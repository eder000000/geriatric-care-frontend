import apiClient from './client';

export interface AlertRule {
  id: string;
  name: string;
  isActive: boolean;
}

export const alertService = {
  // Get count of active alert rules as a proxy for "active alerts"
  getActiveAlertRules: async (): Promise<AlertRule[]> => {
    const response = await apiClient.get('/api/alert-rules/active');
    return response.data;
  },
};
