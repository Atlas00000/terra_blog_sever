/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DDoS attacks
 */
/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export declare const apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP
 */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Strict rate limiter for contact form submissions
 * 3 requests per hour per IP
 */
export declare const contactLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Strict rate limiter for newsletter subscriptions
 * 5 requests per hour per IP
 */
export declare const newsletterLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Strict rate limiter for comment submissions
 * 10 requests per hour per IP
 */
export declare const commentLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rate-limit.middleware.d.ts.map