import { NextFunction, Request, Response } from 'express';
import * as teamService from '../services/team.service';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teams = await teamService.getAll();
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const team = await teamService.getById(Number(req.params.id));
    res.json(team);
  } catch (error) {
    next(error);
  }
};

export const getWorkload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workload = await teamService.getWorkload(Number(req.params.id));
    res.json(workload);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const team = await teamService.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const team = await teamService.update(Number(req.params.id), req.body);
    res.json(team);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await teamService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
