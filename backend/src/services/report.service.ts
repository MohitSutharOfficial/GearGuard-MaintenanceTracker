import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboard = async () => {
  const [
    totalEquipment,
    operationalEquipment,
    totalRequests,
    openRequests,
    overdueRequests,
  ] = await Promise.all([
    prisma.equipment.count(),
    prisma.equipment.count({ where: { status: 'OPERATIONAL' } }),
    prisma.maintenanceRequest.count(),
    prisma.maintenanceRequest.count({
      where: { stage: { notIn: ['REPAIRED', 'SCRAP'] } },
    }),
    prisma.maintenanceRequest.count({
      where: {
        scheduledDate: { lt: new Date() },
        stage: { notIn: ['REPAIRED', 'SCRAP'] },
      },
    }),
  ]);

  return {
    totalEquipment,
    operationalEquipment,
    totalRequests,
    openRequests,
    overdueRequests,
  };
};

export const getUtilization = async () => {
  const equipment = await prisma.equipment.findMany({
    include: {
      maintenanceRequests: {
        where: { stage: { notIn: ['REPAIRED', 'SCRAP'] } },
      },
    },
  });

  return equipment.map((eq) => ({
    id: eq.id,
    name: eq.name,
    status: eq.status,
    openRequests: eq.maintenanceRequests.length,
  }));
};

export const getPerformance = async () => {
  const teams = await prisma.maintenanceTeam.findMany({
    include: {
      equipment: {
        include: {
          maintenanceRequests: {
            where: { stage: 'REPAIRED' },
          },
        },
      },
    },
  });

  return teams.map((team) => {
    const requests = team.equipment.flatMap((eq) => eq.maintenanceRequests);
    const avgDuration =
      requests.length > 0
        ? requests.reduce((sum, r) => sum + (r.duration || 0), 0) / requests.length
        : 0;

    return {
      teamId: team.id,
      teamName: team.name,
      completedRequests: requests.length,
      avgDuration: Math.round(avgDuration),
    };
  });
};

export const getCompliance = async () => {
  const preventiveRequests = await prisma.maintenanceRequest.findMany({
    where: { type: 'PREVENTIVE' },
    include: { equipment: { include: { category: true } } },
  });

  const total = preventiveRequests.length;
  const completed = preventiveRequests.filter((r) => r.stage === 'REPAIRED').length;
  const overdue = preventiveRequests.filter(
    (r) =>
      r.scheduledDate &&
      r.scheduledDate < new Date() &&
      r.stage !== 'REPAIRED'
  ).length;

  return {
    total,
    completed,
    overdue,
    complianceRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
};
