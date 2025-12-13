"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagsQuerySchema = exports.getTagParamsSchema = exports.updateTagSchema = exports.createTagSchema = void 0;
const zod_1 = require("zod");
exports.createTagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    description: zod_1.z.string().max(500).optional(),
});
exports.updateTagSchema = exports.createTagSchema.partial();
exports.getTagParamsSchema = zod_1.z.object({
    id: zod_1.z.string().cuid().optional(),
    slug: zod_1.z.string().optional(),
}).refine((data) => data.id || data.slug, {
    message: 'Either id or slug must be provided',
});
exports.getTagsQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).default('20').optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=tag.schema.js.map