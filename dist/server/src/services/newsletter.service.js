"use strict";
/**
 * Newsletter Service
 * Handles newsletter subscriptions, confirmations, and preferences
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
class NewsletterService {
    /**
     * Generate confirmation token
     */
    generateToken() {
        return crypto_1.default.randomBytes(32).toString('hex');
    }
    /**
     * Subscribe to newsletter
     */
    async subscribe(data) {
        // Check if already subscribed
        const existing = await prisma_1.default.newsletterSubscriber.findUnique({
            where: { email: data.email },
        });
        if (existing) {
            if (existing.status === client_1.SubscriberStatus.CONFIRMED) {
                throw new error_middleware_1.AppError('ALREADY_SUBSCRIBED', 'Email is already subscribed', 409);
            }
            if (existing.status === client_1.SubscriberStatus.UNSUBSCRIBED) {
                // Resubscribe
                await prisma_1.default.newsletterSubscriber.update({
                    where: { email: data.email },
                    data: {
                        status: client_1.SubscriberStatus.PENDING,
                        unsubscribedAt: null,
                        preferences: data.preferences || undefined,
                    },
                });
                return {
                    message: 'Please check your email to confirm your subscription',
                    requiresConfirmation: true,
                };
            }
            // Already pending
            throw new error_middleware_1.AppError('PENDING_CONFIRMATION', 'Please check your email to confirm your subscription', 409);
        }
        // Create new subscriber
        await prisma_1.default.newsletterSubscriber.create({
            data: {
                email: data.email,
                status: client_1.SubscriberStatus.PENDING,
                preferences: data.preferences || undefined,
            },
        });
        // TODO: Send confirmation email
        // In production, send email with confirmation link
        return {
            message: 'Please check your email to confirm your subscription',
            requiresConfirmation: true,
        };
    }
    /**
     * Confirm subscription (double opt-in)
     */
    async confirm(email) {
        const subscriber = await prisma_1.default.newsletterSubscriber.findUnique({
            where: { email },
        });
        if (!subscriber) {
            throw new error_middleware_1.AppError('SUBSCRIBER_NOT_FOUND', 'Subscriber not found', 404);
        }
        if (subscriber.status === client_1.SubscriberStatus.CONFIRMED) {
            return { message: 'Email is already confirmed' };
        }
        await prisma_1.default.newsletterSubscriber.update({
            where: { email },
            data: {
                status: client_1.SubscriberStatus.CONFIRMED,
                confirmedAt: new Date(),
            },
        });
        return { message: 'Subscription confirmed successfully' };
    }
    /**
     * Unsubscribe from newsletter
     */
    async unsubscribe(email) {
        const subscriber = await prisma_1.default.newsletterSubscriber.findUnique({
            where: { email },
        });
        if (!subscriber) {
            throw new error_middleware_1.AppError('SUBSCRIBER_NOT_FOUND', 'Subscriber not found', 404);
        }
        if (subscriber.status === client_1.SubscriberStatus.UNSUBSCRIBED) {
            return { message: 'Email is already unsubscribed' };
        }
        await prisma_1.default.newsletterSubscriber.update({
            where: { email },
            data: {
                status: client_1.SubscriberStatus.UNSUBSCRIBED,
                unsubscribedAt: new Date(),
            },
        });
        return { message: 'Successfully unsubscribed' };
    }
    /**
     * Update preferences
     */
    async updatePreferences(email, data) {
        const subscriber = await prisma_1.default.newsletterSubscriber.findUnique({
            where: { email },
        });
        if (!subscriber) {
            throw new error_middleware_1.AppError('SUBSCRIBER_NOT_FOUND', 'Subscriber not found', 404);
        }
        if (subscriber.status !== client_1.SubscriberStatus.CONFIRMED) {
            throw new error_middleware_1.AppError('NOT_CONFIRMED', 'Please confirm your subscription first', 400);
        }
        const updated = await prisma_1.default.newsletterSubscriber.update({
            where: { email },
            data: {
                preferences: data.preferences,
            },
        });
        return updated;
    }
    /**
     * Get all subscribers (admin only)
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
            where.email = { contains: params.search, mode: 'insensitive' };
        }
        const [subscribers, total] = await Promise.all([
            prisma_1.default.newsletterSubscriber.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma_1.default.newsletterSubscriber.count({ where }),
        ]);
        return {
            data: subscribers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get subscriber by email
     */
    async getByEmail(email) {
        const subscriber = await prisma_1.default.newsletterSubscriber.findUnique({
            where: { email },
        });
        if (!subscriber) {
            throw new error_middleware_1.AppError('SUBSCRIBER_NOT_FOUND', 'Subscriber not found', 404);
        }
        return subscriber;
    }
}
exports.newsletterService = new NewsletterService();
//# sourceMappingURL=newsletter.service.js.map