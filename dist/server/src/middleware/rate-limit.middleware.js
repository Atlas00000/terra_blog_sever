"use strict";
/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DDoS attacks
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentLimiter = exports.newsletterLimiter = exports.contactLimiter = exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_middleware_1 = require("./error.middleware");
/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 * Disabled in test environment
 */
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'test' ? 10000 : 100, // Very high limit in test environment
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests from this IP, please try again later',
            statusCode: 429,
            timestamp: new Date().toISOString(),
        },
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        throw new error_middleware_1.AppError('TOO_MANY_REQUESTS', 'Too many requests from this IP, please try again later', 429);
    },
    skip: () => process.env.NODE_ENV === 'test', // Skip rate limiting in tests
});
/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP
 * Disabled in test environment
 */
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'test' ? 10000 : 5, // Very high limit in test environment
    message: {
        error: {
            code: 'TOO_MANY_AUTH_REQUESTS',
            message: 'Too many authentication attempts, please try again later',
            statusCode: 429,
            timestamp: new Date().toISOString(),
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (req, res) => {
        throw new error_middleware_1.AppError('TOO_MANY_AUTH_REQUESTS', 'Too many authentication attempts, please try again later', 429);
    },
    skip: () => process.env.NODE_ENV === 'test', // Skip rate limiting in tests
});
/**
 * Strict rate limiter for contact form submissions
 * 3 requests per hour per IP
 */
exports.contactLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 contact submissions per hour
    message: {
        error: {
            code: 'TOO_MANY_CONTACT_REQUESTS',
            message: 'Too many contact form submissions, please try again later',
            statusCode: 429,
            timestamp: new Date().toISOString(),
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        throw new error_middleware_1.AppError('TOO_MANY_CONTACT_REQUESTS', 'Too many contact form submissions, please try again later', 429);
    },
});
/**
 * Strict rate limiter for newsletter subscriptions
 * 5 requests per hour per IP
 */
exports.newsletterLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 newsletter subscriptions per hour
    message: {
        error: {
            code: 'TOO_MANY_NEWSLETTER_REQUESTS',
            message: 'Too many newsletter subscription attempts, please try again later',
            statusCode: 429,
            timestamp: new Date().toISOString(),
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        throw new error_middleware_1.AppError('TOO_MANY_NEWSLETTER_REQUESTS', 'Too many newsletter subscription attempts, please try again later', 429);
    },
});
/**
 * Strict rate limiter for comment submissions
 * 10 requests per hour per IP
 */
exports.commentLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 comments per hour
    message: {
        error: {
            code: 'TOO_MANY_COMMENT_REQUESTS',
            message: 'Too many comment submissions, please try again later',
            statusCode: 429,
            timestamp: new Date().toISOString(),
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        throw new error_middleware_1.AppError('TOO_MANY_COMMENT_REQUESTS', 'Too many comment submissions, please try again later', 429);
    },
});
//# sourceMappingURL=rate-limit.middleware.js.map