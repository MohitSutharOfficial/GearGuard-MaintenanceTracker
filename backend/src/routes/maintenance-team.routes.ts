import { Router } from 'express';
import { MaintenanceTeamController } from '../controllers/maintenance-team.controller';

const router = Router();

router.get('/', MaintenanceTeamController.getAll);
router.get('/:id', MaintenanceTeamController.getById);
router.post('/', MaintenanceTeamController.create);
router.put('/:id', MaintenanceTeamController.update);
router.delete('/:id', MaintenanceTeamController.delete);

export default router;
