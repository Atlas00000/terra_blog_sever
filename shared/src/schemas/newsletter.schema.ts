import { z } from 'zod';

export const subscribeNewsletterSchema = z.object({
  email: z.string().email(),
  preferences: z.record(z.boolean()).optional(),
});

export const updatePreferencesSchema = z.object({
  preferences: z.record(z.boolean()),
});

export const unsubscribeSchema = z.object({
  email: z.string().email(),
  token: z.string().optional(), // Optional unsubscribe token
});

export const getNewsletterQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20').optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'UNSUBSCRIBED']).optional(),
  search: z.string().optional(),
});

