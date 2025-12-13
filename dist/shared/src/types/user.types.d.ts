import { Role } from '@prisma/client';
export interface UserCreateInput {
    email: string;
    name?: string;
    password: string;
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
export interface UserUpdateInput {
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
export interface LoginInput {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string | null;
        role: Role;
    };
    token: string;
}
//# sourceMappingURL=user.types.d.ts.map