"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.redisClient = void 0;
const redis_1 = require("redis");
const env_1 = require("../config/env");
exports.redisClient = (0, redis_1.createClient)({
    url: env_1.env.REDIS_URL,
});
exports.redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});
exports.redisClient.on('connect', () => {
    console.log('✅ Redis connected');
});
// Connect to Redis
if (!exports.redisClient.isOpen) {
    exports.redisClient.connect().catch(console.error);
}
exports.redis = exports.redisClient;
//# sourceMappingURL=redis.js.map