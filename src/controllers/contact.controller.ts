import { Request, Response, NextFunction } from 'express';
import { contactService } from '../services/contact.service';

export class ContactController {
  /**
   * POST /api/v1/contact
   */
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const submission = await contactService.submit(req.body);
      res.status(201).json({
        data: submission,
        message: 'Thank you for your message. We will get back to you soon.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/contact (admin only)
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        status: req.query.status as any,
        search: req.query.search as string,
      };

      const result = await contactService.getAll(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/contact/:id (admin only)
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const submission = await contactService.getById(id);
      res.json({ data: submission });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/contact/:id/status (admin only)
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const submission = await contactService.updateStatus(id, status as any);
      res.json({
        data: submission,
        message: 'Status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/contact/:id (admin only)
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await contactService.delete(id);
      res.json({ message: 'Contact submission deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const contactController = new ContactController();

