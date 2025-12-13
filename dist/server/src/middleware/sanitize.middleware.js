"use strict";
/**
 * Input Sanitization Middleware
 * Prevents XSS attacks by sanitizing user input
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeStrings = exports.sanitize = void 0;
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
const window = new jsdom_1.JSDOM('').window;
const purify = (0, dompurify_1.default)(window);
/**
 * Recursively sanitize object values
 */
function sanitizeObject(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (typeof obj === 'string') {
        // Remove HTML tags and dangerous content
        return purify.sanitize(obj, { ALLOWED_TAGS: [] });
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => sanitizeObject(item));
    }
    if (typeof obj === 'object') {
        const sanitized = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitized[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    }
    return obj;
}
/**
 * Sanitize request body, query, and params
 */
const sanitize = (req, res, next) => {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    next();
};
exports.sanitize = sanitize;
/**
 * Sanitize only string fields (for rich text content that may contain HTML)
 * Use this for endpoints that need to preserve HTML formatting
 */
const sanitizeStrings = (req, res, next) => {
    if (req.body) {
        const sanitized = {};
        for (const key in req.body) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                const value = req.body[key];
                // Only sanitize string values, preserve objects and arrays
                if (typeof value === 'string') {
                    // For content fields, allow some HTML but sanitize dangerous content
                    if (key === 'content' || key === 'excerpt' || key === 'message') {
                        sanitized[key] = purify.sanitize(value, {
                            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote'],
                            ALLOWED_ATTR: ['href', 'target', 'rel'],
                        });
                    }
                    else {
                        // For other string fields, remove all HTML
                        sanitized[key] = purify.sanitize(value, { ALLOWED_TAGS: [] });
                    }
                }
                else {
                    sanitized[key] = value;
                }
            }
        }
        req.body = sanitized;
    }
    if (req.query) {
        const sanitized = {};
        for (const key in req.query) {
            if (Object.prototype.hasOwnProperty.call(req.query, key)) {
                const value = req.query[key];
                if (typeof value === 'string') {
                    sanitized[key] = purify.sanitize(value, { ALLOWED_TAGS: [] });
                }
                else {
                    sanitized[key] = value;
                }
            }
        }
        req.query = sanitized;
    }
    if (req.params) {
        const sanitized = {};
        for (const key in req.params) {
            if (Object.prototype.hasOwnProperty.call(req.params, key)) {
                const value = req.params[key];
                if (typeof value === 'string') {
                    sanitized[key] = purify.sanitize(value, { ALLOWED_TAGS: [] });
                }
                else {
                    sanitized[key] = value;
                }
            }
        }
        req.params = sanitized;
    }
    next();
};
exports.sanitizeStrings = sanitizeStrings;
//# sourceMappingURL=sanitize.middleware.js.map