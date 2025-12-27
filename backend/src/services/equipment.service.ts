import { supabase, supabaseAdmin } from '../config/supabase';
import { DatabaseResponse, Equipment, EquipmentStatus } from '../types/database.types';
import { logger } from '../utils/logger';

export class EquipmentService {
  /**
   * Get all equipment with optional filters
   */
  static async getAll(filters?: {
    status?: EquipmentStatus;
    category?: string;
    team_id?: string;
  }): Promise<DatabaseResponse<Equipment[]>> {
    try {
      let query = supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.team_id) {
        query = query.eq('maintenance_team_id', filters.team_id);
      }

      const { data, error, count } = await query;

      if (error) {
        logger.error('Error fetching equipment:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: data as Equipment[], error: null, count: count || undefined };
    } catch (error) {
      logger.error('Equipment service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get equipment by ID
   */
  static async getById(id: string): Promise<DatabaseResponse<Equipment>> {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error(`Error fetching equipment ${id}:`, error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: data as Equipment, error: null };
    } catch (error) {
      logger.error('Equipment service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create new equipment
   */
  static async create(equipmentData: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResponse<Equipment>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('equipment')
        .insert([equipmentData])
        .select()
        .single();

      if (error) {
        logger.error('Error creating equipment:', error);
        return { data: null, error: new Error(error.message) };
      }

      logger.info(`Equipment created: ${data.serial_number}`);
      return { data: data as Equipment, error: null };
    } catch (error) {
      logger.error('Equipment service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update equipment
   */
  static async update(id: string, updates: Partial<Equipment>): Promise<DatabaseResponse<Equipment>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('equipment')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error(`Error updating equipment ${id}:`, error);
        return { data: null, error: new Error(error.message) };
      }

      if (!data) {
        return { data: null, error: new Error('Equipment not found after update') };
      }

      logger.info(`Equipment updated: ${id}`);
      return { data: data as Equipment, error: null };
    } catch (error) {
      logger.error('Equipment service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete equipment
   */
  static async delete(id: string): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error(`Error deleting equipment ${id}:`, error);
        return { data: null, error: new Error(error.message) };
      }

      logger.info(`Equipment deleted: ${id}`);
      return { data: null, error: null };
    } catch (error) {
      logger.error('Equipment service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get open requests count for equipment
   */
  static async getOpenRequestsCount(equipmentId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('maintenance_requests')
        .select('*', { count: 'exact', head: true })
        .eq('equipment_id', equipmentId)
        .not('stage', 'in', '(repaired,completed,scrap)');

      if (error) {
        logger.error(`Error counting requests for equipment ${equipmentId}:`, error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      logger.error('Equipment service error:', error);
      return 0;
    }
  }
}
