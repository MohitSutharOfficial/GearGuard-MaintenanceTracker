import { logger } from '../utils/logger';
import { startOverdueCheckJob } from './overdue-check.job';
import { startPreventiveGeneratorJob } from './preventive-generator.job';

export const startCronJobs = () => {
  logger.info('Starting cron jobs...');

  startOverdueCheckJob();
  startPreventiveGeneratorJob();

  logger.info('All cron jobs started successfully');
};
