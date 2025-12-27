import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import { hashPassword } from '../utils/encryption';

const prisma = new PrismaClient();

export const getAll = async (role?: string) => {
  const where = role ? { role } : {};

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: { name: 'asc' },
  });
};

export const getById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      teamMemberships: {
        include: { team: true },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return user;
};

export const update = async (id: number, data: any) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // If password is being updated, hash it
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
};

export const remove = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  await prisma.user.delete({ where: { id } });
};
