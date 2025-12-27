import api from './api';

export interface MaintenanceRequest {
  id: number;
  subject: string;
  description?: string;
  type: 'CORRECTIVE' | 'PREVENTIVE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  stage: 'NEW' | 'IN_PROGRESS' | 'REPAIRED' | 'SCRAP';
  equipmentId: number;
  technicianId?: number;
  scheduledDate?: string;
  duration?: number;
  notes?: string;
  equipment?: any;
  technician?: any;
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
    const { data } = await api.get('/requests', { params: filters });
    return data;
  },

  async getOverdue(): Promise<MaintenanceRequest[]> {
    const { data } = await api.get('/requests/overdue');
    return data;
  },

  async getById(id: number): Promise<MaintenanceRequest> {
    const { data } = await api.get(`/requests/${id}`);
    return data;
  },

  async create(request: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    const { data } = await api.post('/requests', request);
    return data;
  },

  async update(id: number, request: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    const { data } = await api.patch(`/requests/${id}`, request);
    return data;
  },

  async updateStage(id: number, stage: string): Promise<MaintenanceRequest> {
    const { data } = await api.patch(`/requests/${id}/stage`, { stage });
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/requests/${id}`);
  },
};
