import { Router } from 'express';
import { newsletterController } from '../../controllers/newsletter.controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { newsletterLimiter } from '../../middleware/rate-limit.middleware';
import {
  subscribeNewsletterSchema,
  updatePreferencesSchema,
  unsubscribeSchema,
  getNewsletterQuerySchema,
} from '../../../../shared/src/schemas/newsletter.schema';
import { z } from 'zod';

const router = Router();

// POST /api/v1/newsletter/subscribe (public)
router.post(
  '/subscribe',
  newsletterLimiter,
  validate(subscribeNewsletterSchema, 'body'),
  newsletterController.subscribe.bind(newsletterController)
);

// POST /api/v1/newsletter/confirm (public)
router.post(
  '/confirm',
  validate(unsubscribeSchema.pick({ email: true }), 'body'),
  newsletterController.confirm.bind(newsletterController)
);

// POST /api/v1/newsletter/unsubscribe (public)
router.post(
  '/unsubscribe',
  validate(unsubscribeSchema.pick({ email: true }), 'body'),
  newsletterController.unsubscribe.bind(newsletterController)
);

// PUT /api/v1/newsletter/preferences (public, requires email in body)
router.put(
  '/preferences',
  validate(updatePreferencesSchema.extend({ email: z.string().email() }), 'body'),
  newsletterController.updatePreferences.bind(newsletterController)
);

// GET /api/v1/newsletter (protected, admin only)
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(getNewsletterQuerySchema, 'query'),
  newsletterController.getAll.bind(newsletterController)
);

// GET /api/v1/newsletter/:email (protected, admin only)
router.get(
  '/:email',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  newsletterController.getByEmail.bind(newsletterController)
);

export default router;

