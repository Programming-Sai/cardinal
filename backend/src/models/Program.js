import { pool } from '../config/database.js';

export const mapProgramRow = (row) => ({
  id: row.id,
  slug: row.slug,
  category: row.category,
  title: row.title,
  tagline: row.tagline,
  summary: row.summary,
  target: row.target,
  eligibility: row.eligibility,
  duration: row.duration,
  location: row.location,
  deadline: row.deadline,
  fee: row.fee,
  availability: row.availability,
  status: row.status,
  outcome: row.outcome,
  includes: row.includes || [],
  excludes: row.excludes || [],
  timeline: row.timeline || [],
  nextSteps: row.next_steps || [],
  colors: row.colors || null,
  image: row.image,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  // Compatibility aliases for the current frontend
  name: row.title,
  imageUrl: row.image,
  description: row.summary,
});

export const listPrograms = async ({ status, category } = {}, client = pool) => {
  const clauses = [];
  const values = [];

  if (status) {
    values.push(status);
    clauses.push(`status = $${values.length}`);
  }

  if (category) {
    values.push(category);
    clauses.push(`category = $${values.length}`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await client.query(`SELECT * FROM programs ${where} ORDER BY created_at ASC`, values);
  return rows.map(mapProgramRow);
};

export const getProgramById = async (id, client = pool) => {
  const { rows } = await client.query('SELECT * FROM programs WHERE id = $1 LIMIT 1', [id]);
  return rows[0] ? mapProgramRow(rows[0]) : null;
};

export const getProgramBySlug = async (slug, client = pool) => {
  const { rows } = await client.query('SELECT * FROM programs WHERE slug = $1 LIMIT 1', [slug]);
  return rows[0] ? mapProgramRow(rows[0]) : null;
};

export const createProgram = async (data, client = pool) => {
  const { rows } = await client.query(
    `
      INSERT INTO programs (
        slug, category, title, tagline, summary, target, eligibility, duration,
        location, deadline, fee, availability, status, outcome, includes, excludes,
        timeline, next_steps, colors, image
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,$14,$15,$16,
        $17,$18,$19,$20
      )
      RETURNING *
    `,
    [
      data.slug,
      data.category,
      data.title,
      data.tagline || null,
      data.summary || null,
      data.target || null,
      data.eligibility || null,
      data.duration || null,
      data.location || null,
      data.deadline || null,
      data.fee || null,
      data.availability || null,
      data.status || 'coming_soon',
      data.outcome || null,
      data.includes || null,
      data.excludes || null,
      data.timeline || null,
      data.nextSteps || null,
      data.colors || null,
      data.image || null,
    ]
  );
  return mapProgramRow(rows[0]);
};

export const updateProgram = async (id, updates, client = pool) => {
  const columns = {
    slug: 'slug',
    category: 'category',
    title: 'title',
    tagline: 'tagline',
    summary: 'summary',
    target: 'target',
    eligibility: 'eligibility',
    duration: 'duration',
    location: 'location',
    deadline: 'deadline',
    fee: 'fee',
    availability: 'availability',
    status: 'status',
    outcome: 'outcome',
    includes: 'includes',
    excludes: 'excludes',
    timeline: 'timeline',
    nextSteps: 'next_steps',
    colors: 'colors',
    image: 'image',
  };

  const fields = [];
  const values = [];

  for (const [key, column] of Object.entries(columns)) {
    if (updates[key] !== undefined) {
      values.push(updates[key]);
      fields.push(`${column} = $${values.length}`);
    }
  }

  if (fields.length === 0) {
    return getProgramById(id, client);
  }

  values.push(id);
  const { rows } = await client.query(
    `UPDATE programs SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] ? mapProgramRow(rows[0]) : null;
};

export const deleteProgram = async (id, client = pool) => {
  await client.query('DELETE FROM programs WHERE id = $1', [id]);
};

export const countPrograms = async (client = pool) => {
  const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM programs');
  return rows[0].count;
};
