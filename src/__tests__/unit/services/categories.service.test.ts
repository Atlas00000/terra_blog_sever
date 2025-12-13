import { categoriesService } from '../../../services/categories.service';
import { AppError } from '../../../middleware/error.middleware';
import { cleanDatabase, seedTestData, createTestCategory, createTestPost } from '../../helpers/db.helper';

describe('CategoriesService', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('getAll', () => {
    it('should return paginated categories', async () => {
      await seedTestData();

      const result = await categoriesService.getAll({ page: 1, limit: 10 });

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
    });

    it('should include post count', async () => {
      const { category, post } = await seedTestData();

      const result = await categoriesService.getAll({});

      const foundCategory = result.data.find((c: any) => c.id === category.id);
      expect(foundCategory?.postCount).toBeGreaterThan(0);
    });

    it('should search categories', async () => {
      await createTestCategory({ name: 'Technology', slug: 'technology' });
      await createTestCategory({ name: 'Science', slug: 'science' });

      const result = await categoriesService.getAll({ search: 'Tech' });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.some((c: any) => c.name.includes('Tech'))).toBe(true);
    });
  });

  describe('getBySlug', () => {
    it('should get category by slug', async () => {
      const { category } = await seedTestData();

      const result = await categoriesService.getBySlug(category.slug);

      expect(result).toBeDefined();
      expect(result.slug).toBe(category.slug);
      expect(result.postCount).toBeDefined();
    });

    it('should throw error if category not found', async () => {
      await expect(categoriesService.getBySlug('non-existent-slug')).rejects.toThrow(AppError);
    });
  });

  describe('getById', () => {
    it('should get category by ID', async () => {
      const { category } = await seedTestData();

      const result = await categoriesService.getById(category.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(category.id);
    });

    it('should throw error if category not found', async () => {
      await expect(categoriesService.getById('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const data = {
        name: 'New Category',
        slug: 'new-category',
        description: 'New category description',
      };

      const category = await categoriesService.create(data);

      expect(category).toBeDefined();
      expect(category.name).toBe(data.name);
      expect(category.slug).toBe(data.slug);
    });

    it('should throw error if name already exists', async () => {
      const { category } = await seedTestData();

      const data = {
        name: category.name,
        slug: 'different-slug',
      };

      await expect(categoriesService.create(data)).rejects.toThrow(AppError);
    });

    it('should throw error if slug already exists', async () => {
      const { category } = await seedTestData();

      const data = {
        name: 'Different Name',
        slug: category.slug,
      };

      await expect(categoriesService.create(data)).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update category', async () => {
      const { category } = await seedTestData();

      const updateData = {
        name: 'Updated Category',
        description: 'Updated description',
      };

      const updated = await categoriesService.update(category.id, updateData);

      expect(updated.name).toBe(updateData.name);
      expect(updated.description).toBe(updateData.description);
    });

    it('should throw error if category not found', async () => {
      await expect(
        categoriesService.update('non-existent-id', { name: 'New Name' })
      ).rejects.toThrow(AppError);
    });

    it('should throw error if name is taken by another category', async () => {
      const { category } = await seedTestData();
      const category2 = await createTestCategory({ name: 'Category 2', slug: 'category-2' });

      await expect(
        categoriesService.update(category.id, { name: category2.name })
      ).rejects.toThrow(AppError);
    });

    it('should throw error if slug is taken by another category', async () => {
      const { category } = await seedTestData();
      const category2 = await createTestCategory({ name: 'Category 2', slug: 'category-2' });

      await expect(
        categoriesService.update(category.id, { slug: category2.slug })
      ).rejects.toThrow(AppError);
    });

    it('should allow updating to same name', async () => {
      const { category } = await seedTestData();

      const updated = await categoriesService.update(category.id, {
        name: category.name,
        description: 'Updated description',
      });

      expect(updated.name).toBe(category.name);
    });
  });

  describe('delete', () => {
    it('should delete category', async () => {
      const category = await createTestCategory({ name: 'To Delete', slug: 'to-delete' });

      await categoriesService.delete(category.id);

      const deleted = await global.prisma.category.findUnique({
        where: { id: category.id },
      });

      expect(deleted).toBeNull();
    });

    it('should throw error if category not found', async () => {
      await expect(categoriesService.delete('non-existent-id')).rejects.toThrow(AppError);
    });

    it('should throw error if category has posts', async () => {
      const { category, author } = await seedTestData();
      await createTestPost({
        title: 'Post with Category',
        slug: 'post-with-category',
        authorId: author.id,
        categoryIds: [category.id],
      });

      await expect(categoriesService.delete(category.id)).rejects.toThrow(AppError);
    });
  });
});

