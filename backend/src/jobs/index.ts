import cron from 'node-cron';
import { MaintenanceRequestService } from '../services/maintenance-request.service';
import { logger } from '../utils/logger';

/**
 * Overdue Check Job
 * Runs daily at midnight to check for overdue maintenance requests
 */
export const startOverdueCheckJob = () => {
  cron.schedule('0 0 * * *', async () => {
    logger.info('Running overdue check job...');
    try {
      const result = await MaintenanceRequestService.getOverdue();
      if (result.data) {
        logger.info(`Found ${result.data.length} overdue maintenance requests`);
        // You can add notification logic here
      }
    } catch (error) {
      logger.error('Overdue check job failed:', error);
    }
  });
  logger.info('✅ Overdue check job scheduled (daily at midnight)');
};

/**
 * Preventive Maintenance Generator Job
 * Runs weekly on Monday at 8 AM to generate preventive maintenance requests
 */
export const startPreventiveGeneratorJob = () => {
  cron.schedule('0 8 * * 1', async () => {
    logger.info('Running preventive maintenance generator job...');
    try {
      // Logic to generate preventive maintenance requests
      // This is a placeholder - implement based on your business rules
      logger.info('Preventive maintenance generation completed');
    } catch (error) {
      logger.error('Preventive generator job failed:', error);
    }
  });
  logger.info('✅ Preventive generator job scheduled (Monday at 8 AM)');
};

export const startCronJobs = () => {
  logger.info('Starting cron jobs...');
  startOverdueCheckJob();
  startPreventiveGeneratorJob();
  logger.info('✅ All cron jobs started successfully');
};
