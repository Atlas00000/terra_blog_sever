"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("../../controllers/newsletter.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rate_limit_middleware_1 = require("../../middleware/rate-limit.middleware");
const newsletter_schema_1 = require("../../../../shared/src/schemas/newsletter.schema");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// POST /api/v1/newsletter/subscribe (public)
router.post('/subscribe', rate_limit_middleware_1.newsletterLimiter, (0, validation_middleware_1.validate)(newsletter_schema_1.subscribeNewsletterSchema, 'body'), newsletter_controller_1.newsletterController.subscribe.bind(newsletter_controller_1.newsletterController));
// POST /api/v1/newsletter/confirm (public)
router.post('/confirm', (0, validation_middleware_1.validate)(newsletter_schema_1.unsubscribeSchema.pick({ email: true }), 'body'), newsletter_controller_1.newsletterController.confirm.bind(newsletter_controller_1.newsletterController));
// POST /api/v1/newsletter/unsubscribe (public)
router.post('/unsubscribe', (0, validation_middleware_1.validate)(newsletter_schema_1.unsubscribeSchema.pick({ email: true }), 'body'), newsletter_controller_1.newsletterController.unsubscribe.bind(newsletter_controller_1.newsletterController));
// PUT /api/v1/newsletter/preferences (public, requires email in body)
router.put('/preferences', (0, validation_middleware_1.validate)(newsletter_schema_1.updatePreferencesSchema.extend({ email: zod_1.z.string().email() }), 'body'), newsletter_controller_1.newsletterController.updatePreferences.bind(newsletter_controller_1.newsletterController));
// GET /api/v1/newsletter (protected, admin only)
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(newsletter_schema_1.getNewsletterQuerySchema, 'query'), newsletter_controller_1.newsletterController.getAll.bind(newsletter_controller_1.newsletterController));
// GET /api/v1/newsletter/:email (protected, admin only)
router.get('/:email', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), newsletter_controller_1.newsletterController.getByEmail.bind(newsletter_controller_1.newsletterController));
exports.default = router;
//# sourceMappingURL=newsletter.routes.js.map