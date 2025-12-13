import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import postsRoutes from './posts.routes';
import categoriesRoutes from './categories.routes';
import tagsRoutes from './tags.routes';
import productsRoutes from './products.routes';
import mediaRoutes from './media.routes';
import newsletterRoutes from './newsletter.routes';
import commentsRoutes from './comments.routes';
import contactRoutes from './contact.routes';
import pressRoutes from './press.routes';

const router = Router();

// API v1 routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/tags', tagsRoutes);
router.use('/products', productsRoutes);
router.use('/media', mediaRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/comments', commentsRoutes);
router.use('/contact', contactRoutes);
router.use('/press', pressRoutes);

export default router;

