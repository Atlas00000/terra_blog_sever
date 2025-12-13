/**
 * Newsletter Service
 * Handles newsletter subscriptions, confirmations, and preferences
 */
import { SubscriberStatus } from '@prisma/client';
export interface SubscribeData {
    email: string;
    preferences?: Record<string, boolean>;
}
export interface UpdatePreferencesData {
    preferences: Record<string, boolean>;
}
export interface NewsletterQueryParams {
    page?: number;
    limit?: number;
    status?: SubscriberStatus;
    search?: string;
}
declare class NewsletterService {
    /**
     * Generate confirmation token
     */
    private generateToken;
    /**
     * Subscribe to newsletter
     */
    subscribe(data: SubscribeData): Promise<{
        message: string;
        requiresConfirmation: boolean;
    }>;
    /**
     * Confirm subscription (double opt-in)
     */
    confirm(email: string): Promise<{
        message: string;
    }>;
    /**
     * Unsubscribe from newsletter
     */
    unsubscribe(email: string): Promise<{
        message: string;
    }>;
    /**
     * Update preferences
     */
    updatePreferences(email: string, data: UpdatePreferencesData): Promise<{
        status: import(".prisma/client").$Enums.SubscriberStatus;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        preferences: import("@prisma/client/runtime/library").JsonValue | null;
        confirmedAt: Date | null;
        unsubscribedAt: Date | null;
    }>;
    /**
     * Get all subscribers (admin only)
     */
    getAll(params: NewsletterQueryParams): Promise<{
        data: {
            status: import(".prisma/client").$Enums.SubscriberStatus;
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            preferences: import("@prisma/client/runtime/library").JsonValue | null;
            confirmedAt: Date | null;
            unsubscribedAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get subscriber by email
     */
    getByEmail(email: string): Promise<{
        status: import(".prisma/client").$Enums.SubscriberStatus;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        preferences: import("@prisma/client/runtime/library").JsonValue | null;
        confirmedAt: Date | null;
        unsubscribedAt: Date | null;
    }>;
}
export declare const newsletterService: NewsletterService;
export {};
//# sourceMappingURL=newsletter.service.d.ts.map