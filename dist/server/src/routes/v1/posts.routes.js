"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_controller_1 = require("../../controllers/posts.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const post_schema_1 = require("../../../../shared/src/schemas/post.schema");
const router = (0, express_1.Router)();
// GET /api/v1/posts (public, but can filter by status for admin)
router.get('/', (0, validation_middleware_1.validate)(post_schema_1.getPostsQuerySchema, 'query'), posts_controller_1.postsController.getAll.bind(posts_controller_1.postsController));
// GET /api/v1/posts/:slug (public)
router.get('/:slug', posts_controller_1.postsController.getBySlug.bind(posts_controller_1.postsController));
// GET /api/v1/posts/id/:id (protected, for admin)
router.get('/id/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), posts_controller_1.postsController.getById.bind(posts_controller_1.postsController));
// POST /api/v1/posts (protected)
router.post('/', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(post_schema_1.createPostSchema, 'body'), posts_controller_1.postsController.create.bind(posts_controller_1.postsController));
// PUT /api/v1/posts/:id (protected)
router.put('/:id', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(post_schema_1.updatePostSchema, 'body'), posts_controller_1.postsController.update.bind(posts_controller_1.postsController));
// DELETE /api/v1/posts/:id (protected)
router.delete('/:id', auth_middleware_1.authenticate, posts_controller_1.postsController.delete.bind(posts_controller_1.postsController));
exports.default = router;
//# sourceMappingURL=posts.routes.js.map