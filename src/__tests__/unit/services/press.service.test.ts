import { pressReleasesService } from '../../../services/press.service';
import { AppError } from '../../../middleware/error.middleware';
import { cleanDatabase } from '../../helpers/db.helper';

describe('PressService', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('getAll', () => {
    it('should return paginated press releases', async () => {
      await global.prisma.pressRelease.createMany({
        data: [
          {
            title: 'Press Release 1',
            slug: 'press-release-1',
            content: 'Content 1',
            publishedAt: new Date(),
            featured: false,
          },
          {
            title: 'Press Release 2',
            slug: 'press-release-2',
            content: 'Content 2',
            publishedAt: new Date(),
            featured: true,
          },
        ],
      });

      const result = await pressReleasesService.getAll({ page: 1, limit: 10 });

      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter by featured', async () => {
      await global.prisma.pressRelease.createMany({
        data: [
          {
            title: 'Featured Release',
            slug: 'featured-release',
            content: 'Content',
            publishedAt: new Date(),
            featured: true,
          },
          {
            title: 'Regular Release',
            slug: 'regular-release',
            content: 'Content',
            publishedAt: new Date(),
            featured: false,
          },
        ],
      });

      const result = await pressReleasesService.getAll({ featured: true });

      expect(result.data.every((p: any) => p.featured === true)).toBe(true);
    });

    it('should search press releases', async () => {
      await global.prisma.pressRelease.createMany({
        data: [
          {
            title: 'Technology Release',
            slug: 'tech-release',
            content: 'Technology content',
            publishedAt: new Date(),
          },
          {
            title: 'Business Release',
            slug: 'business-release',
            content: 'Business content',
            publishedAt: new Date(),
          },
        ],
      });

      const result = await pressReleasesService.getAll({ search: 'Technology' });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.some((p: any) => p.title.includes('Technology'))).toBe(true);
    });
  });

  describe('getBySlug', () => {
    it('should get press release by slug', async () => {
      const release = await global.prisma.pressRelease.create({
        data: {
          title: 'Test Release',
          slug: 'test-release',
          content: 'Test content',
          publishedAt: new Date(),
        },
      });

      const result = await pressReleasesService.getBySlug(release.slug);

      expect(result).toBeDefined();
      expect(result.slug).toBe(release.slug);
    });

    it('should throw error if press release not found', async () => {
      await expect(pressReleasesService.getBySlug('non-existent-slug')).rejects.toThrow(AppError);
    });
  });

  describe('getById', () => {
    it('should get press release by ID', async () => {
      const release = await global.prisma.pressRelease.create({
        data: {
          title: 'Test Release',
          slug: 'test-release',
          content: 'Test content',
          publishedAt: new Date(),
        },
      });

      const result = await pressReleasesService.getById(release.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(release.id);
    });

    it('should throw error if press release not found', async () => {
      await expect(pressReleasesService.getById('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new press release', async () => {
      const data = {
        title: 'New Release',
        slug: 'new-release',
        content: 'New content',
        publishedAt: new Date(),
        featured: false,
      };

      const release = await pressReleasesService.create(data);

      expect(release).toBeDefined();
      expect(release.title).toBe(data.title);
      expect(release.slug).toBe(data.slug);
    });

    it('should throw error if slug already exists', async () => {
      const existing = await global.prisma.pressRelease.create({
        data: {
          title: 'Existing',
          slug: 'existing-slug',
          content: 'Content',
          publishedAt: new Date(),
        },
      });

      const data = {
        title: 'New Release',
        slug: existing.slug,
        content: 'Content',
        publishedAt: new Date(),
      };

      await expect(pressReleasesService.create(data)).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update press release', async () => {
      const release = await global.prisma.pressRelease.create({
        data: {
          title: 'Original Title',
          slug: 'original-slug',
          content: 'Original content',
          publishedAt: new Date(),
        },
      });

      const updateData = {
        title: 'Updated Title',
        featured: true,
      };

      const updated = await pressReleasesService.update(release.id, updateData);

      expect(updated.title).toBe(updateData.title);
      expect(updated.featured).toBe(updateData.featured);
    });

    it('should throw error if press release not found', async () => {
      await expect(
        pressReleasesService.update('non-existent-id', { title: 'New Title' })
      ).rejects.toThrow(AppError);
    });

    it('should throw error if slug is taken by another release', async () => {
      const release1 = await global.prisma.pressRelease.create({
        data: {
          title: 'Release 1',
          slug: 'release-1',
          content: 'Content',
          publishedAt: new Date(),
        },
      });

      const release2 = await global.prisma.pressRelease.create({
        data: {
          title: 'Release 2',
          slug: 'release-2',
          content: 'Content',
          publishedAt: new Date(),
        },
      });

      await expect(
        pressReleasesService.update(release1.id, { slug: release2.slug })
      ).rejects.toThrow(AppError);
    });
  });

  describe('delete', () => {
    it('should delete press release', async () => {
      const release = await global.prisma.pressRelease.create({
        data: {
          title: 'To Delete',
          slug: 'to-delete',
          content: 'Content',
          publishedAt: new Date(),
        },
      });

      await pressReleasesService.delete(release.id);

      const deleted = await global.prisma.pressRelease.findUnique({
        where: { id: release.id },
      });

      expect(deleted).toBeNull();
    });

    it('should throw error if press release not found', async () => {
      await expect(pressReleasesService.delete('non-existent-id')).rejects.toThrow(AppError);
    });
  });
});

