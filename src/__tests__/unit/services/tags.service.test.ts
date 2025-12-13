import { tagsService } from '../../../services/tags.service';
import { AppError } from '../../../middleware/error.middleware';
import { cleanDatabase, seedTestData, createTestTag, createTestPost } from '../../helpers/db.helper';

describe('TagsService', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('getAll', () => {
    it('should return paginated tags', async () => {
      await seedTestData();

      const result = await tagsService.getAll({ page: 1, limit: 10 });

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
    });

    it('should include post count', async () => {
      const { tag, post } = await seedTestData();

      const result = await tagsService.getAll({});

      const foundTag = result.data.find((t: any) => t.id === tag.id);
      expect(foundTag?.postCount).toBeGreaterThan(0);
    });

    it('should search tags', async () => {
      await createTestTag({ name: 'JavaScript', slug: 'javascript' });
      await createTestTag({ name: 'TypeScript', slug: 'typescript' });

      const result = await tagsService.getAll({ search: 'Script' });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.some((t: any) => t.name.includes('Script'))).toBe(true);
    });
  });

  describe('getBySlug', () => {
    it('should get tag by slug', async () => {
      const { tag } = await seedTestData();

      const result = await tagsService.getBySlug(tag.slug);

      expect(result).toBeDefined();
      expect(result.slug).toBe(tag.slug);
      expect(result.postCount).toBeDefined();
    });

    it('should throw error if tag not found', async () => {
      await expect(tagsService.getBySlug('non-existent-slug')).rejects.toThrow(AppError);
    });
  });

  describe('getById', () => {
    it('should get tag by ID', async () => {
      const { tag } = await seedTestData();

      const result = await tagsService.getById(tag.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(tag.id);
    });

    it('should throw error if tag not found', async () => {
      await expect(tagsService.getById('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const data = {
        name: 'New Tag',
        slug: 'new-tag',
        description: 'New tag description',
      };

      const tag = await tagsService.create(data);

      expect(tag).toBeDefined();
      expect(tag.name).toBe(data.name);
      expect(tag.slug).toBe(data.slug);
    });

    it('should throw error if name already exists', async () => {
      const { tag } = await seedTestData();

      const data = {
        name: tag.name,
        slug: 'different-slug',
      };

      await expect(tagsService.create(data)).rejects.toThrow(AppError);
    });

    it('should throw error if slug already exists', async () => {
      const { tag } = await seedTestData();

      const data = {
        name: 'Different Name',
        slug: tag.slug,
      };

      await expect(tagsService.create(data)).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update tag', async () => {
      const { tag } = await seedTestData();

      const updateData = {
        name: 'Updated Tag',
        description: 'Updated description',
      };

      const updated = await tagsService.update(tag.id, updateData);

      expect(updated.name).toBe(updateData.name);
      expect(updated.description).toBe(updateData.description);
    });

    it('should throw error if tag not found', async () => {
      await expect(
        tagsService.update('non-existent-id', { name: 'New Name' })
      ).rejects.toThrow(AppError);
    });

    it('should throw error if name is taken by another tag', async () => {
      const { tag } = await seedTestData();
      const tag2 = await createTestTag({ name: 'Tag 2', slug: 'tag-2' });

      await expect(
        tagsService.update(tag.id, { name: tag2.name })
      ).rejects.toThrow(AppError);
    });

    it('should throw error if slug is taken by another tag', async () => {
      const { tag } = await seedTestData();
      const tag2 = await createTestTag({ name: 'Tag 2', slug: 'tag-2' });

      await expect(
        tagsService.update(tag.id, { slug: tag2.slug })
      ).rejects.toThrow(AppError);
    });
  });

  describe('delete', () => {
    it('should delete tag', async () => {
      const tag = await createTestTag({ name: 'To Delete', slug: 'to-delete' });

      await tagsService.delete(tag.id);

      const deleted = await global.prisma.tag.findUnique({
        where: { id: tag.id },
      });

      expect(deleted).toBeNull();
    });

    it('should throw error if tag not found', async () => {
      await expect(tagsService.delete('non-existent-id')).rejects.toThrow(AppError);
    });

    it('should throw error if tag has posts', async () => {
      const { tag, author } = await seedTestData();
      await createTestPost({
        title: 'Post with Tag',
        slug: 'post-with-tag',
        authorId: author.id,
        tagIds: [tag.id],
      });

      await expect(tagsService.delete(tag.id)).rejects.toThrow(AppError);
    });
  });
});

