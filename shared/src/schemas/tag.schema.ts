import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).optional(),
});

export const updateTagSchema = createTagSchema.partial();

export const getTagParamsSchema = z.object({
  id: z.string().cuid().optional(),
  slug: z.string().optional(),
}).refine((data) => data.id || data.slug, {
  message: 'Either id or slug must be provided',
});

export const getTagsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20').optional(),
  search: z.string().optional(),
});

