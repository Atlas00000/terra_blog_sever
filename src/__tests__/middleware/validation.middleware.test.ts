import { Request, Response, NextFunction } from 'express';
import { validate } from '../../middleware/validation.middleware';
import { z } from 'zod';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('validate body', () => {
    it('should pass validation for valid body', () => {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
      });

      mockRequest.body = {
        name: 'John Doe',
        email: 'john@test.com',
      };

      const middleware = validate(schema, 'body');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid body', () => {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
      });

      mockRequest.body = {
        name: '', // Invalid: empty string
        email: 'invalid-email',
      };

      const middleware = validate(schema, 'body');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('validate query', () => {
    it('should pass validation for valid query', () => {
      const schema = z.object({
        page: z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: z.string().regex(/^\d+$/).transform(Number).optional(),
      });

      mockRequest.query = {
        page: '1',
        limit: '10',
      };

      const middleware = validate(schema, 'query');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 400 for invalid query', () => {
      const schema = z.object({
        page: z.string().regex(/^\d+$/).optional(),
      });

      mockRequest.query = {
        page: 'invalid',
      };

      const middleware = validate(schema, 'query');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validate params', () => {
    it('should pass validation for valid params', () => {
      const schema = z.object({
        id: z.string().cuid(),
      });

      mockRequest.params = {
        id: 'clx1234567890abcdefghij',
      };

      const middleware = validate(schema, 'params');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 400 for invalid params', () => {
      const schema = z.object({
        id: z.string().cuid(),
      });

      mockRequest.params = {
        id: 'invalid-id',
      };

      const middleware = validate(schema, 'params');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});

