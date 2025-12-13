"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../../controllers/contact.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rate_limit_middleware_1 = require("../../middleware/rate-limit.middleware");
const contact_schema_1 = require("../../../../shared/src/schemas/contact.schema");
const router = (0, express_1.Router)();
// POST /api/v1/contact (public)
router.post('/', rate_limit_middleware_1.contactLimiter, (0, validation_middleware_1.validate)(contact_schema_1.submitContactSchema, 'body'), contact_controller_1.contactController.submit.bind(contact_controller_1.contactController));
// GET /api/v1/contact (protected, admin only)
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(contact_schema_1.getContactQuerySchema, 'query'), contact_controller_1.contactController.getAll.bind(contact_controller_1.contactController));
// GET /api/v1/contact/:id (protected, admin only)
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(contact_schema_1.getContactParamsSchema, 'params'), contact_controller_1.contactController.getById.bind(contact_controller_1.contactController));
// PUT /api/v1/contact/:id/status (protected, admin only)
router.put('/:id/status', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(contact_schema_1.getContactParamsSchema, 'params'), (0, validation_middleware_1.validate)(contact_schema_1.updateContactStatusSchema, 'body'), contact_controller_1.contactController.updateStatus.bind(contact_controller_1.contactController));
// DELETE /api/v1/contact/:id (protected, admin only)
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(contact_schema_1.getContactParamsSchema, 'params'), contact_controller_1.contactController.delete.bind(contact_controller_1.contactController));
exports.default = router;
//# sourceMappingURL=contact.routes.js.map