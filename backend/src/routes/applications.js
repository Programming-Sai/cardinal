import { Router } from 'express';
import {
  createPublicApplication,
  deleteAdminApplication,
  exportApplicationsCsv,
  getAdminApplication,
  listAdminApplicationsHandler,
  updateAdminApplication,
} from '../controllers/applicationController.js';
import { publicLimiter } from '../middleware/rateLimit.js';
import {
  applicationCreateValidation,
  applicationUpdateValidation,
  idParam,
  paginationValidation,
  validate,
} from '../middleware/validation.js';
import { requireRole, verifyJWT } from '../middleware/auth.js';

const router = Router();

router.post('/api/applications', publicLimiter, applicationCreateValidation, validate, createPublicApplication);

router.get(
  '/api/admin/applications',
  verifyJWT,
  requireRole('super_admin', 'admin', 'viewer'),
  paginationValidation,
  validate,
  listAdminApplicationsHandler
);
router.get('/api/admin/applications/:id', verifyJWT, requireRole('super_admin', 'admin', 'viewer'), idParam, validate, getAdminApplication);
router.patch(
  '/api/admin/applications/:id',
  verifyJWT,
  requireRole('super_admin', 'admin'),
  idParam,
  applicationUpdateValidation,
  validate,
  updateAdminApplication
);
router.delete('/api/admin/applications/:id', verifyJWT, requireRole('super_admin'), idParam, validate, deleteAdminApplication);
router.get('/api/admin/exports/applications.csv', verifyJWT, requireRole('super_admin', 'admin'), exportApplicationsCsv);

export default router;
