import { Request, Response, NextFunction } from 'express';
import { pressReleasesService } from '../services/press.service';

export class PressController {
  /**
   * GET /api/v1/press
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const featuredParam = req.query.featured;
      let featured: boolean | undefined;
      
      // Handle string 'true'/'false' only (query params are always strings)
      // Express query params can be string, string[], or ParsedQs, so we need to handle that
      if (featuredParam !== undefined) {
        const featuredStr = Array.isArray(featuredParam) 
          ? String(featuredParam[0]) 
          : String(featuredParam);
        
        if (featuredStr === 'true') {
          featured = true;
        } else if (featuredStr === 'false') {
          featured = false;
        }
        // If featuredStr is any other value, featured remains undefined
      }

      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        featured,
        search: req.query.search as string,
      };

      const result = await pressReleasesService.getAll(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/press/:slug
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const pressRelease = await pressReleasesService.getBySlug(slug);
      res.json({ data: pressRelease });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/press/id/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pressRelease = await pressReleasesService.getById(id);
      res.json({ data: pressRelease });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/press
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = {
        ...req.body,
        publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
      };
      const pressRelease = await pressReleasesService.create(data);
      res.status(201).json({
        data: pressRelease,
        message: 'Press release created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/press/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = {
        ...req.body,
        ...(req.body.publishedAt && { publishedAt: new Date(req.body.publishedAt) }),
      };
      const pressRelease = await pressReleasesService.update(id, data);
      res.json({
        data: pressRelease,
        message: 'Press release updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/press/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await pressReleasesService.delete(id);
      res.json({ message: 'Press release deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const pressController = new PressController();

