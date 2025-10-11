// src/hooks/useAnalyticsHooks.ts
import { useQuery, useMutation, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import analyticsService, {
  AdminOverviewAnalytics,
  AdminUserAnalytics,
  AdminFinancialAnalytics,
  PlatformSummary,
  RealTimeMetrics,
  AnalyticsFilters,
  ExportOptions,
  ParticipantOverviewAnalytics,
  ParticipantServiceAnalytics,
  SupportWorkerOverviewAnalytics,
  SupportWorkerFinancialAnalytics,
  SupportWorkerScheduleAnalytics,
  SupportWorkerPerformanceAnalytics
} from '../api/services/analyticsService';
import { DateRange } from '../entities/Analytics';
import { toast } from 'sonner';

// Query keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: (dateRange?: DateRange, comparison?: boolean) => 
    [...analyticsKeys.all, 'overview', dateRange, comparison] as const,
  userAnalytics: (dateRange?: DateRange) => 
    [...analyticsKeys.all, 'user-analytics', dateRange] as const,
  financialAnalytics: (dateRange?: DateRange) => 
    [...analyticsKeys.all, 'financial-analytics', dateRange] as const,
  filteredAnalytics: (filters?: AnalyticsFilters) => 
    [...analyticsKeys.all, 'filtered', filters] as const,
  platformSummary: (dateRange?: DateRange) => 
    [...analyticsKeys.all, 'platform-summary', dateRange] as const,
  realTimeMetrics: () => 
    [...analyticsKeys.all, 'real-time'] as const,
  participantOverview: (dateRange?: string, comparison?: boolean) => 
    [...analyticsKeys.all, 'participant-overview', dateRange, comparison] as const,
  participantServices: (dateRange?: string) => 
    [...analyticsKeys.all, 'participant-services', dateRange] as const,
  supportWorkerFinancial: (dateRange?: string) => 
    [...analyticsKeys.all, 'support-worker-financial', dateRange] as const,
  supportWorkerSchedule: (dateRange?: string) => 
    [...analyticsKeys.all, 'support-worker-schedule', dateRange] as const,
  supportWorkerOverview: (dateRange?: string | { start: string; end: string }, comparison?: boolean) => 
    [...analyticsKeys.all, 'support-worker-overview', dateRange, comparison] as const,
  supportWorkerPerformance: (dateRange?: string | { start: string; end: string }, comparison?: boolean) => 
    [...analyticsKeys.all, 'support-worker-performance', dateRange, comparison] as const,
  // ...existing code...
};

// Hook to get dashboard overview analytics
export const useGetDashboardOverview = (
  dateRange: DateRange,
  comparison: boolean = true,
  enabled: boolean = true
): UseQueryResult<AdminOverviewAnalytics> => {
  return useQuery({
    queryKey: analyticsKeys.overview(dateRange, comparison),
    queryFn: () => analyticsService.getDashboardOverview(dateRange, comparison),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook to get user analytics
export const useGetUserAnalytics = (
  dateRange: DateRange,
  enabled: boolean = true
): UseQueryResult<AdminUserAnalytics> => {
  return useQuery({
    queryKey: analyticsKeys.userAnalytics(dateRange),
    queryFn: () => analyticsService.getUserAnalytics(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook to get financial analytics
export const useGetFinancialAnalytics = (
  dateRange: DateRange,
  enabled: boolean = true
): UseQueryResult<AdminFinancialAnalytics> => {
  return useQuery({
    queryKey: analyticsKeys.financialAnalytics(dateRange),
    queryFn: () => analyticsService.getFinancialAnalytics(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook to get filtered analytics
export const useGetFilteredAnalytics = (
  filters: AnalyticsFilters,
  enabled: boolean = true
): UseQueryResult<any> => {
  return useQuery({
    queryKey: analyticsKeys.filteredAnalytics(filters),
    queryFn: () => analyticsService.getFilteredAnalytics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook to get platform summary
export const useGetPlatformSummary = (
  dateRange: DateRange,
  enabled: boolean = true
): UseQueryResult<PlatformSummary> => {
  return useQuery({
    queryKey: analyticsKeys.platformSummary(dateRange),
    queryFn: () => analyticsService.getPlatformSummary(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook to get real-time metrics
export const useGetRealTimeMetrics = (
  enabled: boolean = true,
  refetchInterval: number = 60000 // 1 minute
): UseQueryResult<RealTimeMetrics> => {
  return useQuery({
    queryKey: analyticsKeys.realTimeMetrics(),
    queryFn: () => analyticsService.getRealTimeMetrics(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval,
    enabled
  });
};

// Hook to export analytics data
export const useExportAnalyticsData = (): UseMutationResult<
  Blob,
  Error,
  ExportOptions
> => {
  return useMutation({
    mutationFn: (options: ExportOptions) => analyticsService.exportAnalyticsData(options),
    onSuccess: (data, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      
      // Set file name based on format
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `analytics-export-${timestamp}.${variables.format === 'excel' ? 'xlsx' : variables.format}`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Export completed successfully in ${variables.format.toUpperCase()} format`);
    },
    onError: (error) => {
      console.error('Export failed:', error);
      toast.error('Failed to export analytics data. Please try again.');
    }
  });
};

// Hook to get participant overview analytics
export const useGetParticipantOverview = (
  dateRange: string = 'month',
  comparison: boolean = true,
  enabled: boolean = true
): UseQueryResult<ParticipantOverviewAnalytics> => {
  return useQuery({
    queryKey: analyticsKeys.participantOverview(dateRange, comparison),
    queryFn: () => analyticsService.getParticipantOverview(dateRange, comparison),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook to get participant service analytics
export const useGetParticipantServices = (
  dateRange: string = 'month',
  enabled: boolean = true
): UseQueryResult<ParticipantServiceAnalytics> => {
  return useQuery({
    queryKey: analyticsKeys.participantServices(dateRange),
    queryFn: () => analyticsService.getParticipantServices(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook to get support worker overview analytics
export const useGetSupportWorkerOverview = (
  dateRange: string | { start: string; end: string } = 'month',
  comparison: boolean = true,
  enabled: boolean = true
): UseQueryResult<SupportWorkerOverviewAnalytics> => {
  return useQuery({
    queryKey: analyticsKeys.supportWorkerOverview(dateRange, comparison),
    queryFn: () => analyticsService.getSupportWorkerOverview(dateRange, comparison),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook to get support worker financial analytics
export const useGetSupportWorkerFinancial = (
  dateRange: string = 'month',
  enabled: boolean = true
): UseQueryResult<SupportWorkerFinancialAnalytics> => {
  return useQuery({
    queryKey: analyticsKeys.supportWorkerFinancial(dateRange),
    queryFn: () => analyticsService.getSupportWorkerFinancial(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook to get support worker schedule analytics
export const useGetSupportWorkerSchedule = (
  dateRange: string = 'month',
  enabled: boolean = true
): UseQueryResult<SupportWorkerScheduleAnalytics> => {
  return useQuery({
    queryKey: analyticsKeys.supportWorkerSchedule(dateRange),
    queryFn: () => analyticsService.getSupportWorkerSchedule(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook to get support worker performance analytics
export const useGetSupportWorkerPerformance = (
  dateRange: string | { start: string; end: string } = 'month',
  enabled: boolean = true
): UseQueryResult<SupportWorkerPerformanceAnalytics> => {
  return useQuery({
    queryKey: analyticsKeys.supportWorkerPerformance(dateRange),
    queryFn: () => analyticsService.getSupportWorkerPerformance(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};