import { Router } from 'express';
import { register, login, logout, me } from '../controllers/authController';

const router = Router();

// Simple health check for this router
router.get('/health', (_req, res) => res.json({ ok: true }));

// Auth endpoints
router.post('/register', register);
router.post('/login',    login);
router.post('/logout',   logout);
router.get('/me',        me);  // returns current user if cookie is present

export default router;
