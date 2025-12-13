import { Role } from '@prisma/client';
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterData {
    email: string;
    password: string;
    name?: string;
    role?: Role;
}
export interface AuthResult {
    user: {
        id: string;
        email: string;
        name: string | null;
        role: Role;
    };
    token: string;
}
declare class AuthService {
    /**
     * Hash password using bcrypt
     */
    hashPassword(password: string): Promise<string>;
    /**
     * Compare password with hash
     */
    comparePassword(password: string, hash: string): Promise<boolean>;
    /**
     * Generate JWT token
     */
    generateToken(userId: string, email: string, role: Role): string;
    /**
     * Verify JWT token
     */
    verifyToken(token: string): {
        userId: string;
        email: string;
        role: Role;
    };
    /**
     * Register new user
     */
    register(data: RegisterData): Promise<AuthResult>;
    /**
     * Login user
     */
    login(credentials: LoginCredentials): Promise<AuthResult>;
    /**
     * Get user by ID
     */
    getUserById(userId: string): Promise<{
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
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=auth.service.d.ts.map