import { productsService } from '../../../services/products.service';
import { AppError } from '../../../middleware/error.middleware';
import { cleanDatabase, seedTestData, createTestProduct, createTestPost } from '../../helpers/db.helper';

describe('ProductsService', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('getAll', () => {
    it('should return paginated products', async () => {
      await seedTestData();

      const result = await productsService.getAll({ page: 1, limit: 10 });

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
    });

    it('should include post count', async () => {
      const { product, post } = await seedTestData();

      const result = await productsService.getAll({});

      const foundProduct = result.data.find((p) => p.id === product.id);
      expect(foundProduct?.postCount).toBeGreaterThan(0);
    });

    it('should search products', async () => {
      await createTestProduct({ name: 'Terra Platform', slug: 'terra-platform' });
      await createTestProduct({ name: 'Terra Analytics', slug: 'terra-analytics' });

      const result = await productsService.getAll({ search: 'Terra' });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.some((p) => p.name.includes('Terra'))).toBe(true);
    });
  });

  describe('getBySlug', () => {
    it('should get product by slug', async () => {
      const { product } = await seedTestData();

      const result = await productsService.getBySlug(product.slug);

      expect(result).toBeDefined();
      expect(result.slug).toBe(product.slug);
      expect(result.postCount).toBeDefined();
    });

    it('should throw error if product not found', async () => {
      await expect(productsService.getBySlug('non-existent-slug')).rejects.toThrow(AppError);
    });
  });

  describe('getById', () => {
    it('should get product by ID', async () => {
      const { product } = await seedTestData();

      const result = await productsService.getById(product.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(product.id);
    });

    it('should throw error if product not found', async () => {
      await expect(productsService.getById('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const data = {
        name: 'New Product',
        slug: 'new-product',
        description: 'New product description',
        features: ['Feature 1', 'Feature 2'],
        specifications: { version: '1.0.0' },
      };

      const product = await productsService.create(data);

      expect(product).toBeDefined();
      expect(product.name).toBe(data.name);
      expect(product.slug).toBe(data.slug);
      expect(product.features).toEqual(data.features);
    });

    it('should throw error if name already exists', async () => {
      const { product } = await seedTestData();

      const data = {
        name: product.name,
        slug: 'different-slug',
        description: 'Description',
        features: [],
      };

      await expect(productsService.create(data)).rejects.toThrow(AppError);
    });

    it('should throw error if slug already exists', async () => {
      const { product } = await seedTestData();

      const data = {
        name: 'Different Name',
        slug: product.slug,
        description: 'Description',
        features: [],
      };

      await expect(productsService.create(data)).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update product', async () => {
      const { product } = await seedTestData();

      const updateData = {
        name: 'Updated Product',
        description: 'Updated description',
        features: ['Updated Feature'],
      };

      const updated = await productsService.update(product.id, updateData);

      expect(updated.name).toBe(updateData.name);
      expect(updated.description).toBe(updateData.description);
      expect(updated.features).toEqual(updateData.features);
    });

    it('should throw error if product not found', async () => {
      await expect(
        productsService.update('non-existent-id', { name: 'New Name' })
      ).rejects.toThrow(AppError);
    });

    it('should throw error if name is taken by another product', async () => {
      const { product } = await seedTestData();
      const product2 = await createTestProduct({ name: 'Product 2', slug: 'product-2' });

      await expect(
        productsService.update(product.id, { name: product2.name })
      ).rejects.toThrow(AppError);
    });

    it('should throw error if slug is taken by another product', async () => {
      const { product } = await seedTestData();
      const product2 = await createTestProduct({ name: 'Product 2', slug: 'product-2' });

      await expect(
        productsService.update(product.id, { slug: product2.slug })
      ).rejects.toThrow(AppError);
    });
  });

  describe('delete', () => {
    it('should delete product', async () => {
      const product = await createTestProduct({ name: 'To Delete', slug: 'to-delete' });

      await productsService.delete(product.id);

      const deleted = await global.prisma.product.findUnique({
        where: { id: product.id },
      });

      expect(deleted).toBeNull();
    });

    it('should throw error if product not found', async () => {
      await expect(productsService.delete('non-existent-id')).rejects.toThrow(AppError);
    });

    it('should throw error if product has posts', async () => {
      const { product, author } = await seedTestData();
      await createTestPost({
        title: 'Post with Product',
        slug: 'post-with-product',
        authorId: author.id,
      });

      // Connect product to post
      await global.prisma.post.update({
        where: { id: (await global.prisma.post.findFirst({ where: { slug: 'post-with-product' } }))!.id },
        data: {
          products: {
            connect: { id: product.id },
          },
        },
      });

      await expect(productsService.delete(product.id)).rejects.toThrow(AppError);
    });
  });
});

