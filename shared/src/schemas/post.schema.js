"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsQuerySchema = exports.getPostParamsSchema = exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    excerpt: zod_1.z.string().max(500).optional(),
    content: zod_1.z.string().min(1),
    coverImage: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
    categoryIds: zod_1.z.array(zod_1.z.string().cuid()).optional(),
    tagIds: zod_1.z.array(zod_1.z.string().cuid()).optional(),
    productIds: zod_1.z.array(zod_1.z.string().cuid()).optional(),
});
exports.updatePostSchema = exports.createPostSchema.partial();
exports.getPostParamsSchema = zod_1.z.object({
    slug: zod_1.z.string(),
});
exports.getPostsQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).default('20'),
    category: zod_1.z.string().optional(),
    tag: zod_1.z.string().optional(),
    author: zod_1.z.string().optional(),
    status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=post.schema.js.map