import apiClient from './client';

export interface Medication {
  id: string;
  name: string;
  isLowStock: boolean;
  isExpired: boolean;
}

export const medicationService = {
  getMedications: async (): Promise<Medication[]> => {
    const response = await apiClient.get('/api/medications');
    return response.data;
  },
};
