import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(1),
  features: z.array(z.string()).min(1),
  specifications: z.record(z.any()).optional(),
  images: z.array(z.string().url()).optional(),
  videos: z.array(z.string().url()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const getProductParamsSchema = z.object({
  id: z.string().cuid().optional(),
  slug: z.string().optional(),
}).refine((data) => data.id || data.slug, {
  message: 'Either id or slug must be provided',
});

export const getProductsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20').optional(),
  search: z.string().optional(),
});

