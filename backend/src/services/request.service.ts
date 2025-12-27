import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export const getAll = async (filters?: {
  type?: string;
  stage?: string;
  equipmentId?: number;
  technicianId?: number;
  teamId?: number;
}) => {
  const where: any = {};

  if (filters?.type) where.type = filters.type;
  if (filters?.stage) where.stage = filters.stage;
  if (filters?.equipmentId) where.equipmentId = filters.equipmentId;
  if (filters?.technicianId) where.technicianId = filters.technicianId;
  if (filters?.teamId) {
    where.equipment = {
      maintenanceTeamId: filters.teamId,
    };
  }

  return prisma.maintenanceRequest.findMany({
    where,
    include: {
      equipment: { include: { category: true } },
      technician: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getOverdue = async () => {
  const today = new Date();
  return prisma.maintenanceRequest.findMany({
    where: {
      scheduledDate: { lt: today },
      stage: { notIn: ['REPAIRED', 'SCRAP'] },
    },
    include: {
      equipment: { include: { category: true } },
      technician: true,
    },
    orderBy: { scheduledDate: 'asc' },
  });
};

export const getById = async (id: number) => {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: {
      equipment: {
        include: {
          category: true,
          maintenanceTeam: { include: { members: { include: { user: true } } } },
        },
      },
      technician: true,
    },
  });

  if (!request) {
    throw new AppError('Maintenance request not found', 404, 'REQUEST_NOT_FOUND');
  }

  return request;
};

export const create = async (data: any) => {
  // Validate equipment exists
  const equipment = await prisma.equipment.findUnique({
    where: { id: data.equipmentId },
  });

  if (!equipment) {
    throw new AppError('Equipment not found', 404, 'EQUIPMENT_NOT_FOUND');
  }

  // Preventive requests require scheduled date
  if (data.type === 'PREVENTIVE' && !data.scheduledDate) {
    throw new AppError(
      'Scheduled date is required for preventive maintenance',
      400,
      'SCHEDULED_DATE_REQUIRED'
    );
  }

  return prisma.maintenanceRequest.create({
    data: {
      ...data,
      stage: 'NEW',
    },
    include: {
      equipment: { include: { category: true } },
      technician: true,
    },
  });
};

export const update = async (id: number, data: any) => {
  const request = await prisma.maintenanceRequest.findUnique({ where: { id } });

  if (!request) {
    throw new AppError('Maintenance request not found', 404, 'REQUEST_NOT_FOUND');
  }

  return prisma.maintenanceRequest.update({
    where: { id },
    data,
    include: {
      equipment: { include: { category: true } },
      technician: true,
    },
  });
};

export const updateStage = async (id: number, stage: string) => {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: { equipment: true },
  });

  if (!request) {
    throw new AppError('Maintenance request not found', 404, 'REQUEST_NOT_FOUND');
  }

  // Validate stage transition
  const validTransitions: any = {
    NEW: ['IN_PROGRESS'],
    IN_PROGRESS: ['REPAIRED', 'SCRAP'],
    REPAIRED: [],
    SCRAP: [],
  };

  if (!validTransitions[request.stage]?.includes(stage)) {
    throw new AppError(
      `Invalid stage transition from ${request.stage} to ${stage}`,
      400,
      'INVALID_STAGE_TRANSITION'
    );
  }

  // Require duration before moving to REPAIRED
  if (stage === 'REPAIRED' && !request.duration) {
    throw new AppError('Duration is required before marking as repaired', 400, 'DURATION_REQUIRED');
  }

  // Update equipment status when moving to SCRAP
  if (stage === 'SCRAP') {
    await prisma.equipment.update({
      where: { id: request.equipmentId },
      data: { status: 'UNUSABLE' },
    });
  }

  return prisma.maintenanceRequest.update({
    where: { id },
    data: { stage },
    include: {
      equipment: { include: { category: true } },
      technician: true,
    },
  });
};

export const remove = async (id: number) => {
  const request = await prisma.maintenanceRequest.findUnique({ where: { id } });

  if (!request) {
    throw new AppError('Maintenance request not found', 404, 'REQUEST_NOT_FOUND');
  }

  await prisma.maintenanceRequest.delete({ where: { id } });
};
