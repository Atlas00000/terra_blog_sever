import { mediaService } from '../../../services/media.service';
import { AppError } from '../../../middleware/error.middleware';
import { cleanDatabase } from '../../helpers/db.helper';
import { createTestUser } from '../../helpers/db.helper';
import { Role } from '@prisma/client';

// Mock Cloudflare services
jest.mock('../../../services/cloudflare-r2.service', () => ({
  cloudflareR2Service: {
    uploadFile: jest.fn(),
    deleteFile: jest.fn().mockResolvedValue(undefined),
    getFileUrl: jest.fn(),
    extractKeyFromUrl: jest.fn((url: string) => {
      // Extract key from URL - get the filename part
      const parts = url.split('/');
      return parts[parts.length - 1] || '';
    }),
    isConfigured: jest.fn().mockReturnValue(true),
  },
}));

jest.mock('../../../services/cloudflare-images.service', () => ({
  cloudflareImagesService: {
    uploadImage: jest.fn(),
    getImageUrl: jest.fn(),
    deleteImage: jest.fn(),
    getResponsiveUrls: jest.fn().mockImplementation((url: string) => ({
      thumbnail: `${url}?thumbnail`,
      small: `${url}?small`,
      medium: `${url}?medium`,
      large: `${url}?large`,
    })),
  },
}));

