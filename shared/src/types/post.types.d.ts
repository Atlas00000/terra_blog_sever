import { PostStatus } from '@prisma/client';
export interface PostCreateInput {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    status?: PostStatus;
    categoryIds?: string[];
    tagIds?: string[];
    productIds?: string[];
}
export interface PostUpdateInput {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    status?: PostStatus;
    categoryIds?: string[];
    tagIds?: string[];
    productIds?: string[];
}
export interface PostQueryParams {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    author?: string;
    status?: PostStatus;
    search?: string;
}
//# sourceMappingURL=post.types.d.ts.map