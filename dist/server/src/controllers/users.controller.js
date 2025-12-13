"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = exports.UsersController = void 0;
const users_service_1 = require("../services/users.service");
const error_middleware_1 = require("../middleware/error.middleware");
class UsersController {
    /**
     * GET /api/v1/users
     */
    async getAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await users_service_1.usersService.getAll(page, limit);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/users/:id
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await users_service_1.usersService.getById(id);
            res.json({ data: user });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/users/slug/:slug
     */
    async getBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const user = await users_service_1.usersService.getBySlug(slug);
            res.json({ data: user });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/users
     */
    async create(req, res, next) {
        try {
            const user = await users_service_1.usersService.create(req.body);
            res.status(201).json({
                data: user,
                message: 'User created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/users/:id
     */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            // Check if user is admin or updating themselves
            if (userRole !== 'ADMIN' && userId !== id) {
                throw new error_middleware_1.AppError('FORBIDDEN', 'You can only update your own profile', 403);
            }
            const user = await users_service_1.usersService.update(id, req.body);
            res.json({
                data: user,
                message: 'User updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/users/:id
     */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await users_service_1.usersService.delete(id);
            res.json({ message: 'User deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UsersController = UsersController;
exports.usersController = new UsersController();
//# sourceMappingURL=users.controller.js.map