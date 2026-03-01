import apiClient from './client';

export interface Alert {
  id: string;
  patientName: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  triggeredAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
}

export const alertService = {
  getActiveAlerts: async (): Promise<PageResponse<Alert>> => {
    const response = await apiClient.get('/api/alerts', {
      params: { status: 'ACTIVE', page: 0, size: 5 }
    });
    return response.data;
  },
};
