import api from './api';

export interface Equipment {
  id: number;
  name: string;
  code: string;
  categoryId: number;
  maintenanceTeamId: number;
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
    return data;
  },

  async getById(id: number): Promise<Equipment> {
    const { data } = await api.get(`/equipment/${id}`);
    return data;
  },

  async getRequests(id: number) {
    const { data } = await api.get(`/equipment/${id}/requests`);
    return data;
  },

  async create(equipment: Partial<Equipment>): Promise<Equipment> {
    const { data } = await api.post('/equipment', equipment);
    return data;
  },

  async update(id: number, equipment: Partial<Equipment>): Promise<Equipment> {
    const { data } = await api.patch(`/equipment/${id}`, equipment);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/equipment/${id}`);
  },
};
