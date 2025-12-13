import { z } from 'zod';
export declare const createCommentSchema: z.ZodObject<{
    postId: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
    authorName: z.ZodString;
    authorEmail: z.ZodString;
    authorUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    postId: string;
    authorName: string;
    authorEmail: string;
    parentId?: string | undefined;
    authorUrl?: string | undefined;
}, {
    content: string;
    postId: string;
    authorName: string;
    authorEmail: string;
    parentId?: string | undefined;
    authorUrl?: string | undefined;
}>;
export declare const updateCommentSchema: z.ZodObject<{
    content: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "APPROVED", "REJECTED", "SPAM"]>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "SPAM" | undefined;
}, {
    content: string;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "SPAM" | undefined;
}>;
export declare const getCommentsQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>>;
    postId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "APPROVED", "REJECTED", "SPAM"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "PENDING" | "APPROVED" | "REJECTED" | "SPAM" | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    postId?: string | undefined;
}, {
    status?: "PENDING" | "APPROVED" | "REJECTED" | "SPAM" | undefined;
    limit?: string | undefined;
    page?: string | undefined;
    postId?: string | undefined;
}>;
export declare const getCommentParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=comment.schema.d.ts.map