import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';

export interface JWTPayload {
  id?: string;
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, authConfig.jwtSecret as jwt.Secret, {
    expiresIn: authConfig.jwtExpiresIn as any,
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, authConfig.jwtRefreshSecret as jwt.Secret, {
    expiresIn: authConfig.jwtRefreshExpiresIn as any,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, authConfig.jwtSecret) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, authConfig.jwtRefreshSecret) as JWTPayload;
};
