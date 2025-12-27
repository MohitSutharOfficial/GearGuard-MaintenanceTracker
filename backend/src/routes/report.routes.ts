import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/dashboard', reportController.getDashboard);
router.get('/utilization', reportController.getUtilization);
router.get('/performance', reportController.getPerformance);
router.get('/compliance', reportController.getCompliance);

export default router;
