"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = exports.HealthController = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const cache_service_1 = require("../services/cache.service");
const env_1 = require("../config/env");
class HealthController {
    /**
     * Basic health check
     * GET /health
     */
    async basic(req, res) {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: env_1.env.APP_VERSION,
        });
    }
    /**
     * Liveness probe
     * GET /health/live
     */
    async live(req, res) {
        res.json({
            status: 'alive',
            timestamp: new Date().toISOString(),
        });
    }
    /**
     * Readiness probe
     * GET /health/ready
     */
    async ready(req, res) {
        const checks = {};
        // Database check
        try {
            await prisma_1.default.$queryRaw `SELECT 1`;
            checks.database = { status: 'healthy' };
        }
        catch (error) {
            checks.database = {
                status: 'unhealthy',
                message: error.message,
            };
        }
        // Redis check
        try {
            const redisAvailable = await cache_service_1.cacheService.isAvailable();
            checks.redis = {
                status: redisAvailable ? 'healthy' : 'unhealthy',
                message: redisAvailable ? undefined : 'Redis not available',
            };
        }
        catch (error) {
            checks.redis = {
                status: 'unhealthy',
                message: error.message,
            };
        }
        const allHealthy = Object.values(checks).every((check) => check.status === 'healthy');
        const statusCode = allHealthy ? 200 : 503;
        res.status(statusCode).json({
            status: allHealthy ? 'ready' : 'not ready',
            timestamp: new Date().toISOString(),
            checks,
        });
    }
    /**
     * Detailed health check
     * GET /health/detailed
     */
    async detailed(req, res) {
        const checks = {};
        // Database check
        try {
            const start = Date.now();
            await prisma_1.default.$queryRaw `SELECT 1`;
            const latency = Date.now() - start;
            // Get database stats
            const [userCount, postCount] = await Promise.all([
                prisma_1.default.user.count(),
                prisma_1.default.post.count({ where: { deletedAt: null } }),
            ]);
            checks.database = {
                status: 'healthy',
                latency: `${latency}ms`,
                stats: {
                    users: userCount,
                    posts: postCount,
                },
            };
        }
        catch (error) {
            checks.database = {
                status: 'unhealthy',
                error: error.message,
            };
        }
        // Redis check
        try {
            const start = Date.now();
            const redisAvailable = await cache_service_1.cacheService.isAvailable();
            const latency = Date.now() - start;
            checks.redis = {
                status: redisAvailable ? 'healthy' : 'unhealthy',
                latency: `${latency}ms`,
                available: redisAvailable,
            };
        }
        catch (error) {
            checks.redis = {
                status: 'unhealthy',
                error: error.message,
            };
        }
        // System info
        checks.system = {
            nodeVersion: process.version,
            platform: process.platform,
            uptime: `${Math.floor(process.uptime())}s`,
            memory: {
                used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
            },
        };
        const allHealthy = Object.values(checks)
            .filter((check) => check.status !== undefined)
            .every((check) => check.status === 'healthy');
        const statusCode = allHealthy ? 200 : 503;
        res.status(statusCode).json({
            status: allHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            version: env_1.env.APP_VERSION,
            environment: env_1.env.NODE_ENV,
            checks,
        });
    }
}
exports.HealthController = HealthController;
exports.healthController = new HealthController();
//# sourceMappingURL=health.controller.js.map