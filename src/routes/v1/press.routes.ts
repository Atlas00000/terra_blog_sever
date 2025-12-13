import { Router } from 'express';
import { pressController } from '../../controllers/press.controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import {
  createPressReleaseSchema,
  updatePressReleaseSchema,
  getPressReleasesQuerySchema,
} from '../../../../shared/src/schemas/press.schema';

const router = Router();

// GET /api/v1/press (public)
router.get(
  '/',
  validate(getPressReleasesQuerySchema, 'query'),
  pressController.getAll.bind(pressController)
);

// GET /api/v1/press/:slug (public)
router.get(
  '/:slug',
  pressController.getBySlug.bind(pressController)
);

// GET /api/v1/press/id/:id (protected, for admin)
router.get(
  '/id/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  pressController.getById.bind(pressController)
);

// POST /api/v1/press (protected, admin/editor only)
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(createPressReleaseSchema, 'body'),
  pressController.create.bind(pressController)
);

// PUT /api/v1/press/:id (protected, admin/editor only)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(updatePressReleaseSchema, 'body'),
  pressController.update.bind(pressController)
);

// DELETE /api/v1/press/:id (protected, admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  pressController.delete.bind(pressController)
);

export default router;

