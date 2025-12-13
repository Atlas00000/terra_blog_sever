"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const error_middleware_1 = require("./error.middleware");
const auth_service_1 = require("../services/auth.service");
/**
 * Authenticate user via JWT token
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new error_middleware_1.AppError('UNAUTHORIZED', 'No token provided', 401);
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decoded = auth_service_1.authService.verifyToken(token);
        // Attach user info to request
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof error_middleware_1.AppError) {
            res.status(error.statusCode).json({
                error: {
                    code: error.code,
                    message: error.message,
                    statusCode: error.statusCode,
                    timestamp: new Date().toISOString(),
                    path: req.path,
                },
            });
            return;
        }
        next(error);
    }
};
exports.authenticate = authenticate;
/**
 * Authorize user based on roles
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new error_middleware_1.AppError('UNAUTHORIZED', 'Not authenticated', 401);
            }
            if (!allowedRoles.includes(user.role)) {
                throw new error_middleware_1.AppError('FORBIDDEN', 'Insufficient permissions', 403);
            }
            next();
        }
        catch (error) {
            if (error instanceof error_middleware_1.AppError) {
                res.status(error.statusCode).json({
                    error: {
                        code: error.code,
                        message: error.message,
                        statusCode: error.statusCode,
                        timestamp: new Date().toISOString(),
                        path: req.path,
                    },
                });
                return;
            }
            next(error);
        }
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map