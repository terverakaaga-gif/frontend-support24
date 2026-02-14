import { get, post, put } from "../apiClient";
import {
  SupportWorker,
  Availability,
  Experience,
  VerificationStatus,
  Rating,
  IPagination,
} from "../../types/user.types";

// ===== TYPES =====

export interface WorkerSearchFilters {
  // Location filters
  stateId?: string;
  regionId?: string;
  serviceAreaId?: string;
  matchParticipantLocation?: boolean;

  // Search filters
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

export interface FilterOptions {
  skills: Array<{
    _id: string;
    name: string;
    code: string;
    category?: string;
  }>;
  languages: string[];
  serviceAreas: Array<{
    _id: string;
    name: string;
    code: string;
    regionId: string;
    stateId: string;
  }>;
  states: Array<{
    _id: string;
    name: string;
    code: string;
  }>;
  regions: Array<{
    _id: string;
    name: string;
    code: string;
    stateId: string;
  }>;
  rateRanges: {
    min: number;
    max: number;
    average: number;
  };
}

export interface SearchWorkerLocation {
  _id: string;
  name: string;
  code: string;
}

export interface ISearchSupportWorkers {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  skills: Array<{
    _id: string;
    name: string;
    code: string;
  }>;
  hourlyRate: {
    baseRate: number;
    weekendRate?: number;
    holidayRate?: number;
  };
  ratings: {
    average: number;
    count: number;
  };
  serviceAreas: string[];
  languages: string[];
  bio?: string;
  verificationStatus: {
    profileSetupComplete: boolean;
    identityVerified: boolean;
    policeCheckVerified: boolean;
    ndisWorkerScreeningVerified: boolean;
    onboardingComplete: boolean;
  };
  isInUserOrganization: boolean;
  // Location data when filtering by location
  stateIds?: SearchWorkerLocation[];
  regionIds?: SearchWorkerLocation[];
  serviceAreaIds?: SearchWorkerLocation[];
  distance?: number; // For proximity searches
}

export interface ISearchSupportWorkersResponse {
  workers: ISearchSupportWorkers[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ISearchSupportWorkerResponse {
  worker: SupportWorker;
}

// Service for participants
export class ParticipantService {
  endpoint = "workers";

  /**
   * Universal search endpoint - handles all types of searches
   * Uses the new /api/v1/workers/search endpoint
   */
  async searchSupportWorkers(
    filters?: WorkerSearchFilters
  ): Promise<ISearchSupportWorkersResponse> {
    try {
      const params = new URLSearchParams();

      // Location filters
      if (filters?.stateId) params.append("stateId", filters.stateId);
      if (filters?.regionId) params.append("regionId", filters.regionId);
      if (filters?.serviceAreaId)
        params.append("serviceAreaId", filters.serviceAreaId);
      if (filters?.matchParticipantLocation) {
        params.append("matchParticipantLocation", "true");
      }

      // Search filters
      if (filters?.keyword) params.append("keyword", filters.keyword);
      if (filters?.minRating) {
        params.append("minRating", filters.minRating.toString());
      }
      if (filters?.maxHourlyRate) {
        params.append("maxHourlyRate", filters.maxHourlyRate.toString());
      }
      if (filters?.onlyVerified) {
        params.append("onlyVerified", "true");
      }

      // Array filters
      if (filters?.skills && filters.skills.length > 0) {
        filters.skills.forEach((skill) => params.append("skills[]", skill));
      }
      if (filters?.languages && filters.languages.length > 0) {
        filters.languages.forEach((lang) => params.append("languages[]", lang));
      }

      // Pagination
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const queryString = params.toString();
   

      const response = await get<ISearchSupportWorkersResponse>(
        `/workers/search${queryString ? `?${queryString}` : ""}`
      );

      return response;
    } catch (error) {
      console.error("Error in searchSupportWorkers:", error);
      throw error;
    }
  }

  /**
   * Get filter options for the search
   */
  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const response = await get<{
        success: boolean;
        data: FilterOptions;
      }>("/workers/filter-options");

      return response.data;
    } catch (error) {
      console.error("Error in getFilterOptions:", error);
      throw error;
    }
  }

  /**
   * Get support worker profile
   */
  async getSupportWorkerProfile(
    id: string
  ): Promise<ISearchSupportWorkerResponse> {
    return await get<ISearchSupportWorkerResponse>(
      `${this.endpoint}/${id}/profile`
    );
  }

  // Alias methods for backward compatibility
  async searchSupportWorkersByLocation(
    filters?: WorkerSearchFilters
  ): Promise<ISearchSupportWorkersResponse> {
    return this.searchSupportWorkers(filters);
  }

  async searchSupportWorkersByRegion(
    filters?: WorkerSearchFilters
  ): Promise<ISearchSupportWorkersResponse> {
    return this.searchSupportWorkers(filters);
  }

  async searchSupportWorkersByState(
    filters?: WorkerSearchFilters
  ): Promise<ISearchSupportWorkersResponse> {
    return this.searchSupportWorkers(filters);
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use searchSupportWorkers instead
   */
  async getSupportWorkers(
    filters?: any
  ): Promise<ISearchSupportWorkersResponse> {
    return this.searchSupportWorkers(filters);
  }
}

export const participantService = new ParticipantService();
