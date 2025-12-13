import { usersService } from '../../../services/users.service';
import { AppError } from '../../../middleware/error.middleware';
import { cleanDatabase, seedTestData, createTestUser } from '../../helpers/db.helper';
import { Role } from '@prisma/client';

describe('UsersService', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('getAll', () => {
    it('should return paginated users', async () => {
      await seedTestData();

      const result = await usersService.getAll(1, 10);

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should respect pagination limits', async () => {
      // Create multiple users
      for (let i = 0; i < 15; i++) {
        await createTestUser({
          email: `user${i}@test.com`,
          name: `User ${i}`,
        });
      }

      const result = await usersService.getAll(1, 10);

      expect(result.data.length).toBe(10);
      expect(result.pagination.total).toBe(15);
      expect(result.pagination.totalPages).toBe(2);
    });

    it('should return empty array when no users exist', async () => {
      const result = await usersService.getAll();

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('getById', () => {
    it('should get user by ID', async () => {
      const { author } = await seedTestData();

      const user = await usersService.getById(author.id);

      expect(user).toBeDefined();
      expect(user.id).toBe(author.id);
      expect(user.email).toBe(author.email);
    });

    it('should throw error if user not found', async () => {
      await expect(usersService.getById('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('getBySlug', () => {
    it('should get user by slug', async () => {
      const { author } = await seedTestData();

      const user = await usersService.getBySlug(author.slug!);

      expect(user).toBeDefined();
      expect(user.slug).toBe(author.slug);
      expect(user._count).toBeDefined();
      expect(user._count.posts).toBeDefined();
    });

    it('should throw error if user not found', async () => {
      await expect(usersService.getBySlug('non-existent-slug')).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const data = {
        email: 'newuser@test.com',
        password: 'test123456',
        name: 'New User',
        role: Role.AUTHOR,
      };

      const user = await usersService.create(data);

      expect(user).toBeDefined();
      expect(user.email).toBe(data.email);
      expect(user.name).toBe(data.name);
      expect(user.role).toBe(data.role);
    });

    it('should throw error if email already exists', async () => {
      const { author } = await seedTestData();

      const data = {
        email: author.email,
        password: 'test123456',
      };

      await expect(usersService.create(data)).rejects.toThrow(AppError);
    });

    it('should throw error if slug already exists', async () => {
      const { author } = await seedTestData();

      const data = {
        email: 'different@test.com',
        password: 'test123456',
        slug: author.slug!,
      };

      await expect(usersService.create(data)).rejects.toThrow(AppError);
    });

    it('should hash password during creation', async () => {
      const data = {
        email: 'hashed@test.com',
        password: 'test123456',
      };

      await usersService.create(data);

      const user = await global.prisma.user.findUnique({
        where: { email: data.email },
      });

      expect(user?.password).not.toBe(data.password);
      expect(user?.password.length).toBeGreaterThan(50);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const { author } = await seedTestData();

      const updateData = {
        name: 'Updated Name',
        bio: 'Updated bio',
      };

      const user = await usersService.update(author.id, updateData);

      expect(user.name).toBe(updateData.name);
      expect(user.bio).toBe(updateData.bio);
    });

    it('should throw error if user not found', async () => {
      await expect(
        usersService.update('non-existent-id', { name: 'New Name' })
      ).rejects.toThrow(AppError);
    });

    it('should throw error if slug is taken by another user', async () => {
      const { author, editor } = await seedTestData();

      await expect(
        usersService.update(author.id, { slug: editor.slug! })
      ).rejects.toThrow(AppError);
    });

    it('should allow updating to same slug', async () => {
      const { author } = await seedTestData();

      const user = await usersService.update(author.id, {
        slug: author.slug || undefined,
        name: 'Updated',
      });

      expect(user.slug).toBe(author.slug);
    });

    it('should hash password if provided', async () => {
      const { author } = await seedTestData();
      const newPassword = 'newpassword123';

      await usersService.update(author.id, { password: newPassword });

      const user = await global.prisma.user.findUnique({
        where: { id: author.id },
      });

      expect(user?.password).not.toBe(newPassword);
      expect(user?.password.length).toBeGreaterThan(50);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const { author } = await seedTestData();

      const result = await usersService.delete(author.id);

      expect(result.message).toBe('User deleted successfully');

      const user = await global.prisma.user.findUnique({
        where: { id: author.id },
      });

      expect(user).toBeNull();
    });

    it('should throw error if user not found', async () => {
      await expect(usersService.delete('non-existent-id')).rejects.toThrow(AppError);
    });
  });
});

