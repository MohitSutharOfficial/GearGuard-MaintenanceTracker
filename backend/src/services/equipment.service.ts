import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export const getAll = async (filters?: {
  categoryId?: number;
  teamId?: number;
  status?: string;
}) => {
  const where: any = {};

  if (filters?.categoryId) where.categoryId = filters.categoryId;
  if (filters?.teamId) where.maintenanceTeamId = filters.teamId;
  if (filters?.status) where.status = filters.status;

  return prisma.equipment.findMany({
    where,
    include: {
      category: true,
      maintenanceTeam: true,
      maintenanceRequests: {
        where: {
          stage: { notIn: ['REPAIRED', 'SCRAP'] },
        },
      },
    },
    orderBy: { name: 'asc' },
  });
};

export const getById = async (id: number) => {
  const equipment = await prisma.equipment.findUnique({
    where: { id },
    include: {
      category: true,
      maintenanceTeam: { include: { members: { include: { user: true } } } },
      maintenanceRequests: {
        include: { technician: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!equipment) {
    throw new AppError('Equipment not found', 404, 'EQUIPMENT_NOT_FOUND');
  }

  return equipment;
};

export const getRequests = async (id: number) => {
  const equipment = await prisma.equipment.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!equipment) {
    throw new AppError('Equipment not found', 404, 'EQUIPMENT_NOT_FOUND');
  }

  return prisma.maintenanceRequest.findMany({
    where: {
      equipmentId: id,
      stage: { notIn: ['REPAIRED', 'SCRAP'] },
    },
    include: { technician: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const create = async (data: any) => {
  return prisma.equipment.create({
    data,
    include: {
      category: true,
      maintenanceTeam: true,
    },
  });
};

export const update = async (id: number, data: any) => {
  const equipment = await prisma.equipment.findUnique({ where: { id } });

  if (!equipment) {
    throw new AppError('Equipment not found', 404, 'EQUIPMENT_NOT_FOUND');
  }

  return prisma.equipment.update({
    where: { id },
    data,
    include: {
      category: true,
      maintenanceTeam: true,
    },
  });
};

export const remove = async (id: number) => {
  const equipment = await prisma.equipment.findUnique({
    where: { id },
    include: { maintenanceRequests: true },
  });

  if (!equipment) {
    throw new AppError('Equipment not found', 404, 'EQUIPMENT_NOT_FOUND');
  }

  if (equipment.maintenanceRequests.length > 0) {
    throw new AppError(
      'Cannot delete equipment with existing maintenance requests',
      400,
      'EQUIPMENT_HAS_REQUESTS'
    );
  }

  await prisma.equipment.delete({ where: { id } });
};
