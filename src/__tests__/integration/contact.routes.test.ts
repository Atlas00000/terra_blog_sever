import express from 'express';
import request from 'supertest';
import { createTestApp, setupTestEnvironment } from '../helpers/app.helper';
import { seedTestData } from '../helpers/db.helper';
import { authService } from '../../services/auth.service';
import { ContactStatus, Role } from '@prisma/client';

describe('Contact Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    await setupTestEnvironment();
  });

  describe('POST /api/v1/contact', () => {
    it('should submit contact form (public)', async () => {
      const data = {
        name: 'John Doe',
        email: 'john@test.com',
        subject: 'Test Subject',
        message: 'This is a test message',
      };

      const response = await request(app)
        .post('/api/v1/contact')
        .send(data)
        .expect(201);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(data.name);
      expect(response.body.data.email).toBe(data.email);
      expect(response.body.data.status).toBe(ContactStatus.PENDING);
    });

    it('should return 400 for invalid data', async () => {
      const data = {
        name: '', // Invalid: empty name
        email: 'invalid-email',
        subject: 'Subject',
        message: 'Message',
      };

      await request(app)
        .post('/api/v1/contact')
        .send(data)
        .expect(400);
    });
  });

  describe('GET /api/v1/contact', () => {
    it('should return submissions for admin', async () => {
      const { admin } = await seedTestData();
      await global.prisma.contactSubmission.createMany({
        data: [
          {
            name: 'User 1',
            email: 'user1@test.com',
            subject: 'Subject 1',
            message: 'Message 1',
            status: ContactStatus.PENDING,
          },
          {
            name: 'User 2',
            email: 'user2@test.com',
            subject: 'Subject 2',
            message: 'Message 2',
            status: ContactStatus.RESPONDED,
          },
        ],
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const response = await request(app)
        .get('/api/v1/contact')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter by status', async () => {
      const { admin } = await seedTestData();
      await global.prisma.contactSubmission.createMany({
        data: [
          {
            name: 'User 1',
            email: 'user1@test.com',
            subject: 'Subject 1',
            message: 'Message 1',
            status: ContactStatus.PENDING,
          },
          {
            name: 'User 2',
            email: 'user2@test.com',
            subject: 'Subject 2',
            message: 'Message 2',
            status: ContactStatus.RESPONDED,
          },
        ],
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const response = await request(app)
        .get('/api/v1/contact?status=PENDING')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.every((s: any) => s.status === ContactStatus.PENDING)).toBe(true);
    });

    it('should return 403 for non-admin/editor', async () => {
      const { author } = await seedTestData();
      const token = authService.generateToken(author.id, author.email, author.role as Role);

      await request(app)
        .get('/api/v1/contact')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('PUT /api/v1/contact/:id/status', () => {
    it('should update submission status for admin', async () => {
      const { admin } = await seedTestData();
      const submission = await global.prisma.contactSubmission.create({
        data: {
          name: 'John Doe',
          email: 'john@test.com',
          subject: 'Subject',
          message: 'Message',
          status: ContactStatus.PENDING,
        },
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      const response = await request(app)
        .put(`/api/v1/contact/${submission.id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: ContactStatus.RESPONDED })
        .expect(200);

      expect(response.body.data.status).toBe(ContactStatus.RESPONDED);
    });
  });

  describe('DELETE /api/v1/contact/:id', () => {
    it('should delete submission for admin', async () => {
      const { admin } = await seedTestData();
      const submission = await global.prisma.contactSubmission.create({
        data: {
          name: 'John Doe',
          email: 'john@test.com',
          subject: 'Subject',
          message: 'Message',
          status: ContactStatus.PENDING,
        },
      });

      const token = authService.generateToken(admin.id, admin.email, admin.role as Role);

      await request(app)
        .delete(`/api/v1/contact/${submission.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const deleted = await global.prisma.contactSubmission.findUnique({
        where: { id: submission.id },
      });
      expect(deleted).toBeNull();
    });
  });
});

