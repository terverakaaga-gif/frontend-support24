import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import rateTimeBandService from '../api/services/rateTimeBandService';
import { 
  RateTimeBand, 
  RateTimeBandFilters, 
  CreateRateTimeBandRequest, 
  UpdateRateTimeBandRequest 
} from '../entities/RateTimeBand';

// Query keys for React Query
export const rateTimeBandKeys = {
  all: ['rateTimeBands'] as const,
  lists: () => [...rateTimeBandKeys.all, 'list'] as const,
  list: (filters?: RateTimeBandFilters) => [...rateTimeBandKeys.lists(), filters] as const,
  details: () => [...rateTimeBandKeys.all, 'detail'] as const,
  detail: (id: string) => [...rateTimeBandKeys.details(), id] as const,
  active: () => [...rateTimeBandKeys.all, 'active'] as const,
};

// Hook to get all rate time bands with optional filters
export const useGetRateTimeBands = (filters?: RateTimeBandFilters): UseQueryResult<RateTimeBand[]> => {
  return useQuery({
    queryKey: rateTimeBandKeys.list(filters),
    queryFn: () => rateTimeBandService.getRateTimeBands(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get active rate time bands only
export const useGetActiveRateTimeBands = (): UseQueryResult<RateTimeBand[]> => {
  return useQuery({
    queryKey: rateTimeBandKeys.active(),
    queryFn: () => rateTimeBandService.getActiveRateTimeBands(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get a specific rate time band by ID
export const useGetRateTimeBandById = (id?: string): UseQueryResult<RateTimeBand> => {
  return useQuery({
    queryKey: rateTimeBandKeys.detail(id || ''),
    queryFn: () => rateTimeBandService.getRateTimeBandById(id || ''),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a new rate time band
export const useCreateRateTimeBand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRateTimeBandRequest) => rateTimeBandService.createRateTimeBand(data),
    onSuccess: () => {
      // Invalidate and refetch rate time bands
      queryClient.invalidateQueries({ queryKey: rateTimeBandKeys.all });
      toast.success('Rate time band created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create rate time band');
    },
  });
};

// Hook to update an existing rate time band
export const useUpdateRateTimeBand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRateTimeBandRequest }) => 
      rateTimeBandService.updateRateTimeBand(id, data),
    onSuccess: (updatedRateTimeBand) => {
      // Invalidate and refetch rate time bands
      queryClient.invalidateQueries({ queryKey: rateTimeBandKeys.all });
      // Update the specific rate time band in cache
      queryClient.setQueryData(
        rateTimeBandKeys.detail(updatedRateTimeBand._id), 
        updatedRateTimeBand
      );
      toast.success('Rate time band updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update rate time band');
    },
  });
};

// Hook to delete a rate time band
export const useDeleteRateTimeBand = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => rateTimeBandService.deleteRateTimeBand(id),
    onSuccess: () => {
      // Invalidate and refetch rate time bands
      queryClient.invalidateQueries({ queryKey: rateTimeBandKeys.all });
      toast.success('Rate time band deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete rate time band');
    },
  });
}; 