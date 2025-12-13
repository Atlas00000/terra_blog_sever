import { Router } from 'express';
import { tagsController } from '../../controllers/tags.controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import {
  createTagSchema,
  updateTagSchema,
  getTagsQuerySchema,
} from '../../../../shared/src/schemas/tag.schema';

const router = Router();

// GET /api/v1/tags (public)
router.get(
  '/',
  validate(getTagsQuerySchema, 'query'),
  tagsController.getAll.bind(tagsController)
);

// GET /api/v1/tags/:slug (public)
router.get(
  '/:slug',
  tagsController.getBySlug.bind(tagsController)
);

// GET /api/v1/tags/id/:id (protected, for admin)
router.get(
  '/id/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  tagsController.getById.bind(tagsController)
);

// POST /api/v1/tags (protected, admin/editor only)
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(createTagSchema, 'body'),
  tagsController.create.bind(tagsController)
);

// PUT /api/v1/tags/:id (protected, admin/editor only)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(updateTagSchema, 'body'),
  tagsController.update.bind(tagsController)
);

// DELETE /api/v1/tags/:id (protected, admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  tagsController.delete.bind(tagsController)
);

export default router;

