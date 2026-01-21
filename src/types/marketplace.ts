export interface SupportWorker {
  id: string;
  name: string;
  isVerified: boolean;
  role: string;
  rating: number;
  location: string;
  distance: string;
  hourlyRate: string; // e.g., "$65-75/hr"
  specialization: string;
  availability: string;
  readabilityScore: number;
  readabilityShifts: number;
  profileImage: string;
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