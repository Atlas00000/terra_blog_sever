"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_controller_1 = require("../../controllers/comments.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rate_limit_middleware_1 = require("../../middleware/rate-limit.middleware");
const comment_schema_1 = require("../../../../shared/src/schemas/comment.schema");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// GET /api/v1/comments (public, but can filter by status for admin)
router.get('/', (0, validation_middleware_1.validate)(comment_schema_1.getCommentsQuerySchema, 'query'), comments_controller_1.commentsController.getAll.bind(comments_controller_1.commentsController));
// GET /api/v1/comments/:id (public)
router.get('/:id', (0, validation_middleware_1.validate)(comment_schema_1.getCommentParamsSchema, 'params'), comments_controller_1.commentsController.getById.bind(comments_controller_1.commentsController));
// POST /api/v1/comments (public, but can include userId if authenticated)
router.post('/', rate_limit_middleware_1.commentLimiter, (0, validation_middleware_1.validate)(comment_schema_1.createCommentSchema, 'body'), comments_controller_1.commentsController.create.bind(comments_controller_1.commentsController));
// PUT /api/v1/comments/:id (protected)
router.put('/:id', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(comment_schema_1.getCommentParamsSchema, 'params'), (0, validation_middleware_1.validate)(comment_schema_1.updateCommentSchema, 'body'), comments_controller_1.commentsController.update.bind(comments_controller_1.commentsController));
// DELETE /api/v1/comments/:id (protected)
router.delete('/:id', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(comment_schema_1.getCommentParamsSchema, 'params'), comments_controller_1.commentsController.delete.bind(comments_controller_1.commentsController));
// PUT /api/v1/comments/:id/moderate (protected, admin/editor only)
router.put('/:id/moderate', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(comment_schema_1.getCommentParamsSchema, 'params'), (0, validation_middleware_1.validate)(zod_1.z.object({ status: zod_1.z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SPAM']) }), 'body'), comments_controller_1.commentsController.moderate.bind(comments_controller_1.commentsController));
exports.default = router;
//# sourceMappingURL=comments.routes.js.map