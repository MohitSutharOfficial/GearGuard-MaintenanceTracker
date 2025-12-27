import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { addDays } from '../utils/dateUtils';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const startPreventiveGeneratorJob = () => {
  // Run every week on Monday at 8 AM
  cron.schedule('0 8 * * 1', async () => {
    try {
      logger.info('Running preventive maintenance generator job');

      const equipment = await prisma.equipment.findMany({
        where: { status: 'OPERATIONAL' },
        include: { maintenanceTeam: true },
      });

      // Generate preventive maintenance for next 30 days
      const nextMonth = addDays(new Date(), 30);

      for (const eq of equipment) {
        // Check if preventive maintenance already scheduled
        const existingRequest = await prisma.maintenanceRequest.findFirst({
          where: {
            equipmentId: eq.id,
            type: 'PREVENTIVE',
            scheduledDate: { gte: new Date(), lte: nextMonth },
          },
        });

        if (!existingRequest) {
          // Create preventive maintenance request
          const scheduledDate = addDays(new Date(), 7); // Schedule 1 week from now

          await prisma.maintenanceRequest.create({
            data: {
              subject: `Preventive Maintenance - ${eq.name}`,
              description: 'Routine preventive maintenance',
              type: 'PREVENTIVE',
              priority: 'MEDIUM',
              equipmentId: eq.id,
              scheduledDate,
              stage: 'NEW',
            },
          });

          logger.info(`Created preventive maintenance for equipment: ${eq.name}`);
        }
      }

      logger.info('Preventive maintenance generator job completed');
    } catch (error) {
      logger.error('Error in preventive generator job:', error);
    }
  });

  logger.info('Preventive maintenance generator job scheduled');
};
