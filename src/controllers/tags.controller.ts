import { Request, Response, NextFunction } from 'express';
import { tagsService } from '../services/tags.service';

export class TagsController {
  /**
   * GET /api/v1/tags
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string,
      };

      const result = await tagsService.getAll(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/tags/:slug
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const tag = await tagsService.getBySlug(slug);
      res.json({ data: tag });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/tags/id/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tag = await tagsService.getById(id);
      res.json({ data: tag });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/tags
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tag = await tagsService.create(req.body);
      res.status(201).json({
        data: tag,
        message: 'Tag created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/tags/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tag = await tagsService.update(id, req.body);
      res.json({
        data: tag,
        message: 'Tag updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/tags/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await tagsService.delete(id);
      res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const tagsController = new TagsController();

