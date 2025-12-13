"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../../controllers/users.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const user_schema_1 = require("../../../../shared/src/schemas/user.schema");
const router = (0, express_1.Router)();
// GET /api/v1/users (protected, admin only)
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), users_controller_1.usersController.getAll.bind(users_controller_1.usersController));
// GET /api/v1/users/:id (protected)
router.get('/:id', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(user_schema_1.getUserParamsSchema, 'params'), users_controller_1.usersController.getById.bind(users_controller_1.usersController));
// GET /api/v1/users/slug/:slug (public for author pages)
router.get('/slug/:slug', users_controller_1.usersController.getBySlug.bind(users_controller_1.usersController));
// POST /api/v1/users (protected, admin only)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), (0, validation_middleware_1.validate)(user_schema_1.createUserSchema, 'body'), users_controller_1.usersController.create.bind(users_controller_1.usersController));
// PUT /api/v1/users/:id (protected, admin or self)
router.put('/:id', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(user_schema_1.getUserParamsSchema, 'params'), (0, validation_middleware_1.validate)(user_schema_1.updateUserSchema, 'body'), users_controller_1.usersController.update.bind(users_controller_1.usersController));
// DELETE /api/v1/users/:id (protected, admin only)
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), (0, validation_middleware_1.validate)(user_schema_1.getUserParamsSchema, 'params'), users_controller_1.usersController.delete.bind(users_controller_1.usersController));
exports.default = router;
//# sourceMappingURL=users.routes.js.map