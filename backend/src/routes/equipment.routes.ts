import { Router } from 'express';
import * as equipmentController from '../controllers/equipment.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createEquipmentSchema, updateEquipmentSchema } from '../validators/equipment.validator';

const router = Router();

router.use(authenticate); // All routes require authentication

router.get('/', equipmentController.getAll);
router.get('/:id', equipmentController.getById);
router.get('/:id/requests', equipmentController.getRequests);
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createEquipmentSchema), equipmentController.create);
router.patch('/:id', authorize('ADMIN', 'MANAGER'), validate(updateEquipmentSchema), equipmentController.update);
router.delete('/:id', authorize('ADMIN'), equipmentController.remove);

export default router;
