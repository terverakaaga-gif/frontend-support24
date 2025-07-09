// Define interfaces based on API response structure
export interface RateTimeBand {
  _id: string;
  name: string;
  code: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}

export interface ShiftRate {
  rateTimeBandId: RateTimeBand;
  hourlyRate: number;
  _id: string;
}

export interface ProposedRates {
  baseHourlyRate: number;
  shiftRates: ShiftRate[];
  distanceTravelRate: number;
}

export interface Invite {
  inviteId: string;
  workerId: string;
  workerName: string;
  inviteDate: string;
  proposedRates: ProposedRates;
  notes: string;
}

export interface OrganizationInvites {
  organizationId: string;
  organizationName: string;
  participantId: string;
  participantName: string;
  invites: Invite[];
}

// API Response interface
export interface OrganizationsInvitesResponse {
  organizations: OrganizationInvites[];
}

// Flattened invite for table display with additional fields
export interface FlattenedInvite extends Invite {
  organizationName: string;
  organizationId: string;
  participantId: string;
  participantName: string;
  status: 'pending' | 'accepted' | 'declined'; // Client-side status
}

// Service agreement for invite acceptance
export interface ServiceAgreementShiftRate {
  rateTimeBandId: string;
  hourlyRate: number;
}

export interface ServiceAgreement {
  baseHourlyRate: number;
  shiftRates: ServiceAgreementShiftRate[];
  distanceTravelRate: number;
  startDate: string;
  termsAccepted: boolean;
}

// Request body for processing invite acceptance
export interface ProcessInviteRequest {
  status: 'accepted' | 'declined';
  adminNotes?: string;
  serviceAgreement?: ServiceAgreement;
}

// Legacy interface - keeping for backward compatibility
export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export interface Invitation {
  _id: string;
  participant: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  supportWorker: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  proposedRate?: string;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt?: Date;
  message?: string;
  adminNotes?: string;
}