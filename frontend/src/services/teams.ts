import api from './api';

export interface Team {
  id: number;
  name: string;
  description?: string;
  color?: string;
  members?: any[];
  equipment?: any[];
}

export const teamService = {
  async getAll(): Promise<Team[]> {
    const { data } = await api.get('/teams');
    return data;
  },

  async getById(id: number): Promise<Team> {
    const { data } = await api.get(`/teams/${id}`);
    return data;
  },

  async getWorkload(id: number) {
    const { data } = await api.get(`/teams/${id}/workload`);
    return data;
  },

  async create(team: Partial<Team>): Promise<Team> {
    const { data } = await api.post('/teams', team);
    return data;
  },

  async update(id: number, team: Partial<Team>): Promise<Team> {
    const { data } = await api.patch(`/teams/${id}`, team);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/teams/${id}`);
  },
};
