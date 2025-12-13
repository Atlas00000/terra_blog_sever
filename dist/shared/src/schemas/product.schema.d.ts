import { z } from 'zod';
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    features: z.ZodArray<z.ZodString, "many">;
    specifications: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    videos: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    description: string;
    features: string[];
    specifications?: Record<string, any> | undefined;
    images?: string[] | undefined;
    videos?: string[] | undefined;
}, {
    name: string;
    slug: string;
    description: string;
    features: string[];
    specifications?: Record<string, any> | undefined;
    images?: string[] | undefined;
    videos?: string[] | undefined;
}>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    features: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    specifications: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    images: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    videos: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    features?: string[] | undefined;
    specifications?: Record<string, any> | undefined;
    images?: string[] | undefined;
    videos?: string[] | undefined;
}, {
    name?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    features?: string[] | undefined;
    specifications?: Record<string, any> | undefined;
    images?: string[] | undefined;
    videos?: string[] | undefined;
}>;
export declare const getProductParamsSchema: z.ZodEffects<z.ZodObject<{
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
export declare const getProductsQuerySchema: z.ZodObject<{
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
//# sourceMappingURL=product.schema.d.ts.map