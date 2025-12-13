"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const prisma_1 = __importDefault(require("../lib/prisma"));
const error_middleware_1 = require("../middleware/error.middleware");
const client_1 = require("@prisma/client");
class AuthService {
    /**
     * Hash password using bcrypt
     */
    async hashPassword(password) {
        return bcryptjs_1.default.hash(password, 12);
    }
    /**
     * Compare password with hash
     */
    async comparePassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
    /**
     * Generate JWT token
     */
    generateToken(userId, email, role) {
        return jsonwebtoken_1.default.sign({ userId, email, role }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
    }
    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        }
        catch (error) {
            throw new error_middleware_1.AppError('INVALID_TOKEN', 'Invalid or expired token', 401);
        }
    }
    /**
     * Register new user
     */
    async register(data) {
        // Check if user already exists
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new error_middleware_1.AppError('USER_EXISTS', 'User with this email already exists', 409);
        }
        // Hash password
        const hashedPassword = await this.hashPassword(data.password);
        // Create user
        const user = await prisma_1.default.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: data.role || client_1.Role.AUTHOR,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
        // Generate token
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            user,
            token,
        };
    }
    /**
     * Login user
     */
    async login(credentials) {
        // Find user
        const user = await prisma_1.default.user.findUnique({
            where: { email: credentials.email },
        });
        if (!user) {
            throw new error_middleware_1.AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
        }
        // Verify password
        const isValidPassword = await this.comparePassword(credentials.password, user.password);
        if (!isValidPassword) {
            throw new error_middleware_1.AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
        }
        // Generate token
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token,
        };
    }
    /**
     * Get user by ID
     */
    async getUserById(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
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
}
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map