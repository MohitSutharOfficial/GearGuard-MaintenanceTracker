import { Request, Response } from 'express';
import { EquipmentService } from '../services/equipment.service';
import { logger } from '../utils/logger';

export class EquipmentController {
  /**
   * GET /api/v1/equipment
   * Get all equipment
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { status, category, team_id } = req.query;
      
      const filters = {
        status: status as any,
        category: category as string,
        team_id: team_id as string
      };

      const result = await EquipmentService.getAll(filters);

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
      logger.error('Equipment controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /api/v1/equipment/:id
   * Get equipment by ID
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await EquipmentService.getById(id);

      if (result.error) {
        res.status(404).json({ error: 'Equipment not found' });
        return;
      }

      // Get open requests count
      const openRequestsCount = await EquipmentService.getOpenRequestsCount(id);

      res.status(200).json({
        success: true,
        data: {
          ...result.data,
          openRequestsCount
        }
      });
    } catch (error) {
      logger.error('Equipment controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * POST /api/v1/equipment
   * Create new equipment
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { 
        categoryId, 
        maintenanceTeamId, 
        serialNumber, 
        purchaseDate, 
        warrantyExpiry,
        code,
        manufacturer,
        model,
        ...rest 
      } = req.body;
      
      // Map frontend fields to database schema
      const equipmentData = {
        name: rest.name,
        serial_number: serialNumber || code || `EQ-${Date.now()}`,
        category: categoryId || rest.category || 'General',
        department: manufacturer || rest.department || 'Unknown',
        employee: model || rest.employee || null,
        location: rest.location,
        purchase_date: purchaseDate || new Date().toISOString().split('T')[0],
        warranty_expiry: warrantyExpiry || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
        status: rest.status === 'OPERATIONAL' ? 'active' : 
                rest.status === 'UNDER_MAINTENANCE' ? 'under_repair' : 
                rest.status === 'UNUSABLE' ? 'scrapped' : 
                rest.status || 'active',
        maintenance_team_id: maintenanceTeamId
      };
      
      const result = await EquipmentService.create(equipmentData);

      if (result.error) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.status(201).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      logger.error('Equipment controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * PUT /api/v1/equipment/:id
   * Update equipment
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { 
        categoryId, 
        maintenanceTeamId, 
        serialNumber, 
        purchaseDate, 
        warrantyExpiry,
        code,
        manufacturer,
        model,
        ...rest 
      } = req.body;
      
      // Map frontend fields to database schema
      const updates: any = {};
      if (rest.name) updates.name = rest.name;
      if (serialNumber || code) updates.serial_number = serialNumber || code;
      if (categoryId || rest.category) updates.category = categoryId || rest.category;
      if (manufacturer || rest.department) updates.department = manufacturer || rest.department;
      if (model !== undefined || rest.employee !== undefined) updates.employee = model || rest.employee;
      if (rest.location) updates.location = rest.location;
      if (purchaseDate) updates.purchase_date = purchaseDate;
      if (warrantyExpiry) updates.warranty_expiry = warrantyExpiry;
      if (rest.status) {
        updates.status = rest.status === 'OPERATIONAL' ? 'active' : 
                        rest.status === 'UNDER_MAINTENANCE' ? 'under_repair' : 
                        rest.status === 'UNUSABLE' ? 'scrapped' : 
                        rest.status;
      }
      if (maintenanceTeamId) updates.maintenance_team_id = maintenanceTeamId;
      
      const result = await EquipmentService.update(id, updates);

      if (result.error) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      logger.error('Equipment controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * DELETE /api/v1/equipment/:id
   * Delete equipment
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await EquipmentService.delete(id);

      if (result.error) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Equipment deleted successfully'
      });
    } catch (error) {
      logger.error('Equipment controller error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
