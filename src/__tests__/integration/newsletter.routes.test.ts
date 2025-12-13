import express from 'express';
import request from 'supertest';
import { createTestApp, setupTestEnvironment } from '../helpers/app.helper';
import { seedTestData } from '../helpers/db.helper';
import { authService } from '../../services/auth.service';
import { Role } from '@prisma/client';
import { SubscriberStatus } from '@prisma/client';

describe('Newsletter Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await setupTestEnvironment();
  });

  describe('POST /api/v1/newsletter/subscribe', () => {
    it('should subscribe new email', async () => {
      const data = {
        email: 'newsubscriber@test.com',
        preferences: {
          weekly: true,
          productUpdates: true,
        },
      };

      const response = await request(app)
        .post('/api/v1/newsletter/subscribe')
        .send(data)
        .expect(201);

      expect(response.body.message).toBeDefined();
      expect(response.body.requiresConfirmation).toBe(true);
    });

    it('should return 409 if already subscribed', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'subscribed@test.com',
          status: SubscriberStatus.CONFIRMED,
        },
      });

      const data = {
        email: 'subscribed@test.com',
      };

      await request(app)
        .post('/api/v1/newsletter/subscribe')
        .send(data)
        .expect(409);
    });

    it('should return 400 for invalid email', async () => {
      const data = {
        email: 'invalid-email',
      };

      await request(app)
        .post('/api/v1/newsletter/subscribe')
        .send(data)
        .expect(400);
    });
  });

  describe('POST /api/v1/newsletter/confirm', () => {
    it('should confirm subscription', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'pending@test.com',
          status: SubscriberStatus.PENDING,
        },
      });

      const response = await request(app)
        .post('/api/v1/newsletter/confirm')
        .send({ email: 'pending@test.com' })
        .expect(200);

      expect(response.body.message).toContain('confirmed');

      const subscriber = await global.prisma.newsletterSubscriber.findUnique({
        where: { email: 'pending@test.com' },
      });
      expect(subscriber?.status).toBe(SubscriberStatus.CONFIRMED);
    });

    it('should return 404 for non-existent subscriber', async () => {
      await request(app)
        .post('/api/v1/newsletter/confirm')
        .send({ email: 'nonexistent@test.com' })
        .expect(404);
    });
  });

  describe('POST /api/v1/newsletter/unsubscribe', () => {
    it('should unsubscribe confirmed subscriber', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'subscribed@test.com',
          status: SubscriberStatus.CONFIRMED,
          confirmedAt: new Date(),
        },
      });

      const response = await request(app)
        .post('/api/v1/newsletter/unsubscribe')
        .send({ email: 'subscribed@test.com' })
        .expect(200);

      expect(response.body.message).toContain('unsubscribed');

      const subscriber = await global.prisma.newsletterSubscriber.findUnique({
        where: { email: 'subscribed@test.com' },
      });
      expect(subscriber?.status).toBe(SubscriberStatus.UNSUBSCRIBED);
    });
  });

  describe('PUT /api/v1/newsletter/preferences', () => {
    it('should update preferences', async () => {
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'subscriber@test.com',
          status: SubscriberStatus.CONFIRMED,
          preferences: { weekly: true },
        },
      });

      const updateData = {
        email: 'subscriber@test.com',
        preferences: {
          weekly: false,
          productUpdates: true,
          blogPosts: true,
        },
      };

      const response = await request(app)
        .put('/api/v1/newsletter/preferences')
        .send(updateData)
        .expect(200);

      expect(response.body.data.preferences).toEqual(updateData.preferences);
    });
  });

  describe('GET /api/v1/newsletter', () => {
    it('should return subscribers for admin', async () => {
      const { admin } = await seedTestData();
      await global.prisma.newsletterSubscriber.createMany({
        data: [
          { email: 'sub1@test.com', status: SubscriberStatus.CONFIRMED },
          { email: 'sub2@test.com', status: SubscriberStatus.PENDING },
        ],
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const response = await request(app)
        .get('/api/v1/newsletter')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .get('/api/v1/newsletter')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('GET /api/v1/newsletter/:email', () => {
    it('should return subscriber by email for admin', async () => {
      const { admin } = await seedTestData();
      await global.prisma.newsletterSubscriber.create({
        data: {
          email: 'subscriber@test.com',
          status: SubscriberStatus.CONFIRMED,
        },
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const response = await request(app)
        .get('/api/v1/newsletter/subscriber@test.com')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe('subscriber@test.com');
    });
  });
});

