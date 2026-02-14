import { EmergencyContact, PlanManager, Coordinator, SubscriptionTier } from "@/types/user.types";
import { Subscription } from "./participant";

export interface EditProfileFormData {
  // Common
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: Date | null;
  address?: string;
  notificationPreferences?: string;
  
  // Participant Specific
  ndisNumber?: string;
  supportNeeds?: string[]; // array of IDs
  requiresSupervision?: boolean;
  stateId?: string;
  regionId?: string;
  suburbId?: string;
  serviceAreaId?: string;
  emergencyContact?: EmergencyContact;
  planManager?: PlanManager;
  coordinator?: Coordinator;
  preferredLanguages?: string[];
  preferredGenders?: string[];
  notes?: string;
  subscription?: Subscription;
  supportCoordinators?: any[];
  onboardingComplete?: boolean;

  // Support Worker Specific
  bio?: string;
  skills?: string[]; // array of IDs
  languages?: string[];
  experience?: any[];
  resume?: string;
  qualifications?: any[];
  stateIds?: string[];
  regionIds?: string[];
  serviceAreaIds?: string[];
  serviceAreas?: any[];
  travelRadiusKm?: number;
  baseLocation?: any;
  shiftRates?: any[];
  availability?: {
    weekdays: any[];
    unavailableDates: any[];
  };
  verificationStatus?: any;
  ratings?: { average: number; count: number };
  organizations?: any[];
}