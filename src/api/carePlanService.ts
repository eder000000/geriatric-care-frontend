import apiClient from './client';

export interface CarePlan {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  patientId: string;
  patientName: string;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface CreateCarePlanRequest {
  patientId: string;
  title: string;
  description?: string;
  priority: string;
  startDate: string;
  endDate?: string;
}

export const carePlanService = {
  getCarePlans: async (page = 0, size = 10): Promise<PageResponse<CarePlan>> => {
    const response = await apiClient.get('/api/care-plans', { params: { page, size } });
    return response.data;
  },
  getByPatient: async (patientId: string): Promise<PageResponse<CarePlan>> => {
    const response = await apiClient.get('/api/care-plans', { params: { patientId, page: 0, size: 20 } });
    return response.data;
  },
  create: async (data: CreateCarePlanRequest): Promise<CarePlan> => {
    const response = await apiClient.post('/api/care-plans', data);
    return response.data;
  },
  activate: async (id: string): Promise<CarePlan> => {
    const response = await apiClient.patch(`/api/care-plans/${id}/activate`);
    return response.data;
  },
  complete: async (id: string): Promise<CarePlan> => {
    const response = await apiClient.patch(`/api/care-plans/${id}/complete`);
    return response.data;
  },
};
