import { Request, Response } from 'express';
import { MaintenanceTeamService } from '../services/maintenance-team.service';
import { logger } from '../utils/logger';

export class MaintenanceTeamController {
  /**
   * GET /api/v1/maintenance-teams
   * Get all maintenance teams
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const activeOnly = req.query.active === 'true';
      const result = await MaintenanceTeamService.getAll(activeOnly);

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
      logger.error('Maintenance team controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /api/v1/maintenance-teams/:id
   * Get maintenance team by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await MaintenanceTeamService.getById(id);

      if (result.error) {
        res.status(404).json({ error: 'Maintenance team not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      logger.error('Maintenance team controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * POST /api/v1/maintenance-teams
   * Create new maintenance team
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const teamData = req.body;
      const result = await MaintenanceTeamService.create(teamData);

      if (result.error) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.status(201).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      logger.error('Maintenance team controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * PUT /api/v1/maintenance-teams/:id
   * Update maintenance team
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;
      const result = await MaintenanceTeamService.update(id, updates);

      if (result.error) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      logger.error('Maintenance team controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * DELETE /api/v1/maintenance-teams/:id
   * Delete maintenance team
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await MaintenanceTeamService.delete(id);

      if (result.error) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Maintenance team deleted successfully'
      });
    } catch (error) {
      logger.error('Maintenance team controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
