// api/hooks/useTimesheetHooks.ts
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { timesheetService } from '../api/services/timesheetService';
import { 
  ProcessedTimesheetData, 
  Timesheet, 
  TimesheetClientFilters, 
  TimesheetFilters,
  TimesheetSummary 
} from '../entities/Timesheet';
import { post } from '@/api/apiClient';
import { toast } from 'sonner';

// Query keys for cache management
export const timesheetKeys = {
  all: ['timesheets'] as const,
  lists: () => [...timesheetKeys.all, 'list'] as const,
  list: (filters?: TimesheetClientFilters) => [...timesheetKeys.lists(), filters] as const,
  details: () => [...timesheetKeys.all, 'detail'] as const,
  detail: (id: string) => [...timesheetKeys.details(), id] as const,
  summary: (filters?: TimesheetFilters) => [...timesheetKeys.all, 'summary', filters] as const,
  raw: (filters?: TimesheetFilters) => [...timesheetKeys.all, 'raw', filters] as const,
};

// Hook to get processed timesheets with client-side filtering, sorting, and pagination
export const useGetTimesheets = (
  filters?: TimesheetClientFilters
): UseQueryResult<ProcessedTimesheetData> => {
  return useQuery({
    queryKey: timesheetKeys.list(filters),
    queryFn: () => timesheetService.getTimesheets(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes (timesheets change more frequently)
    placeholderData: (previousData) => previousData, // Keep previous data while refetching
  });
};

// Hook to get a single timesheet by ID
export const useGetTimesheet = (
  timesheetId: string,
  enabled: boolean = true
): UseQueryResult<Timesheet> => {
  return useQuery({
    queryKey: timesheetKeys.detail(timesheetId),
    queryFn: () => timesheetService.getTimesheetById(timesheetId),
    enabled: enabled && !!timesheetId,
    staleTime: 5 * 60 * 1000, // 5 minutes (individual timesheet details don't change often)
  });
};

// Hook to get all timesheets without processing (useful for exports, statistics)
export const useGetAllTimesheets = (
  filters?: TimesheetFilters,
  enabled: boolean = true
): UseQueryResult<Timesheet[]> => {
  return useQuery({
    queryKey: timesheetKeys.raw(filters),
    queryFn: () => timesheetService.getAllTimesheets(filters),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get timesheet summary statistics
export const useGetTimesheetSummary = (
  filters?: TimesheetFilters,
  enabled: boolean = true
): UseQueryResult<TimesheetSummary> => {
  return useQuery({
    queryKey: timesheetKeys.summary(filters),
    queryFn: () => timesheetService.getTimesheetSummary(filters),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for real-time timesheet processing (useful for complex filtering UIs)
export const useProcessTimesheets = (
  timesheets: Timesheet[] | undefined,
  filters: TimesheetClientFilters
): ProcessedTimesheetData | undefined => {
  if (!timesheets) return undefined;
  
  return timesheetService.processTimesheets(timesheets, filters);
};

// Utility hook for timesheet status counts
export const useTimesheetStatusCounts = (
  filters?: TimesheetFilters
): UseQueryResult<Record<string, number>> => {
  return useQuery({
    queryKey: [...timesheetKeys.summary(filters), 'status-counts'],
    queryFn: async () => {
      const summary = await timesheetService.getTimesheetSummary(filters);
      return {
        total: summary.totalTimesheets,
        pending: summary.pendingCount,
        approved: summary.approvedCount,
        rejected: summary.rejectedCount,
        revised: summary.totalTimesheets - summary.pendingCount - summary.approvedCount - summary.rejectedCount,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for participant-specific timesheets
export const useGetParticipantTimesheets = (
  participantId: string,
  additionalFilters?: Omit<TimesheetClientFilters, 'participantId'>,
  enabled: boolean = true
): UseQueryResult<ProcessedTimesheetData> => {
  const filters: TimesheetClientFilters = {
    ...additionalFilters,
    participantId,
  };

  return useQuery({
    queryKey: [...timesheetKeys.all, 'participant', participantId, additionalFilters],
    queryFn: () => timesheetService.getTimesheets(filters),
    enabled: enabled && !!participantId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for worker-specific timesheets (client-side filtering by workerId)
export const useGetWorkerTimesheets = (
  workerId: string,
  additionalFilters?: TimesheetClientFilters,
  enabled: boolean = true
): UseQueryResult<ProcessedTimesheetData> => {
  const allTimesheetsQuery = useGetAllTimesheets(additionalFilters, enabled && !!workerId);

  return useQuery({
    queryKey: [...timesheetKeys.all, 'worker', workerId, additionalFilters],
    queryFn: async () => {
      if (!allTimesheetsQuery.data) {
        throw new Error('All timesheets data not available');
      }

      // Filter by worker ID on the client side
      // Handle both string workerId and object workerId cases
      const workerTimesheets = allTimesheetsQuery.data.filter(
        timesheet => {
          const timesheetWorkerId = typeof timesheet.workerId === 'string' 
            ? timesheet.workerId 
            : timesheet.workerId._id;
          return timesheetWorkerId === workerId;
        }
      );

      return timesheetService.processTimesheets(workerTimesheets, additionalFilters || {});
    },
    enabled: enabled && !!workerId && !!allTimesheetsQuery.data,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for organization-specific timesheets (client-side filtering)
export const useGetOrganizationTimesheets = (
  organizationId: string,
  additionalFilters?: TimesheetClientFilters,
  enabled: boolean = true
): UseQueryResult<ProcessedTimesheetData> => {
  const allTimesheetsQuery = useGetAllTimesheets(additionalFilters, enabled && !!organizationId);

  return useQuery({
    queryKey: [...timesheetKeys.all, 'organization', organizationId, additionalFilters],
    queryFn: async () => {
      if (!allTimesheetsQuery.data) {
        throw new Error('All timesheets data not available');
      }

      // Filter by organization ID on the client side
      const orgTimesheets = allTimesheetsQuery.data.filter(
        timesheet => timesheet.organizationId._id === organizationId
      );

      return timesheetService.processTimesheets(orgTimesheets, additionalFilters || {});
    },
    enabled: enabled && !!organizationId && !!allTimesheetsQuery.data,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to create a new timesheet
 */
export const useCreateTimesheet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => post('/timesheets', data),
    onSuccess: () => {
      // Invalidate and refetch timesheets
      queryClient.invalidateQueries({ queryKey: timesheetKeys.all });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create timesheet';
      console.error('Create timesheet error:', error);
    },
  });
};

/**
 * Approve timesheets for review
 * @param timesheetId string of timesheet ID to approve
 */
export const useApproveTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timesheetId: string) => 
      post(`/timesheets/${timesheetId}/approve`, ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timesheetKeys.all });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to accept timesheets';
      console.error('Accept timesheets error:', error, errorMessage);
    },
  });
}

/* Reject timesheets for review
 * @param timesheetId string of timesheet ID to reject
 */
export const useRejectTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timesheetId: string) => 
      post(`/timesheets/${timesheetId}/reject`, ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timesheetKeys.all });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Failed to reject timesheets';
      console.error('Reject timesheets error:', error, errorMessage);
    },
  });
}