
export interface RateTimeBand {
  _id: string;
  name: string;
  code: string;
}

export interface ShiftRate {
  rateTimeBandId: RateTimeBand;
  hourlyRate: number;
  _id: string;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  _id: string;
}

export interface AvailabilityDay {
  day: string;
  available: boolean;
  slots: AvailabilitySlot[];
  _id: string;
}

export interface Availability {
  weekdays: AvailabilityDay[];
  unavailableDates: string[];
}

export interface Experience {
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description: string;
  _id: string;
}

export interface Qualification {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
}

export interface VerificationStatus {
  profileSetupComplete: boolean;
  identityVerified: boolean;
  policeCheckVerified: boolean;
  ndisWorkerScreeningVerified: boolean;
  onboardingComplete: boolean;
}

export interface SupportWorker {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio?: string;
  profileImage?: string | null;
  role: "supportWorker";
  skills: { name: string }[];
  languages: string[];
  shiftRates: ShiftRate[];
  availability: Availability;
  experience: Experience[];
  qualifications: Qualification[];
  verificationStatus: VerificationStatus;
  travelRadiusKm: number;
  serviceAreaIds: string[];
}