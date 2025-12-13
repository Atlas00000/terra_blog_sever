import { Role } from '@prisma/client';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../../../src/config/env';

/**
 * Generate a JWT token for testing
 */
export function generateToken(userId: string, role: Role = Role.AUTHOR): string {
  return jwt.sign(
    {
      id: userId,
      email: 'test@test.com',
      role,
    },
    env.JWT_SECRET,
    {
      expiresIn: String(env.JWT_EXPIRES_IN),
    } as SignOptions
  );
}

/**
 * Generate authorization header
 */
export function getAuthHeader(token: string): { Authorization: string } {
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Generate admin auth header
 */
export function getAdminAuthHeader(userId: string): { Authorization: string } {
  return getAuthHeader(generateToken(userId, Role.ADMIN));
}

/**
 * Generate editor auth header
 */
export function getEditorAuthHeader(userId: string): { Authorization: string } {
  return getAuthHeader(generateToken(userId, Role.EDITOR));
}

/**
 * Generate author auth header
 */
export function getAuthorAuthHeader(userId: string): { Authorization: string } {
  return getAuthHeader(generateToken(userId, Role.AUTHOR));
}

