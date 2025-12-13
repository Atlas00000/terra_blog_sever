"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    /**
     * POST /api/v1/auth/register
     */
    async register(req, res, next) {
        try {
            const result = await auth_service_1.authService.register(req.body);
            res.status(201).json({
                data: result,
                message: 'User registered successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/auth/login
     */
    async login(req, res, next) {
        try {
            const result = await auth_service_1.authService.login(req.body);
            res.json({
                data: result,
                message: 'Login successful',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/auth/me
     */
    async getMe(req, res, next) {
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
            const user = await auth_service_1.authService.getUserById(userId);
            res.json({
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map