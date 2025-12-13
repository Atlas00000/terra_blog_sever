/**
 * Media Service
 * Handles media CRUD operations and file management
 */
export interface CreateMediaData {
    originalUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    uploadedById?: string;
}
export interface MediaQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    mimeType?: string;
    uploadedById?: string;
}
declare class MediaService {
    /**
     * Get all media with filters
     */
    getAll(params: MediaQueryParams): Promise<{
        data: ({
            uploadedBy: {
                name: string | null;
                email: string;
                id: string;
            } | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            originalUrl: string;
            optimizedUrl: string;
            thumbnailUrl: string | null;
            fileName: string;
            fileSize: number;
            mimeType: string;
            uploadedById: string | null;
        } | {
            optimizedUrl: string;
            thumbnailUrl: string;
            responsiveUrls: {
                thumbnail: string;
                small: string;
                medium: string;
                large: string;
                original: string;
            };
            uploadedBy: {
                name: string | null;
                email: string;
                id: string;
            } | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            originalUrl: string;
            fileName: string;
            fileSize: number;
            mimeType: string;
            uploadedById: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get media by ID
     */
    getById(id: string): Promise<({
        uploadedBy: {
            name: string | null;
            email: string;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalUrl: string;
        optimizedUrl: string;
        thumbnailUrl: string | null;
        fileName: string;
        fileSize: number;
        mimeType: string;
        uploadedById: string | null;
    }) | {
        optimizedUrl: string;
        thumbnailUrl: string;
        responsiveUrls: {
            thumbnail: string;
            small: string;
            medium: string;
            large: string;
            original: string;
        };
        uploadedBy: {
            name: string | null;
            email: string;
            id: string;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalUrl: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        uploadedById: string | null;
    }>;
    /**
     * Create media record
     */
    create(data: CreateMediaData): Promise<({
        uploadedBy: {
            name: string | null;
            email: string;
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalUrl: string;
        optimizedUrl: string;
        thumbnailUrl: string | null;
        fileName: string;
        fileSize: number;
        mimeType: string;
        uploadedById: string | null;
    }) | {
        responsiveUrls: {
            thumbnail: string;
            small: string;
            medium: string;
            large: string;
            original: string;
        };
        uploadedBy: {
            name: string | null;
            email: string;
            id: string;
        } | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        originalUrl: string;
        optimizedUrl: string;
        thumbnailUrl: string | null;
        fileName: string;
        fileSize: number;
        mimeType: string;
        uploadedById: string | null;
    }>;
    /**
     * Delete media
     */
    delete(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
}
export declare const mediaService: MediaService;
export {};
//# sourceMappingURL=media.service.d.ts.map