/**
 * Unified Worker Card Component
 * 
 * Displays support worker information in a unified format across:
 * - Participant find support workers page
 * - Provider workforce page
 * - Provider marketplace
 * 
 * Automatically hides/shows content based on available data.
 * Uses the UnifiedSupportWorkerCard type to accept data from any context.
 */

import { useState } from "react";
import {
  Star,
  MapPoint,
  DollarMinimalistic,
  VerifiedCheck,
  Calendar,
  StarsMinimalistic,
} from "@solar-icons/react";
import {
  CARD,
  CARD_CONTENT,
  BUTTON_OUTLINE,
  cn,
  FLEX_COL,
  FLEX_COL_CENTER,
  TRANSITION,
} from "@/lib/design-utils";
import { UnifiedSupportWorkerCard } from "@/types/unified-support-worker";
import {
  BG_COLORS,
  BORDER_STYLES,
  BORDER_WIDTH,
  CONTAINER_PADDING,
  FLEX_LAYOUTS,
  FONT_FAMILY,
  FONT_WEIGHT,
  GAP,
  GRID_LAYOUTS,
  SPACING,
  TEXT_COLORS,
  TEXT_SIZE,
  TEXT_STYLES,
} from "@/constants/design-system";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ConfirmationDialog } from "@/components/modals/ConfirmationDialog";

interface UnifiedWorkerCardProps {
  worker: UnifiedSupportWorkerCard;
  // Base actions (participant context)
  onViewProfile: (id: string) => void;
  // Optional provider actions
  onContact?: (id: string) => void;
  onVet?: (id: string) => void;
  onHire?: (id: string) => void;
  // Workforce-specific actions
  onAddToWorkforce?: (id: string) => void;
  onAssignShift?: (id: string) => void;
  onDeleteWorker?: (id: string) => void;
  // Rendering options
  variant?: 'participant' | 'marketplace' | 'workforce';
}

