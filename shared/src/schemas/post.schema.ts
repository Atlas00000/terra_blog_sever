import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
  categoryIds: z.array(z.string().cuid()).optional(),
  tagIds: z.array(z.string().cuid()).optional(),
  productIds: z.array(z.string().cuid()).optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const getPostParamsSchema = z.object({
  slug: z.string(),
});

export const getPostsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  category: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
  search: z.string().optional(),
});

