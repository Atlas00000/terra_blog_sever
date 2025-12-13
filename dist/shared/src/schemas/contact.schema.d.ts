import { z } from 'zod';
export declare const submitContactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    subject: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    name: string;
    email: string;
    subject: string;
}, {
    message: string;
    name: string;
    email: string;
    subject: string;
}>;
export declare const getContactQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "RESPONDED", "ARCHIVED"]>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "ARCHIVED" | "PENDING" | "RESPONDED" | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    page?: number | undefined;
}, {
    status?: "ARCHIVED" | "PENDING" | "RESPONDED" | undefined;
    limit?: string | undefined;
    search?: string | undefined;
    page?: string | undefined;
}>;
export declare const getContactParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const updateContactStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "RESPONDED", "ARCHIVED"]>;
}, "strip", z.ZodTypeAny, {
    status: "ARCHIVED" | "PENDING" | "RESPONDED";
}, {
    status: "ARCHIVED" | "PENDING" | "RESPONDED";
}>;
//# sourceMappingURL=contact.schema.d.ts.map