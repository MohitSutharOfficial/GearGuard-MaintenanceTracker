import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';

const router = Router();

router.get('/', EquipmentController.getAll);
router.get('/:id', EquipmentController.getById);
router.post('/', EquipmentController.create);
router.put('/:id', EquipmentController.update);
router.delete('/:id', EquipmentController.delete);

export default router;
