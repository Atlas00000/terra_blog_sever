"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    code;
    message;
    statusCode;
    details;
    constructor(code, message, statusCode, details) {
        super(message);
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, _next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                statusCode: err.statusCode,
                timestamp: new Date().toISOString(),
                path: req.path,
                details: err.details,
            },
        });
    }
    // Log unexpected errors
    console.error('Unexpected error:', err);
    // Generic error response
    return res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: req.path,
        },
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map