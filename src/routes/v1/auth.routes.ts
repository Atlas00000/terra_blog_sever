import { Router } from 'express';
import { authController } from '../../controllers/auth.controller';
import { validate } from '../../middleware/validation.middleware';
import { loginSchema, createUserSchema } from '../../../shared/src/schemas/user.schema';
import { authenticate } from '../../middleware/auth.middleware';
import { authLimiter } from '../../middleware/rate-limit.middleware';

const router = Router();

// POST /api/v1/auth/register
router.post(
  '/register',
  authLimiter,
  validate(createUserSchema, 'body'),
  authController.register.bind(authController)
);

// POST /api/v1/auth/login
router.post(
  '/login',
  authLimiter,
  validate(loginSchema, 'body'),
  authController.login.bind(authController)
);

// GET /api/v1/auth/me (protected)
router.get(
  '/me',
  authenticate,
  authController.getMe.bind(authController)
);

export default router;

