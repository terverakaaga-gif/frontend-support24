import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

import {
  ISearchSupportWorkersResponse,
  participantService,
  ISearchSupportWorkerResponse,
  WorkerSearchFilters,
  FilterOptions,
} from "@/api/services/participantService";
import { IInvitationRequest } from "@/entities/Invitation";
import inviteService from "@/api/services/inviteService";
import {
  Organization,
  organizationService,
} from "@/api/services/organizationService";

// Legacy interface for backward compatibility
export interface SupportWorkerFilters {
  skills?: string[];
  serviceAreas?: string[];
  languages?: string[];
  availabilityDays?: string[];
  availabilityStartTime?: string;
  availabilityEndTime?: string;
  availabilityDate?: string;
  minRating?: number;
  maxHourlyRate?: number;
  onlyVerified?: boolean;
  keyword?: string;
  page?: number;
  limit?: number;
}

const queryKeys = {
  searchSupportWorkers: (filters?: WorkerSearchFilters) => [
    "supportWorkers",
    "search", 
    filters,
  ],
  supportWorkerProfile: (id: string) => ["supportWorkers", "profile", id],
  inviteSupportWorkers: (orgId: string) => ["inviteSupportWorkers", orgId],
  organizations: ["orgs"],
  filterOptions: ["supportWorkers", "filterOptions"],
};

/**
 * Main search hook - uses the new universal search endpoint
 * Handles all types of searches: location-based, keyword, filters, etc.
 */
export function useSupportWorkers(
  filters?: WorkerSearchFilters,
  options?: UseQueryOptions<ISearchSupportWorkersResponse>
) {
  return useQuery<ISearchSupportWorkersResponse>({
    queryKey: queryKeys.searchSupportWorkers(filters),
    queryFn: async () => {
      try {
        const result = await participantService.searchSupportWorkers(filters);
        return result;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors, but retry on 5xx and network errors
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
}

/**
 * Get filter options for search interface
 */
export function useSearchFilterOptions(
  options?: UseQueryOptions<FilterOptions>
) {
  return useQuery<FilterOptions>({
    queryKey: queryKeys.filterOptions,
    queryFn: async () => {
      try {
        const result = await participantService.getFilterOptions();
        return result;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (options don't change often)
    retry: 2,
    ...options,
  });
}

/**
 * Get individual support worker profile
 */
export function useSupportWorkerProfile(
  id: string,
  options?: UseQueryOptions<ISearchSupportWorkerResponse>
) {
  return useQuery<ISearchSupportWorkerResponse>({
    queryKey: queryKeys.supportWorkerProfile(id),
    queryFn: () => participantService.getSupportWorkerProfile(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Get my organizations
 */
export function useMyOrganizations() {
  return useQuery<Organization[]>({
    queryKey: queryKeys.organizations,
    queryFn: async () =>
      (await organizationService.getOrganizations()).organizations,
  });
}

/**
 * Send invites to support workers to join organization
 */
export function useSendInvitationToSupportWorkers(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IInvitationRequest) =>
      inviteService.sendInvitationToSupportWorkers(orgId, data),
    onMutate: async (data: IInvitationRequest) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.inviteSupportWorkers(orgId),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.inviteSupportWorkers(orgId),
      });
    },
  });
}

/**
 * Convenience hook for different search scenarios
 */
export function useSearchSupportWorkers() {
  return {
    // Search all workers (no filters)
    useAllWorkers: (options?: UseQueryOptions<ISearchSupportWorkersResponse>) =>
      useSupportWorkers(undefined, options),

    // Search by participant location
    useWorkersByLocation: (options?: UseQueryOptions<ISearchSupportWorkersResponse>) =>
      useSupportWorkers({ matchParticipantLocation: true }, options),

    // Search by specific location
    useWorkersByRegion: (
      regionId: string,
      options?: UseQueryOptions<ISearchSupportWorkersResponse>
    ) => useSupportWorkers({ regionId }, options),

    useWorkersByState: (
      stateId: string,
      options?: UseQueryOptions<ISearchSupportWorkersResponse>
    ) => useSupportWorkers({ stateId }, options),

    // Search with custom filters
    useWorkersWithFilters: (
      filters: WorkerSearchFilters,
      options?: UseQueryOptions<ISearchSupportWorkersResponse>
    ) => useSupportWorkers(filters, options),

    // Get filter options
    useFilterOptions: useSearchFilterOptions,
  };
}

/**
 * Participant service utilities
 */
export function useParticipantService() {
  const queryClient = useQueryClient();

  return {
    // Queries
    useSupportWorkers,
    useSupportWorkerProfile,
    useSendInvitationToSupportWorkers,
    useSearchFilterOptions,
    useSearchSupportWorkers,

    // Prefetching
    prefetchSupportWorkers: (filters?: WorkerSearchFilters) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.searchSupportWorkers(filters),
        queryFn: () => participantService.searchSupportWorkers(filters),
      });
    },

    prefetchSupportWorkerProfile: (id: string) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.supportWorkerProfile(id),
        queryFn: () => participantService.getSupportWorkerProfile(id),
      });
    },

    prefetchFilterOptions: () => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.filterOptions,
        queryFn: () => participantService.getFilterOptions(),
      });
    },

    // Invalidation
    invalidateSupportWorkers: (filters?: WorkerSearchFilters) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.searchSupportWorkers(filters),
      });
    },

    invalidateSupportWorkerProfile: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.supportWorkerProfile(id),
      });
    },

    invalidateFilterOptions: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.filterOptions,
      });
    },

    // Query keys for external use
    queryKeys,
  };
}

// Legacy exports for backward compatibility
export { useSupportWorkers as useLegacySupportWorkers };
