import { z } from 'zod';
export declare const createPostSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    excerpt: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    coverImage: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    status: z.ZodDefault<z.ZodEnum<["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]>>;
    categoryIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tagIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    productIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
    content: string;
    slug: string;
    title: string;
    excerpt?: string | undefined;
    coverImage?: string | undefined;
    categoryIds?: string[] | undefined;
    tagIds?: string[] | undefined;
    productIds?: string[] | undefined;
}, {
    content: string;
    slug: string;
    title: string;
    status?: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" | undefined;
    excerpt?: string | undefined;
    coverImage?: string | undefined;
    categoryIds?: string[] | undefined;
    tagIds?: string[] | undefined;
    productIds?: string[] | undefined;
}>;
export declare const updatePostSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    content: z.ZodOptional<z.ZodString>;
    coverImage: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]>>>;
    categoryIds: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    tagIds: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    productIds: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    status?: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" | undefined;
    content?: string | undefined;
    excerpt?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    coverImage?: string | undefined;
    categoryIds?: string[] | undefined;
    tagIds?: string[] | undefined;
    productIds?: string[] | undefined;
}, {
    status?: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" | undefined;
    content?: string | undefined;
    excerpt?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    coverImage?: string | undefined;
    categoryIds?: string[] | undefined;
    tagIds?: string[] | undefined;
    productIds?: string[] | undefined;
}>;
export declare const getPostParamsSchema: z.ZodObject<{
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    slug: string;
}, {
    slug: string;
}>;
export declare const getPostsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
    limit: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
    category: z.ZodOptional<z.ZodString>;
    tag: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" | undefined;
    search?: string | undefined;
    category?: string | undefined;
    tag?: string | undefined;
    author?: string | undefined;
}, {
    status?: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" | undefined;
    limit?: string | undefined;
    search?: string | undefined;
    category?: string | undefined;
    tag?: string | undefined;
    page?: string | undefined;
    author?: string | undefined;
}>;
//# sourceMappingURL=post.schema.d.ts.map