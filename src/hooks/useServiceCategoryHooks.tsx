import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import serviceCategoryService from '../api/services/serviceCategoryService';
import { 
  ServiceCategory, 
  ServiceCategoryFilters, 
  CreateServiceCategoryRequest, 
  UpdateServiceCategoryRequest,
  ServiceCategoriesResponse,
  ServiceCategoryStatisticsResponse,
  ServiceCategoryStatus
} from '../entities/ServiceCategory';

// Query keys for React Query
export const serviceCategoryKeys = {
  all: ['serviceCategories'] as const,
  lists: () => [...serviceCategoryKeys.all, 'list'] as const,
  list: (filters?: ServiceCategoryFilters) => [...serviceCategoryKeys.lists(), filters] as const,
  details: () => [...serviceCategoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceCategoryKeys.details(), id] as const,
  byStatus: (status: ServiceCategoryStatus) => [...serviceCategoryKeys.all, 'status', status] as const,
  statistics: () => [...serviceCategoryKeys.all, 'statistics'] as const,
};

// Hook to get all service categories with optional filters and pagination
export const useGetServiceCategories = (filters?: ServiceCategoryFilters): UseQueryResult<ServiceCategoriesResponse> => {
  return useQuery({
    queryKey: serviceCategoryKeys.list(filters),
    queryFn: () => serviceCategoryService.getServiceCategories(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get service categories by status
export const useGetServiceCategoriesByStatus = (status: ServiceCategoryStatus): UseQueryResult<ServiceCategory[]> => {
  return useQuery({
    queryKey: serviceCategoryKeys.byStatus(status),
    queryFn: () => serviceCategoryService.getServiceCategoriesByStatus(status),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get a specific service category by ID
export const useGetServiceCategoryById = (id?: string): UseQueryResult<ServiceCategory> => {
  return useQuery({
    queryKey: serviceCategoryKeys.detail(id || ''),
    queryFn: () => serviceCategoryService.getServiceCategoryById(id || ''),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get service category statistics
export const useGetServiceCategoryStatistics = (): UseQueryResult<ServiceCategoryStatisticsResponse> => {
  return useQuery({
    queryKey: serviceCategoryKeys.statistics(),
    queryFn: () => serviceCategoryService.getServiceCategoryStatistics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a new service category
export const useCreateServiceCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateServiceCategoryRequest) => serviceCategoryService.createServiceCategory(data),
    onSuccess: () => {
      // Invalidate and refetch service categories
      queryClient.invalidateQueries({ queryKey: serviceCategoryKeys.all });
      toast.success('Service category created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create service category');
    },
  });
};

// Hook to update an existing service category
export const useUpdateServiceCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceCategoryRequest }) => 
      serviceCategoryService.updateServiceCategory(id, data),
    onSuccess: (updatedCategory) => {
      // Invalidate and refetch service categories
      queryClient.invalidateQueries({ queryKey: serviceCategoryKeys.all });
      // Update the specific service category in cache
      queryClient.setQueryData(
        serviceCategoryKeys.detail(updatedCategory._id), 
        updatedCategory
      );
      toast.success('Service category updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update service category');
    },
  });
};

// Hook to delete a service category
export const useDeleteServiceCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => serviceCategoryService.deleteServiceCategory(id),
    onSuccess: () => {
      // Invalidate and refetch service categories
      queryClient.invalidateQueries({ queryKey: serviceCategoryKeys.all });
      toast.success('Service category deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete service category');
    },
  });
};
