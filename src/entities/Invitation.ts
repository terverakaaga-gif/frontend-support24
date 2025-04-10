import { User } from './User';

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
  status: InvitationStatus;
  createdAt: Date;
  updatedAt?: Date;
  message?: string;
  adminNotes?: string;
}