"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middleware/error.middleware");
const swagger_1 = require("./config/swagger");
const security_1 = require("./config/security");
const request_id_middleware_1 = require("./middleware/request-id.middleware");
const sanitize_middleware_1 = require("./middleware/sanitize.middleware");
const rate_limit_middleware_1 = require("./middleware/rate-limit.middleware");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);
// Security middleware (must be first)
app.use((0, helmet_1.default)(security_1.helmetConfig));
app.use((0, cors_1.default)(security_1.corsConfig));
// Request ID middleware (for tracing)
app.use(request_id_middleware_1.requestId);
// Request logging middleware
const request_logger_middleware_1 = require("./middleware/request-logger.middleware");
app.use(request_logger_middleware_1.requestLogger);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Input sanitization (before routes)
app.use(sanitize_middleware_1.sanitizeStrings);
// Rate limiting (apply to all API routes)
app.use('/api', rate_limit_middleware_1.apiLimiter);
// Health checks
const health_controller_1 = require("./controllers/health.controller");
app.get('/health', health_controller_1.healthController.basic.bind(health_controller_1.healthController));
app.get('/health/live', health_controller_1.healthController.live.bind(health_controller_1.healthController));
app.get('/health/ready', health_controller_1.healthController.ready.bind(health_controller_1.healthController));
app.get('/health/detailed', health_controller_1.healthController.detailed.bind(health_controller_1.healthController));
// API Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
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