import { logger } from '../utils/logger';
import { testConnection } from './supabase';

export const connectDatabase = async (): Promise<void> => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to Supabase');
    }
    logger.info('✅ Database connection established');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

