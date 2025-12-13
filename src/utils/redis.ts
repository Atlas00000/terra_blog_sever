import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import { env } from '../config/env';

export const redisClient = createClient({
  url: env.REDIS_URL,
}) as RedisClientType;

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('✅ Redis connected');
  }
});

// Connect to Redis
if (!redisClient.isOpen) {
  redisClient.connect().catch(console.error);
}

export const redis: RedisClientType = redisClient;

