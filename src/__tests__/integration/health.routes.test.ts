import express from 'express';
import request from 'supertest';
import { createTestApp } from '../helpers/app.helper';

describe('Health Check Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /health', () => {
    it('should return basic health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.status).toBe('healthy');
    });
  });

  describe('GET /health/live', () => {
    it('should return liveness status', async () => {
      const response = await request(app)
        .get('/health/live')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.status).toBe('alive');
    });
  });

  describe('GET /health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(app)
        .get('/health/ready')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.status).toBeDefined();
    });
  });
});

