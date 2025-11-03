import { get, post, put } from "../apiClient";
import {
  SupportWorker,
  Availability,
  Experience,
  VerificationStatus,
  Rating,
  IPagination,
} from "../../types/user.types";

export interface ISearchSupportWorkers {
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

  async getSupportWorkers(): Promise<ISearchSupportWorkersResponse> {
    return await get<ISearchSupportWorkersResponse>(`${this.endpoint}/search`);
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
