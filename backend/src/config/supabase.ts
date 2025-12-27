import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase environment variables');
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Test connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) {
      logger.error('Supabase connection test failed:', error);
      return false;
    }
    logger.info('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    logger.error('Supabase connection error:', error);
    return false;
  }
};
