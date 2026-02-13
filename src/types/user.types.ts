// Enums and basic types
export type UserRole = "admin" | "participant" | "supportWorker" | "guardian" | "coordinator" | "provider";
export type UserStatus = "active" | "pending" | "suspended" | "inactive";
export type Gender = "male" | "female" | "other" | "prefer-not-to-say";
export type NotificationPreference = "all" | "important" | "none";
export type SubscriptionTier = "basic" | "premium" | "enterprise";
export enum EUserRole {
  ADMIN = "admin",
  PARTICIPANT = "participant",
  SUPPORT_WORKER = "supportWorker",
  GUARDIAN = "guardian",
  COORDINATOR = "coordinator",
  PROVIDER = "provider",
}
export enum EUserStatus {
  ACTIVE = "active",
  PENDING = "pending",
  SUSPENDED = "suspended",
  INACTIVE = "inactive",
}
export enum ENotificationPreference {
  ALL = "all",
  IMPORTANT = "important",
  NONE = "none",
}
export enum ESubscriptionTier {
  BASIC = "basic",
  PREMIUM = "premium",
  ENTERPRISE = "enterprise",
}

// Base User interface matching backend
export interface BaseUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  profileImage?: string | null;
  notificationPreferences: NotificationPreference;
  pushTokens?: {
    token: string;
    platform: 'ios' | 'android' | 'web';
    deviceId: string;
    lastUsed: Date;
  }[];
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  createdAt: string;
  updatedAt: string;
  address?: string | { street: string, city: string, state: string, country: string, postalCode: string }
}

// Location types
export interface LocationPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// Participant specific types
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PlanManager {
  name: string;
  email: string;
}

export interface Coordinator {
  name: string;
  email: string;
}

export interface ParticipantSubscription {
  tier: SubscriptionTier;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  autoRenew: boolean;
  paymentMethod?: string;
}

export interface SupportNeed {
  _id: string;
  name: string;
  description: string;
  category?: string;
}

// Support Worker specific types
export interface Qualification {
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  verified: boolean;
}

export interface Experience {
  title: string;
  organization: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface HourlyRates {
  baseRate: number;
  weekendRate?: number;
  holidayRate?: number;
  overnightRate?: number;
}

export interface ShiftRate {
  rateTimeBandId: {
    _id: string;
    name: string;
    description?: string;
  };
  hourlyRate: number;
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string;   // HH:MM format
}

export interface WeekdayAvailability {
  day: string;
  available: boolean;
  slots?: TimeSlot[];
}

export interface Availability {
  weekdays: WeekdayAvailability[];
  unavailableDates?: Date[];
}

export interface Rating {
  average: number;
  count: number;
}

export interface VerificationStatus {
  profileSetupComplete: boolean;
  identityVerified: boolean;
  policeCheckVerified: boolean;
  ndisWorkerScreeningVerified: boolean;
  onboardingComplete: boolean;
  onboardingFeeReceived: boolean;
}

export interface BankDetails {
  accountName: string;
  bsb: string;
  accountNumber: string;
}

export interface Skill {
  _id: string;
  name: string;
  code: string;
}

// Main User Interfaces
export interface Participant extends BaseUser {
  supportNeeds: SupportNeed[];
  emergencyContact?: EmergencyContact;
  planManager?: PlanManager;
  coordinator?: Coordinator;
  guardianId?: string;
  subscription: ParticipantSubscription;
  supportCoordinators: string[];
  preferredLanguages?: string[];
  preferredGenders?: string[];
  notes?: string;
  ndisNumber?: string;
  requiresSupervision: boolean;
  onboardingComplete: boolean;
  // Location fields
  stateId?: string;
  regionId?: string;
  suburbId?: string;
  serviceAreaId?: string;
  participantLocation?: LocationPoint;
}

export interface SupportWorker extends BaseUser {
  skills?: Skill[];
  bio?: string;
  qualifications: Qualification[];
  experience: Experience[];
  hourlyRate?: HourlyRates;
  shiftRates: ShiftRate[];
  availability: Availability;
  serviceAreas: string[];
  languages: string[];
  ratings: Rating;
  verificationStatus: VerificationStatus;
  organizations: string[];
  abn?: string;
  bankDetails?: BankDetails;
  // Location fields
  stateIds?: string[];
  regionIds?: string[];
  serviceAreaIds?: string[];
  baseLocation?: LocationPoint;
  travelRadiusKm?: number;
}

export interface Guardian extends BaseUser {
  participants: string[];
  relationship: string;
  isLegalGuardian: boolean;
  organization?: string;
  isPrimaryContact: boolean;
}

export interface Admin extends BaseUser {
  permissions: string[];
}

export interface Coordinator extends BaseUser {
  assignedParticipants: string[];
  organization?: string;
  licenseNumber?: string;
  qualifications: Qualification[];
  serviceAreas: string[];
  onboardingComplete: boolean;
}

export interface Provider extends BaseUser {
  organizationName: string;
  abn: string;
  providerType: string;
  primaryContactName: string;
  primaryContactPhone: string;
  primaryContactEmail: string;
  businessAddress?: {
    street: string;
    city: string;
    state: string;
    postcode: string;
  };
  settings?: {
    autoCreateWorkers: boolean;
    autoCreateParticipants: boolean;
    requireWorkerApproval: boolean;
    enableAutoCancellationReplacement: boolean;
    smsNotifications: boolean;
  };
  stateIds: string[];
  regionIds: string[];
  totalRostersUploaded: number;
  totalShiftsManaged: number;
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionStartDate: Date;
}

// Union type for all user types
export type User = SupportWorker | Participant | Guardian | Admin | Coordinator | Provider;

// Input types for onboarding
export interface ParticipantOnboardingInput {
  serviceCategories: string[];
  emergencyContact?: EmergencyContact;
  planManager?: PlanManager;
  coordinator?: Coordinator;
  preferredLanguages?: string[];
  ndisNumber?: string;
  stateId?: string;
  regionId?: string;
  suburbId?: string;
  serviceAreaId?: string;
  location?: {
    longitude: number;
    latitude: number;
  };
  address?: string;
}

export interface SupportWorkerOnboardingInput {
  bio: string;
  serviceCategories: string[];
  languages: string[];
  experience?: Experience[];
  resume?: string;
  shiftRates: ShiftRate[];
  availability: Availability;
  stateIds?: string[];
  regionIds?: string[];
  serviceAreaIds?: string[];
  baseLocation?: {
    longitude: number;
    latitude: number;
  };
  travelRadiusKm?: number;
  address?: string;
}

// Other existing types for auth, etc.
export interface UserRegistrationInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  // Provider-specific fields (optional, required only for provider role)
  organizationName?: string;
  abn?: string;
  businessAddress?: {
    street: string;
    city: string;
    state: string;
    postcode: string;
  };
  providerType?: string;
  primaryContactName?: string;
  primaryContactPhone?: string;
  primaryContactEmail?: string;
}

export interface EmailVerificationInput {
  userId: string;
  otpCode: string;
}

export interface ResendVerificationInput {
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  hasMore: boolean;
}