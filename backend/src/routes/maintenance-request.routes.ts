import { Router } from 'express';
import { MaintenanceRequestController } from '../controllers/maintenance-request.controller';

const router = Router();

router.get('/', MaintenanceRequestController.getAll);
router.get('/overdue', MaintenanceRequestController.getOverdue);
router.get('/:id', MaintenanceRequestController.getById);
router.post('/', MaintenanceRequestController.create);
router.put('/:id', MaintenanceRequestController.update);
router.patch('/:id/stage', MaintenanceRequestController.updateStage);
router.delete('/:id', MaintenanceRequestController.delete);

export default router;
