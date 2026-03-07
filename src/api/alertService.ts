import apiClient from './client';

export interface Alert {
  id: string;
  patientId: string;
  vitalSignId: string;
  triggeredRuleId: string;
  severity: string;
  message: string;
  triggeredAt: string;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  resolvedAt: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

export interface AlertRule {
  id: string;
  patientId: string | null;
  vitalSignType: string;
  severity: string;
  comparisonOperator: string;
  thresholdValue: number;
  thresholdValueMax: number | null;
  alertMessage: string;
  isActive: boolean;
  cooldownMinutes: number;
  createdAt: string;
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
