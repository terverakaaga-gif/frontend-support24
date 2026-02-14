import { get, post, patch, del } from '../apiClient';
import { 
  ServiceType, 
  CreateServiceTypeRequest, 
  UpdateServiceTypeRequest, 
  ServiceTypeFilters,
  ServiceTypeResponse,
  ServiceTypesResponse
} from '../../entities/ServiceType';

// Interface for the API response structure
interface ServiceTypesApiResponse {
  serviceTypes: ServiceType[];
}

interface ServiceTypeApiResponse {
  serviceType: ServiceType;
}

const serviceTypeService = {
  // Get all service types with optional filters
  getServiceTypes: async (filters?: ServiceTypeFilters): Promise<ServiceType[]> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/service-types?${queryString}` : '/service-types';
    
    // Get the response which contains { serviceTypes: [...] }
    const response = await get<ServiceTypesApiResponse>(url);
    
    // Return just the serviceTypes array
    return response.serviceTypes;
  },

  // Get active service types only
  getActiveServiceTypes: async (): Promise<ServiceType[]> => {
    const response = await get<ServiceTypesApiResponse>('/service-types/active');
    return response.serviceTypes;
  },

  // Get a specific service type by ID
  getServiceTypeById: async (id: string): Promise<ServiceType> => {
    const response = await get<ServiceTypeApiResponse>(`/service-types/${id}`);
    return response.serviceType;
  },

  // Create a new service type
  createServiceType: async (data: CreateServiceTypeRequest): Promise<ServiceType> => {
    const response = await post<ServiceTypeApiResponse>('/service-types', data);
    return response.serviceType;
  },

  // Update an existing service type
  updateServiceType: async (id: string, data: UpdateServiceTypeRequest): Promise<ServiceType> => {
    const response = await patch<ServiceTypeApiResponse>(`/service-types/${id}`, data);
    return response.serviceType;
  },

  // Delete a service type (soft delete - changes status to inactive)
  deleteServiceType: async (id: string): Promise<void> => {
    await del(`/service-types/${id}`);
  }
};

export default serviceTypeService; 