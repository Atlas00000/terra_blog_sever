"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsController = exports.PostsController = void 0;
const posts_service_1 = require("../services/posts.service");
class PostsController {
    /**
     * GET /api/v1/posts
     */
    async getAll(req, res, next) {
        try {
            const params = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                category: req.query.category,
                tag: req.query.tag,
                author: req.query.author,
                status: req.query.status,
                search: req.query.search,
            };
            const result = await posts_service_1.postsService.getAll(params);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/posts/:slug
     */
    async getBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const post = await posts_service_1.postsService.getBySlug(slug);
            res.json({ data: post });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/posts/id/:id (admin)
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const post = await posts_service_1.postsService.getById(id);
            res.json({ data: post });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/posts
     */
    async create(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Not authenticated',
                        statusCode: 401,
                        timestamp: new Date().toISOString(),
                    },
                });
                return;
            }
            const post = await posts_service_1.postsService.create(req.body, userId);
            res.status(201).json({
                data: post,
                message: 'Post created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/posts/:id
     */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            if (!userId) {
                res.status(401).json({
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Not authenticated',
                        statusCode: 401,
                        timestamp: new Date().toISOString(),
                    },
                });
                return;
            }
            const post = await posts_service_1.postsService.update(id, req.body, userId, userRole);
            res.json({
                data: post,
                message: 'Post updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/posts/:id
     */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            if (!userId) {
                res.status(401).json({
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Not authenticated',
                        statusCode: 401,
                        timestamp: new Date().toISOString(),
                    },
                });
                return;
            }
            await posts_service_1.postsService.delete(id, userId, userRole);
            res.json({ message: 'Post deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PostsController = PostsController;
exports.postsController = new PostsController();
//# sourceMappingURL=posts.controller.js.map