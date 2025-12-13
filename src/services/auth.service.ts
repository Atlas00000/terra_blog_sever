import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { Role } from '@prisma/client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: Role;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: Role;
  };
  token: string;
}

class AuthService {
  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  generateToken(userId: string, email: string, role: Role): string {
    const payload = { userId, email, role };
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: string; email: string; role: Role } {
    try {
      return jwt.verify(token, env.JWT_SECRET) as {
        userId: string;
        email: string;
        role: Role;
      };
    } catch (error) {
      throw new AppError('INVALID_TOKEN', 'Invalid or expired token', 401);
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResult> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('USER_EXISTS', 'User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || Role.AUTHOR,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user,
      token,
    };
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    // Verify password
    const isValidPassword = await this.comparePassword(
      credentials.password,
      user.password
    );

    if (!isValidPassword) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
}

export const authService = new AuthService();

