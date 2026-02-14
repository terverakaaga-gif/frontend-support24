import { UnifiedSupportWorkerCard } from './unified-support-worker';

/**
 * Marketplace Support Worker
 * Extends the unified support worker type with marketplace-specific presentation fields
 */
export interface SupportWorker extends Partial<UnifiedSupportWorkerCard> {
  id: string;
  _id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  role: string;
  rating: number;
  ratings?: { average: number; count: number };
  location: string;
  distance: string;
  hourlyRate: string; // e.g., "$65-75/hr"
  specialization: string; // Marketplace-specific
  availability: string; // Marketplace-specific
  readabilityScore: number; // Marketplace-specific
  readabilityShifts: number; // Marketplace-specific
  profileImage: string;
  email?: string;
  phone?: string;
  skills?: Array<{ name: string }>;
  languages?: string[];
  bio?: string;
  serviceAreas?: string[];
  verificationStatus?: {
    profileSetupComplete: boolean;
    identityVerified: boolean;
    policeCheckVerified: boolean;
    ndisWorkerScreeningVerified: boolean;
  };
}

// Mock Data based on your screenshot
export const MOCK_WORKERS: SupportWorker[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    isVerified: true,
    role: "Disability Support Worker",
    rating: 4.5,
    location: "Brimbank",
    distance: "8km",
    hourlyRate: "65-75/hr",
    specialization: "Autism, PBS...",
    availability: "Weekdays (7 AM - 7PM)",
    readabilityScore: 92,
    readabilityShifts: 42,
    profileImage: "/placeholder-avatar.jpg"
  },
  {
    id: "2",
    name: "Mason T",
    isVerified: true,
    role: "Support Worker",
    rating: 4.5,
    location: "Albion Park, AU",
    distance: "",
    hourlyRate: "60-70/hr",
    specialization: "Manual Handling",
    availability: "Weekends",
    readabilityScore: 88,
    readabilityShifts: 12,
    profileImage: "/placeholder-avatar-2.jpg"
  },
  // Add more mock items to fill the grid...
  { id: "3", name: "Sarah Johnson", isVerified: true, role: "Disability Support Worker", rating: 4.5, location: "Brimbank", distance: "8km", hourlyRate: "65-75/hr", specialization: "Autism, PBS...", availability: "Weekdays (7 AM - 7PM)", readabilityScore: 92, readabilityShifts: 42, profileImage: "/placeholder-avatar.jpg" },
  { id: "4", name: "Sarah Johnson", isVerified: true, role: "Disability Support Worker", rating: 4.5, location: "Brimbank", distance: "8km", hourlyRate: "65-75/hr", specialization: "Autism, PBS...", availability: "Weekdays (7 AM - 7PM)", readabilityScore: 92, readabilityShifts: 42, profileImage: "/placeholder-avatar.jpg" },
];