import apiClient from './client';

export type CarePlanPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CarePlanStatus = 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface CarePlan {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string | null;
  status: CarePlanStatus;
  priority: CarePlanPriority;
  startDate: string;
  endDate: string | null;
  completionPercentage: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateCarePlanRequest {
  patientId: string;
  title: string;
  description?: string;
  priority: CarePlanPriority;
  startDate: string;
  endDate?: string;
}

export const carePlanService = {
  getCarePlans: async (page = 0, size = 10): Promise<PageResponse<CarePlan>> => {
    const response = await apiClient.get('/api/care-plans', { params: { page, size } });
    return response.data;
  },
  create: async (data: CreateCarePlanRequest): Promise<CarePlan> => {
    const response = await apiClient.post('/api/care-plans', data);
    return response.data;
  },
};
