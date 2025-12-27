import bcrypt from 'bcrypt';
import { authConfig } from '../config/auth';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, authConfig.bcryptRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
