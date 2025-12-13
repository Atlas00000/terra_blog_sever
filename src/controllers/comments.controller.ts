import { Request, Response, NextFunction } from 'express';
import { commentsService } from '../services/comments.service';

export class CommentsController {
  /**
   * GET /api/v1/comments
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        postId: req.query.postId as string,
        status: req.query.status as any,
      };

      const result = await commentsService.getAll(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/comments/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const comment = await commentsService.getById(id);
      res.json({ data: comment });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/comments
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const comment = await commentsService.create({
        ...req.body,
        userId,
      });
      res.status(201).json({
        data: comment,
        message: 'Comment submitted successfully. It will be reviewed before publication.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/comments/:id
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

      const comment = await commentsService.update(id, req.body, userId, userRole);
      res.json({
        data: comment,
        message: 'Comment updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/comments/:id
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

      await commentsService.delete(id, userId, userRole);
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/comments/:id/moderate (admin/editor only)
   */
  async moderate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const comment = await commentsService.moderate(id, status);
      res.json({
        data: comment,
        message: 'Comment moderated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const commentsController = new CommentsController();

