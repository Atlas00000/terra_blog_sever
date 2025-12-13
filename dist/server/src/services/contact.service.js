"use strict";
/**
 * Contact Service
 * Handles contact form submissions
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const client_1 = require("@prisma/client");
class ContactService {
    /**
     * Submit contact form
     */
    async submit(data) {
        const submission = await prisma_1.default.contactSubmission.create({
            data: {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                status: client_1.ContactStatus.PENDING,
            },
        });
        // TODO: Send notification email to admin
        // TODO: Send confirmation email to user
        return submission;
    }
    /**
     * Get all submissions (admin only)
     */
    async getAll(params) {
        const page = params.page || 1;
        const limit = params.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.status) {
            where.status = params.status;
        }
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { email: { contains: params.search, mode: 'insensitive' } },
                { subject: { contains: params.search, mode: 'insensitive' } },
                { message: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [submissions, total] = await Promise.all([
            prisma_1.default.contactSubmission.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma_1.default.contactSubmission.count({ where }),
        ]);
        return {
            data: submissions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get submission by ID
     */
    async getById(id) {
        const submission = await prisma_1.default.contactSubmission.findUnique({
            where: { id },
        });
        if (!submission) {
            throw new error_middleware_1.AppError('SUBMISSION_NOT_FOUND', 'Contact submission not found', 404);
        }
        return submission;
    }
    /**
     * Update submission status
     */
    async updateStatus(id, status) {
        const submission = await prisma_1.default.contactSubmission.findUnique({
            where: { id },
        });
        if (!submission) {
            throw new error_middleware_1.AppError('SUBMISSION_NOT_FOUND', 'Contact submission not found', 404);
        }
        const updateData = { status };
        // Set respondedAt if marking as responded
        if (status === client_1.ContactStatus.RESPONDED && !submission.respondedAt) {
            updateData.respondedAt = new Date();
        }
        const updated = await prisma_1.default.contactSubmission.update({
            where: { id },
            data: updateData,
        });
        return updated;
    }
    /**
     * Delete submission
     */
    async delete(id) {
        const submission = await prisma_1.default.contactSubmission.findUnique({
            where: { id },
        });
        if (!submission) {
            throw new error_middleware_1.AppError('SUBMISSION_NOT_FOUND', 'Contact submission not found', 404);
        }
        await prisma_1.default.contactSubmission.delete({
            where: { id },
        });
        return { message: 'Contact submission deleted successfully' };
    }
}
exports.contactService = new ContactService();
//# sourceMappingURL=contact.service.js.map