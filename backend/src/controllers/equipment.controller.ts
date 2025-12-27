import { NextFunction, Request, Response } from 'express';
import * as equipmentService from '../services/equipment.service';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, teamId, status } = req.query;
    const equipment = await equipmentService.getAll({
      categoryId: categoryId ? Number(categoryId) : undefined,
      teamId: teamId ? Number(teamId) : undefined,
      status: status as string,
    });
    res.json(equipment);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const equipment = await equipmentService.getById(Number(req.params.id));
    res.json(equipment);
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await equipmentService.getRequests(Number(req.params.id));
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const equipment = await equipmentService.create(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const equipment = await equipmentService.update(Number(req.params.id), req.body);
    res.json(equipment);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await equipmentService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
