import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { authService } from '../../services/auth.service';
import { AppError } from '../../middleware/error.middleware';
import { Role } from '@prisma/client';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('authenticate', () => {
    it('should authenticate valid token', async () => {
      const userId = 'test-user-id';
      const email = 'test@test.com';
      const role = Role.AUTHOR;
      const token = authService.generateToken(userId, email, role);

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect((mockRequest as any).user).toBeDefined();
      expect((mockRequest as any).user.userId).toBe(userId);
      expect((mockRequest as any).user.email).toBe(email);
      expect((mockRequest as any).user.role).toBe(role);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 401 if no token provided', async () => {
      mockRequest.headers = {};

      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if token format is invalid', async () => {
      mockRequest.headers = {
        authorization: 'InvalidFormat token',
      };

      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('should authorize user with correct role', () => {
      (mockRequest as any).user = {
        userId: 'test-user-id',
        email: 'test@test.com',
        role: Role.ADMIN,
      };

      const middleware = authorize(Role.ADMIN, Role.EDITOR);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 401 if user not authenticated', () => {
      (mockRequest as any).user = undefined;

      const middleware = authorize(Role.ADMIN);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 403 if user role not allowed', () => {
      (mockRequest as any).user = {
        userId: 'test-user-id',
        email: 'test@test.com',
        role: Role.AUTHOR,
      };

      const middleware = authorize(Role.ADMIN, Role.EDITOR);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should allow multiple roles', () => {
      (mockRequest as any).user = {
        userId: 'test-user-id',
        email: 'test@test.com',
        role: Role.EDITOR,
      };

      const middleware = authorize(Role.ADMIN, Role.EDITOR);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });
  });
});

