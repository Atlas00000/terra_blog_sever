/**
 * Audit Logging Service
 * Tracks all CRUD operations for audit purposes
 */
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'READ' | 'LOGIN' | 'LOGOUT';
export type AuditResource = 'POST' | 'USER' | 'CATEGORY' | 'TAG' | 'PRODUCT' | 'MEDIA' | 'COMMENT' | 'NEWSLETTER' | 'CONTACT' | 'PRESS';
export interface AuditLogData {
    action: AuditAction;
    resource: AuditResource;
    resourceId: string;
    userId?: string;
    changes?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
declare class AuditService {
    /**
     * Create an audit log entry
     */
    log(data: AuditLogData): Promise<void>;
    /**
     * Log CREATE operation
     */
    logCreate(resource: AuditResource, resourceId: string, userId?: string, changes?: Record<string, any>, ipAddress?: string, userAgent?: string): Promise<void>;
    /**
     * Log UPDATE operation
     */
    logUpdate(resource: AuditResource, resourceId: string, userId?: string, changes?: Record<string, any>, ipAddress?: string, userAgent?: string): Promise<void>;
    /**
     * Log DELETE operation
     */
    logDelete(resource: AuditResource, resourceId: string, userId?: string, changes?: Record<string, any>, ipAddress?: string, userAgent?: string): Promise<void>;
    /**
     * Log READ operation (for sensitive data)
     */
    logRead(resource: AuditResource, resourceId: string, userId?: string, changes?: Record<string, any>, ipAddress?: string, userAgent?: string): Promise<void>;
    /**
     * Get audit logs with filters
     */
    getLogs(params: {
        page?: number;
        limit?: number;
        resource?: string;
        action?: string;
        userId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        data: ({
            user: {
                name: string | null;
                email: string;
                id: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            action: string;
            resource: string;
            resourceId: string | null;
            changes: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
export declare const auditService: AuditService;
export {};
//# sourceMappingURL=audit.service.d.ts.map