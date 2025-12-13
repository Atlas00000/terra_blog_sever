/**
 * Input Sanitization Middleware
 * Prevents XSS attacks by sanitizing user input
 */

import { Request, Response, NextFunction } from 'express';
import DOMPurify from 'dompurify';

// Lazy initialization of DOMPurify to avoid issues in test environment
let purify: ReturnType<typeof DOMPurify> | null = null;
let jsdomInitialized = false;

function getPurify() {
  if (!purify && !jsdomInitialized) {
    try {
      // Use dynamic require for jsdom to avoid ES module issues in Jest
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { JSDOM } = require('jsdom');
      const window = new JSDOM('').window;
      purify = DOMPurify(window as any);
      jsdomInitialized = true;
    } catch (error) {
      // Fallback: if jsdom fails, use a basic sanitizer
      console.warn('JSDOM initialization failed, using basic sanitization');
      jsdomInitialized = true;
      // Return a fallback sanitizer function
      purify = {
        sanitize: (input: string, config?: any) => {
          if (!config || !config.ALLOWED_TAGS || config.ALLOWED_TAGS.length === 0) {
            return input.replace(/<[^>]*>/g, '');
          }
          // For content fields, allow specified tags
          let result = input;
          result = result.replace(/<script[^>]*>.*?<\/script>/gi, '');
          result = result.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
          return result;
        },
      } as any;
    }
  }
  return purify;
}

/**
 * Recursively sanitize object values
 */
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    // Remove HTML tags and dangerous content
    const purifyInstance = getPurify();
    if (!purifyInstance) {
      // Fallback: basic HTML tag removal if DOMPurify is not available
      return obj.replace(/<[^>]*>/g, '');
    }
    const sanitized = purifyInstance.sanitize(obj, { ALLOWED_TAGS: [] });
    return sanitized || obj.replace(/<[^>]*>/g, ''); // Fallback if sanitize returns null/undefined
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const sanitizedValue = sanitizeObject(obj[key]);
        sanitized[key] = sanitizedValue;
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Sanitize request body, query, and params
 */
export const sanitize = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query) as any;
  }

  if (req.params) {
    req.params = sanitizeObject(req.params) as any;
  }

  next();
};

/**
 * Sanitize only string fields (for rich text content that may contain HTML)
 * Use this for endpoints that need to preserve HTML formatting
 */
export const sanitizeStrings = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // Modify in place - preserve all fields, only sanitize string values
    for (const key in req.body) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        const value = req.body[key];
        // Only sanitize string values, preserve objects and arrays
        if (typeof value === 'string') {
          // For content fields, allow some HTML but sanitize dangerous content
          const purifyInstance = getPurify();
          let sanitizedValue: string;
          
          if (!purifyInstance) {
            // Fallback: basic HTML tag removal if DOMPurify is not available
            if (key === 'content' || key === 'excerpt' || key === 'message') {
              // For content fields, just remove script tags
              sanitizedValue = value.replace(/<script[^>]*>.*?<\/script>/gi, '');
            } else {
              // For other string fields, remove all HTML
              sanitizedValue = value.replace(/<[^>]*>/g, '');
            }
          } else if (key === 'content' || key === 'excerpt' || key === 'message') {
            const result = purifyInstance.sanitize(value, {
              ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote'],
              ALLOWED_ATTR: ['href', 'target', 'rel'],
            });
            sanitizedValue = result || value.replace(/<script[^>]*>.*?<\/script>/gi, '');
          } else {
            // For other string fields, remove all HTML
            const result = purifyInstance.sanitize(value, { ALLOWED_TAGS: [] });
            sanitizedValue = result || value.replace(/<[^>]*>/g, '');
          }
          
          // Only update if value changed or if we have a valid sanitized value
          req.body[key] = sanitizedValue;
        }
        // Non-string values are preserved as-is (no modification needed)
      }
    }
  }

  if (req.query) {
    const sanitized: any = {};
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        const value = req.query[key];
        if (typeof value === 'string') {
          const purifyInstance = getPurify();
          sanitized[key] = purifyInstance ? purifyInstance.sanitize(value, { ALLOWED_TAGS: [] }) : value.replace(/<[^>]*>/g, '');
        } else {
          sanitized[key] = value;
        }
      }
    }
    req.query = sanitized;
  }

  if (req.params) {
    const sanitized: any = {};
    for (const key in req.params) {
      if (Object.prototype.hasOwnProperty.call(req.params, key)) {
        const value = req.params[key];
        if (typeof value === 'string') {
          const purifyInstance = getPurify();
          sanitized[key] = purifyInstance ? purifyInstance.sanitize(value, { ALLOWED_TAGS: [] }) : value.replace(/<[^>]*>/g, '');
        } else {
          sanitized[key] = value;
        }
      }
    }
    req.params = sanitized;
  }

  next();
};

