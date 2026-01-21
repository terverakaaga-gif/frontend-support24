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
} from "@/lib/design-utils";
import { SupportWorker } from "@/types/marketplace";
import {
  BORDER_STYLES,
  BORDER_WIDTH,
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

interface WorkerCardProps {
  worker: SupportWorker;
  onViewProfile: (id: string) => void;
  onContact: (id: string) => void;
}

export default function WorkerCard({
  worker,
  onViewProfile,
  onContact,
}: WorkerCardProps) {
  return (
    <div
      className={cn(
        CARD,
        "hover:shadow-lg transition-all duration-200 border-gray-100 flex flex-col h-full"
      )}
    >
      <div className={cn(CARD_CONTENT, "p-5 flex flex-col h-full")}>
        {/* Header: Avatar & Name */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative mb-2">
            <img
              src={worker.profileImage}
              alt={worker.name}
              className="w-16 h-16 rounded-full object-cover border border-gray-100"
            />
          </div>

          <div className="flex items-center gap-1 mb-0.5">
            <h3 className="font-montserrat-bold text-gray-900 text-lg">
              {worker.name}
            </h3>
            {worker.isVerified && (
              <VerifiedCheck className="w-5 h-5 text-primary-600" />
            )}
          </div>
          <p className="text-gray-500 text-xs font-medium">{worker.role}</p>
        </div>

        {/* Stats Row */}
        <div className={cn(FLEX_LAYOUTS.center, TEXT_STYLES.tiny, GAP.sm)}>
          <div className={cn(FLEX_LAYOUTS.center, GAP.sm)}>
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            <span>{worker.rating}</span>
          </div>
          <div className="w-px h-3 bg-gray-300"></div>
          <div className={cn(FLEX_LAYOUTS.center, GAP.sm)}>
            <MapPoint className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate max-w-[100px]">
              {worker.location} {worker.distance && `(${worker.distance})`}
            </span>
          </div>
          <div className="w-px h-3 bg-gray-300"></div>
          <div className={cn(FLEX_LAYOUTS.center, GAP.sm)}>
            <DollarMinimalistic className="w-3.5 h-3.5 text-gray-400" />
            <span>{worker.hourlyRate}</span>
          </div>
        </div>

        {/* Divider */}
        <div
          className={cn(
            BORDER_STYLES.default,
            `mt-${SPACING.sm}`
          )}
        ></div>

        {/* Details */}
        <div className={cn(FLEX_COL, GAP.sm, `py-${SPACING.base}`)}>
          <div className={cn(FLEX_LAYOUTS.rowStart, GAP.sm)}>
            <StarsMinimalistic className="w-5 h-5 text-gray-800 shrink-0" />
            <span className={cn(TEXT_STYLES.label)}>
              Specialization: <span>{worker.specialization}</span>
            </span>
          </div>

          <div className={cn(FLEX_LAYOUTS.rowStart, GAP.sm)}>
            <Calendar className={cn("w-5 h-5 text-gray-800 shrink-0")} />
            <span className={cn(TEXT_STYLES.label)}>
              Availability: <span>{worker.availability}</span>
            </span>
          </div>

          <div className="pt-1">
            <p className={cn(TEXT_STYLES.tiny,TEXT_COLORS.success, 'italic')}>
              Readability Score: {worker.readabilityScore}/100 (
              {worker.readabilityShifts} shifts)
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={cn(GRID_LAYOUTS.cols2, GAP.responsive)}>
          <Button
            onClick={() => onViewProfile(worker.id)}
            className={cn(BUTTON_OUTLINE, BORDER_WIDTH.thin)}
          >
            View Profile
          </Button>
          <Button
            onClick={() => onContact(worker.id)}
            className={cn(BUTTON_OUTLINE, BORDER_WIDTH.thin)}
          >
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
}
