import { postsService } from '../../../services/posts.service';
import { AppError } from '../../../middleware/error.middleware';
import { cleanDatabase, seedTestData, createTestPost, createTestUser, createTestCategory, createTestTag } from '../../helpers/db.helper';
import { PostStatus } from '@prisma/client';

describe('PostsService', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      // Create content with exactly 400 words
      const words = Array(400).fill('word').join(' ');
      const readingTime = postsService.calculateReadingTime(words);

      expect(readingTime).toBe(2); // 400 words / 200 wpm = 2 minutes
    });

    it('should round up reading time', () => {
      // Create content with exactly 250 words
      const words = Array(250).fill('word').join(' ');
      const readingTime = postsService.calculateReadingTime(words);

      expect(readingTime).toBe(2); // 250 words / 200 wpm = 1.25, rounded up to 2
    });

    it('should return at least 1 minute for any content', () => {
      const content = 'short';
      const readingTime = postsService.calculateReadingTime(content);

      expect(readingTime).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getAll', () => {
    it('should return paginated posts', async () => {
      const { author, post } = await seedTestData();

      const result = await postsService.getAll({ page: 1, limit: 10 });

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
    });

    it('should filter by status', async () => {
      const { author } = await seedTestData();
      await createTestPost({
        title: 'Draft Post',
        slug: 'draft-post',
        authorId: author.id,
        status: PostStatus.DRAFT,
      });

      const result = await postsService.getAll({ status: PostStatus.DRAFT });

      expect(result.data.every((p: any) => p.status === PostStatus.DRAFT)).toBe(true);
    });

    it('should filter by category', async () => {
      const { author, category } = await seedTestData();
      const category2 = await createTestCategory({ name: 'Category 2', slug: 'category-2' });

      await createTestPost({
        title: 'Post with Category 2',
        slug: 'post-category-2',
        authorId: author.id,
        categoryIds: [category2.id],
      });

      const result = await postsService.getAll({ category: category.slug });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.every((p: any) => p.categories.some((c: any) => c.slug === category.slug))).toBe(true);
    });

    it('should filter by tag', async () => {
      const { author, tag } = await seedTestData();
      const tag2 = await createTestTag({ name: 'Tag 2', slug: 'tag-2' });

      await createTestPost({
        title: 'Post with Tag 2',
        slug: 'post-tag-2',
        authorId: author.id,
        tagIds: [tag2.id],
      });

      const result = await postsService.getAll({ tag: tag.slug });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.every((p: any) => p.tags.some((t: any) => t.slug === tag.slug))).toBe(true);
    });

    it('should search posts', async () => {
      const { author } = await seedTestData();
      await createTestPost({
        title: 'Searchable Post',
        slug: 'searchable-post',
        authorId: author.id,
        content: 'This post contains searchable content',
        status: PostStatus.PUBLISHED, // Must be published to appear in search
      });

      const result = await postsService.getAll({ search: 'searchable' });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.some((p: any) => p.title.includes('Searchable'))).toBe(true);
    });
  });

  describe('getBySlug', () => {
    it('should get post by slug', async () => {
      const { post } = await seedTestData();

      const result = await postsService.getBySlug(post.slug);

      expect(result).toBeDefined();
      expect(result.slug).toBe(post.slug);
      expect(result.status).toBe(PostStatus.PUBLISHED);
    });

    it('should throw error if post not found', async () => {
      await expect(postsService.getBySlug('non-existent-slug')).rejects.toThrow(AppError);
    });

    it('should only return published posts', async () => {
      const { author } = await seedTestData();
      await createTestPost({
        title: 'Draft Post',
        slug: 'draft-post',
        authorId: author.id,
        status: PostStatus.DRAFT,
      });

      await expect(postsService.getBySlug('draft-post')).rejects.toThrow(AppError);
    });
  });

  describe('getById', () => {
    it('should get post by ID', async () => {
      const { post } = await seedTestData();

      const result = await postsService.getById(post.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(post.id);
    });

    it('should throw error if post not found', async () => {
      await expect(postsService.getById('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const { author } = await seedTestData();

      const data = {
        title: 'New Post',
        slug: 'new-post',
        content: 'This is a new post with enough content to calculate reading time.',
        status: PostStatus.DRAFT,
      };

      const post = await postsService.create(data, author.id);

      expect(post).toBeDefined();
      expect(post.title).toBe(data.title);
      expect(post.slug).toBe(data.slug);
      expect(post.readingTime).toBeGreaterThan(0);
    });

    it('should throw error if slug already exists', async () => {
      const { author, post } = await seedTestData();

      const data = {
        title: 'Duplicate Slug',
        slug: post.slug,
        content: 'Content',
      };

      await expect(postsService.create(data, author.id)).rejects.toThrow(AppError);
    });

    it('should connect categories, tags, and products', async () => {
      const { author, category, tag, product } = await seedTestData();

      const data = {
        title: 'Post with Relations',
        slug: 'post-with-relations',
        content: 'Content',
        categoryIds: [category.id],
        tagIds: [tag.id],
        productIds: [product.id],
      };

      const post = await postsService.create(data, author.id);

      expect(post.categories.length).toBe(1);
      expect(post.tags.length).toBe(1);
      expect(post.products.length).toBe(1);
    });

    it('should set publishedAt when status is PUBLISHED', async () => {
      const { author } = await seedTestData();

      const data = {
        title: 'Published Post',
        slug: 'published-post',
        content: 'Content',
        status: PostStatus.PUBLISHED,
      };

      const post = await postsService.create(data, author.id);

      expect(post.publishedAt).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update post', async () => {
      const { author, post } = await seedTestData();

      const updateData = {
        title: 'Updated Title',
        content: 'Updated content with enough words to calculate reading time.',
      };

      const updated = await postsService.update(post.id, updateData, author.id, 'AUTHOR');

      expect(updated.title).toBe(updateData.title);
      expect(updated.content).toBe(updateData.content);
    });

    it('should throw error if post not found', async () => {
      const { author } = await seedTestData();

      await expect(
        postsService.update('non-existent-id', { title: 'New Title' }, author.id, 'AUTHOR')
      ).rejects.toThrow(AppError);
    });

    it('should throw error if author tries to update another author\'s post', async () => {
      const { author, post } = await seedTestData();
      const otherAuthor = await createTestUser({
        email: 'other@test.com',
        name: 'Other Author',
      });

      await expect(
        postsService.update(post.id, { title: 'Hacked Title' }, otherAuthor.id, 'AUTHOR')
      ).rejects.toThrow(AppError);
    });

    it('should allow admin to update any post', async () => {
      const { admin, post } = await seedTestData();

      const updateData = {
        title: 'Admin Updated Title',
      };

      const updated = await postsService.update(post.id, updateData, admin.id, 'ADMIN');

      expect(updated.title).toBe(updateData.title);
    });

    it('should recalculate reading time when content changes', async () => {
      const { author, post } = await seedTestData();
      const originalReadingTime = post.readingTime;

      // Create content with exactly 600 words
      const words = Array(600).fill('word').join(' ');
      const updateData = {
        content: words, // 600 words = 3 minutes
      };

      const updated = await postsService.update(post.id, updateData, author.id, 'AUTHOR');

      expect(updated.readingTime).toBe(3); // 600 words / 200 wpm = 3 minutes
      expect(updated.readingTime).not.toBe(originalReadingTime);
    });
  });

  describe('delete', () => {
    it('should soft delete post', async () => {
      const { author, post } = await seedTestData();

      await postsService.delete(post.id, author.id, 'AUTHOR');

      const deletedPost = await global.prisma.post.findUnique({
        where: { id: post.id },
      });

      expect(deletedPost?.deletedAt).toBeDefined();
    });

    it('should throw error if post not found', async () => {
      const { author } = await seedTestData();

      await expect(postsService.delete('non-existent-id', author.id, 'AUTHOR')).rejects.toThrow(AppError);
    });

    it('should throw error if author tries to delete another author\'s post', async () => {
      const { post } = await seedTestData();
      const otherAuthor = await createTestUser({
        email: 'other@test.com',
        name: 'Other Author',
      });

      await expect(
        postsService.delete(post.id, otherAuthor.id, 'AUTHOR')
      ).rejects.toThrow(AppError);
    });
  });
});

