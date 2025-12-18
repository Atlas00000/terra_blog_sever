import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["ADMIN", "AUTHOR", "EDITOR"]>>;
    bio: z.ZodOptional<z.ZodString>;
    avatar: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    slug: z.ZodOptional<z.ZodString>;
    socialLinks: z.ZodOptional<z.ZodObject<{
        linkedin: z.ZodOptional<z.ZodString>;
        twitter: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        linkedin?: string | undefined;
        twitter?: string | undefined;
    }, {
        email?: string | undefined;
        linkedin?: string | undefined;
        twitter?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: "ADMIN" | "AUTHOR" | "EDITOR";
    password: string;
    slug?: string | undefined;
    name?: string | undefined;
    bio?: string | undefined;
    avatar?: string | undefined;
    socialLinks?: {
        email?: string | undefined;
        linkedin?: string | undefined;
        twitter?: string | undefined;
    } | undefined;
}, {
    email: string;
    password: string;
    role?: "ADMIN" | "AUTHOR" | "EDITOR" | undefined;
    slug?: string | undefined;
    name?: string | undefined;
    bio?: string | undefined;
    avatar?: string | undefined;
    socialLinks?: {
        email?: string | undefined;
        linkedin?: string | undefined;
        twitter?: string | undefined;
    } | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<Omit<{
    name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    role: z.ZodOptional<z.ZodDefault<z.ZodEnum<["ADMIN", "AUTHOR", "EDITOR"]>>>;
    bio: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    avatar: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    socialLinks: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        linkedin: z.ZodOptional<z.ZodString>;
        twitter: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        linkedin?: string | undefined;
        twitter?: string | undefined;
    }, {
        email?: string | undefined;
        linkedin?: string | undefined;
        twitter?: string | undefined;
    }>>>;
} & {
    password: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "email">, "strip", z.ZodTypeAny, {
    role?: "ADMIN" | "AUTHOR" | "EDITOR" | undefined;
    slug?: string | undefined;
    name?: string | undefined;
    password?: string | undefined;
    bio?: string | undefined;
    avatar?: string | undefined;
    socialLinks?: {
        email?: string | undefined;
        linkedin?: string | undefined;
        twitter?: string | undefined;
    } | undefined;
}, {
    role?: "ADMIN" | "AUTHOR" | "EDITOR" | undefined;
    slug?: string | undefined;
    name?: string | undefined;
    password?: string | undefined;
    bio?: string | undefined;
    avatar?: string | undefined;
    socialLinks?: {
        email?: string | undefined;
        linkedin?: string | undefined;
        twitter?: string | undefined;
    } | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const getUserParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=user.schema.d.ts.map