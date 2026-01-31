/**
 * Unified Support Worker Card Type
 * 
 * This type consolidates support worker data for use across all roles:
 * - Participants (find support workers page)
 * - Providers (workforce page, marketplace)
 * 
 * Base fields are required, while provider-specific fields are optional.
 * This allows a single WorkerCard component to be used across all contexts.
 */

// Base identification (both _id and id optional for flexibility)
export interface UnifiedWorkerCardBase {
  _id?: string;
  id?: string; // For backward compatibility with marketplace mock data
  firstName: string;
  lastName: string;
  name?: string; // For backward compatibility
  email: string;
  phone: string;
  profileImage?: string;
  role: string;
}

// Core professional info
export interface UnifiedWorkerCardProfessional {
  skills?: Array<{
    _id?: string;
    name: string;
    code?: string;
  }>;
  bio?: string;
  languages?: string[];
  serviceAreas?: string[];
  experience?: Array<{
    title: string;
    organization: string;
    startDate: string;
    endDate?: string;
    description: string;
    _id?: string;
  }>;
  qualifications?: Array<{
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
  }>;
}

// Rating and verification
export interface UnifiedWorkerCardRatings {
  ratings?: {
    average: number;
    count: number;
  };
  rating?: number; // For backward compatibility
  isVerified?: boolean;
  verificationStatus?: {
    profileSetupComplete: boolean;
    identityVerified: boolean;
    policeCheckVerified: boolean;
    ndisWorkerScreeningVerified: boolean;
    onboardingComplete?: boolean;
  };
}

// Location and pricing
export interface UnifiedWorkerCardLocation {
  location?: string;
  distance?: string | number;
  baseLocation?: {
    type: string;
    coordinates: number[];
  };
  travelRadiusKm?: number;
}

export interface UnifiedWorkerCardPricing {
  hourlyRate?: string | number | {
    baseRate?: number;
    weekendRate?: number;
    holidayRate?: number;
  };
  shiftRates?: Array<{
    rateTimeBandId?: { name: string; code: string };
    hourlyRate?: number;
    _id?: string;
  }>;
}

// PROVIDER-SPECIFIC FIELDS (Optional)
export interface UnifiedWorkerCardProviderFields {
  // Vetting/Workforce management
  status?: 'vetted' | 'unvetted' | 'vetting';
  
  // Marketplace presentation
  specialization?: string;
  availability?: string;
  readabilityScore?: number;
  readabilityShifts?: number;
  
  // Subscription/pricing tier
  subscription?: {
    tier: string;
    isActive: boolean;
    autoRenew?: boolean;
    startDate?: string;
  };
  
  // Organization tracking
  isInUserOrganization?: boolean;
  organizationCount?: number;
}

/**
 * Complete unified support worker card type
 * Use this type for all worker card displays across the application
 */
export type UnifiedSupportWorkerCard = 
  & UnifiedWorkerCardBase
  & UnifiedWorkerCardProfessional
  & UnifiedWorkerCardRatings
  & UnifiedWorkerCardLocation
  & UnifiedWorkerCardPricing
  & UnifiedWorkerCardProviderFields;

/**
 * Type helper: Get base worker data (participant context)
 * Only requires fields that are always present
 */
export type ParticipantWorkerCard = Omit<
  UnifiedSupportWorkerCard,
  | 'status'
  | 'specialization'
  | 'availability'
  | 'readabilityScore'
  | 'readabilityShifts'
  | 'subscription'
  | 'organizationCount'
>;

/**
 * Type helper: Get provider worker data (workforce/marketplace context)
 * Allows all fields including provider-specific ones
 */
export type ProviderWorkerCard = UnifiedSupportWorkerCard;
