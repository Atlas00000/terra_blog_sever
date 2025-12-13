import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { Role } from '@prisma/client';
import { authService } from './auth.service';

export interface CreateUserData {
  email: string;
  password: string;
  name?: string;
  role?: Role;
  bio?: string;
  avatar?: string;
  slug?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface UpdateUserData {
  name?: string;
  password?: string;
  role?: Role;
  bio?: string;
  avatar?: string;
  slug?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

class UsersService {
  /**
   * Get all users
   */
  async getAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          bio: true,
          avatar: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count(),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatar: true,
        slug: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 'User not found', 404);
    }

    return user;
  }

  /**
   * Get user by slug (for author pages)
   */
  async getBySlug(slug: string) {
    const user = await prisma.user.findUnique({
      where: { slug },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatar: true,
        slug: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 'User not found', 404);
    }

    return user;
  }

  /**
   * Create user
   */
  async create(data: CreateUserData) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('USER_EXISTS', 'User with this email already exists', 409);
    }

    // Check if slug is taken (if provided)
    if (data.slug) {
      const existingSlug = await prisma.user.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        throw new AppError('SLUG_EXISTS', 'User with this slug already exists', 409);
      }
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || Role.AUTHOR,
        bio: data.bio,
        avatar: data.avatar,
        slug: data.slug,
        socialLinks: data.socialLinks,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatar: true,
        slug: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Update user
   */
  async update(id: string, data: UpdateUserData) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new AppError('USER_NOT_FOUND', 'User not found', 404);
    }

    // Check if slug is taken (if provided and different)
    if (data.slug && data.slug !== existingUser.slug) {
      const existingSlug = await prisma.user.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        throw new AppError('SLUG_EXISTS', 'User with this slug already exists', 409);
      }
    }

    // Hash password if provided
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await authService.hashPassword(data.password);
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
        avatar: true,
        slug: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Delete user
   */
  async delete(id: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 'User not found', 404);
    }

    // Delete user (hard delete for users)
    await prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}

export const usersService = new UsersService();

