import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { swaggerSpec } from './config/swagger';
import { helmetConfig, corsConfig } from './config/security';
import { requestId } from './middleware/request-id.middleware';
import { sanitizeStrings } from './middleware/sanitize.middleware';
import { apiLimiter } from './middleware/rate-limit.middleware';
import routes from './routes';

const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware (must be first)
app.use(helmet(helmetConfig));
app.use(cors(corsConfig));

// Request ID middleware (for tracing)
app.use(requestId);

// Request logging middleware
import { requestLogger } from './middleware/request-logger.middleware';
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization (before routes)
app.use(sanitizeStrings);

// Rate limiting (apply to all API routes)
app.use('/api', apiLimiter);

// Health checks
import { healthController } from './controllers/health.controller';

app.get('/health', healthController.basic.bind(healthController));
app.get('/health/live', healthController.live.bind(healthController));
app.get('/health/ready', healthController.ready.bind(healthController));
app.get('/health/detailed', healthController.detailed.bind(healthController));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

