import { z } from 'zod';

export const createPressReleaseSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  publishedAt: z.string().datetime().or(z.date()),
  featured: z.boolean().default(false),
  mediaKitUrl: z.string().url().optional().or(z.literal('')),
});

export const updatePressReleaseSchema = createPressReleaseSchema.partial();

export const getPressReleaseParamsSchema = z.object({
  id: z.string().cuid().optional(),
  slug: z.string().optional(),
}).refine((data) => data.id || data.slug, {
  message: 'Either id or slug must be provided',
});

export const getPressReleasesQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20').optional(),
  featured: z.string().transform((val) => val === 'true').optional(),
  search: z.string().optional(),
});

