import { Router } from 'express';
import { categoriesController } from '../../controllers/categories.controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoriesQuerySchema,
} from '../../../shared/src/schemas/category.schema';

const router = Router();

// GET /api/v1/categories (public)
router.get(
  '/',
  validate(getCategoriesQuerySchema, 'query'),
  categoriesController.getAll.bind(categoriesController)
);

// GET /api/v1/categories/:slug (public)
router.get(
  '/:slug',
  categoriesController.getBySlug.bind(categoriesController)
);

// GET /api/v1/categories/id/:id (protected, for admin)
router.get(
  '/id/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  categoriesController.getById.bind(categoriesController)
);

// POST /api/v1/categories (protected, admin/editor only)
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(createCategorySchema, 'body'),
  categoriesController.create.bind(categoriesController)
);

// PUT /api/v1/categories/:id (protected, admin/editor only)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(updateCategorySchema, 'body'),
  categoriesController.update.bind(categoriesController)
);

// DELETE /api/v1/categories/:id (protected, admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  categoriesController.delete.bind(categoriesController)
);

export default router;

