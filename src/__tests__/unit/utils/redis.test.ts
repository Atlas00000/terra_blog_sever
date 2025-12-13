import { redisClient } from '../../../utils/redis';

describe('Redis', () => {
  it('should have redis client instance', () => {
    expect(redisClient).toBeDefined();
  });

  // Note: Actual Redis connection tests would require a running Redis instance
  // These tests verify the module exports correctly
  it('should export redis client', () => {
    expect(redisClient).toBeDefined();
  });
});

