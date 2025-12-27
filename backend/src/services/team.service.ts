import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export const getAll = async () => {
  return prisma.maintenanceTeam.findMany({
    include: {
      members: {
        include: { user: true },
      },
    },
    orderBy: { name: 'asc' },
  });
};

export const getById = async (id: number) => {
  const team = await prisma.maintenanceTeam.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: true },
      },
      equipment: true,
    },
  });

  if (!team) {
    throw new AppError('Team not found', 404, 'TEAM_NOT_FOUND');
  }

  return team;
};

export const getWorkload = async (id: number) => {
  const team = await prisma.maintenanceTeam.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!team) {
    throw new AppError('Team not found', 404, 'TEAM_NOT_FOUND');
  }

  const requests = await prisma.maintenanceRequest.findMany({
    where: {
      equipment: { maintenanceTeamId: id },
      stage: { notIn: ['REPAIRED', 'SCRAP'] },
    },
    include: { equipment: true, technician: true },
  });

  return {
    teamId: id,
    totalRequests: requests.length,
    byStage: {
      NEW: requests.filter((r) => r.stage === 'NEW').length,
      IN_PROGRESS: requests.filter((r) => r.stage === 'IN_PROGRESS').length,
    },
    byType: {
      CORRECTIVE: requests.filter((r) => r.type === 'CORRECTIVE').length,
      PREVENTIVE: requests.filter((r) => r.type === 'PREVENTIVE').length,
    },
    requests,
  };
};

export const create = async (data: any) => {
  return prisma.maintenanceTeam.create({
    data,
    include: {
      members: { include: { user: true } },
    },
  });
};

export const update = async (id: number, data: any) => {
  const team = await prisma.maintenanceTeam.findUnique({ where: { id } });

  if (!team) {
    throw new AppError('Team not found', 404, 'TEAM_NOT_FOUND');
  }

  return prisma.maintenanceTeam.update({
    where: { id },
    data,
    include: {
      members: { include: { user: true } },
    },
  });
};

export const remove = async (id: number) => {
  const team = await prisma.maintenanceTeam.findUnique({
    where: { id },
    include: { equipment: true },
  });

  if (!team) {
    throw new AppError('Team not found', 404, 'TEAM_NOT_FOUND');
  }

  if (team.equipment.length > 0) {
    throw new AppError(
      'Cannot delete team with assigned equipment',
      400,
      'TEAM_HAS_EQUIPMENT'
    );
  }

  await prisma.maintenanceTeam.delete({ where: { id } });
};
