import { pool } from '../config/database.js';

export const logAdminAction = async ({ adminId, action, targetType, targetId = null, details = null }, client = pool) => {
  await client.query(
    `
      INSERT INTO admin_actions (admin_id, action, target_type, target_id, details)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [adminId, action, targetType, targetId, details ? JSON.stringify(details) : null]
  );
};
