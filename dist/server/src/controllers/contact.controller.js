"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = exports.ContactController = void 0;
const contact_service_1 = require("../services/contact.service");
class ContactController {
    /**
     * POST /api/v1/contact
     */
    async submit(req, res, next) {
        try {
            const submission = await contact_service_1.contactService.submit(req.body);
            res.status(201).json({
                data: submission,
                message: 'Thank you for your message. We will get back to you soon.',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/contact (admin only)
     */
    async getAll(req, res, next) {
        try {
            const params = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                status: req.query.status,
                search: req.query.search,
            };
            const result = await contact_service_1.contactService.getAll(params);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/v1/contact/:id (admin only)
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const submission = await contact_service_1.contactService.getById(id);
            res.json({ data: submission });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * PUT /api/v1/contact/:id/status (admin only)
     */
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const submission = await contact_service_1.contactService.updateStatus(id, status);
            res.json({
                data: submission,
                message: 'Status updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * DELETE /api/v1/contact/:id (admin only)
     */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await contact_service_1.contactService.delete(id);
            res.json({ message: 'Contact submission deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ContactController = ContactController;
exports.contactController = new ContactController();
//# sourceMappingURL=contact.controller.js.map