import { Router } from 'express';
import {
  createAdminAccount,
  deleteAdminAccount,
  listAdminAccounts,
  updateAdminAccount,
} from '../controllers/adminController.js';
import {
  adminCreateValidation,
  adminUpdateValidation,
  idParam,
  validate,
} from '../middleware/validation.js';
import { requireRole, verifyJWT } from '../middleware/auth.js';

const router = Router();

router.get('/api/admin/admins', verifyJWT, requireRole('super_admin'), listAdminAccounts);
router.post('/api/admin/admins', verifyJWT, requireRole('super_admin'), adminCreateValidation, validate, createAdminAccount);
router.put('/api/admin/admins/:id', verifyJWT, requireRole('super_admin'), idParam, adminUpdateValidation, validate, updateAdminAccount);
router.delete('/api/admin/admins/:id', verifyJWT, requireRole('super_admin'), idParam, validate, deleteAdminAccount);

export default router;
