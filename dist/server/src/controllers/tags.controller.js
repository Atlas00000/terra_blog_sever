"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagsController = exports.TagsController = void 0;
const tags_service_1 = require("../services/tags.service");
class TagsController {
    /**
     * GET /api/v1/tags
     */
    async getAll(req, res, next) {
        try {
            const params = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                search: req.query.search,
            };
            const result = await tags_service_1.tagsService.getAll(params);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/tags/:slug
     */
    async getBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const tag = await tags_service_1.tagsService.getBySlug(slug);
            res.json({ data: tag });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/tags/id/:id
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const tag = await tags_service_1.tagsService.getById(id);
            res.json({ data: tag });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/tags
     */
    async create(req, res, next) {
        try {
            const tag = await tags_service_1.tagsService.create(req.body);
            res.status(201).json({
                data: tag,
                message: 'Tag created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/tags/:id
     */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const tag = await tags_service_1.tagsService.update(id, req.body);
            res.json({
                data: tag,
                message: 'Tag updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/tags/:id
     */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await tags_service_1.tagsService.delete(id);
            res.json({ message: 'Tag deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TagsController = TagsController;
exports.tagsController = new TagsController();
//# sourceMappingURL=tags.controller.js.map