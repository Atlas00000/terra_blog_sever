import { Router } from 'express';
import { productsController } from '../../controllers/products.controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
} from '../../../shared/src/schemas/product.schema';

const router = Router();

// GET /api/v1/products (public)
router.get(
  '/',
  validate(getProductsQuerySchema, 'query'),
  productsController.getAll.bind(productsController)
);

// GET /api/v1/products/:slug (public)
router.get(
  '/:slug',
  productsController.getBySlug.bind(productsController)
);

// GET /api/v1/products/id/:id (protected, for admin)
router.get(
  '/id/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  productsController.getById.bind(productsController)
);

// POST /api/v1/products (protected, admin/editor only)
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(createProductSchema, 'body'),
  productsController.create.bind(productsController)
);

// PUT /api/v1/products/:id (protected, admin/editor only)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(updateProductSchema, 'body'),
  productsController.update.bind(productsController)
);

// DELETE /api/v1/products/:id (protected, admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  productsController.delete.bind(productsController)
);

export default router;

