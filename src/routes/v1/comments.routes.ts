import { Router } from 'express';
import { commentsController } from '../../controllers/comments.controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { apiLimiter } from '../../middleware/rate-limit.middleware';
import {
  createCommentSchema,
  listCommentsQuerySchema,
  adminListCommentsQuerySchema,
  updateCommentStatusSchema,
  postSlugParamsSchema,
} from '../../../../shared/src/schemas/comment.schema';

const router = Router({ mergeParams: true });

// Public: list comments for a post
router.get(
  '/posts/:slug/comments',
  apiLimiter,
  validate(listCommentsQuerySchema, 'query'),
  validate(postSlugParamsSchema, 'params'),
  commentsController.listForPost.bind(commentsController)
);

// Public: create comment (pending)
router.post(
  '/posts/:slug/comments',
  apiLimiter,
  validate(createCommentSchema, 'body'),
  validate(postSlugParamsSchema, 'params'),
  commentsController.create.bind(commentsController)
);

// Admin: list comments
router.get(
  '/comments',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  apiLimiter,
  validate(adminListCommentsQuerySchema, 'query'),
  commentsController.adminList.bind(commentsController)
);

// Admin: update comment status
router.patch(
  '/comments/:id/status',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  apiLimiter,
  validate(updateCommentStatusSchema, 'body'),
  commentsController.updateStatus.bind(commentsController)
);

// Admin: delete comment (soft)
router.delete(
  '/comments/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  apiLimiter,
  commentsController.delete.bind(commentsController)
);

export default router;

