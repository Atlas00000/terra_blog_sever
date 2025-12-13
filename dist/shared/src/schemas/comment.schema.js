"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentParamsSchema = exports.getCommentsQuerySchema = exports.updateCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
exports.createCommentSchema = zod_1.z.object({
    postId: zod_1.z.string().cuid(),
    parentId: zod_1.z.string().cuid().optional(),
    authorName: zod_1.z.string().min(1).max(100),
    authorEmail: zod_1.z.string().email(),
    authorUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    content: zod_1.z.string().min(1).max(5000),
});
exports.updateCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(5000),
    status: zod_1.z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SPAM']).optional(),
});
exports.getCommentsQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).default('20').optional(),
    postId: zod_1.z.string().cuid().optional(),
    status: zod_1.z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SPAM']).optional(),
});
exports.getCommentParamsSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
//# sourceMappingURL=comment.schema.js.map