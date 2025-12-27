import api from './api';

export interface Team {
  id: string;
  name: string;
  description?: string;
  color?: string;
  members?: any[];
  equipment?: any[];
}

export const teamService = {
  async getAll(): Promise<Team[]> {
    const { data } = await api.get('/maintenance-teams');
    return data.data || data; // Handle wrapped response
  },

  async getById(id: string): Promise<Team> {
    const { data } = await api.get(`/maintenance-teams/${id}`);
    return data.data || data; // Handle wrapped response
  },

  async getWorkload(id: string) {
    const { data } = await api.get(`/maintenance-teams/${id}/workload`);
    return data.data || data; // Handle wrapped response
  },

  async create(team: Partial<Team>): Promise<Team> {
    const { data } = await api.post('/maintenance-teams', team);
    return data.data || data; // Handle wrapped response
  },

  async update(id: string, team: Partial<Team>): Promise<Team> {
    const { data } = await api.patch(`/maintenance-teams/${id}`, team);
    return data.data || data; // Handle wrapped response
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/maintenance-teams/${id}`);
  },
};
