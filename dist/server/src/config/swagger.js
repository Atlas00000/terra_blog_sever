"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("./env");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Terra Industries Blog API',
            version: env_1.env.APP_VERSION,
            description: 'RESTful API for Terra Industries Blog - A comprehensive blog platform for defense technology content',
            contact: {
                name: 'Terra Industries',
                email: 'info@terraindustries.co',
            },
        },
        servers: [
            {
                url: `http://localhost:${env_1.env.PORT}`,
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
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map