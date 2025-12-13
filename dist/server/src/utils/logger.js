"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logRequest = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
}));
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    format: logFormat,
    defaultMeta: { service: 'terrablog-api', environment: process.env.NODE_ENV || 'development' },
    transports: [
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston_1.default.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});
// Console transport with different format based on environment
if (process.env.NODE_ENV === 'production') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: logFormat,
    }));
}
else {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), consoleFormat),
    }));
}
/**
 * Log request with request ID
 */
const logRequest = (req, message, level = 'info') => {
    const requestId = req.requestId || 'unknown';
    const logData = {
        requestId,
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    };
    exports.logger[level](message, logData);
};
exports.logRequest = logRequest;
/**
 * Log error with request context
 */
const logError = (req, error, message) => {
    const requestId = req.requestId || 'unknown';
    exports.logger.error(message || error.message, {
        requestId,
        method: req.method,
        path: req.path,
        ip: req.ip,
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
        },
    });
};
exports.logError = logError;
//# sourceMappingURL=logger.js.map