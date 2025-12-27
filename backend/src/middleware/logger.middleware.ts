import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(
      `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
};
