import apiClient from './client';
export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: string;
  manufacturer: string;
  quantityInStock: number;
  expirationDate: string | null;
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
  reorderLevel?: number;
  quantityInStock?: number;
  expirationDate?: string;
}
export const medicationService = {
  getMedications: async (): Promise<Medication[]> => {
    const response = await apiClient.get('/api/medications');
    return response.data;
  },
  create: async (data: CreateMedicationRequest): Promise<Medication> => {
    const response = await apiClient.post('/api/medications', data);
    return response.data;
  },
};
