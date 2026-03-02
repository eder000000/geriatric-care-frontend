import apiClient from './client';

export interface AlertRule {
  id: string;
  patientId: string | null;
  vitalSignType: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  comparisonOperator: string;
  thresholdValue: number;
  thresholdValueMax: number | null;
  alertMessage: string;
  isActive: boolean;
  cooldownMinutes: number;
  createdAt: string;
}

export interface PatientAlert {
  id: string;
  patientId: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  triggeredAt: string;
}

export const alertService = {
  getAlertRules: async (): Promise<AlertRule[]> => {
    const response = await apiClient.get('/api/alert-rules');
    return response.data;
  },
  getActiveAlertRules: async (): Promise<AlertRule[]> => {
    const response = await apiClient.get('/api/alert-rules/active');
    return response.data;
  },
  getPatientAlerts: async (patientId: string): Promise<PatientAlert[]> => {
    const response = await apiClient.get(`/api/alerts/patient/${patientId}`);
    return response.data;
  },
};
