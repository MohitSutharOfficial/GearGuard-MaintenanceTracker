import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const startOverdueCheckJob = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('Running overdue check job');

      const today = new Date();
      const overdueRequests = await prisma.maintenanceRequest.findMany({
        where: {
          scheduledDate: { lt: today },
          stage: { notIn: ['REPAIRED', 'SCRAP'] },
        },
        include: {
          equipment: true,
          technician: true,
        },
      });

      logger.info(`Found ${overdueRequests.length} overdue requests`);

      // Here you could send notifications, emails, etc.
      // For now, just logging
      for (const request of overdueRequests) {
        logger.warn(`Overdue request: ${request.subject} (ID: ${request.id})`);
      }
    } catch (error) {
      logger.error('Error in overdue check job:', error);
    }
  });

  logger.info('Overdue check job scheduled');
};
