"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middleware/error.middleware");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.CLIENT_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: env_1.env.APP_VERSION,
    });
});
// API Routes
app.use('/api', routes_1.default);
// Error handling middleware (must be last)
app.use(error_middleware_1.errorHandler);
const PORT = env_1.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${env_1.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
//# sourceMappingURL=server.js.map