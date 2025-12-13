"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsletterQuerySchema = exports.unsubscribeSchema = exports.updatePreferencesSchema = exports.subscribeNewsletterSchema = void 0;
const zod_1 = require("zod");
exports.subscribeNewsletterSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    preferences: zod_1.z.record(zod_1.z.boolean()).optional(),
});
exports.updatePreferencesSchema = zod_1.z.object({
    preferences: zod_1.z.record(zod_1.z.boolean()),
});
exports.unsubscribeSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    token: zod_1.z.string().optional(), // Optional unsubscribe token
});
exports.getNewsletterQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).default('20').optional(),
    status: zod_1.z.enum(['PENDING', 'CONFIRMED', 'UNSUBSCRIBED']).optional(),
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=newsletter.schema.js.map