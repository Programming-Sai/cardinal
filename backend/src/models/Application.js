import { pool } from '../config/database.js';
import { getProgramBySlug } from './Program.js';

export const mapApplicationRow = async (row, client = pool) => {
  const program = row.specific_program ? await getProgramBySlug(row.specific_program, client) : null;

  const base = {
    id: row.id,
    submittedAt: row.submitted_at,
    status: row.status,
    programInterest: row.program_interest,
    specificProgram: row.specific_program,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    dateOfBirth: row.date_of_birth,
    institution: row.institution,
    country: row.country,
    language: row.language,
    motivationStatement: row.motivation_statement,
    heardFrom: row.heard_from,
    cvUrl: row.cv_url,
    internalNotes: row.internal_notes,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    referenceNumber: row.reference_number,
    // Compatibility aliases
    name: row.full_name,
    program: program ? `${program.title}` : row.specific_program || row.program_interest,
    programType: row.program_interest,
    motivation: row.motivation_statement,
    submittedDate: row.submitted_at,
    notes: row.internal_notes,
  };

  return base;
};

export const findApplicationDuplicate = async ({ email, programInterest, specificProgram }, client = pool) => {
  const { rows } = await client.query(
    `
      SELECT *
      FROM applications
      WHERE LOWER(email) = LOWER($1)
        AND program_interest = $2
        AND COALESCE(specific_program, '') = COALESCE($3, '')
      LIMIT 1
    `,
    [email, programInterest, specificProgram || '']
  );
  return rows[0] || null;
};

export const createApplication = async (data, referenceNumber, client = pool) => {
  const { rows } = await client.query(
    `
      INSERT INTO applications (
        program_interest, specific_program, full_name, email, phone, date_of_birth,
        institution, country, language, motivation_statement, heard_from, cv_url,
        internal_notes, reference_number
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `,
    [
      data.programInterest,
      data.specificProgram || null,
      data.fullName,
      data.email,
      data.phone || null,
      data.dateOfBirth || null,
      data.institution,
      data.country,
      data.language || null,
      data.motivationStatement,
      data.heardFrom || null,
      data.cvUrl || null,
      data.internalNotes || null,
      referenceNumber,
    ]
  );
  return rows[0];
};

export const getApplicationById = async (id, client = pool) => {
  const { rows } = await client.query('SELECT * FROM applications WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
};

export const listApplications = async ({ status, programInterest, search, page = 1, limit = 20 } = {}, client = pool) => {
  const clauses = [];
  const values = [];
  let idx = 0;

  if (status && status !== 'all') {
    values.push(status);
    clauses.push(`status = $${++idx}`);
  }

  if (programInterest && programInterest !== 'all') {
    values.push(programInterest);
    clauses.push(`program_interest = $${++idx}`);
  }

  if (search) {
    values.push(`%${search}%`);
    clauses.push(`(full_name ILIKE $${++idx} OR email ILIKE $${idx} OR institution ILIKE $${idx})`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const countResult = await client.query(`SELECT COUNT(*)::int AS count FROM applications ${where}`, values);
  const total = countResult.rows[0].count;

  values.push(limit, (page - 1) * limit);
  const { rows } = await client.query(
    `
      SELECT *
      FROM applications
      ${where}
      ORDER BY submitted_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `,
    values
  );

  const items = [];
  for (const row of rows) {
    items.push(await mapApplicationRow(row, client));
  }

  return {
    items,
    total,
    page,
    limit,
  };
};

export const updateApplication = async (id, updates, client = pool) => {
  const fields = [];
  const values = [];
  const add = (column, value) => {
    values.push(value);
    fields.push(`${column} = $${values.length}`);
  };

  if (updates.status !== undefined) add('status', updates.status);
  if (updates.internalNotes !== undefined) add('internal_notes', updates.internalNotes);
  if (updates.reviewedBy !== undefined) add('reviewed_by', updates.reviewedBy);
  if (updates.reviewedAt !== undefined) add('reviewed_at', updates.reviewedAt);
  if (updates.fullName !== undefined) add('full_name', updates.fullName);
  if (updates.phone !== undefined) add('phone', updates.phone);
  if (updates.language !== undefined) add('language', updates.language);
  if (updates.heardFrom !== undefined) add('heard_from', updates.heardFrom);
  if (updates.cvUrl !== undefined) add('cv_url', updates.cvUrl);

  if (fields.length === 0) {
    return getApplicationById(id, client);
  }

  values.push(id);
  const { rows } = await client.query(
    `UPDATE applications SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] || null;
};

export const deleteApplication = async (id, client = pool) => {
  await client.query('DELETE FROM applications WHERE id = $1', [id]);
};

export const countApplicationsByStatus = async (client = pool) => {
  const { rows } = await client.query(
    `
      SELECT
        COUNT(*) FILTER (WHERE status = 'new')::int AS new_count,
        COUNT(*) FILTER (WHERE status = 'reviewed')::int AS reviewed_count,
        COUNT(*) FILTER (WHERE status = 'accepted')::int AS accepted_count,
        COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected_count,
        COUNT(*)::int AS total_count
      FROM applications
    `
  );
  return rows[0];
};
