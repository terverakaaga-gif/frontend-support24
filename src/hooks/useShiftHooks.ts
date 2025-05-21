import { useMutation, useQuery, useQueryClient, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import shiftService, { 
//   CreateShiftInput, 
//   UpdateShiftInput, 
//   ShiftStatusUpdateInput, 
//   CancelShiftInput,
  ShiftFilters 
} from '../api/services/shiftService';
import { Shift } from '../entities/Shift';

// Keys for React Query
export const shiftKeys = {
  all: ['shifts'] as const,
  lists: () => [...shiftKeys.all, 'list'] as const,
  list: (filters?: ShiftFilters) => [...shiftKeys.lists(), filters] as const,
  myShifts: () => [...shiftKeys.all, 'my-shifts'] as const,
  myShiftsList: (filters?: ShiftFilters) => [...shiftKeys.myShifts(), filters] as const,
  assignedShifts: () => [...shiftKeys.all, 'assigned-shifts'] as const,
  assignedShiftsList: (filters?: ShiftFilters) => [...shiftKeys.assignedShifts(), filters] as const,
  details: () => [...shiftKeys.all, 'detail'] as const,
  detail: (shiftId: string) => [...shiftKeys.details(), shiftId] as const,
  detailRef: (shiftIdRef: string) => [...shiftKeys.details(), shiftIdRef] as const,
};

// Hook to get all shifts with optional filters
export const useGetShifts = (filters?: ShiftFilters): UseQueryResult<Shift[]> => {
  return useQuery({
    queryKey: shiftKeys.list(filters),
    queryFn: () => shiftService.getShifts(filters),
  });
};

// Hook to get a specific shift by Shift ID
export const useGetShiftById = (shiftId?: string): UseQueryResult<Shift> => {
  return useQuery({
    queryKey: shiftKeys.detail(shiftId || ''),
    queryFn: () => shiftService.getShiftById(shiftId || ''),
    enabled: !!shiftId,
  });
};

// Hook to get a specific shift by ID
export const useGetShiftByShiftIdRef = (shiftIdRef?: string): UseQueryResult<Shift> => {
  return useQuery({
    queryKey: shiftKeys.detailRef(shiftIdRef || ''),
    queryFn: () => shiftService.getShiftByShifIdRef(shiftIdRef || ''),
    enabled: !!shiftIdRef,
  });
};

// Hook to create a new shift
// export const useCreateShift = (): UseMutationResult
//   Shift, 
//   Error, 
//   CreateShiftInput
// > => {
//   return useMutation({
//     mutationFn: (data: CreateShiftInput) => shiftService.createShift(data),
//     onSuccess: () => {
//       // Invalidate lists to refresh data
//       queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.myShifts() });
//     },
//   });
// };

// Hook to update a shift
// export const useUpdateShift = (): UseMutationResult
//   Shift, 
//   Error, 
//   { id: string; data: UpdateShiftInput }
// > => {
//   return useMutation({
//     mutationFn: ({ id, data }) => shiftService.updateShift(id, data),
//     onSuccess: (data) => {
//       // Invalidate lists and the specific shift
//       queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.myShifts() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.assignedShifts() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.detail(data._id) });
//     },
//   });
// };

// Hook to update shift status
// export const useUpdateShiftStatus = (): UseMutationResult
//   Shift, 
//   Error, 
//   { id: string; data: ShiftStatusUpdateInput }
// > => {
//   return useMutation({
//     mutationFn: ({ id, data }) => shiftService.updateShiftStatus(id, data),
//     onSuccess: (data) => {
//       // Invalidate lists and the specific shift
//       queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.myShifts() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.assignedShifts() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.detail(data._id) });
//     },
//   });
// };

// Hook to cancel a shift
// export const useCancelShift = (): UseMutationResult
//   Shift, 
//   Error, 
//   { id: string; data: CancelShiftInput }
// > => {
//   return useMutation({
//     mutationFn: ({ id, data }) => shiftService.cancelShift(id, data),
//     onSuccess: (data) => {
//       // Invalidate lists and the specific shift
//       queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.myShifts() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.assignedShifts() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.detail(data._id) });
//     },
//   });
// };

// Hook to complete a shift
// export const useCompleteShift = (): UseMutationResult
//   Shift, 
//   Error, 
//   string
// > => {
//   return useMutation({
//     mutationFn: (id: string) => shiftService.completeShift(id),
//     onSuccess: (data) => {
//       // Invalidate lists and the specific shift
//       queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.myShifts() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.assignedShifts() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.detail(data._id) });
//     },
//   });
// };

// Hook to delete a shift
// export const useDeleteShift = (): UseMutationResult
//   void, 
//   Error, 
//   string
// > => {
//   return useMutation({
//     mutationFn: (id: string) => shiftService.deleteShift(id),
//     onSuccess: () => {
//       // Invalidate lists 
//       queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.myShifts() });
//       queryClient.invalidateQueries({ queryKey: shiftKeys.assignedShifts() });
//     },
//   });
// };

// Hook for participants to get their own shifts
// export const useGetMyShifts = (filters?: ShiftFilters): UseQueryResult<Shift[]> => {
//   return useQuery({
//     queryKey: shiftKeys.myShiftsList(filters),
//     queryFn: () => shiftService.getMyShifts(filters),
//   });
// };

// Hook for support workers to get shifts assigned to them
// export const useGetMyAssignedShifts = (filters?: ShiftFilters): UseQueryResult<Shift[]> => {
//   return useQuery({
//     queryKey: shiftKeys.assignedShiftsList(filters),
//     queryFn: () => shiftService.getMyAssignedShifts(filters),
//   });
// };