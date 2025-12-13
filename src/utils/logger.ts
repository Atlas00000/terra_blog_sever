import winston from 'winston';
import { Request } from 'express';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: logFormat,
  defaultMeta: { service: 'terrablog-api', environment: process.env.NODE_ENV || 'development' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Console transport with different format based on environment
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.Console({
      format: logFormat,
    })
  );
} else {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), consoleFormat),
    })
  );
}

/**
 * Log request with request ID
 */
export const logRequest = (req: Request, message: string, level: 'info' | 'warn' | 'error' = 'info') => {
  const requestId = req.requestId || 'unknown';
  const logData = {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  logger[level](message, logData);
};

/**
 * Log error with request context
 */
export const logError = (req: Request, error: Error, message?: string) => {
  const requestId = req.requestId || 'unknown';
  logger.error(message || error.message, {
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

