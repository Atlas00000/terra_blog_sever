"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const redis_1 = require("redis");
const env_1 = require("../config/env");
const redisClient = (0, redis_1.createClient)({
    url: env_1.env.REDIS_URL,
});
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});
redisClient.on('connect', () => {
    console.log('✅ Redis connected');
});
// Connect to Redis
if (!redisClient.isOpen) {
    redisClient.connect().catch(console.error);
}
exports.redis = redisClient;
//# sourceMappingURL=redis.js.map