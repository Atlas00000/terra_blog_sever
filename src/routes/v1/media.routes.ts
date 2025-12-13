import { Router } from 'express';
import { mediaController } from '../../controllers/media.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { upload, uploadMultiple } from '../../middleware/upload.middleware';

const router = Router();

// GET /api/v1/media (protected, admin/editor only)
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  mediaController.getAll.bind(mediaController)
);

// GET /api/v1/media/:id (protected, admin/editor only)
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  mediaController.getById.bind(mediaController)
);

// POST /api/v1/media/upload (protected)
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  mediaController.upload.bind(mediaController)
);

// POST /api/v1/media/upload-multiple (protected)
router.post(
  '/upload-multiple',
  authenticate,
  uploadMultiple.array('files', 10),
  mediaController.uploadMultiple.bind(mediaController)
);

// DELETE /api/v1/media/:id (protected)
router.delete(
  '/:id',
  authenticate,
  mediaController.delete.bind(mediaController)
);

export default router;

