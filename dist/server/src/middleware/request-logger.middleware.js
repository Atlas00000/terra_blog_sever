"use strict";
/**
 * Request Logger Middleware
 * Logs all incoming requests with request ID
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = require("../utils/logger");
const requestLogger = (req, res, next) => {
    // Skip logging for health checks in production
    if (process.env.NODE_ENV === 'production' && req.path.startsWith('/health')) {
        return next();
    }
    // Log request
    (0, logger_1.logRequest)(req, `${req.method} ${req.path}`, 'info');
    // Log response when finished
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const level = res.statusCode >= 400 ? 'warn' : 'info';
        (0, logger_1.logRequest)(req, `${req.method} ${req.path} ${res.statusCode} - ${duration}ms`, level);
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=request-logger.middleware.js.map