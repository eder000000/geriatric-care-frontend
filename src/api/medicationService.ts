import apiClient from './client';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
}

export const medicationService = {
  getMedications: async (): Promise<PageResponse<unknown>> => {
    const response = await apiClient.get('/api/medications', { params: { page: 0, size: 1 } });
    return response.data;
  },
};
