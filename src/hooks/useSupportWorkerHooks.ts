import { useMutation, useQuery, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import supportWorkerService, { 
  SupportWorkerProfileInput, 
  AvailabilityInput 
} from '../api/services/supportWorkerService';
import { 
  SupportWorker, 
  Availability, 
  Experience,
  VerificationStatus
} from '../types/user.types';

// Keys for React Query
export const supportWorkerKeys = {
  all: ['supportWorker'] as const,
  profile: () => [...supportWorkerKeys.all, 'profile'] as const,
  experience: () => [...supportWorkerKeys.all, 'experience'] as const,
  availability: () => [...supportWorkerKeys.all, 'availability'] as const,
  list: () => [...supportWorkerKeys.all, 'list'] as const,
  detail: (id: string) => [...supportWorkerKeys.all, 'detail', id] as const,
};

// Hook to get support worker profile
export const useGetSupportWorkerProfile = (): UseQueryResult<SupportWorker> => {
  return useQuery({
    queryKey: supportWorkerKeys.profile(),
    queryFn: () => supportWorkerService.getProfile(),
  });
};

// Hook to update support worker profile
export const useUpdateSupportWorkerProfile = (): UseMutationResult<
  SupportWorker, 
  Error, 
  SupportWorkerProfileInput
> => {
  return useMutation({
    mutationFn: (data: SupportWorkerProfileInput) => supportWorkerService.updateProfile(data),
    // Invalidate and refetch profile after mutation
    onSuccess: () => {
      // Invalidate could be handled at a higher level if needed
    },
  });
};

// Hook to update support worker availability
export const useUpdateAvailability = (): UseMutationResult<
  Availability, 
  Error, 
  AvailabilityInput[]
> => {
  return useMutation({
    mutationFn: (data: AvailabilityInput[]) => supportWorkerService.updateAvailability(data),
  });
};

// Hook to add work experience
export const useAddExperience = (): UseMutationResult<
  Experience, 
  Error, 
  Omit<Experience, '_id'>
> => {
  return useMutation({
    mutationFn: (data: Omit<Experience, '_id'>) => supportWorkerService.addExperience(data),
  });
};

// Hook to update work experience
export const useUpdateExperience = (): UseMutationResult<
  Experience, 
  Error, 
  { id: string; data: Omit<Experience, '_id'> }
> => {
  return useMutation({
    mutationFn: ({ id, data }) => supportWorkerService.updateExperience(id, data),
  });
};

// Hook to complete profile setup
export const useCompleteProfileSetup = (): UseMutationResult<
  VerificationStatus, 
  Error, 
  void
> => {
  return useMutation({
    mutationFn: () => supportWorkerService.completeProfileSetup(),
  });
};

// Hook to get all available support workers
export const useGetAllSupportWorkers = (): UseQueryResult<SupportWorker[]> => {
  return useQuery({
    queryKey: supportWorkerKeys.list(),
    queryFn: () => supportWorkerService.getAllAvailable(),
  });
};

// Hook to get support worker by ID
export const useGetSupportWorkerById = (id: string): UseQueryResult<SupportWorker> => {
  return useQuery({
    queryKey: supportWorkerKeys.detail(id),
    queryFn: () => supportWorkerService.getById(id),
    // Only fetch if ID is provided
    enabled: !!id,
  });
};