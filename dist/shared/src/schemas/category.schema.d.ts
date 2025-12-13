import { z } from 'zod';
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    description?: string | undefined;
}, {
    name: string;
    slug: string;
    description?: string | undefined;
}>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
}>;
export declare const getCategoryParamsSchema: z.ZodEffects<z.ZodObject<{
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
export declare const getCategoriesQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    search?: string | undefined;
    page?: number | undefined;
}, {
    limit?: string | undefined;
    search?: string | undefined;
    page?: string | undefined;
}>;
//# sourceMappingURL=category.schema.d.ts.map