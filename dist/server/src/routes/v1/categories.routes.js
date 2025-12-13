"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_controller_1 = require("../../controllers/categories.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const category_schema_1 = require("../../../../shared/src/schemas/category.schema");
const router = (0, express_1.Router)();
// GET /api/v1/categories (public)
router.get('/', (0, validation_middleware_1.validate)(category_schema_1.getCategoriesQuerySchema, 'query'), categories_controller_1.categoriesController.getAll.bind(categories_controller_1.categoriesController));
// GET /api/v1/categories/:slug (public)
router.get('/:slug', categories_controller_1.categoriesController.getBySlug.bind(categories_controller_1.categoriesController));
// GET /api/v1/categories/id/:id (protected, for admin)
router.get('/id/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), categories_controller_1.categoriesController.getById.bind(categories_controller_1.categoriesController));
// POST /api/v1/categories (protected, admin/editor only)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(category_schema_1.createCategorySchema, 'body'), categories_controller_1.categoriesController.create.bind(categories_controller_1.categoriesController));
// PUT /api/v1/categories/:id (protected, admin/editor only)
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(category_schema_1.updateCategorySchema, 'body'), categories_controller_1.categoriesController.update.bind(categories_controller_1.categoriesController));
// DELETE /api/v1/categories/:id (protected, admin only)
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), categories_controller_1.categoriesController.delete.bind(categories_controller_1.categoriesController));
exports.default = router;
//# sourceMappingURL=categories.routes.js.map