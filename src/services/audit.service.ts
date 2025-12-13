/**
 * Audit Logging Service
 * Tracks all CRUD operations for audit purposes
 */

import prisma from '../lib/prisma';

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

class AuditService {
  /**
   * Create an audit log entry
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      await prisma.auditLog.create({
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
    } catch (error) {
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
  async logCreate(
    resource: AuditResource,
    resourceId: string,
    userId?: string,
    changes?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
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
  async logUpdate(
    resource: AuditResource,
    resourceId: string,
    userId?: string,
    changes?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
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
  async logDelete(
    resource: AuditResource,
    resourceId: string,
    userId?: string,
    changes?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
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
  async logRead(
    resource: AuditResource,
    resourceId: string,
    userId?: string,
    changes?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
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
  async getLogs(params: {
    page?: number;
    limit?: number;
    resource?: string;
    action?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.resource) {
      where.resource = params.resource as string;
    }

    if (params.action) {
      where.action = params.action as string;
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
      prisma.auditLog.findMany({
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
      prisma.auditLog.count({ where }),
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

export const auditService = new AuditService();

