"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPressReleasesQuerySchema = exports.getPressReleaseParamsSchema = exports.updatePressReleaseSchema = exports.createPressReleaseSchema = void 0;
const zod_1 = require("zod");
exports.createPressReleaseSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    excerpt: zod_1.z.string().max(500).optional(),
    content: zod_1.z.string().min(1),
    publishedAt: zod_1.z.string().datetime().or(zod_1.z.date()),
    featured: zod_1.z.boolean().default(false),
    mediaKitUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
exports.updatePressReleaseSchema = exports.createPressReleaseSchema.partial();
exports.getPressReleaseParamsSchema = zod_1.z.object({
    id: zod_1.z.string().cuid().optional(),
    slug: zod_1.z.string().optional(),
}).refine((data) => data.id || data.slug, {
    message: 'Either id or slug must be provided',
});
exports.getPressReleasesQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).default('20').optional(),
    featured: zod_1.z.string().transform((val) => val === 'true').optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=press.schema.js.map