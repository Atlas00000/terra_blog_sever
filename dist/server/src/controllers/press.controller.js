"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pressController = exports.PressController = void 0;
const press_service_1 = require("../services/press.service");
class PressController {
    /**
     * GET /api/v1/press
     */
    async getAll(req, res, next) {
        try {
            const params = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
                search: req.query.search,
            };
            const result = await press_service_1.pressReleasesService.getAll(params);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/press/:slug
     */
    async getBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const pressRelease = await press_service_1.pressReleasesService.getBySlug(slug);
            res.json({ data: pressRelease });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/press/id/:id
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const pressRelease = await press_service_1.pressReleasesService.getById(id);
            res.json({ data: pressRelease });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/press
     */
    async create(req, res, next) {
        try {
            const data = {
                ...req.body,
                publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
            };
            const pressRelease = await press_service_1.pressReleasesService.create(data);
            res.status(201).json({
                data: pressRelease,
                message: 'Press release created successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/press/:id
     */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const data = {
                ...req.body,
                ...(req.body.publishedAt && { publishedAt: new Date(req.body.publishedAt) }),
            };
            const pressRelease = await press_service_1.pressReleasesService.update(id, data);
            res.json({
                data: pressRelease,
                message: 'Press release updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/press/:id
     */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await press_service_1.pressReleasesService.delete(id);
            res.json({ message: 'Press release deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PressController = PressController;
exports.pressController = new PressController();
//# sourceMappingURL=press.controller.js.map