import { Request, Response, NextFunction } from 'express';
import { sanitize, sanitizeStrings } from '../../middleware/sanitize.middleware';

describe('Sanitization Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  describe('sanitize', () => {
    it('should sanitize XSS attempts in body', () => {
      mockRequest.body = {
        name: '<script>alert("XSS")</script>John',
        email: 'john@test.com',
      };

      sanitize(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.name).not.toContain('<script>');
      expect(mockRequest.body.name).toContain('John');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should sanitize nested objects', () => {
      mockRequest.body = {
        user: {
          name: '<script>alert("XSS")</script>',
          bio: '<img src=x onerror=alert(1)>',
        },
      };

      sanitize(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.user.name).not.toContain('<script>');
      expect(mockRequest.body.user.bio).not.toContain('<img');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should sanitize arrays', () => {
      mockRequest.body = {
        tags: ['<script>alert(1)</script>', 'normal-tag'],
      };

      sanitize(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.tags[0]).not.toContain('<script>');
      expect(mockRequest.body.tags[1]).toBe('normal-tag');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should sanitize query parameters', () => {
      mockRequest.query = {
        search: '<script>alert("XSS")</script>',
      };

      sanitize(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.query.search).not.toContain('<script>');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should sanitize params', () => {
      mockRequest.params = {
        id: '<script>alert(1)</script>',
      };

      sanitize(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.params.id).not.toContain('<script>');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should preserve non-string values', () => {
      mockRequest.body = {
        number: 123,
        boolean: true,
        nullValue: null,
      };

      sanitize(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.number).toBe(123);
      expect(mockRequest.body.boolean).toBe(true);
      expect(mockRequest.body.nullValue).toBeNull();
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('sanitizeStrings', () => {
    it('should allow safe HTML tags in content fields', () => {
      mockRequest.body = {
        content: '<p>Safe content</p><strong>Bold</strong>',
      };

      sanitizeStrings(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.content).toContain('<p>');
      expect(mockRequest.body.content).toContain('<strong>');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should remove dangerous tags from content', () => {
      mockRequest.body = {
        content: '<script>alert("XSS")</script><p>Safe</p>',
      };

      sanitizeStrings(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.content).not.toContain('<script>');
      expect(mockRequest.body.content).toContain('<p>');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should remove all HTML from non-content fields', () => {
      mockRequest.body = {
        title: '<p>Title</p>',
        content: '<p>Content</p>',
      };

      sanitizeStrings(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.title).not.toContain('<p>');
      expect(mockRequest.body.content).toContain('<p>'); // content field allows HTML
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});

