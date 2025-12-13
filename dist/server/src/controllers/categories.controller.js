"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesController = exports.CategoriesController = void 0;
const categories_service_1 = require("../services/categories.service");
class CategoriesController {
    /**
     * GET /api/v1/categories
     */
    async getAll(req, res, next) {
        try {
            const params = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                search: req.query.search,
            };
            const result = await categories_service_1.categoriesService.getAll(params);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/categories/:slug
     */
    async getBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const category = await categories_service_1.categoriesService.getBySlug(slug);
            res.json({ data: category });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/categories/id/:id
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const category = await categories_service_1.categoriesService.getById(id);
            res.json({ data: category });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/categories
     */
    async create(req, res, next) {
        try {
            const category = await categories_service_1.categoriesService.create(req.body);
            res.status(201).json({
                data: category,
                message: 'Category created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/categories/:id
     */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const category = await categories_service_1.categoriesService.update(id, req.body);
            res.json({
                data: category,
                message: 'Category updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/categories/:id
     */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await categories_service_1.categoriesService.delete(id);
            res.json({ message: 'Category deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoriesController = CategoriesController;
exports.categoriesController = new CategoriesController();
//# sourceMappingURL=categories.controller.js.map