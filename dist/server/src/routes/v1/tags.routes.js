"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tags_controller_1 = require("../../controllers/tags.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const tag_schema_1 = require("../../../../shared/src/schemas/tag.schema");
const router = (0, express_1.Router)();
// GET /api/v1/tags (public)
router.get('/', (0, validation_middleware_1.validate)(tag_schema_1.getTagsQuerySchema, 'query'), tags_controller_1.tagsController.getAll.bind(tags_controller_1.tagsController));
// GET /api/v1/tags/:slug (public)
router.get('/:slug', tags_controller_1.tagsController.getBySlug.bind(tags_controller_1.tagsController));
// GET /api/v1/tags/id/:id (protected, for admin)
router.get('/id/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), tags_controller_1.tagsController.getById.bind(tags_controller_1.tagsController));
// POST /api/v1/tags (protected, admin/editor only)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(tag_schema_1.createTagSchema, 'body'), tags_controller_1.tagsController.create.bind(tags_controller_1.tagsController));
// PUT /api/v1/tags/:id (protected, admin/editor only)
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), (0, validation_middleware_1.validate)(tag_schema_1.updateTagSchema, 'body'), tags_controller_1.tagsController.update.bind(tags_controller_1.tagsController));
// DELETE /api/v1/tags/:id (protected, admin only)
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), tags_controller_1.tagsController.delete.bind(tags_controller_1.tagsController));
exports.default = router;
//# sourceMappingURL=tags.routes.js.map