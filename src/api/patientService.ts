import apiClient from './client';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  medicalConditions: string;
  emergencyContact: string;
  emergencyPhone: string;
  isActive: boolean;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const patientService = {
  getPatients: async (page = 0, size = 10, search?: string): Promise<PageResponse<Patient>> => {
    const params: Record<string, unknown> = { page, size };
    if (search) params.search = search;
    const response = await apiClient.get('/api/patients', { params });
    return response.data;
  },
  getPatient: async (id: string): Promise<Patient> => {
    const response = await apiClient.get(`/api/patients/${id}`);
    return response.data;
  },
  createPatient: async (data: Partial<Patient>): Promise<Patient> => {
    const response = await apiClient.post('/api/patients', data);
    return response.data;
  },
  updatePatient: async (id: string, data: Partial<Patient>): Promise<Patient> => {
    const response = await apiClient.put(`/api/patients/${id}`, data);
    return response.data;
  },
  deactivatePatient: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/patients/${id}/deactivate`);
  },
};
