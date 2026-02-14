
// import { User } from './User';

// export interface Participant extends User {
//   supportNeeds: string[];
//   emergencyContact?: {
//     name: string;
//     relationship: string;
//     phone: string;
//   };
// }
// types/participant.ts

export interface Participant {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "participant";
  status: "active" | "inactive" | "pending" | "suspended";
  phone: string;
  notificationPreferences: string;
  isEmailVerified: boolean;
  supportNeeds: string[];
  subscription: {
    tier: string;
    isActive: boolean;
    autoRenew: boolean;
    startDate: string;
  };
  supportCoordinators: string[];
  preferredLanguages: string[];
  preferredGenders: string[];
  requiresSupervision: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  __v: number;
  organization: Organization[];
  guardian: Guardian[];
  hasOrganization: boolean;
  organizationCount: number;
}

export interface Organization {
  _id: string;
  name: string;
  participantId: string;
  workers: Worker[];
  pendingInvites: PendingInvite[];
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Worker {
  workerId: string;
  serviceAgreement: ServiceAgreement;
  joinedDate: string;
  _id: string;
}

export interface ServiceAgreement {
  baseHourlyRate: number;
  shiftRates: ShiftRate[];
  distanceTravelRate: number;
  startDate: string;
  termsAccepted: boolean;
}

export interface ShiftRate {
  rateTimeBandId: string;
  hourlyRate: number;
  _id: string;
}

export interface PendingInvite {
  workerId: string;
  inviteDate: string;
  status: "pending" | "accepted" | "declined";
  proposedRates: ProposedRates;
  notes?: string;
  serviceAgreement: {
    shiftRates: ShiftRate[];
  };
  _id: string;
  adminId?: string;
  responseDate?: string;
  adminNotes?: string;
  declineReason?: string;
}

export interface ProposedRates {
  baseHourlyRate: number;
  shiftRates: ShiftRate[];
  distanceTravelRate: number;
}

export interface Guardian {
  name?: string;
  // Define guardian structure if needed
}

// Filter interfaces (extending from the existing ones)
export interface ParticipantTableFilters {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  isEmailVerified?: boolean;
  hasProfileImage?: boolean;
  hasGuardian?: boolean;
  subscriptionTier?: string;
  subscriptionStatus?: 'active' | 'inactive';
  hasNdisNumber?: boolean;
  requiresSupervision?: boolean;
  hasOrganization?: boolean;
}

export interface FilterOptionsResponse {
  skills: string[];
  serviceAreas: string[];
  languages: string[];
  subscriptionTiers: string[];
  adminTypes: string[];
  userStatuses: string[];
}


