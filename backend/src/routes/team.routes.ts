import { Router } from 'express';
import * as teamController from '../controllers/team.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createTeamSchema, updateTeamSchema } from '../validators/team.validator';

const router = Router();

router.use(authenticate);

router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);
router.get('/:id/workload', teamController.getWorkload);
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createTeamSchema), teamController.create);
router.patch('/:id', authorize('ADMIN', 'MANAGER'), validate(updateTeamSchema), teamController.update);
router.delete('/:id', authorize('ADMIN'), teamController.remove);

export default router;
