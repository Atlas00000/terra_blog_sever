import { Request, Response, NextFunction } from 'express';
import { errorHandler, AppError } from '../../middleware/error.middleware';

describe('Error Handling Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      path: '/api/test',
      method: 'GET',
      headers: {
        'x-request-id': 'test-request-id',
      },
      requestId: 'test-request-id',
      get: jest.fn((header: string) => {
        if (header === 'user-agent') return 'test-user-agent';
        if (header === 'set-cookie') return undefined;
        return undefined;
      }) as any,
      ip: '127.0.0.1',
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('AppError', () => {
    it('should create AppError with correct properties', () => {
      const error = new AppError('TEST_ERROR', 'Test error message', 400);

      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test error message');
      expect(error.statusCode).toBe(400);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('errorHandler', () => {
    it('should handle AppError correctly', () => {
      const error = new AppError('TEST_ERROR', 'Test error message', 400);

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'TEST_ERROR',
            message: 'Test error message',
            statusCode: 400,
          }),
        })
      );
    });

    it('should handle generic Error', () => {
      const error = new Error('Generic error');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'INTERNAL_ERROR',
            statusCode: 500,
          }),
        })
      );
    });

    it('should include request ID in error response', () => {
      const error = new AppError('TEST_ERROR', 'Test error', 400);

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            requestId: 'test-request-id',
          }),
        })
      );
    });

    it('should hide error details in production for 500 errors', () => {
      process.env.NODE_ENV = 'production';
      const error = new AppError('INTERNAL_ERROR', 'Internal error', 500, { sensitive: 'data' });

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      const callArgs = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(callArgs.error.details).toBeUndefined();
    });
  });
});

