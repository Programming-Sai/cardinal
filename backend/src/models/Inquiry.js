import { pool } from '../config/database.js';

export const mapInquiryRow = (row) => ({
  id: row.id,
  submittedAt: row.submitted_at,
  status: row.status,
  organizationName: row.organization_name,
  organizationType: row.organization_type,
  country: row.country,
  website: row.website,
  contactName: row.contact_name,
  contactTitle: row.contact_title,
  contactEmail: row.contact_email,
  contactPhone: row.contact_phone,
  interestTypes: row.interest_types || [],
  cohortSize: row.cohort_size,
  timeline: row.timeline,
  additionalInfo: row.additional_info,
  internalNotes: row.internal_notes,
  reviewedBy: row.reviewed_by,
  reviewedAt: row.reviewed_at,
  referenceNumber: row.reference_number,
  // Compatibility aliases
  organizationCountry: row.country,
  interests: row.interest_types || [],
  submittedDate: row.submitted_at,
  notes: row.internal_notes,
});

export const findInquiryDuplicate = async ({ contactEmail, organizationName }, client = pool) => {
  const { rows } = await client.query(
    `
      SELECT *
      FROM inquiries
      WHERE LOWER(contact_email) = LOWER($1)
        AND LOWER(organization_name) = LOWER($2)
      LIMIT 1
    `,
    [contactEmail, organizationName]
  );
  return rows[0] || null;
};

export const createInquiry = async (data, referenceNumber, client = pool) => {
  const { rows } = await client.query(
    `
      INSERT INTO inquiries (
        organization_name, organization_type, country, website, contact_name,
        contact_title, contact_email, contact_phone, interest_types, cohort_size,
        timeline, additional_info, internal_notes, reference_number
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `,
    [
      data.organizationName,
      data.organizationType,
      data.country,
      data.website || null,
      data.contactName,
      data.contactTitle,
      data.contactEmail,
      data.contactPhone || null,
      JSON.stringify(data.interestTypes),
      data.cohortSize || null,
      data.timeline || null,
      data.additionalInfo || null,
      data.internalNotes || null,
      referenceNumber,
    ]
  );
  return rows[0];
};

export const getInquiryById = async (id, client = pool) => {
  const { rows } = await client.query('SELECT * FROM inquiries WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
};

export const listInquiries = async ({ status, organizationType, search, page = 1, limit = 20 } = {}, client = pool) => {
  const clauses = [];
  const values = [];
  let idx = 0;

  if (status && status !== 'all') {
    values.push(status);
    clauses.push(`status = $${++idx}`);
  }

  if (organizationType && organizationType !== 'all') {
    values.push(organizationType);
    clauses.push(`organization_type = $${++idx}`);
  }

  if (search) {
    values.push(`%${search}%`);
    clauses.push(`(organization_name ILIKE $${++idx} OR contact_email ILIKE $${idx} OR contact_name ILIKE $${idx})`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const countResult = await client.query(`SELECT COUNT(*)::int AS count FROM inquiries ${where}`, values);
  const total = countResult.rows[0].count;

  values.push(limit, (page - 1) * limit);
  const { rows } = await client.query(
    `
      SELECT *
      FROM inquiries
      ${where}
      ORDER BY submitted_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `,
    values
  );

  return {
    items: rows.map(mapInquiryRow),
    total,
    page,
    limit,
  };
};

export const updateInquiry = async (id, updates, client = pool) => {
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

  if (fields.length === 0) {
    return getInquiryById(id, client);
  }

  values.push(id);
  const { rows } = await client.query(
    `UPDATE inquiries SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] || null;
};

export const deleteInquiry = async (id, client = pool) => {
  await client.query('DELETE FROM inquiries WHERE id = $1', [id]);
};

export const countInquiriesByStatus = async (client = pool) => {
  const { rows } = await client.query(
    `
      SELECT
        COUNT(*) FILTER (WHERE status = 'new')::int AS new_count,
        COUNT(*) FILTER (WHERE status = 'contacted')::int AS contacted_count,
        COUNT(*) FILTER (WHERE status = 'partnered')::int AS partnered_count,
        COUNT(*) FILTER (WHERE status = 'closed')::int AS closed_count,
        COUNT(*)::int AS total_count
      FROM inquiries
    `
  );
  return rows[0];
};
