"use strict";
/**
 * Audit Logging Service
 * Tracks all CRUD operations for audit purposes
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class AuditService {
    /**
     * Create an audit log entry
     */
    async log(data) {
        try {
            await prisma_1.default.auditLog.create({
                data: {
                    action: data.action,
                    resource: data.resource,
                    resourceId: data.resourceId,
                    userId: data.userId,
                    changes: data.changes || {},
                    ipAddress: data.ipAddress,
                    userAgent: data.userAgent,
                },
            });
        }
        catch (error) {
            // Don't throw errors for audit logging failures
            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
                console.error('Audit logging failed:', error);
            }
        }
    }
    /**
     * Log CREATE operation
     */
    async logCreate(resource, resourceId, userId, changes, ipAddress, userAgent) {
        await this.log({
            action: 'CREATE',
            resource,
            resourceId,
            userId,
            changes,
            ipAddress,
            userAgent,
        });
    }
    /**
     * Log UPDATE operation
     */
    async logUpdate(resource, resourceId, userId, changes, ipAddress, userAgent) {
        await this.log({
            action: 'UPDATE',
            resource,
            resourceId,
            userId,
            changes,
            ipAddress,
            userAgent,
        });
    }
    /**
     * Log DELETE operation
     */
    async logDelete(resource, resourceId, userId, changes, ipAddress, userAgent) {
        await this.log({
            action: 'DELETE',
            resource,
            resourceId,
            userId,
            changes,
            ipAddress,
            userAgent,
        });
    }
    /**
     * Log READ operation (for sensitive data)
     */
    async logRead(resource, resourceId, userId, changes, ipAddress, userAgent) {
        await this.log({
            action: 'READ',
            resource,
            resourceId,
            userId,
            changes,
            ipAddress,
            userAgent,
        });
    }
    /**
     * Get audit logs with filters
     */
    async getLogs(params) {
        const page = params.page || 1;
        const limit = params.limit || 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (params.resource) {
            where.resource = params.resource;
        }
        if (params.action) {
            where.action = params.action;
        }
        if (params.userId) {
            where.userId = params.userId;
        }
        if (params.startDate || params.endDate) {
            where.createdAt = {};
            if (params.startDate) {
                where.createdAt.gte = params.startDate;
            }
            if (params.endDate) {
                where.createdAt.lte = params.endDate;
            }
        }
        const [logs, total] = await Promise.all([
            prisma_1.default.auditLog.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma_1.default.auditLog.count({ where }),
        ]);
        return {
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
exports.auditService = new AuditService();
//# sourceMappingURL=audit.service.js.map