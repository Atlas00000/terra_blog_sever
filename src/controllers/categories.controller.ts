import { Request, Response, NextFunction } from 'express';
import { categoriesService } from '../services/categories.service';

export class CategoriesController {
  /**
   * GET /api/v1/categories
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string,
      };

      const result = await categoriesService.getAll(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/categories/:slug
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const category = await categoriesService.getBySlug(slug);
      res.json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/categories/id/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await categoriesService.getById(id);
      res.json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/categories
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoriesService.create(req.body);
      res.status(201).json({
        data: category,
        message: 'Category created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/categories/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await categoriesService.update(id, req.body);
      res.json({
        data: category,
        message: 'Category updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/categories/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await categoriesService.delete(id);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const categoriesController = new CategoriesController();

