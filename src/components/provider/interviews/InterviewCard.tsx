import { Play } from "@solar-icons/react";
import {
  cn,
  CARD_INTERACTIVE,
  TEXT_TRUNCATE,
  FLEX_ROW_BETWEEN,
  FLEX_COL,
  FLEX_COL_CENTER,
} from "@/lib/design-utils";
import {
  RADIUS,
  SPACING,
  TEXT_COLORS,
  FONT_FAMILY,
  TEXT_SIZE,
  BG_COLORS,
  GAP,
  FLEX_LAYOUTS,
} from "@/constants/design-system";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { InterviewSession } from "@/types/interview";

interface InterviewCardProps {
  session: InterviewSession;
  onClick: (session: InterviewSession) => void;
}

export function InterviewCard({ session, onClick }: InterviewCardProps) {
  return (
    <div
      className={cn(CARD_INTERACTIVE, FLEX_COL, "h-full group")}
      onClick={() => onClick(session)}
    >
      {/* Thumbnail Section */}
      <div
        className={cn(
          "relative w-full aspect-video",
          RADIUS.lg,
          BG_COLORS.gray100,
        )}
      >
        <img
          src={session.thumbnail}
          alt={session.candidateName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 rounded-full p-3 shadow-lg backdrop-blur-sm">
            <Play className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-montserrat-medium">
          {session.durationLabel}
        </div>
      </div>

      {/* Content Section */}
      <div className={cn("p-4 flex flex-col gap-3")}>
        <div>
          <h3
            className={cn(
              "font-montserrat-bold text-gray-900 line-clamp-1",
              TEXT_SIZE.sm,
            )}
          >
            Support Worker Screening Interview - {session.date}
          </h3>
        </div>

        <div className={cn(FLEX_LAYOUTS.rowStart, GAP.sm)}>
          <Avatar className="w-12 h-12 border border-gray-100">
            <AvatarImage src={session.avatar} alt={session.candidateName} />
            <AvatarFallback>
              {session.candidateName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span
              className={cn(
                TEXT_SIZE.sm,
                FONT_FAMILY.montserratMedium,
                TEXT_COLORS.gray900,
                TEXT_TRUNCATE,
              )}
            >
              {session.candidateName}
            </span>
            <span className={cn("text-xs text-gray-500")}>{session.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
