import { get, post, put } from "../apiClient";
import {
  SupportWorker,
  Availability,
  Experience,
  VerificationStatus,
  Rating,
  IPagination,
} from "../../types/user.types";
import { SupportWorkerFilters } from "@/hooks/useParticipant";
import { LocationSupportWorkerFilters } from "@/hooks/useLocationHooks";

// ===== TYPES =====

interface WorkerSearchResponse {
  workers: SearchWorker[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

interface ServiceTypeStatus {
  [key: string]: any;
}

export interface ISearchSupportWorkers {
  distance: string;
  _id: string;
  firstName: string;
  lastName: string;
  skills: {
    _id: string;
    name: string;
    code: string;
  }[];
  hourlyRate: {
    baseRate: number;
  };
  ratings: Rating;
  serviceAreas: string[];
  languages: string[];
  verificationStatus: VerificationStatus;
  isInUserOrganization: boolean;
  profileImage?: string;
}

export interface ISearchSupportWorkersResponse {
  workers: ISearchSupportWorkers[];
  pagination: IPagination;
}

export interface ISearchSupportWorkerResponse {
  worker: SupportWorker;
}

// Service for participants
export class ParticipantService {
  endpoint = "workers";

  /**
   * Original search - by skills, availability, etc
   */
  async getSupportWorkers(
    filters?: SupportWorkerFilters
  ): Promise<ISearchSupportWorkersResponse> {
    const params = new URLSearchParams();

    if (filters.keyword) params.append("keyword", filters.keyword);

    if (filters.skills && filters.skills.length > 0) {
      filters.skills.forEach((skill) => params.append("skills[]", skill));
    }

    if (filters.serviceAreas && filters.serviceAreas.length > 0) {
      filters.serviceAreas.forEach((area) =>
        params.append("serviceAreas[]", area)
      );
    }

    if (filters.languages && filters.languages.length > 0) {
      filters.languages.forEach((lang) => params.append("languages[]", lang));
    }

    if (filters.availabilityDays && filters.availabilityDays.length > 0) {
      filters.availabilityDays.forEach((day) =>
        params.append("availabilityDays[]", day)
      );
    }

    if (filters.availabilityStartTime) {
      params.append("availabilityStartTime", filters.availabilityStartTime);
    }

    if (filters.availabilityEndTime) {
      params.append("availabilityEndTime", filters.availabilityEndTime);
    }

    if (filters.availabilityDate) {
      params.append("availabilityDate", filters.availabilityDate);
    }

    if (filters.minRating) {
      params.append("minRating", filters.minRating.toString());
    }

    if (filters.maxHourlyRate) {
      params.append("maxHourlyRate", filters.maxHourlyRate.toString());
    }

    if (filters.onlyVerified) {
      params.append("onlyVerified", "true");
    }

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return get<ISearchSupportWorkersResponse>(
      `/workers/search?${params.toString()}`
    );
  }

  /**
   * NEW: Location-based search
   */
  async searchSupportWorkersByLocation(
    filters: LocationSupportWorkerFilters
  ): Promise<ISearchSupportWorkersResponse> {
    const params = new URLSearchParams();

    // Location filters
    if (filters.stateId) params.append("stateId", filters.stateId);
    if (filters.regionId) params.append("regionId", filters.regionId);
    if (filters.serviceAreaId)
      params.append("serviceAreaId", filters.serviceAreaId);
    if (filters.maxDistanceKm)
      params.append("maxDistanceKm", filters.maxDistanceKm.toString());
    if (filters.participantId)
      params.append("participantId", filters.participantId);
    if (filters.matchParticipantLocation)
      params.append("matchParticipantLocation", "true");

    // Additional filters
    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.minRating)
      params.append("minRating", filters.minRating.toString());
    if (filters.maxHourlyRate)
      params.append("maxHourlyRate", filters.maxHourlyRate.toString());
    if (filters.onlyVerified) params.append("onlyVerified", "true");

    if (filters.skills && filters.skills.length > 0) {
      filters.skills.forEach((skill) => params.append("skills[]", skill));
    }
    if (filters.languages && filters.languages.length > 0) {
      filters.languages.forEach((lang) => params.append("languages[]", lang));
    }

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    // Choose endpoint based on distance/participant filters
    const endpoint =
      filters.maxDistanceKm || filters.participantId
        ? "/location/workers/nearby"
        : "/location/workers/by-region";

    const response = await get<WorkerSearchResponse>(
      `${endpoint}?${params.toString()}`
    );

    // Transform to match ISearchSupportWorkersResponse format
    return {
      workers: response.workers.map((worker) => ({
        _id: worker._id,
        firstName: worker.firstName,
        lastName: worker.lastName,
        skills: worker.skills.map((skill) =>
          typeof skill === "string"
            ? { _id: skill, name: skill, code: skill }
            : { _id: skill._id, name: skill.name, code: skill._id }
        ),
        hourlyRate: worker.hourlyRate,
        ratings: worker.ratings,
        serviceAreas: worker.serviceAreas,
        languages: worker.languages,
        verificationStatus: worker.verificationStatus,
        isInUserOrganization: false, // Determined on frontend
        distance: worker.distance,
      })),
      pagination: {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      },
    };
  }

  async getSupportWorkerProfile(
    id: string
  ): Promise<ISearchSupportWorkerResponse> {
    return await get<ISearchSupportWorkerResponse>(
      `${this.endpoint}/${id}/profile`
    );
  }
}

export const participantService = new ParticipantService();
