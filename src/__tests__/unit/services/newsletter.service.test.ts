import { newsletterService } from '../../../services/newsletter.service';
import { AppError } from '../../../middleware/error.middleware';
import { cleanDatabase, seedTestData } from '../../helpers/db.helper';
import { SubscriberStatus } from '@prisma/client';

describe('NewsletterService', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('subscribe', () => {
    it('should subscribe a new email', async () => {
      const data = {
        email: 'newsubscriber@test.com',
        preferences: {
          weekly: true,
          productUpdates: true,
        },
      };

      const result = await newsletterService.subscribe(data);

      expect(result.requiresConfirmation).toBe(true);
      expect(result.message).toContain('confirm');

      const subscriber = await global.prisma.newsletterSubscriber.findUnique({
        where: { email: data.email },
      });

      expect(subscriber).toBeDefined();
      expect(subscriber?.status).toBe(SubscriberStatus.PENDING);
    });

    it('should throw error if already confirmed', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'confirmed@test.com',
          status: SubscriberStatus.CONFIRMED,
        },
      });

      await expect(
        newsletterService.subscribe({ email: 'confirmed@test.com' })
      ).rejects.toThrow(AppError);
    });

    it('should resubscribe if previously unsubscribed', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'unsubscribed@test.com',
          status: SubscriberStatus.UNSUBSCRIBED,
          unsubscribedAt: new Date(),
        },
      });

      const result = await newsletterService.subscribe({
        email: 'unsubscribed@test.com',
      });

      expect(result.requiresConfirmation).toBe(true);

      const subscriber = await global.prisma.newsletterSubscriber.findUnique({
        where: { email: 'unsubscribed@test.com' },
      });

      expect(subscriber?.status).toBe(SubscriberStatus.PENDING);
      expect(subscriber?.unsubscribedAt).toBeNull();
    });

    it('should throw error if already pending', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'pending@test.com',
          status: SubscriberStatus.PENDING,
        },
      });

      await expect(
        newsletterService.subscribe({ email: 'pending@test.com' })
      ).rejects.toThrow(AppError);
    });
  });

  describe('confirm', () => {
    it('should confirm subscription', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'pending@test.com',
          status: SubscriberStatus.PENDING,
        },
      });

      const result = await newsletterService.confirm('pending@test.com');

      expect(result.message).toContain('confirmed');

      const subscriber = await global.prisma.newsletterSubscriber.findUnique({
        where: { email: 'pending@test.com' },
      });

      expect(subscriber?.status).toBe(SubscriberStatus.CONFIRMED);
      expect(subscriber?.confirmedAt).toBeDefined();
    });

    it('should return message if already confirmed', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'confirmed@test.com',
          status: SubscriberStatus.CONFIRMED,
          confirmedAt: new Date(),
        },
      });

      const result = await newsletterService.confirm('confirmed@test.com');

      expect(result.message).toContain('already confirmed');
    });

    it('should throw error if subscriber not found', async () => {
      await expect(
        newsletterService.confirm('nonexistent@test.com')
      ).rejects.toThrow(AppError);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe confirmed subscriber', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'subscribed@test.com',
          status: SubscriberStatus.CONFIRMED,
          confirmedAt: new Date(),
        },
      });

      const result = await newsletterService.unsubscribe('subscribed@test.com');

      expect(result.message).toContain('unsubscribed');

      const subscriber = await global.prisma.newsletterSubscriber.findUnique({
        where: { email: 'subscribed@test.com' },
      });

      expect(subscriber?.status).toBe(SubscriberStatus.UNSUBSCRIBED);
      expect(subscriber?.unsubscribedAt).toBeDefined();
    });

    it('should throw error if subscriber not found', async () => {
      await expect(
        newsletterService.unsubscribe('nonexistent@test.com')
      ).rejects.toThrow(AppError);
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'subscriber@test.com',
          status: SubscriberStatus.CONFIRMED,
          preferences: { weekly: true },
        },
      });

      const newPreferences = {
        preferences: {
          weekly: false,
          productUpdates: true,
          blogPosts: true,
        },
      };

      const result = await newsletterService.updatePreferences(
        'subscriber@test.com',
        newPreferences
      );

      expect(result.preferences).toEqual(newPreferences.preferences);
    });

    it('should throw error if subscriber not found', async () => {
      await expect(
        newsletterService.updatePreferences('nonexistent@test.com', { preferences: { weekly: true } })
      ).rejects.toThrow(AppError);
    });
  });

  describe('getAll', () => {
    it('should return paginated subscribers', async () => {
      await global.prisma.newsletterSubscriber.createMany({
        data: [
          { email: 'sub1@test.com', status: SubscriberStatus.CONFIRMED },
          { email: 'sub2@test.com', status: SubscriberStatus.CONFIRMED },
          { email: 'sub3@test.com', status: SubscriberStatus.PENDING },
        ],
      });

      const result = await newsletterService.getAll({ page: 1, limit: 10 });

      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(3);
      expect(result.pagination.total).toBe(3);
    });

    it('should filter by status', async () => {
      await global.prisma.newsletterSubscriber.createMany({
        data: [
          { email: 'sub1@test.com', status: SubscriberStatus.CONFIRMED },
          { email: 'sub2@test.com', status: SubscriberStatus.PENDING },
        ],
      });

      const result = await newsletterService.getAll({
        status: SubscriberStatus.CONFIRMED,
      });

      expect(result.data.every((s) => s.status === SubscriberStatus.CONFIRMED)).toBe(true);
    });

    it('should search subscribers', async () => {
      await global.prisma.newsletterSubscriber.createMany({
        data: [
          { email: 'john@test.com', status: SubscriberStatus.CONFIRMED },
          { email: 'jane@test.com', status: SubscriberStatus.CONFIRMED },
        ],
      });

      const result = await newsletterService.getAll({ search: 'john' });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.some((s) => s.email.includes('john'))).toBe(true);
    });
  });

  describe('getByEmail', () => {
    it('should get subscriber by email', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'subscriber@test.com',
          status: SubscriberStatus.CONFIRMED,
        },
      });

      const result = await newsletterService.getByEmail('subscriber@test.com');

      expect(result).toBeDefined();
      expect(result.email).toBe('subscriber@test.com');
    });

    it('should throw error if subscriber not found', async () => {
      await expect(
        newsletterService.getByEmail('nonexistent@test.com')
      ).rejects.toThrow(AppError);
    });
  });
});

