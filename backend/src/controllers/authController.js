import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/auth.js';
import { pool } from '../config/database.js';
import { apiError, apiSuccess, normalizeEmail } from '../utils/helpers.js';
import { getAdminRowByEmail, mapAdminRow, updateAdmin } from '../models/Admin.js';

const stripPassword = (row) => {
  if (!row) return null;
  const admin = mapAdminRow(row);
  return admin;
};

export const login = async (req, res, next) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  const adminRow = await getAdminRowByEmail(email, pool);
  if (!adminRow || !adminRow.is_active) {
    return next(apiError('Invalid email or password', 401, 'UNAUTHORIZED'));
  }

  const passwordMatches = await bcrypt.compare(password, adminRow.password_hash);
  if (!passwordMatches) {
    return next(apiError('Invalid email or password', 401, 'UNAUTHORIZED'));
  }

  const updated = await updateAdmin(adminRow.id, { lastLogin: new Date().toISOString() }, pool);
  const token = jwt.sign(
    {
      id: adminRow.id,
      email: adminRow.email,
      role: adminRow.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  apiSuccess(res, {
    token,
    admin: updated || stripPassword(adminRow),
  });
};

export const me = async (req, res) => {
  apiSuccess(res, {
    admin: {
      id: req.admin.id,
      email: req.admin.email,
      role: req.admin.role,
      fullName: req.admin.fullName,
      createdAt: req.admin.createdAt,
      lastLogin: req.admin.lastLogin,
      isActive: req.admin.isActive,
    },
  });
};

export const logout = async (req, res) => {
  apiSuccess(res, { message: 'Logged out on client side.' });
};
