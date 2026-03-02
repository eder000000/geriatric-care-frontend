import apiClient from './client';

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: string;
  manufacturer: string;
  expirationDate: string;
  quantityInStock: number;
  reorderLevel: number;
  isLowStock: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

export interface CreateMedicationRequest {
  name: string;
  genericName?: string;
  dosage: string;
  form?: string;
  manufacturer?: string;
  expirationDate?: string;
  quantityInStock: number;
  reorderLevel: number;
}

export const medicationService = {
  getMedications: async (): Promise<Medication[]> => {
    const response = await apiClient.get('/api/medications');
    return response.data;
  },
  getLowStock: async (): Promise<Medication[]> => {
    const response = await apiClient.get('/api/medications/low-stock');
    return response.data;
  },
  create: async (data: CreateMedicationRequest): Promise<Medication> => {
    const response = await apiClient.post('/api/medications', data);
    return response.data;
  },
  update: async (id: string, data: Partial<CreateMedicationRequest>): Promise<Medication> => {
    const response = await apiClient.put(`/api/medications/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/medications/${id}`);
  },
};
