import { NextFunction, Request, Response } from 'express';
import * as reportService from '../services/report.service';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboard = await reportService.getDashboard();
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
};

export const getUtilization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const utilization = await reportService.getUtilization();
    res.json(utilization);
  } catch (error) {
    next(error);
  }
};

export const getPerformance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const performance = await reportService.getPerformance();
    res.json(performance);
  } catch (error) {
    next(error);
  }
};

export const getCompliance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const compliance = await reportService.getCompliance();
    res.json(compliance);
  } catch (error) {
    next(error);
  }
};
