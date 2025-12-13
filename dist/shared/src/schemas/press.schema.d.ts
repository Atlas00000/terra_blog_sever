import { z } from 'zod';
export declare const createPressReleaseSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    excerpt: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    publishedAt: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    featured: z.ZodDefault<z.ZodBoolean>;
    mediaKitUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    content: string;
    slug: string;
    title: string;
    publishedAt: string | Date;
    featured: boolean;
    excerpt?: string | undefined;
    mediaKitUrl?: string | undefined;
}, {
    content: string;
    slug: string;
    title: string;
    publishedAt: string | Date;
    excerpt?: string | undefined;
    featured?: boolean | undefined;
    mediaKitUrl?: string | undefined;
}>;
export declare const updatePressReleaseSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    content: z.ZodOptional<z.ZodString>;
    publishedAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    featured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    mediaKitUrl: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
}, "strip", z.ZodTypeAny, {
    content?: string | undefined;
    excerpt?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    publishedAt?: string | Date | undefined;
    featured?: boolean | undefined;
    mediaKitUrl?: string | undefined;
}, {
    content?: string | undefined;
    excerpt?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    publishedAt?: string | Date | undefined;
    featured?: boolean | undefined;
    mediaKitUrl?: string | undefined;
}>;
export declare const getPressReleaseParamsSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    slug?: string | undefined;
}, {
    id?: string | undefined;
    slug?: string | undefined;
}>, {
    id?: string | undefined;
    slug?: string | undefined;
}, {
    id?: string | undefined;
    slug?: string | undefined;
}>;
export declare const getPressReleasesQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>>;
    featured: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    search?: string | undefined;
    page?: number | undefined;
    featured?: boolean | undefined;
}, {
    limit?: string | undefined;
    search?: string | undefined;
    page?: string | undefined;
    featured?: string | undefined;
}>;
//# sourceMappingURL=press.schema.d.ts.map