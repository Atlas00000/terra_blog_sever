"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_controller_1 = require("../../controllers/media.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const upload_middleware_1 = require("../../middleware/upload.middleware");
const router = (0, express_1.Router)();
// GET /api/v1/media (protected, admin/editor only)
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), media_controller_1.mediaController.getAll.bind(media_controller_1.mediaController));
// GET /api/v1/media/:id (protected, admin/editor only)
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN', 'EDITOR'), media_controller_1.mediaController.getById.bind(media_controller_1.mediaController));
// POST /api/v1/media/upload (protected)
router.post('/upload', auth_middleware_1.authenticate, upload_middleware_1.upload.single('file'), media_controller_1.mediaController.upload.bind(media_controller_1.mediaController));
// POST /api/v1/media/upload-multiple (protected)
router.post('/upload-multiple', auth_middleware_1.authenticate, upload_middleware_1.uploadMultiple.array('files', 10), media_controller_1.mediaController.uploadMultiple.bind(media_controller_1.mediaController));
// DELETE /api/v1/media/:id (protected)
router.delete('/:id', auth_middleware_1.authenticate, media_controller_1.mediaController.delete.bind(media_controller_1.mediaController));
exports.default = router;
//# sourceMappingURL=media.routes.js.map