import { Router } from 'express';
import { usersController } from '../../controllers/users.controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createUserSchema, updateUserSchema, getUserParamsSchema } from '../../../../shared/src/schemas/user.schema';

const router = Router();

// GET /api/v1/users (protected, admin only)
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  usersController.getAll.bind(usersController)
);

// GET /api/v1/users/:id (protected)
router.get(
  '/:id',
  authenticate,
  validate(getUserParamsSchema, 'params'),
  usersController.getById.bind(usersController)
);

// GET /api/v1/users/slug/:slug (public for author pages)
router.get(
  '/slug/:slug',
  usersController.getBySlug.bind(usersController)
);

// POST /api/v1/users (protected, admin only)
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createUserSchema, 'body'),
  usersController.create.bind(usersController)
);

// PUT /api/v1/users/:id (protected, admin or self)
router.put(
  '/:id',
  authenticate,
  validate(getUserParamsSchema, 'params'),
  validate(updateUserSchema, 'body'),
  usersController.update.bind(usersController)
);

// DELETE /api/v1/users/:id (protected, admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(getUserParamsSchema, 'params'),
  usersController.delete.bind(usersController)
);

export default router;

