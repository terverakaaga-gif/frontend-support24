import { UnifiedSupportWorkerCard } from './unified-support-worker';

export type VettingStatus = 'unvetted' | 'vetting' | 'vetted';
export type VettingPlanTier = 'basic' | 'standard' | 'premium';

/**
 * Organization Worker
 * Extends the unified support worker type with vetting-specific requirements
 */
export interface OrgWorker extends Partial<UnifiedSupportWorkerCard> {
  id: string;
  _id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: string;
  avatar?: string;
  profileImage?: string;
  location: string;
  distance: string; // e.g., "8km"
  hourlyRate: string; // e.g., "$65-75/hr"
  rating: number;
  status: VettingStatus; // Required for workforce context
  isVerified: boolean; // The primary tick
  email?: string;
  phone?: string;
}