"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const press_controller_1 = require("../../controllers/press.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const press_schema_1 = require("../../../../shared/src/schemas/press.schema");
const router = (0, express_1.Router)();
// GET /api/v1/press (public)
router.get('/', (0, validation_middleware_1.validate)(press_schema_1.getPressReleasesQuerySchema, 'query'), press_controller_1.pressController.getAll.bind(press_controller_1.pressController));
// GET /api/v1/press/:slug (public)
router.get('/:slug', press_controller_1.pressController.getBySlug.bind(press_controller_1.pressController));
// GET /api/v1/press/id/:id (protected, for admin)
router.get('/id/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), press_controller_1.pressController.getById.bind(press_controller_1.pressController));
// POST /api/v1/press (protected, admin/editor only)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(press_schema_1.createPressReleaseSchema, 'body'), press_controller_1.pressController.create.bind(press_controller_1.pressController));
// PUT /api/v1/press/:id (protected, admin/editor only)
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(press_schema_1.updatePressReleaseSchema, 'body'), press_controller_1.pressController.update.bind(press_controller_1.pressController));
// DELETE /api/v1/press/:id (protected, admin only)
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), press_controller_1.pressController.delete.bind(press_controller_1.pressController));
exports.default = router;
//# sourceMappingURL=press.routes.js.map