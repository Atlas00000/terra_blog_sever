import { z } from 'zod';

export const submitContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

export const getContactQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20').optional(),
  status: z.enum(['PENDING', 'RESPONDED', 'ARCHIVED']).optional(),
  search: z.string().optional(),
});

export const getContactParamsSchema = z.object({
  id: z.string().cuid(),
});

export const updateContactStatusSchema = z.object({
  status: z.enum(['PENDING', 'RESPONDED', 'ARCHIVED']),
});

