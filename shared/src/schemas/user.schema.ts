import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'AUTHOR', 'EDITOR']).default('AUTHOR'),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    email: z.string().email().optional(),
  }).optional(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  password: z.string().min(8).optional(),
  email: z.string().email().optional(), // Email can't be changed via update
}).omit({ email: true });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const getUserParamsSchema = z.object({
  id: z.string().cuid(),
});

