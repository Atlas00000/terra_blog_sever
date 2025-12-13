import { Request, Response, NextFunction } from 'express';
import { postsService } from '../services/posts.service';

export class PostsController {
  /**
   * GET /api/v1/posts
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        category: req.query.category as string,
        tag: req.query.tag as string,
        author: req.query.author as string,
        status: req.query.status as any,
        search: req.query.search as string,
      };

      const result = await postsService.getAll(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/posts/:slug
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const post = await postsService.getBySlug(slug);
      res.json({ data: post });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/posts/id/:id (admin)
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await postsService.getById(id);
      res.json({ data: post });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/posts
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
            statusCode: 401,
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      const post = await postsService.create(req.body, userId);
      res.status(201).json({
        data: post,
        message: 'Post created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/posts/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      if (!userId) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
            statusCode: 401,
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      const post = await postsService.update(id, req.body, userId, userRole);
      res.json({
        data: post,
        message: 'Post updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/posts/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      if (!userId) {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
            statusCode: 401,
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      await postsService.delete(id, userId, userRole);
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const postsController = new PostsController();

