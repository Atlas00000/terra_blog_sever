/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DDoS attacks
 */

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { AppError } from './error.middleware';

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 * Disabled in test environment
 */
export const apiLimiter = rateLimit({
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
  handler: (req: Request, res: Response) => {
    throw new AppError('TOO_MANY_REQUESTS', 'Too many requests from this IP, please try again later', 429);
  },
  skip: () => process.env.NODE_ENV === 'test', // Skip rate limiting in tests
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP
 * Disabled in test environment
 */
export const authLimiter = rateLimit({
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
  handler: (req: Request, res: Response) => {
    throw new AppError('TOO_MANY_AUTH_REQUESTS', 'Too many authentication attempts, please try again later', 429);
  },
  skip: () => process.env.NODE_ENV === 'test', // Skip rate limiting in tests
});

/**
 * Strict rate limiter for contact form submissions
 * 3 requests per hour per IP
 */
export const contactLimiter = rateLimit({
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
  handler: (req: Request, res: Response) => {
    throw new AppError('TOO_MANY_CONTACT_REQUESTS', 'Too many contact form submissions, please try again later', 429);
  },
});

/**
 * Strict rate limiter for newsletter subscriptions
 * 5 requests per hour per IP
 */
export const newsletterLimiter = rateLimit({
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
  handler: (req: Request, res: Response) => {
    throw new AppError('TOO_MANY_NEWSLETTER_REQUESTS', 'Too many newsletter subscription attempts, please try again later', 429);
  },
});

/**
 * Strict rate limiter for comment submissions
 * 10 requests per hour per IP
 */
export const commentLimiter = rateLimit({
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
  handler: (req: Request, res: Response) => {
    throw new AppError('TOO_MANY_COMMENT_REQUESTS', 'Too many comment submissions, please try again later', 429);
  },
});

