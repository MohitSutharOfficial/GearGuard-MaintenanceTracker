import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN', 'MANAGER'), userController.getAll);
router.get('/:id', userController.getById);
router.patch('/:id', userController.update);
router.delete('/:id', authorize('ADMIN'), userController.remove);

export default router;
