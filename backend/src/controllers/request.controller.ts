import { NextFunction, Request, Response } from 'express';
import * as requestService from '../services/request.service';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, stage, equipmentId, technicianId, teamId } = req.query;
    const requests = await requestService.getAll({
      type: type as string,
      stage: stage as string,
      equipmentId: equipmentId ? Number(equipmentId) : undefined,
      technicianId: technicianId ? Number(technicianId) : undefined,
      teamId: teamId ? Number(teamId) : undefined,
    });
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

export const getOverdue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await requestService.getOverdue();
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await requestService.getById(Number(req.params.id));
    res.json(request);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await requestService.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await requestService.update(Number(req.params.id), req.body);
    res.json(request);
  } catch (error) {
    next(error);
  }
};

export const updateStage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { stage } = req.body;
    const request = await requestService.updateStage(Number(req.params.id), stage);
    res.json(request);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await requestService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
