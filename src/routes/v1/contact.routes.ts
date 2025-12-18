import { Router } from 'express';
import { contactController } from '../../controllers/contact.controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { contactLimiter } from '../../middleware/rate-limit.middleware';
import {
  submitContactSchema,
  getContactQuerySchema,
  getContactParamsSchema,
  updateContactStatusSchema,
} from '../../../shared/src/schemas/contact.schema';

const router = Router();

// POST /api/v1/contact (public)
router.post(
  '/',
  contactLimiter,
  validate(submitContactSchema, 'body'),
  contactController.submit.bind(contactController)
);

// GET /api/v1/contact (protected, admin only)
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(getContactQuerySchema, 'query'),
  contactController.getAll.bind(contactController)
);

// GET /api/v1/contact/:id (protected, admin only)
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(getContactParamsSchema, 'params'),
  contactController.getById.bind(contactController)
);

// PUT /api/v1/contact/:id/status (protected, admin only)
router.put(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(getContactParamsSchema, 'params'),
  validate(updateContactStatusSchema, 'body'),
  contactController.updateStatus.bind(contactController)
);

// DELETE /api/v1/contact/:id (protected, admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(getContactParamsSchema, 'params'),
  contactController.delete.bind(contactController)
);

export default router;

