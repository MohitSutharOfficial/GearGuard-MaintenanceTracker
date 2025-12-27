import { supabase, supabaseAdmin } from '../config/supabase';
import { DatabaseResponse, MaintenanceRequest, RequestPriority, RequestStage, RequestType } from '../types/database.types';
import { logger } from '../utils/logger';

export class MaintenanceRequestService {
  /**
   * Get all maintenance requests with optional filters
   */
  static async getAll(filters?: {
    type?: RequestType;
    stage?: RequestStage;
    priority?: RequestPriority;
    equipment_id?: string;
    team_id?: string;
    is_overdue?: boolean;
  }): Promise<DatabaseResponse<MaintenanceRequest[]>> {
    try {
      let query = supabase
        .from('maintenance_requests')
        .select(`
          *,
          equipment:equipment_id (
            id,
            name,
            category,
            serial_number
          ),
          team:maintenance_team_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.stage) {
        query = query.eq('stage', filters.stage);
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.equipment_id) {
        query = query.eq('equipment_id', filters.equipment_id);
      }
      if (filters?.team_id) {
        query = query.eq('maintenance_team_id', filters.team_id);
      }
      if (filters?.is_overdue) {
        query = query
          .not('scheduled_date', 'is', null)
          .lt('scheduled_date', new Date().toISOString().split('T')[0])
          .not('stage', 'in', '(repaired,completed,scrap)');
      }

      const { data, error, count } = await query;

      if (error) {
        logger.error('Error fetching maintenance requests:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: data as MaintenanceRequest[], error: null, count: count || undefined };
    } catch (error) {
      logger.error('Maintenance request service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get request by ID
   */
  static async getById(id: string): Promise<DatabaseResponse<MaintenanceRequest>> {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          equipment:equipment_id (
            id,
            name,
            category,
            serial_number
          ),
          team:maintenance_team_id (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        logger.error(`Error fetching request ${id}:`, error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: data as MaintenanceRequest, error: null };
    } catch (error) {
      logger.error('Maintenance request service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create new maintenance request
   */
  static async create(requestData: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at' | 'completed_at'>): Promise<DatabaseResponse<MaintenanceRequest>> {
    try {
      // Validate preventive requests have scheduled date
      if (requestData.type === RequestType.PREVENTIVE && !requestData.scheduled_date) {
        return { 
          data: null, 
          error: new Error('Preventive maintenance requests must have a scheduled date') 
        };
      }

      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([requestData])
        .select()
        .single();

      if (error) {
        logger.error('Error creating maintenance request:', error);
        return { data: null, error: new Error(error.message) };
      }

      logger.info(`Maintenance request created: ${data.subject}`);
      return { data: data as MaintenanceRequest, error: null };
    } catch (error) {
      logger.error('Maintenance request service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update maintenance request
   */
  static async update(id: string, updates: Partial<MaintenanceRequest>): Promise<DatabaseResponse<MaintenanceRequest>> {
    try {
      // Set completed_at when moving to completed/repaired stage
      if ((updates.stage === RequestStage.REPAIRED || updates.stage === RequestStage.COMPLETED) && !updates.completed_at) {
        updates.completed_at = new Date().toISOString();
      }

      // Use supabaseAdmin to bypass RLS policies
      const { data, error } = await supabaseAdmin
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error(`Error updating request ${id}:`, error);
        return { data: null, error: new Error(error.message) };
      }

      if (!data) {
        logger.error(`Request ${id} not found`);
        return { data: null, error: new Error(`Request not found: ${id}`) };
      }

      logger.info(`Maintenance request updated: ${id}`);
      return { data: data as MaintenanceRequest, error: null };
    } catch (error) {
      logger.error('Maintenance request service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete maintenance request
   */
  static async delete(id: string): Promise<DatabaseResponse<null>> {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error(`Error deleting request ${id}:`, error);
        return { data: null, error: new Error(error.message) };
      }

      logger.info(`Maintenance request deleted: ${id}`);
      return { data: null, error: null };
    } catch (error) {
      logger.error('Maintenance request service error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get overdue requests
   */
  static async getOverdue(): Promise<DatabaseResponse<MaintenanceRequest[]>> {
    return this.getAll({ is_overdue: true });
  }

  /**
   * Update request stage (for Kanban drag & drop)
   */
  static async updateStage(id: string, stage: RequestStage): Promise<DatabaseResponse<MaintenanceRequest>> {
    return this.update(id, { stage });
  }
}
