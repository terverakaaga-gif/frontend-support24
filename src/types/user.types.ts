// User Role type
export type UserRole = 'admin' | 'participant' | 'supportWorker' | 'guardian';

// User Status type
export type UserStatus = 'active' | 'pending' | 'suspended' | 'inactive';

// Base User interface with common fields
export interface BaseUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  notificationPreferences: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// Support Worker Verification Status
export interface VerificationStatus {
  profileSetupComplete: boolean;
  identityVerified: boolean;
  policeCheckVerified: boolean;
  ndisWorkerScreeningVerified: boolean;
  onboardingComplete: boolean;
  onboardingFeeReceived: boolean;
}

// Support Worker Rating
export interface Rating {
  average: number;
  count: number;
}

// Support Worker Availability
export interface Availability {
  unavailableDates: string[];
  weekdays: WeekdayAvailability[];
}

export interface WeekdayAvailability {
  day: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

// Support Worker Experience
export interface Experience {
  _id?: string;
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description: string;
}

// Support Worker interface
export interface SupportWorker extends BaseUser {
  skills: string[];
  availability: Availability;
  serviceAreas: string[];
  languages: string[];
  ratings: Rating;
  verificationStatus: VerificationStatus;
  organizations: string[];
  qualifications: string[];
  experience: Experience[];
  bio?: string;
  hourlyRate?: number;
  weekendRate?: number;
  holidayRate?: number;
  overnightRate?: number;
}

// Participant Subscription
export interface Subscription {
  tier: string;
  isActive: boolean;
  autoRenew: boolean;
  startDate: string;
  endDate?: string;
}

// Participant interface
export interface Participant extends BaseUser {
  subscription: Subscription;
  supportNeeds: string[];
  supportCoordinators: string[];
  preferredLanguages: string[];
  preferredGenders: string[];
  requiresSupervision: boolean;
}

// Guardian interface
export interface Guardian extends BaseUser {
  participants: string[];
}

// Admin interface
export interface Admin extends BaseUser {
  permissions: string[];
}

// Union type for all user types
export type User = SupportWorker | Participant | Guardian | Admin;

// Registration input type
export interface UserRegistrationInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
}

// Email verification input
export interface EmailVerificationInput {
  userId: string;
  otpCode: string;
}

// Resend verification input
export interface ResendVerificationInput {
  email: string;
}

// Login input
export interface LoginInput {
  email: string;
  password: string;
}