import api from './api';

export interface Equipment {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  maintenanceTeamId: string;
  location?: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  status: 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'UNUSABLE';
  notes?: string;
  category?: any;
  maintenanceTeam?: any;
  maintenanceRequests?: any[];
}

export const equipmentService = {
  async getAll(filters?: {
    categoryId?: number;
    teamId?: number;
    status?: string;
  }): Promise<Equipment[]> {
    const { data } = await api.get('/equipment', { params: filters });
    return data.data || data; // Handle wrapped response
  },

  async getById(id: string): Promise<Equipment> {
    const { data } = await api.get(`/equipment/${id}`);
    return data.data || data; // Handle wrapped response
  },

  async getRequests(id: string) {
    const { data } = await api.get(`/equipment/${id}/requests`);
    return data.data || data; // Handle wrapped response
  },

  async create(equipment: Partial<Equipment>): Promise<Equipment> {
    const { data } = await api.post('/equipment', equipment);
    return data.data || data; // Handle wrapped response
  },

  async update(id: string, equipment: Partial<Equipment>): Promise<Equipment> {
    const { data } = await api.patch(`/equipment/${id}`, equipment);
    return data.data || data; // Handle wrapped response
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/equipment/${id}`);
  },
};
