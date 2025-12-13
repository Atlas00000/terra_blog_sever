"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const posts_routes_1 = __importDefault(require("./posts.routes"));
const categories_routes_1 = __importDefault(require("./categories.routes"));
const tags_routes_1 = __importDefault(require("./tags.routes"));
const products_routes_1 = __importDefault(require("./products.routes"));
const media_routes_1 = __importDefault(require("./media.routes"));
const newsletter_routes_1 = __importDefault(require("./newsletter.routes"));
const comments_routes_1 = __importDefault(require("./comments.routes"));
const contact_routes_1 = __importDefault(require("./contact.routes"));
const press_routes_1 = __importDefault(require("./press.routes"));
const router = (0, express_1.Router)();
// API v1 routes
router.use('/auth', auth_routes_1.default);
router.use('/users', users_routes_1.default);
router.use('/posts', posts_routes_1.default);
router.use('/categories', categories_routes_1.default);
router.use('/tags', tags_routes_1.default);
router.use('/products', products_routes_1.default);
router.use('/media', media_routes_1.default);
router.use('/newsletter', newsletter_routes_1.default);
router.use('/comments', comments_routes_1.default);
router.use('/contact', contact_routes_1.default);
router.use('/press', press_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map