// api/hooks/useTimesheetHooks.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { timesheetService } from '../api/services/timesheetService';
import { 
  ProcessedTimesheetData, 
  Timesheet, 
  TimesheetClientFilters, 
  TimesheetFilters,
  TimesheetSummary 
} from '../entities/Timesheet';

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
      const workerTimesheets = allTimesheetsQuery.data.filter(
        timesheet => timesheet.workerId._id === workerId
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