/**
 * Marketplace WorkerCard Component
 * 
 * Legacy wrapper component that uses the unified UnifiedWorkerCard
 * for consistent worker display in the marketplace context.
 * 
 * Kept for backward compatibility while transitioning to unified component.
 */

import UnifiedWorkerCard from "@/components/UnifiedWorkerCard";
import { UnifiedSupportWorkerCard } from "@/types/unified-support-worker";
import { SupportWorker } from "@/types/marketplace";

interface WorkerCardProps {
  worker: SupportWorker;
  onViewProfile: (id: string) => void;
  // onContact: (id: string) => void;
}

export default function WorkerCard({
  worker,
  onViewProfile,
  // onContact,
}: WorkerCardProps) {
  // Convert marketplace SupportWorker to UnifiedSupportWorkerCard
  const unifiedWorker: UnifiedSupportWorkerCard = {
    _id: worker._id || worker.id,
    id: worker.id,
    firstName: worker.firstName || worker.name?.split(' ')[0] || '',
    lastName: worker.lastName || worker.name?.split(' ').slice(1).join(' ') || '',
    name: worker.name,
    email: worker.email || '',
    phone: worker.phone || '',
    profileImage: worker.profileImage,
    role: worker.role,
    location: worker.location,
    distance: worker.distance,
    hourlyRate: worker.hourlyRate,
    rating: worker.rating,
    isVerified: worker.isVerified,
    specialization: worker.specialization,
    availability: worker.availability,
    readabilityScore: worker.readabilityScore,
    readabilityShifts: worker.readabilityShifts,
    skills: worker.skills,
    languages: worker.languages,
    bio: worker.bio,
    serviceAreas: worker.serviceAreas,
    verificationStatus: worker.verificationStatus,
  };

  return (
    <UnifiedWorkerCard
      worker={unifiedWorker}
      onViewProfile={onViewProfile}
      // onContact={onContact}
      variant="marketplace"
    />
  );
}
