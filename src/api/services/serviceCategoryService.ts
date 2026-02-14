import { get, post, patch, del } from '../apiClient';
import { 
  ServiceCategory, 
  CreateServiceCategoryRequest, 
  UpdateServiceCategoryRequest, 
  ServiceCategoryFilters,
  ServiceCategoriesResponse,
  ServiceCategoryResponse,
  ServiceCategoryStatisticsResponse,
  ServiceCategoryStatus
} from '../../entities/ServiceCategory';

const serviceCategoryService = {
  // Get all service categories with optional filters and pagination
  getServiceCategories: async (filters?: ServiceCategoryFilters): Promise<ServiceCategoriesResponse> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/service-categories?${queryString}` : '/service-categories';
    
    const response = await get<ServiceCategoriesResponse>(url);
    return response;
  },

  // Get service categories by status
  getServiceCategoriesByStatus: async (status: ServiceCategoryStatus): Promise<ServiceCategory[]> => {
    const response = await get<{ categories: ServiceCategory[] }>(`/service-categories/status/${status}`);
    return response.categories;
  },

  // Get a specific service category by ID
  getServiceCategoryById: async (id: string): Promise<ServiceCategory> => {
    const response = await get<ServiceCategoryResponse>(`/service-categories/${id}`);
    return response.category;
  },

  // Create a new service category
  createServiceCategory: async (data: CreateServiceCategoryRequest): Promise<ServiceCategory> => {
    const response = await post<ServiceCategoryResponse>('/service-categories', data);
    return response.category;
  },

  // Update an existing service category
  updateServiceCategory: async (id: string, data: UpdateServiceCategoryRequest): Promise<ServiceCategory> => {
    const response = await patch<ServiceCategoryResponse>(`/service-categories/${id}`, data);
    return response.category;
  },

  // Delete a service category
  deleteServiceCategory: async (id: string): Promise<void> => {
    await del(`/service-categories/${id}`);
  },

  // Get service category statistics
  getServiceCategoryStatistics: async (): Promise<ServiceCategoryStatisticsResponse> => {
    const response = await get<ServiceCategoryStatisticsResponse>('/service-categories/statistics');
    return response;
  }
};

export default serviceCategoryService;
