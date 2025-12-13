"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const posts_routes_1 = __importDefault(require("./posts.routes"));
const router = (0, express_1.Router)();
// API v1 routes
router.use('/auth', auth_routes_1.default);
router.use('/users', users_routes_1.default);
router.use('/posts', posts_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map