"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
// Soft delete middleware (only for models with deletedAt field)
exports.prisma.$use(async (params, next) => {
    // Only apply to models that have deletedAt field (Post model only)
    // Comments use status-based soft deletes (REJECTED status), not deletedAt
    const modelsWithSoftDelete = ['Post'];
    if (!modelsWithSoftDelete.includes(params.model || '')) {
        return next(params);
    }
    // Handle delete operations
    if (params.action === 'delete') {
        params.action = 'update';
        params.args['data'] = { deletedAt: new Date() };
    }
    // Handle deleteMany operations
    if (params.action === 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data !== undefined) {
            params.args.data['deletedAt'] = new Date();
        }
        else {
            params.args['data'] = { deletedAt: new Date() };
        }
    }
    // Filter out deleted records in find operations
    if (params.action === 'findUnique' || params.action === 'findFirst') {
        if (params.args.where !== undefined) {
            if (params.args.where.deletedAt === undefined) {
                params.args.where['deletedAt'] = null;
            }
        }
        else {
            params.args['where'] = { deletedAt: null };
        }
    }
    if (params.action === 'findMany') {
        if (params.args.where !== undefined) {
            if (params.args.where.deletedAt === undefined) {
                params.args.where['deletedAt'] = null;
            }
        }
        else {
            params.args['where'] = { deletedAt: null };
        }
    }
    return next(params);
});
exports.default = exports.prisma;
//# sourceMappingURL=prisma.js.map