describe('MediaService', () => {
  let testUser: any;

  beforeEach(async () => {
    await cleanDatabase();
    jest.clearAllMocks();
    
    // Initialize mocks BEFORE creating test user to ensure they're ready
    const { cloudflareImagesService } = require('../../../services/cloudflare-images.service');
    const { cloudflareR2Service } = require('../../../services/cloudflare-r2.service');
    
    // Reset and configure getResponsiveUrls mock - MUST be done before any service calls
    cloudflareImagesService.getResponsiveUrls.mockImplementation((url: string) => ({
      thumbnail: `${url}?thumbnail`,
      small: `${url}?small`,
      medium: `${url}?medium`,
      large: `${url}?large`,
    }));
    
    // Ensure R2 service mocks are configured
    cloudflareR2Service.isConfigured.mockReturnValue(true);
    cloudflareR2Service.deleteFile.mockResolvedValue(undefined);
    cloudflareR2Service.extractKeyFromUrl.mockImplementation((url: string) => {
      const parts = url.split('/');
      return parts[parts.length - 1] || '';
    });
    
    testUser = await createTestUser({
      name: 'Test User',
      email: 'test@example.com',
      role: Role.ADMIN,
    });
  });

  describe('create', () => {
    it('should create a media record', async () => {
      const data = {
        originalUrl: 'https://cdn.example.com/uploads/test.jpg',
        fileName: 'test.jpg',
        fileSize: 1024,
        mimeType: 'image/jpeg',
        uploadedById: testUser.id,
      };

      const result = await mediaService.create(data);

      expect(result).toBeDefined();
      expect(result.fileName).toBe(data.fileName);
      expect(result.originalUrl).toBe(data.originalUrl);
      expect(result.uploadedById).toBe(testUser.id);
    });

    it('should generate optimized URLs for images', async () => {
      const data = {
        originalUrl: 'https://cdn.example.com/uploads/test.jpg',
        fileName: 'test.jpg',
        fileSize: 1024,
        mimeType: 'image/jpeg',
        uploadedById: testUser.id,
      };

      const result = await mediaService.create(data);

      expect(result.optimizedUrl).toBeDefined();
      expect(result.thumbnailUrl).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('should return paginated media', async () => {
      await global.prisma.media.createMany({
        data: [
          {
            originalUrl: 'https://cdn.example.com/file1.jpg',
            optimizedUrl: 'https://cdn.example.com/file1.jpg/medium',
            fileName: 'file1.jpg',
            fileSize: 1024,
            mimeType: 'image/jpeg',
            uploadedById: testUser.id,
          },
          {
            originalUrl: 'https://cdn.example.com/file2.png',
            optimizedUrl: 'https://cdn.example.com/file2.png/medium',
            fileName: 'file2.png',
            fileSize: 2048,
            mimeType: 'image/png',
            uploadedById: testUser.id,
          },
        ],
      });

      const result = await mediaService.getAll({ page: 1, limit: 10 });

      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter by mimeType', async () => {
      await global.prisma.media.createMany({
        data: [
          {
            originalUrl: 'https://cdn.example.com/image.jpg',
            optimizedUrl: 'https://cdn.example.com/image.jpg/medium',
            fileName: 'image.jpg',
            fileSize: 1024,
            mimeType: 'image/jpeg',
            uploadedById: testUser.id,
          },
          {
            originalUrl: 'https://cdn.example.com/document.pdf',
            optimizedUrl: 'https://cdn.example.com/document.pdf',
            fileName: 'document.pdf',
            fileSize: 2048,
            mimeType: 'application/pdf',
            uploadedById: testUser.id,
          },
        ],
      });

      const result = await mediaService.getAll({ mimeType: 'image/jpeg' });

      expect(result.data.length).toBe(1);
      expect(result.data[0].mimeType).toBe('image/jpeg');
    });

    it('should filter by uploadedById', async () => {
      const otherUser = await createTestUser({
        name: 'Other User',
        email: 'other@example.com',
        role: Role.AUTHOR,
      });

      await global.prisma.media.createMany({
        data: [
          {
            originalUrl: 'https://cdn.example.com/file1.jpg',
            optimizedUrl: 'https://cdn.example.com/file1.jpg/medium',
            fileName: 'file1.jpg',
            fileSize: 1024,
            mimeType: 'image/jpeg',
            uploadedById: testUser.id,
          },
          {
            originalUrl: 'https://cdn.example.com/file2.jpg',
            optimizedUrl: 'https://cdn.example.com/file2.jpg/medium',
            fileName: 'file2.jpg',
            fileSize: 2048,
            mimeType: 'image/jpeg',
            uploadedById: otherUser.id,
          },
        ],
      });

      const result = await mediaService.getAll({ uploadedById: testUser.id });

      expect(result.data.length).toBe(1);
      expect(result.data[0].uploadedById).toBe(testUser.id);
    });
  });

  describe('getById', () => {
    it('should get media by ID', async () => {
      const media = await global.prisma.media.create({
        data: {
          originalUrl: 'https://cdn.example.com/test.jpg',
          optimizedUrl: 'https://cdn.example.com/test.jpg/medium',
          fileName: 'test.jpg',
          fileSize: 1024,
          mimeType: 'image/jpeg',
          uploadedById: testUser.id,
        },
      });

      const result = await mediaService.getById(media.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(media.id);
    });

    it('should throw error if media not found', async () => {
      await expect(mediaService.getById('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('delete', () => {
    it('should delete media and file from R2', async () => {
      const media = await global.prisma.media.create({
        data: {
          originalUrl: 'https://cdn.example.com/test.jpg',
          optimizedUrl: 'https://cdn.example.com/test.jpg/medium',
          fileName: 'test.jpg',
          fileSize: 1024,
          mimeType: 'image/jpeg',
          uploadedById: testUser.id,
        },
      });

      const { cloudflareR2Service } = require('../../../services/cloudflare-r2.service');
      // Reset mock before test
      (cloudflareR2Service.deleteFile as jest.Mock).mockClear();

      await mediaService.delete(media.id, testUser.id, 'ADMIN');

      const deleted = await global.prisma.media.findUnique({
        where: { id: media.id },
      });

      expect(deleted).toBeNull();
      // Verify deleteFile was called with the correct URL
      expect(cloudflareR2Service.deleteFile).toHaveBeenCalledWith(expect.stringContaining('test.jpg'));
    });

    it('should throw error if media not found', async () => {
      await expect(mediaService.delete('non-existent-id', testUser.id, 'ADMIN')).rejects.toThrow(AppError);
    });

    it('should throw error if user tries to delete another user\'s media', async () => {
      const otherUser = await createTestUser({
        name: 'Other User',
        email: 'other@example.com',
        role: Role.AUTHOR,
      });

      const media = await global.prisma.media.create({
        data: {
          originalUrl: 'https://cdn.example.com/test.jpg',
          optimizedUrl: 'https://cdn.example.com/test.jpg/medium',
          fileName: 'test.jpg',
          fileSize: 1024,
          mimeType: 'image/jpeg',
          uploadedById: testUser.id,
        },
      });

      await expect(mediaService.delete(media.id, otherUser.id, 'AUTHOR')).rejects.toThrow(AppError);
    });
  });
});
