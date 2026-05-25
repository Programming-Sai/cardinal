import { Router } from 'express';
import {
  createAdminProgram,
  deleteAdminProgram,
  getPublicProgram,
  listAdminPrograms,
  listPublicPrograms,
  updateAdminProgram,
} from '../controllers/programController.js';
import { idParam, programCreateValidation, programUpdateValidation, slugParam, validate } from '../middleware/validation.js';
import { requireRole, verifyJWT } from '../middleware/auth.js';

const router = Router();

router.get('/api/programs', listPublicPrograms);
router.get('/api/programs/:slug', slugParam, validate, getPublicProgram);

router.get('/api/admin/programs', verifyJWT, requireRole('super_admin', 'admin', 'viewer'), listAdminPrograms);
router.post(
  '/api/admin/programs',
  verifyJWT,
  requireRole('super_admin', 'admin'),
  programCreateValidation,
  validate,
  createAdminProgram
);
router.put(
  '/api/admin/programs/:id',
  verifyJWT,
  requireRole('super_admin', 'admin'),
  idParam,
  programUpdateValidation,
  validate,
  updateAdminProgram
);
router.delete('/api/admin/programs/:id', verifyJWT, requireRole('super_admin'), idParam, validate, deleteAdminProgram);

export default router;
