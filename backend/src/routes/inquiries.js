import { Router } from 'express';
import {
  createPublicInquiry,
  deleteAdminInquiry,
  exportInquiriesCsv,
  getAdminInquiry,
  listAdminInquiriesHandler,
  updateAdminInquiry,
} from '../controllers/inquiryController.js';
import { publicLimiter } from '../middleware/rateLimit.js';
import {
  idParam,
  inquiryCreateValidation,
  inquiryUpdateValidation,
  paginationValidation,
  validate,
} from '../middleware/validation.js';
import { requireRole, verifyJWT } from '../middleware/auth.js';

const router = Router();

router.post('/api/inquiries', publicLimiter, inquiryCreateValidation, validate, createPublicInquiry);

router.get(
  '/api/admin/inquiries',
  verifyJWT,
  requireRole('super_admin', 'admin', 'viewer'),
  paginationValidation,
  validate,
  listAdminInquiriesHandler
);
router.get('/api/admin/inquiries/:id', verifyJWT, requireRole('super_admin', 'admin', 'viewer'), idParam, validate, getAdminInquiry);
router.patch(
  '/api/admin/inquiries/:id',
  verifyJWT,
  requireRole('super_admin', 'admin'),
  idParam,
  inquiryUpdateValidation,
  validate,
  updateAdminInquiry
);
router.delete('/api/admin/inquiries/:id', verifyJWT, requireRole('super_admin'), idParam, validate, deleteAdminInquiry);
router.get('/api/admin/exports/inquiries.csv', verifyJWT, requireRole('super_admin', 'admin'), exportInquiriesCsv);

export default router;
