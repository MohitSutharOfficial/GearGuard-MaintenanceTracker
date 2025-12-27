import { Router } from 'express';
import * as requestController from '../controllers/request.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createRequestSchema, updateRequestSchema } from '../validators/request.validator';

const router = Router();

router.use(authenticate);

router.get('/', requestController.getAll);
router.get('/overdue', requestController.getOverdue);
router.get('/:id', requestController.getById);
router.post('/', authorize('ADMIN', 'MANAGER', 'TECHNICIAN'), validate(createRequestSchema), requestController.create);
router.patch('/:id', validate(updateRequestSchema), requestController.update);
router.patch('/:id/stage', requestController.updateStage);
router.delete('/:id', authorize('ADMIN', 'MANAGER'), requestController.remove);

export default router;
