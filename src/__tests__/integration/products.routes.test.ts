import express from 'express';
import request from 'supertest';
import { createTestApp, setupTestEnvironment } from '../helpers/app.helper';
import { createTestProduct, seedTestData, createTestPost } from '../helpers/db.helper';
import { authService } from '../../services/auth.service';
import { Role } from '@prisma/client';

describe('Products Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await setupTestEnvironment();
  });

  describe('GET /api/v1/products', () => {
    it('should return paginated products (public)', async () => {
      await createTestProduct({ name: 'Product 1', slug: 'product-1' });
      await createTestProduct({ name: 'Product 2', slug: 'product-2' });

      const response = await request(app)
        .get('/api/v1/products')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    it('should search products', async () => {
      await createTestProduct({ name: 'Terra Platform', slug: 'terra-platform' });
      await createTestProduct({ name: 'Terra Analytics', slug: 'terra-analytics' });

      const response = await request(app)
        .get('/api/v1/products?search=Terra')
        .expect(200);

      expect(response.body.data.some((p: any) => p.name.includes('Terra'))).toBe(true);
    });
  });

  describe('GET /api/v1/products/:slug', () => {
    it('should return product by slug (public)', async () => {
      const product = await createTestProduct({ name: 'Test Product', slug: 'test-product' });

      const response = await request(app)
        .get('/api/v1/products/test-product')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.slug).toBe(product.slug);
    });

    it('should return 404 for non-existent slug', async () => {
      await request(app)
        .get('/api/v1/products/non-existent-slug')
        .expect(404);
    });
  });

  describe('POST /api/v1/products', () => {
    it('should create product for admin/editor', async () => {
      const { editor } = await seedTestData();
      const token = authService.generateToken(editor.id, editor.email, editor.role as Role);

      const productData = {
        name: 'New Product',
        slug: 'new-product',
        description: 'New product description',
        features: ['Feature 1', 'Feature 2'],
        specifications: { version: '1.0.0' },
      };

      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData)
        .expect(201);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(productData.name);
      expect(response.body.data.features).toEqual(productData.features);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      const productData = {
        name: 'New Product',
        slug: 'new-product',
      };

      await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData)
        .expect(403);
    });

    it('should return 409 for duplicate name', async () => {
      const { admin } = await seedTestData();
      const existing = await createTestProduct({ name: 'Existing', slug: 'existing' });
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const productData = {
        name: existing.name,
        slug: 'different-slug',
        description: 'Product description',
        features: ['Feature 1'],
      };

      await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token}`)
        .send(productData)
        .expect(409);
    });
  });

  describe('PUT /api/v1/products/:id', () => {
    it('should update product for admin/editor', async () => {
      const { editor } = await seedTestData();
      const product = await createTestProduct({ name: 'Original', slug: 'original' });
      const token = authService.generateToken(editor.id, editor.email, editor.role as Role);

      const updateData = {
        name: 'Updated Product',
        features: ['Updated Feature'],
      };

      const response = await request(app)
        .put(`/api/v1/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.features).toEqual(updateData.features);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author } = await seedTestData();
      const product = await createTestProduct({ name: 'Test', slug: 'test' });
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .put(`/api/v1/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' })
        .expect(403);
    });
  });

  describe('DELETE /api/v1/products/:id', () => {
    it('should delete product for admin', async () => {
      const { admin } = await seedTestData();
      const product = await createTestProduct({ name: 'To Delete', slug: 'to-delete' });
      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      await request(app)
        .delete(`/api/v1/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const deleted = await global.prisma.product.findUnique({
        where: { id: product.id },
      });
      expect(deleted).toBeNull();
    });

    it('should return 409 if product has posts', async () => {
      const { admin, author, product } = await seedTestData();
      await createTestPost({
        title: 'Post with Product',
        slug: 'post-with-product',
        authorId: author.id,
      });

      // Connect product to post
      const post = await global.prisma.post.findFirst({ where: { slug: 'post-with-product' } });
      if (post) {
        await global.prisma.post.update({
          where: { id: post.id },
          data: {
            products: {
              connect: { id: product.id },
            },
          },
        });
      }

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      await request(app)
        .delete(`/api/v1/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(409);
    });
  });
});

