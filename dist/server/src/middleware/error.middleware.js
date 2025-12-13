"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
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
        // Log client errors at warn level, server errors at error level
        if (err.statusCode >= 500) {
            (0, logger_1.logError)(req, err, `Server error: ${err.message}`);
        }
        else if (err.statusCode >= 400) {
            // Log client errors at info level (less verbose)
            const { logRequest } = require('../utils/logger');
            logRequest(req, `Client error: ${err.message}`, 'warn');
        }
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                statusCode: err.statusCode,
                timestamp: new Date().toISOString(),
                path: req.path,
                requestId: req.requestId,
                ...(process.env.NODE_ENV === 'development' && { details: err.details }),
            },
        });
    }
    // Log unexpected errors
    (0, logger_1.logError)(req, err, 'Unexpected error occurred');
    // Generic error response
    return res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : err.message,
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: req.path,
            requestId: req.requestId,
        },
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map