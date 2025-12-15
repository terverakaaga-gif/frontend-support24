
import { WorkerProfile } from "@/lib/utils";

export interface RateTimeBand {
  _id: string;
  name: string;
  code: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}

export interface ShiftRate {
  rateTimeBandId: string | RateTimeBand;
  hourlyRate: number;
  _id: string;
}

export interface ServiceAgreement {
  baseHourlyRate: number;
  shiftRates: ShiftRate[];
  distanceTravelRate: number;
  startDate: string;
  termsAccepted: boolean;
}

export interface Worker {
  serviceAgreement: ServiceAgreement;
  workerId: string | WorkerProfile;
  joinedDate: string;
  _id: string;
}

export interface ProposedRates {
  baseHourlyRate: number;
  shiftRates: ShiftRate[];
  distanceTravelRate: number;
}

export interface PendingInvite {
  proposedRates: ProposedRates;
  serviceAgreement: {
    shiftRates: ShiftRate[];
  };
  workerId: string | WorkerProfile;
  inviteDate: string;
  status: string;
  notes: string;
  _id: string;
  adminId?: string;
  responseDate?: string;
  adminNotes?: string;
  declineReason?: string;
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