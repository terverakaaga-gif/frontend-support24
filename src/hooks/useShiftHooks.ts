import { useQuery, UseQueryResult } from '@tanstack/react-query';
import shiftService, { ShiftFilters } from '../api/services/shiftService';
import { Shift } from '../entities/Shift';

// Keys for React Query
export const shiftKeys = {
  all: ['shifts'] as const,
  lists: () => [...shiftKeys.all, 'list'] as const,
  list: (filters?: ShiftFilters) => [...shiftKeys.lists(), filters] as const,
  details: () => [...shiftKeys.all, 'detail'] as const,
  detail: (id: string) => [...shiftKeys.details(), id] as const,
  byShiftId: (shiftIdRef: string) => [...shiftKeys.all, 'byShiftId', shiftIdRef] as const,
};

// Hook to get all shifts with optional filters
export const useGetShifts = (filters?: ShiftFilters): UseQueryResult<Shift[]> => {
  return useQuery({
    queryKey: shiftKeys.list(filters),
    queryFn: () => shiftService.getShifts(filters),
  });
};

// Hook to get a specific shift by MongoDB ID
export const useGetShiftById = (id?: string): UseQueryResult<Shift> => {
  return useQuery({
    queryKey: shiftKeys.detail(id || ''),
    queryFn: () => shiftService.getShiftById(id || ''),
    enabled: !!id,
  });
};

// Hook to get shift by shiftId reference
export const useGetShiftByShiftId = (shiftIdRef?: string): UseQueryResult<Shift> => {
  return useQuery({
    queryKey: shiftKeys.byShiftId(shiftIdRef || ''),
    queryFn: () => shiftService.getShiftByShiftId(shiftIdRef || ''),
    enabled: !!shiftIdRef,
  });
};