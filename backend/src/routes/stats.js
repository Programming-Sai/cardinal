import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { requireRole, verifyJWT } from '../middleware/auth.js';

const router = Router();

router.get('/api/admin/stats', verifyJWT, requireRole('super_admin', 'admin', 'viewer'), getDashboardStats);
router.get('/api/admin/dashboard/stats', verifyJWT, requireRole('super_admin', 'admin', 'viewer'), getDashboardStats);

export default router;
