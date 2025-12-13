import { Request, Response, NextFunction } from 'express';
import { newsletterService } from '../services/newsletter.service';

export class NewsletterController {
  /**
   * POST /api/v1/newsletter/subscribe
   */
  async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await newsletterService.subscribe(req.body);
      res.status(201).json({
        ...result,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/newsletter/confirm
   */
  async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await newsletterService.confirm(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/newsletter/unsubscribe
   */
  async unsubscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await newsletterService.unsubscribe(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/newsletter/preferences
   */
  async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await newsletterService.updatePreferences(email, req.body);
      res.json({
        data: result,
        message: 'Preferences updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/newsletter (admin only)
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        status: req.query.status as any,
        search: req.query.search as string,
      };

      const result = await newsletterService.getAll(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/newsletter/:email
   */
  async getByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const subscriber = await newsletterService.getByEmail(email);
      res.json({ data: subscriber });
    } catch (error) {
      next(error);
    }
  }
}

export const newsletterController = new NewsletterController();

