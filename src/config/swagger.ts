import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Terra Industries Blog API',
      version: env.APP_VERSION,
      description: 'RESTful API for Terra Industries Blog - A comprehensive blog platform for defense technology content',
      contact: {
        name: 'Terra Industries',
        email: 'info@terraindustries.co',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
      {
        url: 'https://api.terraindustries.co',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Posts', description: 'Blog post endpoints' },
      { name: 'Categories', description: 'Category management endpoints' },
      { name: 'Tags', description: 'Tag management endpoints' },
      { name: 'Products', description: 'Product showcase endpoints' },
      { name: 'Media', description: 'Media upload and management endpoints' },
      { name: 'Newsletter', description: 'Newsletter subscription endpoints' },
      { name: 'Comments', description: 'Comment management endpoints' },
      { name: 'Contact', description: 'Contact form endpoints' },
      { name: 'Press', description: 'Press release endpoints' },
      { name: 'Health', description: 'Health check endpoints' },
    ],
  },
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

