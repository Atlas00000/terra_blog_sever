"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsQuerySchema = exports.getProductParamsSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    description: zod_1.z.string().min(1),
    features: zod_1.z.array(zod_1.z.string()).min(1),
    specifications: zod_1.z.record(zod_1.z.any()).optional(),
    images: zod_1.z.array(zod_1.z.string().url()).optional(),
    videos: zod_1.z.array(zod_1.z.string().url()).optional(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
exports.getProductParamsSchema = zod_1.z.object({
    id: zod_1.z.string().cuid().optional(),
    slug: zod_1.z.string().optional(),
}).refine((data) => data.id || data.slug, {
    message: 'Either id or slug must be provided',
});
exports.getProductsQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).default('20').optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=product.schema.js.map