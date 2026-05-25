import { pool } from '../config/database.js';

export const mapAdminRow = (row) => ({
  id: row.id,
  email: row.email,
  fullName: row.full_name,
  role: row.role,
  createdAt: row.created_at,
  lastLogin: row.last_login,
  isActive: row.is_active,
});

export const getAdminByEmail = async (email, client = pool) => {
  const { rows } = await client.query('SELECT * FROM admins WHERE LOWER(email) = LOWER($1) LIMIT 1', [email]);
  return rows[0] ? mapAdminRow(rows[0]) : null;
};

export const getAdminRowByEmail = async (email, client = pool) => {
  const { rows } = await client.query('SELECT * FROM admins WHERE LOWER(email) = LOWER($1) LIMIT 1', [email]);
  return rows[0] || null;
};

export const getAdminById = async (id, client = pool) => {
  const { rows } = await client.query('SELECT * FROM admins WHERE id = $1 LIMIT 1', [id]);
  return rows[0] ? mapAdminRow(rows[0]) : null;
};

export const getAdminRowById = async (id, client = pool) => {
  const { rows } = await client.query('SELECT * FROM admins WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
};

export const listAdmins = async (client = pool) => {
  const { rows } = await client.query('SELECT * FROM admins ORDER BY created_at ASC');
  return rows.map(mapAdminRow);
};

export const createAdmin = async (data, client = pool) => {
  const { rows } = await client.query(
    `
      INSERT INTO admins (email, full_name, role, password_hash, is_active)
      VALUES ($1, $2, $3, $4, COALESCE($5, true))
      RETURNING *
    `,
    [data.email, data.fullName, data.role, data.passwordHash, data.isActive]
  );
  return mapAdminRow(rows[0]);
};

export const updateAdmin = async (id, updates, client = pool) => {
  const fields = [];
  const values = [];
  const add = (column, value) => {
    values.push(value);
    fields.push(`${column} = $${values.length}`);
  };

  if (updates.email !== undefined) add('email', updates.email);
  if (updates.fullName !== undefined) add('full_name', updates.fullName);
  if (updates.role !== undefined) add('role', updates.role);
  if (updates.passwordHash !== undefined) add('password_hash', updates.passwordHash);
  if (updates.isActive !== undefined) add('is_active', updates.isActive);
  if (updates.lastLogin !== undefined) add('last_login', updates.lastLogin);

  if (fields.length === 0) {
    const existing = await getAdminById(id, client);
    return existing;
  }

  values.push(id);
  const { rows } = await client.query(
    `UPDATE admins SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] ? mapAdminRow(rows[0]) : null;
};

export const deleteAdmin = async (id, client = pool) => {
  await client.query('DELETE FROM admins WHERE id = $1', [id]);
};

export const countAdmins = async (client = pool) => {
  const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM admins');
  return rows[0].count;
};

export const countSuperAdmins = async (client = pool) => {
  const { rows } = await client.query("SELECT COUNT(*)::int AS count FROM admins WHERE role = 'super_admin'");
  return rows[0].count;
};
