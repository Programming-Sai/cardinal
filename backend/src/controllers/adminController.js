import bcrypt from 'bcryptjs';
import { withTransaction } from '../config/database.js';
import { apiError, apiSuccess } from '../utils/helpers.js';
import {
  countSuperAdmins,
  createAdmin,
  deleteAdmin,
  getAdminByEmail,
  getAdminById,
  listAdmins,
  updateAdmin,
} from '../models/Admin.js';
import { logAdminAction } from '../models/AuditLog.js';
import { sendEmail } from '../config/email.js';
import { templates } from '../utils/emailTemplates.js';

const validateLastSuperAdminDeletion = async (adminId, client) => {
  const admin = await getAdminById(adminId, client);
  if (!admin) {
    throw apiError('Admin not found', 404, 'NOT_FOUND');
  }

  if (admin.role === 'super_admin') {
    const superAdminCount = await countSuperAdmins(client);
    if (superAdminCount <= 1) {
      throw apiError('Cannot delete the last super admin', 409, 'CONFLICT');
    }
  }

  return admin;
};

export const listAdminAccounts = async (req, res, next) => {
  try {
    apiSuccess(res, await listAdmins());
  } catch (error) {
    next(error);
  }
};

export const createAdminAccount = async (req, res, next) => {
  try {
    const existing = await getAdminByEmail(req.body.email);
    if (existing) {
      return next(apiError('Admin with this email already exists', 409, 'CONFLICT'));
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const admin = await createAdmin({
      email: req.body.email,
      fullName: req.body.fullName,
      role: req.body.role,
      passwordHash,
      isActive: true,
    });

    await logAdminAction({
      adminId: req.admin.id,
      action: 'admin.create',
      targetType: 'admin',
      targetId: admin.id,
      details: { email: admin.email, role: admin.role },
    });

    if (String(req.body.sendInvite) === 'true' || req.body.sendInvite === true) {
      sendEmail({
        to: admin.email,
        subject: 'You have been invited to Cardinal Immersions admin',
        html: templates.adminInvite({
          fullName: admin.fullName,
          role: admin.role,
          email: admin.email,
          temporaryPassword: req.body.password,
        }),
      }).catch((error) => {
        console.error('Admin invite email failed:', error.message);
      });
    }

    apiSuccess(res, admin, 201);
  } catch (error) {
    next(error);
  }
};

export const updateAdminAccount = async (req, res, next) => {
  try {
    const existing = await getAdminById(req.params.id);
    if (!existing) {
      return next(apiError('Admin not found', 404, 'NOT_FOUND'));
    }

    const updates = {
      email: req.body.email,
      fullName: req.body.fullName,
      role: req.body.role,
      isActive: req.body.isActive,
    };

    if (req.body.password) {
      updates.passwordHash = await bcrypt.hash(req.body.password, 10);
    }

    const updated = await updateAdmin(req.params.id, updates);

    await logAdminAction({
      adminId: req.admin.id,
      action: 'admin.update',
      targetType: 'admin',
      targetId: req.params.id,
      details: { email: updated.email, role: updated.role },
    });

    apiSuccess(res, updated);
  } catch (error) {
    next(error);
  }
};

export const deleteAdminAccount = async (req, res, next) => {
  try {
    await withTransaction(async (client) => {
      const admin = await validateLastSuperAdminDeletion(req.params.id, client);
      await deleteAdmin(admin.id, client);
      await logAdminAction({
        adminId: req.admin.id,
        action: 'admin.delete',
        targetType: 'admin',
        targetId: admin.id,
        details: { email: admin.email, role: admin.role },
      }, client);
    });

    apiSuccess(res, { deleted: true });
  } catch (error) {
    next(error);
  }
};
