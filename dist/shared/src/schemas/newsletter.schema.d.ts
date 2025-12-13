import { z } from 'zod';
export declare const subscribeNewsletterSchema: z.ZodObject<{
    email: z.ZodString;
    preferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    preferences?: Record<string, boolean> | undefined;
}, {
    email: string;
    preferences?: Record<string, boolean> | undefined;
}>;
export declare const updatePreferencesSchema: z.ZodObject<{
    preferences: z.ZodRecord<z.ZodString, z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    preferences: Record<string, boolean>;
}, {
    preferences: Record<string, boolean>;
}>;
export declare const unsubscribeSchema: z.ZodObject<{
    email: z.ZodString;
    token: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    token?: string | undefined;
}, {
    email: string;
    token?: string | undefined;
}>;
export declare const getNewsletterQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "CONFIRMED", "UNSUBSCRIBED"]>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "PENDING" | "CONFIRMED" | "UNSUBSCRIBED" | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    page?: number | undefined;
}, {
    status?: "PENDING" | "CONFIRMED" | "UNSUBSCRIBED" | undefined;
    limit?: string | undefined;
    search?: string | undefined;
    page?: string | undefined;
}>;
//# sourceMappingURL=newsletter.schema.d.ts.map