import { Request, Response, NextFunction } from 'express';
import { productsService } from '../services/products.service';

export class ProductsController {
  /**
   * GET /api/v1/products
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string,
      };

      const result = await productsService.getAll(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/products/:slug
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const product = await productsService.getBySlug(slug);
      res.json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/products/id/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productsService.getById(id);
      res.json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/products
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productsService.create(req.body);
      res.status(201).json({
        data: product,
        message: 'Product created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/products/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productsService.update(id, req.body);
      res.json({
        data: product,
        message: 'Product updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/products/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await productsService.delete(id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const productsController = new ProductsController();

