// src/hooks/useAnalyticsHooks.ts
import { useQuery, useMutation, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import analyticsService, {
  AdminOverviewAnalytics,
  AdminUserAnalytics,
  AdminFinancialAnalytics,
  PlatformSummary,
  RealTimeMetrics,
  AnalyticsFilters,
  ExportOptions
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