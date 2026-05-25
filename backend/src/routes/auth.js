import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { loginValidation, validate } from '../middleware/validation.js';
import { verifyJWT } from '../middleware/auth.js';

const router = Router();

router.post('/api/auth/login', authLimiter, loginValidation, validate, login);
router.get('/api/auth/me', verifyJWT, me);
router.post('/api/auth/logout', verifyJWT, logout);

export default router;
