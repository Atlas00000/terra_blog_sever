"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const user_schema_1 = require("../../../../shared/src/schemas/user.schema");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rate_limit_middleware_1 = require("../../middleware/rate-limit.middleware");
const router = (0, express_1.Router)();
// POST /api/v1/auth/register
router.post('/register', rate_limit_middleware_1.authLimiter, (0, validation_middleware_1.validate)(user_schema_1.createUserSchema, 'body'), auth_controller_1.authController.register.bind(auth_controller_1.authController));
// POST /api/v1/auth/login
router.post('/login', rate_limit_middleware_1.authLimiter, (0, validation_middleware_1.validate)(user_schema_1.loginSchema, 'body'), auth_controller_1.authController.login.bind(auth_controller_1.authController));
// GET /api/v1/auth/me (protected)
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.authController.getMe.bind(auth_controller_1.authController));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map