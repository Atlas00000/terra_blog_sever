"use strict";
/**
 * Security Configuration
 * Centralized security settings for the application
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = exports.helmetConfig = void 0;
const env_1 = require("./env");
/**
 * Helmet security headers configuration
 */
exports.helmetConfig = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:', 'http:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", 'data:'],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding for API docs
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    },
};
/**
 * CORS configuration
 */
exports.corsConfig = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
            return callback(null, true);
        }
        const allowedOrigins = [
            env_1.env.CLIENT_URL,
            'http://localhost:3000',
            'http://localhost:3001',
            // Add production URLs when available
        ];
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            // In development, allow all origins
            if (env_1.env.NODE_ENV === 'development') {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID'],
    maxAge: 86400, // 24 hours
};
//# sourceMappingURL=security.js.map