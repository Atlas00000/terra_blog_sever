/**
 * Contact Service
 * Handles contact form submissions
 */
import { ContactStatus } from '@prisma/client';
export interface SubmitContactData {
    name: string;
    email: string;
    subject: string;
    message: string;
}
export interface ContactQueryParams {
    page?: number;
    limit?: number;
    status?: ContactStatus;
    search?: string;
}
declare class ContactService {
    /**
     * Submit contact form
     */
    submit(data: SubmitContactData): Promise<{
        status: import(".prisma/client").$Enums.ContactStatus;
        message: string;
        name: string;
        email: string;
        id: string;
        createdAt: Date;
        subject: string;
        respondedAt: Date | null;
    }>;
    /**
     * Get all submissions (admin only)
     */
    getAll(params: ContactQueryParams): Promise<{
        data: {
            status: import(".prisma/client").$Enums.ContactStatus;
            message: string;
            name: string;
            email: string;
            id: string;
            createdAt: Date;
            subject: string;
            respondedAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get submission by ID
     */
    getById(id: string): Promise<{
        status: import(".prisma/client").$Enums.ContactStatus;
        message: string;
        name: string;
        email: string;
        id: string;
        createdAt: Date;
        subject: string;
        respondedAt: Date | null;
    }>;
    /**
     * Update submission status
     */
    updateStatus(id: string, status: ContactStatus): Promise<{
        status: import(".prisma/client").$Enums.ContactStatus;
        message: string;
        name: string;
        email: string;
        id: string;
        createdAt: Date;
        subject: string;
        respondedAt: Date | null;
    }>;
    /**
     * Delete submission
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
export declare const contactService: ContactService;
export {};
//# sourceMappingURL=contact.service.d.ts.map