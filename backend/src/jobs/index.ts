import { logger } from '../utils/logger';

export const startCronJobs = () => {
  logger.info('Cron jobs are currently disabled (database not configured)');
};
