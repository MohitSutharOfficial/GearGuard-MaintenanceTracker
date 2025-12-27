import api from './api';

export const reportService = {
  async getDashboard() {
    const { data } = await api.get('/reports/dashboard');
    return data;
  },

  async getUtilization() {
    const { data } = await api.get('/reports/utilization');
    return data;
  },

  async getPerformance() {
    const { data } = await api.get('/reports/performance');
    return data;
  },

  async getCompliance() {
    const { data } = await api.get('/reports/compliance');
    return data;
  },
};
