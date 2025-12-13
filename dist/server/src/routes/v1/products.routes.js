"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("../../controllers/products.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const product_schema_1 = require("../../../../shared/src/schemas/product.schema");
const router = (0, express_1.Router)();
// GET /api/v1/products (public)
router.get('/', (0, validation_middleware_1.validate)(product_schema_1.getProductsQuerySchema, 'query'), products_controller_1.productsController.getAll.bind(products_controller_1.productsController));
// GET /api/v1/products/:slug (public)
router.get('/:slug', products_controller_1.productsController.getBySlug.bind(products_controller_1.productsController));
// GET /api/v1/products/id/:id (protected, for admin)
router.get('/id/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), products_controller_1.productsController.getById.bind(products_controller_1.productsController));
// POST /api/v1/products (protected, admin/editor only)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(product_schema_1.createProductSchema, 'body'), products_controller_1.productsController.create.bind(products_controller_1.productsController));
// PUT /api/v1/products/:id (protected, admin/editor only)
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(product_schema_1.updateProductSchema, 'body'), products_controller_1.productsController.update.bind(products_controller_1.productsController));
// DELETE /api/v1/products/:id (protected, admin only)
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), products_controller_1.productsController.delete.bind(products_controller_1.productsController));
exports.default = router;
//# sourceMappingURL=products.routes.js.map