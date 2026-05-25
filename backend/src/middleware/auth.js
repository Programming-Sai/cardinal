import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.js';
import { apiError } from '../utils/helpers.js';
import { getAdminById } from '../models/Admin.js';

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(apiError('Missing authorization token', 401, 'UNAUTHORIZED'));
  }

  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    return getAdminById(req.auth.id)
      .then((admin) => {
        req.admin = admin;
        if (!req.admin || req.admin.isActive === false) {
          next(apiError('Invalid or expired token', 401, 'UNAUTHORIZED'));
          return;
        }
        next();
      })
      .catch(() => next(apiError('Invalid or expired token', 401, 'UNAUTHORIZED')));
  } catch {
    return next(apiError('Invalid or expired token', 401, 'UNAUTHORIZED'));
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return next(apiError('Forbidden: insufficient permissions', 403, 'FORBIDDEN'));
  }
  return next();
};
