import apiClient from './client';
export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  severity: string;
  message: string;
  isAcknowledged: boolean;
  createdAt: string;
  triggeredAt: string;
}
export interface AlertRule {
  id: string;
  name: string;
  type: string;
  severity: string;
  isActive: boolean;
  description: string | null;
  vitalSignType: string;
  comparisonOperator: string;
  thresholdValue: number;
  thresholdValueMax: number | null;
  cooldownMinutes: number;
}
export const alertService = {
  getActiveAlertRules: async (): Promise<AlertRule[]> => {
    const response = await apiClient.get('/api/alert-rules/active');
    return response.data;
  },
  getAlertRules: async (): Promise<AlertRule[]> => {
    const response = await apiClient.get('/api/alert-rules');
    return response.data;
  },
  getPatientAlerts: async (patientId: string): Promise<Alert[]> => {
    const response = await apiClient.get(`/api/alerts/patient/${patientId}`);
    return response.data;
  },
  acknowledge: async (id: string): Promise<void> => {
    await apiClient.post(`/api/alerts/${id}/acknowledge`);
  },
};
