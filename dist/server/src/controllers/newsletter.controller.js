"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterController = exports.NewsletterController = void 0;
const newsletter_service_1 = require("../services/newsletter.service");
class NewsletterController {
    /**
     * POST /api/v1/newsletter/subscribe
     */
    async subscribe(req, res, next) {
        try {
            const result = await newsletter_service_1.newsletterService.subscribe(req.body);
            res.status(201).json({
                ...result,
                message: result.message,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/newsletter/confirm
     */
    async confirm(req, res, next) {
        try {
            const { email } = req.body;
            const result = await newsletter_service_1.newsletterService.confirm(email);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /api/v1/newsletter/unsubscribe
     */
    async unsubscribe(req, res, next) {
        try {
            const { email } = req.body;
            const result = await newsletter_service_1.newsletterService.unsubscribe(email);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/newsletter/preferences
     */
    async updatePreferences(req, res, next) {
        try {
            const { email } = req.body;
            const result = await newsletter_service_1.newsletterService.updatePreferences(email, req.body);
            res.json({
                data: result,
                message: 'Preferences updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/newsletter (admin only)
     */
    async getAll(req, res, next) {
        try {
            const params = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                status: req.query.status,
                search: req.query.search,
            };
            const result = await newsletter_service_1.newsletterService.getAll(params);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/newsletter/:email
     */
    async getByEmail(req, res, next) {
        try {
            const { email } = req.params;
            const subscriber = await newsletter_service_1.newsletterService.getByEmail(email);
            res.json({ data: subscriber });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NewsletterController = NewsletterController;
exports.newsletterController = new NewsletterController();
//# sourceMappingURL=newsletter.controller.js.map