export default function UnifiedWorkerCard({
  worker,
  onViewProfile,
  onContact,
  onVet,
  onHire,
  onAddToWorkforce,
  onAssignShift,
  onDeleteWorker,
  variant = 'marketplace',
}: UnifiedWorkerCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get worker name
  const workerName = worker.name || `${worker.firstName} ${worker.lastName}`.trim();
  const workerId = worker._id || worker.id || '';

  // Skip rendering if no ID
  if (!workerId) {
    console.warn('UnifiedWorkerCard: No worker ID provided (_id or id)');
    return null;
  }

  // Get rating
  const rating = worker.rating ?? worker.ratings?.average ?? 0;

  // Determine if vetting-specific UI should show
  const isVetted = worker.status === 'vetted';
  const isWorkforceContext = variant === 'workforce' || !!worker.status;

  // Determine if marketplace-specific content should show
  const isMarketplaceContext = variant === 'marketplace' || !!worker.readabilityScore;

  // Format hourly rate
  const formatHourlyRate = () => {
    if (typeof worker.hourlyRate === 'string') {
      return worker.hourlyRate;
    }
    if (typeof worker.hourlyRate === 'number') {
      return `$${worker.hourlyRate}/hr`;
    }
    if (worker.hourlyRate && typeof worker.hourlyRate === 'object') {
      const baseRate = worker.hourlyRate.baseRate;
      return baseRate ? `$${baseRate}/hr` : '';
    }
    return '';
  };

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    // Simulate processing
    setTimeout(() => {
      onDeleteWorker?.(workerId);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }, 500);
  };

  return (
    <div
      className={cn(
        CARD,
        TRANSITION,
        BORDER_STYLES.subtle,
        FLEX_COL,
        "hover:shadow-lg h-full"
      )}
    >
      <div className={cn(CARD_CONTENT, FLEX_COL, CONTAINER_PADDING.responsive)}>
        {/* Header: Avatar & Name */}
        <div className={cn(FLEX_COL_CENTER, `mb-${SPACING.sm}`)}>
          {/* Avatar with optional vetting badge */}
          <div className="relative mb-2">
            <Avatar className="w-16 h-16 border border-gray-100">
              <AvatarImage
                src={worker.profileImage || '/placeholder-avatar.jpg'}
                alt={workerName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-100 text-gray-900 font-montserrat-bold text-sm">
                {workerName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {/* Green Vetted Badge - only in workforce context */}
            {isWorkforceContext && isVetted && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-0.5 rounded-full border border-green-500 shadow-sm">
                <span className="text-[10px] font-montserrat-bold text-green-600 uppercase tracking-wide">
                  Vetted
                </span>
              </div>
            )}
          </div>

          {/* Name & Verification */}
          <div className="flex items-center gap-1 mb-0.5">
            <h3 className="font-montserrat-bold text-gray-900 text-lg">
              {workerName}
            </h3>
            {worker.isVerified && (
              <VerifiedCheck className="w-5 h-5 text-primary-600" />
            )}
          </div>
          <p className="text-gray-500 text-xs font-montserrat-medium">{worker.role}</p>
        </div>

        {/* Stats Row */}
        <div className={cn(FLEX_LAYOUTS.center, TEXT_STYLES.tiny, GAP.sm)}>
          <div className={cn(FLEX_LAYOUTS.center, GAP.sm)}>
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            <span>{rating}</span>
          </div>
          <div className="w-px h-3 bg-gray-300"></div>
          {worker.location && (
            <>
              <div className={cn(FLEX_LAYOUTS.center, GAP.sm)}>
                <MapPoint className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate max-w-[100px]">
                  {worker.location} {worker.distance && `(${worker.distance})`}
                </span>
              </div>
              <div className="w-px h-3 bg-gray-300"></div>
            </>
          )}
          {formatHourlyRate() && (
            <div className={cn(FLEX_LAYOUTS.center, GAP.sm)}>
              <DollarMinimalistic className="w-3.5 h-3.5 text-gray-400" />
              <span>{formatHourlyRate()}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className={cn(BORDER_STYLES.default, `my-${SPACING.sm}`)}></div>

        {/* Details Section - Marketplace Specific */}
        {isMarketplaceContext && (
          <div className={cn(FLEX_COL, GAP.sm, `py-${SPACING.base}`)}>
            {worker.specialization && (
              <div className={cn(FLEX_LAYOUTS.rowStart, GAP.sm)}>
                <StarsMinimalistic className="w-5 h-5 text-gray-800 shrink-0" />
                <span className={cn(TEXT_STYLES.label)}>
                  Specialization: <span>{worker.specialization}</span>
                </span>
              </div>
            )}

            {worker.availability && (
              <div className={cn(FLEX_LAYOUTS.rowStart, GAP.sm)}>
                <Calendar className={cn("w-5 h-5 text-gray-800 shrink-0")} />
                <span className={cn(TEXT_STYLES.label)}>
                  Availability: <span>{worker.availability}</span>
                </span>
              </div>
            )}

            {worker.readabilityScore !== undefined && (
              <div className="pt-1">
                <p className={cn(TEXT_STYLES.tiny, TEXT_COLORS.success, 'italic')}>
                  Readability Score: {worker.readabilityScore}/100 (
                  {worker.readabilityShifts} shifts)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions - Flex grow to push to bottom */}
        <div className={cn("mt-auto", "flex gap-3", GAP.responsive)}>
          {/* Workforce context: Show appropriate actions */}
          {isWorkforceContext ? (
            isVetted ? (
              <>
                {/* Vetted: Assign Shift (75% width) and Delete (25% width) */}
                <Button
                  onClick={() => onAssignShift?.(workerId)}
                  className={cn(
                    "flex-[3] bg-primary-600 text-white hover:bg-primary-700",
                    BORDER_WIDTH.thin
                  )}
                >
                  Assign Shift
                </Button>
                {onDeleteWorker && (
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    className={cn(
                      "flex-1 border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300",
                      BORDER_WIDTH.thin
                    )}
                  >
                    Delete
                  </Button>
                )}
              </>
            ) : (
              /* Unvetted: Single Add to Workforce button */
              <Button
                onClick={() => onAddToWorkforce?.(workerId)}
                className={cn(
                  "w-full", BG_COLORS.primary, TEXT_COLORS.white, "hover:bg-primary-700",
                  BORDER_WIDTH.thin
                )}
              >
                Add to Workforce
              </Button>
            )
          ) : (
            <>
              {/* Primary action: View Profile */}
              <Button
                onClick={() => onViewProfile(workerId)}
                className={cn('w-full', BUTTON_OUTLINE, BORDER_WIDTH.thin)}
              >
                View Profile
              </Button>

              {/* Marketplace context: Contact */}
              {/* {isMarketplaceContext && !isWorkforceContext && (
                <Button
                  onClick={() => onContact?.(workerId)}
                  className={cn(BUTTON_OUTLINE, BORDER_WIDTH.thin)}
                >
                  Contact
                </Button>
              )} */}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        title="Delete Support Worker?"
        description={`Are you sure you want to remove ${workerName} from your workforce? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        isDestructive={true}
        isProcessing={isDeleting}
      />
    </div>
  );
}
