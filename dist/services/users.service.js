"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const client_1 = require("@prisma/client");
const auth_service_1 = require("./auth.service");
class UsersService {
    /**
     * Get all users
     */
    async getAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    bio: true,
                    avatar: true,
                    slug: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma_1.default.user.count(),
        ]);
        return {
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get user by ID
     */
    async getById(id) {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                bio: true,
                avatar: true,
                slug: true,
                socialLinks: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new error_middleware_1.AppError('USER_NOT_FOUND', 'User not found', 404);
        }
        return user;
    }
    /**
     * Get user by slug (for author pages)
     */
    async getBySlug(slug) {
        const user = await prisma_1.default.user.findUnique({
            where: { slug },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                bio: true,
                avatar: true,
                slug: true,
                socialLinks: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        if (!user) {
            throw new error_middleware_1.AppError('USER_NOT_FOUND', 'User not found', 404);
        }
        return user;
    }
    /**
     * Create user
     */
    async create(data) {
        // Check if user already exists
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new error_middleware_1.AppError('USER_EXISTS', 'User with this email already exists', 409);
        }
        // Check if slug is taken (if provided)
        if (data.slug) {
            const existingSlug = await prisma_1.default.user.findUnique({
                where: { slug: data.slug },
            });
            if (existingSlug) {
                throw new error_middleware_1.AppError('SLUG_EXISTS', 'User with this slug already exists', 409);
            }
        }
        // Hash password
        const hashedPassword = await auth_service_1.authService.hashPassword(data.password);
        // Create user
        const user = await prisma_1.default.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: data.role || client_1.Role.AUTHOR,
                bio: data.bio,
                avatar: data.avatar,
                slug: data.slug,
                socialLinks: data.socialLinks,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                bio: true,
                avatar: true,
                slug: true,
                socialLinks: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    /**
     * Update user
     */
    async update(id, data) {
        // Check if user exists
        const existingUser = await prisma_1.default.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            throw new error_middleware_1.AppError('USER_NOT_FOUND', 'User not found', 404);
        }
        // Check if slug is taken (if provided and different)
        if (data.slug && data.slug !== existingUser.slug) {
            const existingSlug = await prisma_1.default.user.findUnique({
                where: { slug: data.slug },
            });
            if (existingSlug) {
                throw new error_middleware_1.AppError('SLUG_EXISTS', 'User with this slug already exists', 409);
            }
        }
        // Hash password if provided
        const updateData = { ...data };
        if (data.password) {
            updateData.password = await auth_service_1.authService.hashPassword(data.password);
        }
        // Update user
        const user = await prisma_1.default.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                bio: true,
                avatar: true,
                slug: true,
                socialLinks: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    /**
     * Delete user
     */
    async delete(id) {
        // Check if user exists
        const user = await prisma_1.default.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new error_middleware_1.AppError('USER_NOT_FOUND', 'User not found', 404);
        }
        // Delete user (hard delete for users)
        await prisma_1.default.user.delete({
            where: { id },
        });
        return { message: 'User deleted successfully' };
    }
}
exports.usersService = new UsersService();
//# sourceMappingURL=users.service.js.map