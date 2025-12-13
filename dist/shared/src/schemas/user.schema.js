"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserParamsSchema = exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1).max(100).optional(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    role: zod_1.z.enum(['ADMIN', 'AUTHOR', 'EDITOR']).default('AUTHOR'),
    bio: zod_1.z.string().max(500).optional(),
    avatar: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/).optional(),
    socialLinks: zod_1.z.object({
        linkedin: zod_1.z.string().url().optional(),
        twitter: zod_1.z.string().url().optional(),
        email: zod_1.z.string().email().optional(),
    }).optional(),
});
exports.updateUserSchema = exports.createUserSchema.partial().extend({
    password: zod_1.z.string().min(8).optional(),
    email: zod_1.z.string().email().optional(), // Email can't be changed via update
}).omit({ email: true });
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.getUserParamsSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
//# sourceMappingURL=user.schema.js.map