/**
 * Comments Service
 * Handles comment CRUD operations, moderation, and threading
 */
import { CommentStatus } from '@prisma/client';
export interface CreateCommentData {
    postId: string;
    parentId?: string;
    authorName: string;
    authorEmail: string;
    authorUrl?: string;
    content: string;
    userId?: string;
}
export interface UpdateCommentData {
    content?: string;
    status?: CommentStatus;
}
export interface CommentQueryParams {
    page?: number;
    limit?: number;
    postId?: string;
    status?: CommentStatus;
}
declare class CommentsService {
    /**
     * Get all comments with filters
     */
    getAll(params: CommentQueryParams): Promise<{
        data: {
            replyCount: number;
            user: {
                name: string | null;
                email: string;
                id: string;
                avatar: string | null;
            } | null;
            _count: {
                replies: number;
            };
            replies: ({
                user: {
                    name: string | null;
                    email: string;
                    id: string;
                    avatar: string | null;
                } | null;
            } & {
                status: import(".prisma/client").$Enums.CommentStatus;
                content: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                postId: string;
                parentId: string | null;
                authorName: string;
                authorEmail: string;
                authorUrl: string | null;
                userId: string | null;
            })[];
            status: import(".prisma/client").$Enums.CommentStatus;
            content: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            postId: string;
            parentId: string | null;
            authorName: string;
            authorEmail: string;
            authorUrl: string | null;
            userId: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get comment by ID
     */
    getById(id: string): Promise<{
        replyCount: number;
        user: {
            name: string | null;
            email: string;
            id: string;
            avatar: string | null;
        } | null;
        _count: {
            replies: number;
        };
        replies: ({
            user: {
                name: string | null;
                email: string;
                id: string;
                avatar: string | null;
            } | null;
        } & {
            status: import(".prisma/client").$Enums.CommentStatus;
            content: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            postId: string;
            parentId: string | null;
            authorName: string;
            authorEmail: string;
            authorUrl: string | null;
            userId: string | null;
        })[];
        status: import(".prisma/client").$Enums.CommentStatus;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        parentId: string | null;
        authorName: string;
        authorEmail: string;
        authorUrl: string | null;
        userId: string | null;
    }>;
    /**
     * Create comment
     */
    create(data: CreateCommentData): Promise<{
        user: {
            name: string | null;
            email: string;
            id: string;
            avatar: string | null;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.CommentStatus;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        parentId: string | null;
        authorName: string;
        authorEmail: string;
        authorUrl: string | null;
        userId: string | null;
    }>;
    /**
     * Update comment
     */
    update(id: string, data: UpdateCommentData, userId: string, userRole: string): Promise<{
        user: {
            name: string | null;
            email: string;
            id: string;
            avatar: string | null;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.CommentStatus;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        parentId: string | null;
        authorName: string;
        authorEmail: string;
        authorUrl: string | null;
        userId: string | null;
    }>;
    /**
     * Delete comment (soft delete via status change)
     */
    delete(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
    /**
     * Moderate comment (approve/reject/spam)
     */
    moderate(id: string, status: CommentStatus): Promise<{
        user: {
            name: string | null;
            email: string;
            id: string;
            avatar: string | null;
        } | null;
    } & {
        status: import(".prisma/client").$Enums.CommentStatus;
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string;
        parentId: string | null;
        authorName: string;
        authorEmail: string;
        authorUrl: string | null;
        userId: string | null;
    }>;
}
export declare const commentsService: CommentsService;
export {};
//# sourceMappingURL=comments.service.d.ts.map