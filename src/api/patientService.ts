import apiClient from './client';

export interface PatientSummary {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const patientService = {
  getPatients: async (page = 0, size = 10): Promise<PageResponse<PatientSummary>> => {
    const response = await apiClient.get('/api/patients', { params: { page, size } });
    return response.data;
  },
};
