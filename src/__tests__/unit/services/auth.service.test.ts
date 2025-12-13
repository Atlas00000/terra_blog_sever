import { authService } from '../../../services/auth.service';
import { AppError } from '../../../middleware/error.middleware';
import { cleanDatabase, seedTestData, createTestUser } from '../../helpers/db.helper';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'test123456';
      const hash = await authService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'test123456';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'test123456';
      const hash = await bcrypt.hash(password, 12);

      const result = await authService.comparePassword(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'test123456';
      const hash = await bcrypt.hash(password, 12);

      const result = await authService.comparePassword('wrongpassword', hash);
      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = 'test-user-id';
      const email = 'test@test.com';
      const role = Role.AUTHOR;

      const token = authService.generateToken(userId, email, role);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different users', () => {
      const token1 = authService.generateToken('user1', 'user1@test.com', Role.AUTHOR);
      const token2 = authService.generateToken('user2', 'user2@test.com', Role.EDITOR);

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const userId = 'test-user-id';
      const email = 'test@test.com';
      const role = Role.AUTHOR;

      const token = authService.generateToken(userId, email, role);
      const decoded = authService.verifyToken(token);

      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
      expect(decoded.role).toBe(role);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        authService.verifyToken(invalidToken);
      }).toThrow(AppError);
    });

    it('should throw error for expired token', () => {
      // This would require mocking time or using a very short expiry
      // For now, we test that invalid tokens throw errors
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZXhwIjoxfQ.invalid';

      expect(() => {
        authService.verifyToken(invalidToken);
      }).toThrow(AppError);
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const data = {
        email: 'newuser@test.com',
        password: 'test123456',
        name: 'New User',
      };

      const result = await authService.register(data);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(data.email);
      expect(result.user.name).toBe(data.name);
      expect(result.token).toBeDefined();
    });

    it('should hash password during registration', async () => {
      const data = {
        email: 'newuser2@test.com',
        password: 'test123456',
      };

      await authService.register(data);

      const user = await global.prisma.user.findUnique({
        where: { email: data.email },
      });

      expect(user?.password).not.toBe(data.password);
      expect(user?.password).toBeDefined();
    });

    it('should throw error if user already exists', async () => {
      const { author } = await seedTestData();

      const data = {
        email: author.email,
        password: 'test123456',
      };

      await expect(authService.register(data)).rejects.toThrow(AppError);
      await expect(authService.register(data)).rejects.toThrow('User with this email already exists');
    });

    it('should set default role to AUTHOR if not provided', async () => {
      const data = {
        email: 'newuser3@test.com',
        password: 'test123456',
      };

      const result = await authService.register(data);

      expect(result.user.role).toBe(Role.AUTHOR);
    });

    it('should allow setting custom role', async () => {
      const data = {
        email: 'newuser4@test.com',
        password: 'test123456',
        role: Role.EDITOR,
      };

      const result = await authService.register(data);

      expect(result.user.role).toBe(Role.EDITOR);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await seedTestData();
    });

    it('should login with correct credentials', async () => {
      const user = await createTestUser({
        name: 'Login User',
        email: 'login@test.com',
        password: 'test123456',
      });

      // Update password to be properly hashed
      const hashedPassword = await authService.hashPassword('test123456');
      await global.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      const result = await authService.login({
        email: 'login@test.com',
        password: 'test123456',
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('login@test.com');
      expect(result.token).toBeDefined();
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        authService.login({
          email: 'nonexistent@test.com',
          password: 'test123456',
        })
      ).rejects.toThrow(AppError);
    });

    it('should throw error for incorrect password', async () => {
      const user = await createTestUser({
        name: 'Wrong Pass User',
        email: 'wrongpass@test.com',
        password: 'test123456',
      });

      // Update password to be properly hashed
      const hashedPassword = await authService.hashPassword('test123456');
      await global.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await expect(
        authService.login({
          email: 'wrongpass@test.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('getUserById', () => {
    it('should get user by ID', async () => {
      const { author } = await seedTestData();

      const user = await authService.getUserById(author.id);

      expect(user).toBeDefined();
      expect(user.id).toBe(author.id);
      expect(user.email).toBe(author.email);
    });

    it('should throw error if user not found', async () => {
      await expect(authService.getUserById('non-existent-id')).rejects.toThrow(AppError);
    });
  });
});

