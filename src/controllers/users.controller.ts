import { Request, Response, NextFunction } from 'express';
import { usersService } from '../services/users.service';
import { AppError } from '../middleware/error.middleware';

export class UsersController {
  /**
   * GET /api/v1/users
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await usersService.getAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await usersService.getById(id);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/slug/:slug
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const user = await usersService.getBySlug(slug);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/users
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await usersService.create(req.body);
      res.status(201).json({
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      // Check if user is admin or updating themselves
      if (userRole !== 'ADMIN' && userId !== id) {
        throw new AppError('FORBIDDEN', 'You can only update your own profile', 403);
      }

      const user = await usersService.update(id, req.body);
      res.json({
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/users/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await usersService.delete(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();

