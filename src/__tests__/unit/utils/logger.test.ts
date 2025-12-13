import { logger, logRequest, logError } from '../../../utils/logger';
import { Request } from 'express';

describe('Logger', () => {
  it('should have logger instance', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });

  describe('logRequest', () => {
    it('should log request with request ID', () => {
      const mockReq = {
        requestId: 'test-request-id',
        method: 'GET',
        path: '/api/test',
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue('test-user-agent'),
      } as unknown as Request;

      // Should not throw
      expect(() => logRequest(mockReq, 'Test message')).not.toThrow();
    });

    it('should handle missing request ID', () => {
      const mockReq = {
        method: 'GET',
        path: '/api/test',
        ip: '127.0.0.1',
        get: jest.fn().mockReturnValue('test-user-agent'),
      } as unknown as Request;

      expect(() => logRequest(mockReq, 'Test message')).not.toThrow();
    });
  });

  describe('logError', () => {
    it('should log error with request context', () => {
      const mockReq = {
        requestId: 'test-request-id',
        method: 'POST',
        path: '/api/test',
        ip: '127.0.0.1',
      } as unknown as Request;

      const error = new Error('Test error');

      // Should not throw
      expect(() => logError(mockReq, error)).not.toThrow();
    });

    it('should log error with custom message', () => {
      const mockReq = {
        requestId: 'test-request-id',
        method: 'POST',
        path: '/api/test',
        ip: '127.0.0.1',
      } as unknown as Request;

      const error = new Error('Test error');

      expect(() => logError(mockReq, error, 'Custom error message')).not.toThrow();
    });
  });
});

