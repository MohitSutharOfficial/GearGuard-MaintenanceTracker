import { Request, Response } from 'express';
import { MaintenanceRequestService } from '../services/maintenance-request.service';
import { RequestPriority, RequestStage, RequestType } from '../types/database.types';
import { logger } from '../utils/logger';

export class MaintenanceRequestController {
  /**
   * GET /api/v1/maintenance-requests
   * Get all maintenance requests
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { type, stage, priority, equipment_id, team_id, is_overdue } = req.query;
      
      const filters = {
        type: type as any,
        stage: stage as any,
        priority: priority as any,
        equipment_id: equipment_id as string,
        team_id: team_id as string,
        is_overdue: is_overdue === 'true'
      };

      const result = await MaintenanceRequestService.getAll(filters);

      if (result.error) {
        res.status(500).json({ error: result.error.message });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
        count: result.count
      });
    } catch (error) {
      logger.error('Maintenance request controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /api/v1/maintenance-requests/:id
   * Get maintenance request by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await MaintenanceRequestService.getById(id);

      if (result.error) {
        res.status(404).json({ error: 'Maintenance request not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      logger.error('Maintenance request controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * POST /api/v1/maintenance-requests
   * Create new maintenance request
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { equipmentId, technician, scheduledDate, duration, ...rest } = req.body;
      
      // Fetch equipment details to get required denormalized fields
      const { EquipmentService } = await import('../services/equipment.service');
      const equipmentResult = await EquipmentService.getById(equipmentId);
      
      if (equipmentResult.error || !equipmentResult.data) {
        res.status(400).json({ error: 'Equipment not found' });
        return;
      }

      const equipment = equipmentResult.data;
      
      // Fetch team name
      const { MaintenanceTeamService } = await import('../services/maintenance-team.service');
      const teamResult = await MaintenanceTeamService.getById(equipment.maintenance_team_id);
      const teamName = teamResult.data?.name || 'Unknown';
      
      // Map camelCase to snake_case and add required fields
      const requestData = {
        subject: rest.subject,
        description: rest.description || '',
        type: rest.type.toLowerCase() as RequestType,
        priority: rest.priority.toLowerCase() as RequestPriority,
        stage: RequestStage.NEW,
        equipment_id: equipmentId,
        equipment_name: equipment.name,
        equipment_category: equipment.category,
        maintenance_team_id: equipment.maintenance_team_id,
        maintenance_team_name: teamName,
        technician: technician || null,
        scheduled_date: scheduledDate || null,
        duration: duration || 0,
        hours_spent: 0,
        notes: rest.notes || null,
        scrap_reason: null,
      };

      const result = await MaintenanceRequestService.create(requestData);

      if (result.error) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.status(201).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      logger.error('Maintenance request controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * PUT /api/v1/maintenance-requests/:id
   * Update maintenance request
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { equipmentId, technician, scheduledDate, ...rest } = req.body;
      
      // Map camelCase to snake_case for database
      const updates: any = { ...rest };
      if (equipmentId !== undefined) updates.equipment_id = equipmentId;
      if (technician !== undefined) updates.technician = technician;
      if (scheduledDate !== undefined) updates.scheduled_date = scheduledDate;
      
      const result = await MaintenanceRequestService.update(id, updates);

      if (result.error) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      logger.error('Maintenance request controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * PATCH /api/v1/maintenance-requests/:id/stage
   * Update request stage (for Kanban)
   */
  static async updateStage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { stage } = req.body;
      
      if (!stage) {
        res.status(400).json({ error: 'Stage is required' });
        return;
      }

      const result = await MaintenanceRequestService.updateStage(id, stage);

      if (result.error) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      logger.error('Maintenance request controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * DELETE /api/v1/maintenance-requests/:id
   * Delete maintenance request
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await MaintenanceRequestService.delete(id);

      if (result.error) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Maintenance request deleted successfully'
      });
    } catch (error) {
      logger.error('Maintenance request controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /api/v1/maintenance-requests/overdue
   * Get overdue maintenance requests
   */
  static async getOverdue(req: Request, res: Response): Promise<void> {
    try {
      const result = await MaintenanceRequestService.getOverdue();

      if (result.error) {
        res.status(500).json({ error: result.error.message });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
        count: result.count
      });
    } catch (error) {
      logger.error('Maintenance request controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
