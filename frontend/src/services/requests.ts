import api from './api';

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description?: string;
  type: 'CORRECTIVE' | 'PREVENTIVE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  stage: 'NEW' | 'IN_PROGRESS' | 'REPAIRED' | 'SCRAP';
  equipmentId: string;
  technician?: string;
  scheduledDate?: string;
  duration?: number;
  notes?: string;
  equipment?: any;
  createdAt: string;
  updatedAt: string;
}

export const requestService = {
  async getAll(filters?: {
    type?: string;
    stage?: string;
    equipmentId?: number;
    technicianId?: number;
    teamId?: number;
  }): Promise<MaintenanceRequest[]> {
    const { data } = await api.get('/maintenance-requests', { params: filters });
    return data.data || data; // Handle wrapped response
  },

  async getOverdue(): Promise<MaintenanceRequest[]> {
    const { data } = await api.get('/maintenance-requests/overdue');
    return data.data || data; // Handle wrapped response
  },

  async getById(id: string): Promise<MaintenanceRequest> {
    const { data } = await api.get(`/maintenance-requests/${id}`);
    return data.data || data; // Handle wrapped response
  },

  async create(request: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    const { data } = await api.post('/maintenance-requests', request);
    return data.data || data; // Handle wrapped response
  },

  async update(id: string, request: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    const { data } = await api.patch(`/maintenance-requests/${id}`, request);
    return data.data || data; // Handle wrapped response
  },

  async updateStage(id: string, stage: string): Promise<MaintenanceRequest> {
    const { data } = await api.patch(`/maintenance-requests/${id}/stage`, { stage });
    return data.data || data; // Handle wrapped response
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/maintenance-requests/${id}`);
  },
};
