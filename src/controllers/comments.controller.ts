import { Request, Response, NextFunction } from 'express';
import { commentsService } from '../services/comments.service';
import { AppError } from '../middleware/error.middleware';

export class CommentsController {
  /**
   * Public: list approved comments for a post
   */
  async listForPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await commentsService.listForPost({ slug, page, limit });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public: create comment (pending)
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const userId = (req as any).user?.userId;
      const { content, parentId, authorName, authorEmail, authorUrl } = req.body;

      const comment = await commentsService.create({
        slug,
        content,
        parentId,
        authorName,
        authorEmail,
        authorUrl,
        userId,
      });

      res.status(201).json({
        data: comment,
        message: 'Comment submitted and pending approval',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: list comments
   */
  async adminList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as any;
      const postId = req.query.postId as string;
      const postSlug = req.query.postSlug as string;

      const result = await commentsService.adminList({
        page,
        limit,
        status,
        postId,
        postSlug,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: update status
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await commentsService.updateStatus(id, status);
      res.json({ data: updated, message: 'Comment status updated' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: delete comment (soft)
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await commentsService.softDelete(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const commentsController = new CommentsController();

