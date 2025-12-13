"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsController = exports.CommentsController = void 0;
const comments_service_1 = require("../services/comments.service");
class CommentsController {
    /**
     * GET /api/v1/comments
     */
    async getAll(req, res, next) {
        try {
            const params = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                postId: req.query.postId,
                status: req.query.status,
            };
            const result = await comments_service_1.commentsService.getAll(params);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/comments/:id
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const comment = await comments_service_1.commentsService.getById(id);
            res.json({ data: comment });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/comments
     */
    async create(req, res, next) {
        try {
            const userId = req.user?.userId;
            const comment = await comments_service_1.commentsService.create({
                ...req.body,
                userId,
            });
            res.status(201).json({
                data: comment,
                message: 'Comment submitted successfully. It will be reviewed before publication.',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/comments/:id
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
            const comment = await comments_service_1.commentsService.update(id, req.body, userId, userRole);
            res.json({
                data: comment,
                message: 'Comment updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/comments/:id
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
            await comments_service_1.commentsService.delete(id, userId, userRole);
            res.json({ message: 'Comment deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/comments/:id/moderate (admin/editor only)
     */
    async moderate(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const comment = await comments_service_1.commentsService.moderate(id, status);
            res.json({
                data: comment,
                message: 'Comment moderated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CommentsController = CommentsController;
exports.commentsController = new CommentsController();
//# sourceMappingURL=comments.controller.js.map