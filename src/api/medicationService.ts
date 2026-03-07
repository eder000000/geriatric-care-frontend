import apiClient from './client';

export type MedicationForm = 'TABLET' | 'CAPSULE' | 'LIQUID' | 'INJECTION' | 'TOPICAL';

export interface Medication {
  id: string;
  name: string;
  genericName: string | null;
  dosage: string;
  form: MedicationForm;
  manufacturer: string | null;
  quantityInStock: number;
  reorderLevel: number;
  expirationDate: string | null;
  isLowStock: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
  isActive: boolean;
}

export interface CreateMedicationRequest {
  name: string;
  genericName?: string;
  dosage: string;
  form: MedicationForm;
  manufacturer?: string;
  quantityInStock: number;
  reorderLevel: number;
  expirationDate: string;
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
