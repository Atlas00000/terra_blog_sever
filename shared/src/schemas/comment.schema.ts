import { z } from 'zod'

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000),
  parentId: z.string().cuid().optional(),
  authorName: z.string().min(1, 'Name is required').max(100),
  authorEmail: z.string().email('Valid email is required'),
  authorUrl: z.string().url().optional().or(z.literal('')),
})

export const postSlugParamsSchema = z.object({
  slug: z.string().min(1),
})

export const listCommentsQuerySchema = z.object({
  page: z.preprocess((v) => (v ? Number(v) : 1), z.number().int().positive()).optional(),
  limit: z.preprocess((v) => (v ? Number(v) : 20), z.number().int().positive()).optional(),
})

export const adminListCommentsQuerySchema = z.object({
  page: z.preprocess((v) => (v ? Number(v) : 1), z.number().int().positive()).optional(),
  limit: z.preprocess((v) => (v ? Number(v) : 20), z.number().int().positive()).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  postId: z.string().cuid().optional(),
  postSlug: z.string().optional(),
})

export const updateCommentStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentStatusInput = z.infer<typeof updateCommentStatusSchema>
export type ListCommentsQuery = z.infer<typeof listCommentsQuerySchema>
export type AdminListCommentsQuery = z.infer<typeof adminListCommentsQuerySchema>
