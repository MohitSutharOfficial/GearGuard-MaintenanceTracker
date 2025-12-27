import { supabaseAdmin } from '../config/supabase';
import { DatabaseResponse, MaintenanceTeam } from '../types/database.types';
import { logger } from '../utils/logger';

export class MaintenanceTeamService {
  /**
   * Get all maintenance teams
   */
  static async getAll(activeOnly = false): Promise<DatabaseResponse<MaintenanceTeam[]>> {
    try {
      let query = supabaseAdmin
        .from('maintenance_teams')
        .select('*')
        .order('name', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error, count } = await query;

      if (error) {
        logger.error('Error fetching maintenance teams:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: data as MaintenanceTeam[], error: null, count: count || undefined };
    } catch (error) {
      logger.error('Maintenance team service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get team by ID
   */
  static async getById(id: string): Promise<DatabaseResponse<MaintenanceTeam>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('maintenance_teams')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error(`Error fetching team ${id}:`, error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: data as MaintenanceTeam, error: null };
    } catch (error) {
      logger.error('Maintenance team service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create new maintenance team
   */
  static async create(teamData: Omit<MaintenanceTeam, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResponse<MaintenanceTeam>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('maintenance_teams')
        .insert([teamData])
        .select()
        .single();

      if (error) {
        logger.error('Error creating maintenance team:', error);
        return { data: null, error: new Error(error.message) };
      }

      logger.info(`Maintenance team created: ${data.name}`);
      return { data: data as MaintenanceTeam, error: null };
    } catch (error) {
      logger.error('Maintenance team service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update maintenance team
   */
  static async update(id: string, updates: Partial<MaintenanceTeam>): Promise<DatabaseResponse<MaintenanceTeam>> {
    try {
      const { data, error } = await supabaseAdmin
        .from('maintenance_teams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error(`Error updating team ${id}:`, error);
        return { data: null, error: new Error(error.message) };
      }

      logger.info(`Maintenance team updated: ${id}`);
      return { data: data as MaintenanceTeam, error: null };
    } catch (error) {
      logger.error('Maintenance team service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete maintenance team
   */
  static async delete(id: string): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await supabaseAdmin
        .from('maintenance_teams')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error(`Error deleting team ${id}:`, error);
        return { data: null, error: new Error(error.message) };
      }

      logger.info(`Maintenance team deleted: ${id}`);
      return { data: null, error: null };
    } catch (error) {
      logger.error('Maintenance team service error:', error);
      return { data: null, error: error as Error };
    }
  }
}
