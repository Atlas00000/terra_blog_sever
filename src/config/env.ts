import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_VERSION: z.string().default('1.0.0'),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Cloudflare
  CLOUDFLARE_ACCOUNT_ID: z.string().optional().or(z.literal('')),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().optional().or(z.literal('')),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().optional().or(z.literal('')),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().optional().or(z.literal('')),
  CLOUDFLARE_R2_PUBLIC_URL: z.string().url().optional().or(z.literal('')),
  CLOUDFLARE_R2_ENDPOINT: z.string().url().optional().or(z.literal('')),
  CLOUDFLARE_IMAGES_API_TOKEN: z.string().optional().or(z.literal('')),

  // Client
  CLIENT_URL: z.string().url().default('http://localhost:3000'),

  // Email (optional)
  SENDGRID_API_KEY: z.string().optional().or(z.literal('')),
  SENDGRID_FROM_EMAIL: z.string().email().optional().or(z.literal('')),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;

