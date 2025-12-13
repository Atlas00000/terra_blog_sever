import { Role } from '@prisma/client';
export interface CreateUserData {
    email: string;
    password: string;
    name?: string;
    role?: Role;
    bio?: string;
    avatar?: string;
    slug?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        email?: string;
    };
}
export interface UpdateUserData {
    name?: string;
    password?: string;
    role?: Role;
    bio?: string;
    avatar?: string;
    slug?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        email?: string;
    };
}
declare class UsersService {
    /**
     * Get all users
     */
    getAll(page?: number, limit?: number): Promise<{
        data: {
            name: string | null;
            email: string;
            id: string;
            slug: string | null;
            role: import(".prisma/client").$Enums.Role;
            bio: string | null;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get user by ID
     */
    getById(id: string): Promise<{
        name: string | null;
        email: string;
        id: string;
        slug: string | null;
        role: import(".prisma/client").$Enums.Role;
        bio: string | null;
        avatar: string | null;
        socialLinks: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Get user by slug (for author pages)
     */
    getBySlug(slug: string): Promise<{
        name: string | null;
        email: string;
        id: string;
        slug: string | null;
        role: import(".prisma/client").$Enums.Role;
        bio: string | null;
        avatar: string | null;
        socialLinks: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            posts: number;
        };
    }>;
    /**
     * Create user
     */
    create(data: CreateUserData): Promise<{
        name: string | null;
        email: string;
        id: string;
        slug: string | null;
        role: import(".prisma/client").$Enums.Role;
        bio: string | null;
        avatar: string | null;
        socialLinks: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Update user
     */
    update(id: string, data: UpdateUserData): Promise<{
        name: string | null;
        email: string;
        id: string;
        slug: string | null;
        role: import(".prisma/client").$Enums.Role;
        bio: string | null;
        avatar: string | null;
        socialLinks: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Delete user
     */
    delete(id: string): Promise<{
        message: string;
    }>;
}
export declare const usersService: UsersService;
export {};
//# sourceMappingURL=users.service.d.ts.map