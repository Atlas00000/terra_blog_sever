import { Router } from 'express';
import { commentsController } from '../../controllers/comments.controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { commentLimiter } from '../../middleware/rate-limit.middleware';
import {
  createCommentSchema,
  updateCommentSchema,
  getCommentsQuerySchema,
  getCommentParamsSchema,
} from '../../../../shared/src/schemas/comment.schema';
import { z } from 'zod';

const router = Router();

// GET /api/v1/comments (public, but can filter by status for admin)
router.get(
  '/',
  validate(getCommentsQuerySchema, 'query'),
  commentsController.getAll.bind(commentsController)
);

// GET /api/v1/comments/:id (public)
router.get(
  '/:id',
  validate(getCommentParamsSchema, 'params'),
  commentsController.getById.bind(commentsController)
);

// POST /api/v1/comments (public, but can include userId if authenticated)
router.post(
  '/',
  commentLimiter,
  validate(createCommentSchema, 'body'),
  commentsController.create.bind(commentsController)
);

// PUT /api/v1/comments/:id (protected)
router.put(
  '/:id',
  authenticate,
  validate(getCommentParamsSchema, 'params'),
  validate(updateCommentSchema, 'body'),
  commentsController.update.bind(commentsController)
);

// DELETE /api/v1/comments/:id (protected)
router.delete(
  '/:id',
  authenticate,
  validate(getCommentParamsSchema, 'params'),
  commentsController.delete.bind(commentsController)
);

// PUT /api/v1/comments/:id/moderate (protected, admin/editor only)
router.put(
  '/:id/moderate',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(getCommentParamsSchema, 'params'),
  validate(z.object({ status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SPAM']) }), 'body'),
  commentsController.moderate.bind(commentsController)
);

export default router;

