"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    // Server
    PORT: zod_1.z.string().default('3001'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    APP_VERSION: zod_1.z.string().default('1.0.0'),
    // Database
    DATABASE_URL: zod_1.z.string().url(),
    // Redis
    REDIS_URL: zod_1.z.string().url(),
    // JWT
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    // Cloudflare
    CLOUDFLARE_ACCOUNT_ID: zod_1.z.string().optional().or(zod_1.z.literal('')),
    CLOUDFLARE_ACCESS_KEY_ID: zod_1.z.string().optional().or(zod_1.z.literal('')),
    CLOUDFLARE_SECRET_ACCESS_KEY: zod_1.z.string().optional().or(zod_1.z.literal('')),
    CLOUDFLARE_R2_BUCKET_NAME: zod_1.z.string().optional().or(zod_1.z.literal('')),
    CLOUDFLARE_R2_PUBLIC_URL: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    // Client
    CLIENT_URL: zod_1.z.string().url().default('http://localhost:3000'),
    // Email (optional)
    SENDGRID_API_KEY: zod_1.z.string().optional().or(zod_1.z.literal('')),
    SENDGRID_FROM_EMAIL: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsedEnv.data;
//# sourceMappingURL=env.js.map