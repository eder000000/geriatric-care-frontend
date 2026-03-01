import apiClient from './client';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
}

export const carePlanService = {
  getCarePlans: async (): Promise<PageResponse<unknown>> => {
    const response = await apiClient.get('/api/care-plans', { params: { page: 0, size: 1 } });
    return response.data;
  },
};
