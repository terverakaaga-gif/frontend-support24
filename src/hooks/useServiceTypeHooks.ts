import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import serviceTypeService from '../api/services/serviceTypeService';
import { 
  ServiceType, 
  ServiceTypeFilters, 
  CreateServiceTypeRequest, 
  UpdateServiceTypeRequest 
} from '../entities/ServiceType';

// Query keys for React Query
export const serviceTypeKeys = {
  all: ['serviceTypes'] as const,
  lists: () => [...serviceTypeKeys.all, 'list'] as const,
  list: (filters?: ServiceTypeFilters) => [...serviceTypeKeys.lists(), filters] as const,
  details: () => [...serviceTypeKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceTypeKeys.details(), id] as const,
  active: () => [...serviceTypeKeys.all, 'active'] as const,
};

// Hook to get all service types with optional filters
export const useGetServiceTypes = (filters?: ServiceTypeFilters): UseQueryResult<ServiceType[]> => {
  return useQuery({
    queryKey: serviceTypeKeys.list(filters),
    queryFn: () => serviceTypeService.getServiceTypes(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get active service types only
export const useGetActiveServiceTypes = (): UseQueryResult<ServiceType[]> => {
  return useQuery({
    queryKey: serviceTypeKeys.active(),
    queryFn: () => serviceTypeService.getActiveServiceTypes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get a specific service type by ID
export const useGetServiceTypeById = (id?: string): UseQueryResult<ServiceType> => {
  return useQuery({
    queryKey: serviceTypeKeys.detail(id || ''),
    queryFn: () => serviceTypeService.getServiceTypeById(id || ''),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a new service type
export const useCreateServiceType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateServiceTypeRequest) => serviceTypeService.createServiceType(data),
    onSuccess: () => {
      // Invalidate and refetch service types
      queryClient.invalidateQueries({ queryKey: serviceTypeKeys.all });
      toast.success('Service type created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create service type');
    },
  });
};

// Hook to update an existing service type
export const useUpdateServiceType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceTypeRequest }) => 
      serviceTypeService.updateServiceType(id, data),
    onSuccess: (updatedServiceType) => {
      // Invalidate and refetch service types
      queryClient.invalidateQueries({ queryKey: serviceTypeKeys.all });
      // Update the specific service type in cache
      queryClient.setQueryData(
        serviceTypeKeys.detail(updatedServiceType._id), 
        updatedServiceType
      );
      toast.success('Service type updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update service type');
    },
  });
};

// Hook to delete a service type
export const useDeleteServiceType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => serviceTypeService.deleteServiceType(id),
    onSuccess: () => {
      // Invalidate and refetch service types
      queryClient.invalidateQueries({ queryKey: serviceTypeKeys.all });
      toast.success('Service type deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete service type');
    },
  });
}; 