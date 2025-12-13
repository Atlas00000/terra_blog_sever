"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactStatusSchema = exports.getContactParamsSchema = exports.getContactQuerySchema = exports.submitContactSchema = void 0;
const zod_1 = require("zod");
exports.submitContactSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    email: zod_1.z.string().email(),
    subject: zod_1.z.string().min(1).max(200),
    message: zod_1.z.string().min(10).max(5000),
});
exports.getContactQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).default('20').optional(),
    status: zod_1.z.enum(['PENDING', 'RESPONDED', 'ARCHIVED']).optional(),
    search: zod_1.z.string().optional(),
});
exports.getContactParamsSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
exports.updateContactStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'RESPONDED', 'ARCHIVED']),
});
//# sourceMappingURL=contact.schema.js.map