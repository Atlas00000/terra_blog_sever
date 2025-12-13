"use strict";
/**
 * Request ID Middleware
 * Adds a unique request ID to each request for tracing and logging
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = void 0;
const uuid_1 = require("uuid");
/**
 * Generate and attach a unique request ID to each request
 */
const requestId = (req, res, next) => {
    const id = (0, uuid_1.v4)();
    req.requestId = id;
    // Add request ID to response headers
    res.setHeader('X-Request-ID', id);
    next();
};
exports.requestId = requestId;
//# sourceMappingURL=request-id.middleware.js.map