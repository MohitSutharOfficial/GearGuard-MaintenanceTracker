import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.query;
    const users = await userService.getAll(role as string);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getById(Number(req.params.id));
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.update(Number(req.params.id), req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
