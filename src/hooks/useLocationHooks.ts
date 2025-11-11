import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { get } from "@/api/apiClient";
import {
  ISearchSupportWorkersResponse,
  participantService,
} from "@/api/services/participantService";

// ===== Types =====

// ===== NEW LOCATION-BASED SEARCH =====
export interface LocationSupportWorkerFilters {
  // Location filters (REQUIRED - at least one)
  stateId?: string;
  regionId?: string;
  serviceAreaId?: string;
  maxDistanceKm?: number;
  participantId?: string;
  matchParticipantLocation?: boolean;

  // Optional additional filters
  keyword?: string;
  skills?: string[];
  languages?: string[];
  minRating?: number;
  maxHourlyRate?: number;
  onlyVerified?: boolean;

  // Pagination
  page?: number;
  limit?: number;
}

interface State {
  _id: string;
  name: string;
  code: string;
}

interface Region {
  _id: string;
  name: string;
  stateId: string;
}

interface Suburb {
  _id: string;
  name: string;
  postcode: string;
  regionId: string;
  stateId: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface ServiceArea {
  _id: string;
  name: string;
  regionId: string;
  stateId: string;
}

interface WorkerSearchFilters {
  participantId?: string;
  maxDistanceKm?: number;
  page?: number;
  limit?: number;
  skills?: string[];
  languages?: string[];
  minRating?: number;
  maxHourlyRate?: number;
  onlyVerified?: boolean;
  keyword?: string;
  // Region-based filters
  stateId?: string;
  regionId?: string;
  serviceAreaId?: string;
  matchParticipantLocation?: boolean;
}

interface SearchWorker {
  _id: string;
  firstName: string;
  lastName: string;
  serviceAreas: string[];
  hourlyRate: {
    baseRate: number;
  };
  ratings: {
    average: number;
    count: number;
  };
  verificationStatus: {
    identityVerified: boolean;
  };
  languages: string[];
  skills: Array<{ _id: string; name: string } | string>;
  distance?: number;
}

interface WorkerSearchResponse {
  workers: SearchWorker[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ===== Query Keys =====

export const locationKeys = {
  all: ["location"] as const,
  states: () => [...locationKeys.all, "states"] as const,
  regions: (stateId?: string) =>
    [...locationKeys.all, "regions", stateId] as const,
  suburbs: (regionId?: string, stateId?: string) =>
    [...locationKeys.all, "suburbs", { regionId, stateId }] as const,
  serviceAreas: (stateId?: string, regionId?: string) =>
    [...locationKeys.all, "serviceAreas", { stateId, regionId }] as const,
  workers: (filters?: WorkerSearchFilters) =>
    [...locationKeys.all, "workers", filters] as const,
};

// ===== Location Reference Data Hooks =====

/**
 * Get all states
 */
export const useStates = (): UseQueryResult<State[]> => {
  return useQuery({
    queryKey: locationKeys.states(),
    queryFn: async () => {
      const response = await get<State[]>("/location/states");
      return response;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (states rarely change)
  });
};

/**
 * Get regions by state ID
 */
export const useRegions = (
  stateId?: string,
  enabled: boolean = true
): UseQueryResult<Region[]> => {
  return useQuery({
    queryKey: locationKeys.regions(stateId),
    queryFn: async () => {
      if (!stateId) return [];
      const response = await get<Region[]>(`/location/regions/${stateId}`);
      return response;
    },
    enabled: enabled && !!stateId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Get suburbs by region ID
 */
export const useSuburbsByRegion = (
  regionId?: string,
  enabled: boolean = true
): UseQueryResult<Suburb[]> => {
  return useQuery({
    queryKey: locationKeys.suburbs(regionId),
    queryFn: async () => {
      if (!regionId) return [];
      const response = await get<Suburb[]>(
        `/location/suburbs/region/${regionId}`
      );
      return response;
    },
    enabled: enabled && !!regionId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Get suburbs by state ID
 */
export const useSuburbsByState = (
  stateId?: string,
  enabled: boolean = true
): UseQueryResult<Suburb[]> => {
  return useQuery({
    queryKey: locationKeys.suburbs(undefined, stateId),
    queryFn: async () => {
      if (!stateId) return [];
      const response = await get<Suburb[]>(
        `/location/suburbs/state/${stateId}`
      );
      return response;
    },
    enabled: enabled && !!stateId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Search suburbs by name or postcode
 */
export const useSearchSuburbs = (
  query: string,
  stateId?: string,
  enabled: boolean = true
): UseQueryResult<Suburb[]> => {
  return useQuery({
    queryKey: [...locationKeys.all, "suburbs", "search", query, stateId],
    queryFn: async () => {
      if (!query) return [];
      const params = new URLSearchParams({ query });
      if (stateId) params.append("stateId", stateId);
      const response = await get<Suburb[]>(
        `/location/suburbs/search?${params.toString()}`
      );
      return response;
    },
    enabled: enabled && !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get service areas by region ID
 */
export const useServiceAreasByRegion = (
  regionId?: string,
  enabled: boolean = true
): UseQueryResult<ServiceArea[]> => {
  return useQuery({
    queryKey: locationKeys.serviceAreas(undefined, regionId),
    queryFn: async () => {
      if (!regionId) return [];
      const response = await get<ServiceArea[]>(
        `/location/service-areas/region/${regionId}`
      );
      return response;
    },
    enabled: enabled && !!regionId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Get service areas by state ID
 */
export const useServiceAreasByState = (
  stateId?: string,
  enabled: boolean = true
): UseQueryResult<ServiceArea[]> => {
  return useQuery({
    queryKey: locationKeys.serviceAreas(stateId),
    queryFn: async () => {
      if (!stateId) return [];
      const response = await get<ServiceArea[]>(
        `/location/service-areas/state/${stateId}`
      );
      return response;
    },
    enabled: enabled && !!stateId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

/**
 * Get all service areas
 */
export const useServiceAreas = (
  stateId?: string,
  regionId?: string
): UseQueryResult<ServiceArea[]> => {
  return useQuery({
    queryKey: locationKeys.serviceAreas(stateId, regionId),
    queryFn: async () => {
      // If regionId is provided, get by region
      if (regionId) {
        const response = await get<ServiceArea[]>(
          `/location/service-areas/region/${regionId}`
        );
        return response;
      }

      // If stateId is provided, get by state
      if (stateId) {
        const response = await get<ServiceArea[]>(
          `/location/service-areas/state/${stateId}`
        );
        return response;
      }

      // Otherwise get all
      const response = await get<ServiceArea[]>("/location/service-areas");
      return response;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

// ===== Geospatial Worker Search Hooks =====

/**
 * Search for workers near participant's location
 */
export const useSearchNearbyWorkers = (
  filters: WorkerSearchFilters,
  enabled: boolean = true
): UseQueryResult<SearchWorker[]> => {
  return useQuery({
    queryKey: locationKeys.workers(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add all filters to query params
      if (filters.participantId)
        params.append("participantId", filters.participantId);
      if (filters.maxDistanceKm)
        params.append("maxDistanceKm", filters.maxDistanceKm.toString());
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.minRating)
        params.append("minRating", filters.minRating.toString());
      if (filters.maxHourlyRate)
        params.append("maxHourlyRate", filters.maxHourlyRate.toString());
      if (filters.onlyVerified) params.append("onlyVerified", "true");
      if (filters.keyword) params.append("keyword", filters.keyword);

      // Array parameters
      if (filters.skills && filters.skills.length > 0) {
        filters.skills.forEach((skill) => params.append("skills[]", skill));
      }
      if (filters.languages && filters.languages.length > 0) {
        filters.languages.forEach((lang) => params.append("languages[]", lang));
      }

      const response = await get<WorkerSearchResponse>(
        `/location/workers/nearby?${params.toString()}`
      );
      return response.workers;
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes (worker availability changes)
  });
};

/**
 * Search for workers by region/state/service area
 */
export const useSearchWorkersByRegion = (
  filters: WorkerSearchFilters,
  enabled: boolean = true
): UseQueryResult<SearchWorker[]> => {
  return useQuery({
    queryKey: [...locationKeys.workers(filters), "by-region"],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add all filters to query params
      if (filters.participantId)
        params.append("participantId", filters.participantId);
      if (filters.stateId) params.append("stateId", filters.stateId);
      if (filters.regionId) params.append("regionId", filters.regionId);
      if (filters.serviceAreaId)
        params.append("serviceAreaId", filters.serviceAreaId);
      if (filters.matchParticipantLocation)
        params.append("matchParticipantLocation", "true");
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.minRating)
        params.append("minRating", filters.minRating.toString());
      if (filters.maxHourlyRate)
        params.append("maxHourlyRate", filters.maxHourlyRate.toString());
      if (filters.onlyVerified) params.append("onlyVerified", "true");
      if (filters.keyword) params.append("keyword", filters.keyword);

      // Array parameters
      if (filters.skills && filters.skills.length > 0) {
        filters.skills.forEach((skill) => params.append("skills[]", skill));
      }
      if (filters.languages && filters.languages.length > 0) {
        filters.languages.forEach((lang) => params.append("languages[]", lang));
      }

      const response = await get<WorkerSearchResponse>(
        `/location/workers/by-region?${params.toString()}`
      );
      return response.workers;
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ===== Geospatial Worker Search Hooks =====

/**
 * Location-based search hook - searches by state/region/distance
 * Completely separate from the original search
 */
export function useSupportWorkersByLocation(
  filters: LocationSupportWorkerFilters,
  options?: UseQueryOptions<ISearchSupportWorkersResponse>
) {
  // Check if any location filter is provided
  const hasLocationFilter =
    filters.stateId ||
    filters.regionId ||
    filters.serviceAreaId ||
    filters.maxDistanceKm ||
    filters.participantId;

  return useQuery<ISearchSupportWorkersResponse>({
    queryKey: ["supportWorkers", "byLocation", filters],
    queryFn: async () => {
      if (!hasLocationFilter) {
        throw new Error("At least one location filter is required");
      }
      return participantService.searchSupportWorkersByLocation(filters);
    },
    enabled: !!hasLocationFilter && (options?.enabled ?? true),
  });
}
