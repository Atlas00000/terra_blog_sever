"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = exports.ProductsController = void 0;
const products_service_1 = require("../services/products.service");
class ProductsController {
    /**
     * GET /api/v1/products
     */
    async getAll(req, res, next) {
        try {
            const params = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                search: req.query.search,
            };
            const result = await products_service_1.productsService.getAll(params);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/products/:slug
     */
    async getBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const product = await products_service_1.productsService.getBySlug(slug);
            res.json({ data: product });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/products/id/:id
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await products_service_1.productsService.getById(id);
            res.json({ data: product });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/products
     */
    async create(req, res, next) {
        try {
            const product = await products_service_1.productsService.create(req.body);
            res.status(201).json({
                data: product,
                message: 'Product created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/products/:id
     */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const product = await products_service_1.productsService.update(id, req.body);
            res.json({
                data: product,
                message: 'Product updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/products/:id
     */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await products_service_1.productsService.delete(id);
            res.json({ message: 'Product deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductsController = ProductsController;
exports.productsController = new ProductsController();
//# sourceMappingURL=products.controller.js.map