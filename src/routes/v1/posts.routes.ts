import { Router } from 'express';
import { postsController } from '../../controllers/posts.controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import {
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema,
} from '../../../shared/src/schemas/post.schema';

const router = Router();

// GET /api/v1/posts (public, but can filter by status for admin)
router.get(
  '/',
  validate(getPostsQuerySchema, 'query'),
  postsController.getAll.bind(postsController)
);

// GET /api/v1/posts/:slug (public)
router.get(
  '/:slug',
  postsController.getBySlug.bind(postsController)
);

// GET /api/v1/posts/id/:id (protected, admin/editor can access all, author can access own)
router.get(
  '/id/:id',
  authenticate,
  postsController.getById.bind(postsController)
);

// POST /api/v1/posts (protected)
router.post(
  '/',
  authenticate,
  validate(createPostSchema, 'body'),
  postsController.create.bind(postsController)
);

// PUT /api/v1/posts/:id (protected)
router.put(
  '/:id',
  authenticate,
  validate(updatePostSchema, 'body'),
  postsController.update.bind(postsController)
);

// DELETE /api/v1/posts/:id (protected)
router.delete(
  '/:id',
  authenticate,
  postsController.delete.bind(postsController)
);

export default router;

