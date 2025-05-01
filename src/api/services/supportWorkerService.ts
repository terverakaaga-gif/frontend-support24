import { get, post, put } from '../apiClient';
import { 
  SupportWorker, 
  Availability, 
  Experience, 
  TimeSlot,
  VerificationStatus
} from '../../types/user.types';

// Support worker profile update input
export interface SupportWorkerProfileInput {
  bio?: string;
  skills?: string[];
  languages?: string[];
  serviceAreas?: string[];
  hourlyRate?: number;
  weekendRate?: number;
  holidayRate?: number;
  overnightRate?: number;
}

// Availability update input
export interface AvailabilityInput {
  day: string;
  slots: TimeSlot[];
}

// Service for support worker operations
const supportWorkerService = {
  // Get the current support worker's profile
  getProfile: async (): Promise<SupportWorker> => {
    return await get<SupportWorker>('/support-workers/me');
  },
  
  // Update support worker's profile
  updateProfile: async (data: SupportWorkerProfileInput): Promise<SupportWorker> => {
    return await put<SupportWorker>('/support-workers/me', data);
  },
  
  // Update support worker's availability
  updateAvailability: async (availability: AvailabilityInput[]): Promise<Availability> => {
    return await put<Availability>('/support-workers/me/availability', { weekdays: availability });
  },
  
  // Add work experience
  addExperience: async (experience: Omit<Experience, '_id'>): Promise<Experience> => {
    return await post<Experience>('/support-workers/me/experience', experience);
  },
  
  // Update work experience
  updateExperience: async (id: string, experience: Omit<Experience, '_id'>): Promise<Experience> => {
    return await put<Experience>(`/support-workers/me/experience/${id}`, experience);
  },
  
  // Complete profile setup (marks the profile as complete)
  completeProfileSetup: async (): Promise<VerificationStatus> => {
    return await post<VerificationStatus>('/support-workers/me/complete-profile');
  },
  
  // Get all available support workers (for participant view)
  getAllAvailable: async (): Promise<SupportWorker[]> => {
    return await get<SupportWorker[]>('/support-workers/available');
  },
  
  // Get support worker details by ID (for participant view)
  getById: async (id: string): Promise<SupportWorker> => {
    return await get<SupportWorker>(`/support-workers/${id}`);
  }
};

export default supportWorkerService;