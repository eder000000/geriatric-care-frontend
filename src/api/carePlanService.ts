import apiClient from './client';
export interface CarePlan {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  startDate: string;
  endDate: string | null;
  completionPercentage: number;
}
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
export const carePlanService = {
  getCarePlans: async (page = 0, size = 10): Promise<PageResponse<CarePlan>> => {
    const response = await apiClient.get('/api/care-plans', { params: { page, size } });
    return response.data;
  },
  create: async (data: Partial<CarePlan>): Promise<CarePlan> => {
    const response = await apiClient.post('/api/care-plans', data);
    return response.data;
  },
};
