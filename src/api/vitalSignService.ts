import apiClient from './client';

export interface VitalSign {
  id: string;
  patientId: string;
  measuredAt: string;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  heartRate: number | null;
  temperature: number | null;
  respiratoryRate: number | null;
  oxygenSaturation: number | null;
  notes: string | null;
  recordedBy: string;
}

export interface CreateVitalSignRequest {
  patientId: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  notes?: string;
}

export const vitalSignService = {
  getByPatient: async (patientId: string): Promise<VitalSign[]> => {
    const response = await apiClient.get(`/api/vital-signs/patient/${patientId}`);
    return response.data;
  },
  getLatest: async (patientId: string): Promise<VitalSign> => {
    const response = await apiClient.get(`/api/vital-signs/patient/${patientId}/latest`);
    return response.data;
  },
  create: async (data: CreateVitalSignRequest): Promise<VitalSign> => {
    const response = await apiClient.post('/api/vital-signs', data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/vital-signs/${id}`);
  },
};
