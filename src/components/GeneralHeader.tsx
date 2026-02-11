import React from "react";
import ProfileAvatar from "./ProfileAvater";
import { User } from "@/types/user.types";
import { Button } from "./ui/button";
import { ArrowLeft } from "@solar-icons/react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/design-utils";
import { SPACING, BG_COLORS, Z_INDEX, GAP, HEADING_STYLES, TEXT_STYLES } from "@/constants/design-system";

interface GeneralHeaderProps {
  title: string;
  subtitle?: string;
  user: User;
  onLogout: () => void;
  onViewProfile: () => void;
  onSettings?: () => void;
  rightComponent?: React.ReactNode;
  stickyTop?: boolean;
  showBackButton?: boolean;
}

const GeneralHeader: React.FC<GeneralHeaderProps> = ({
  title,
  subtitle,
  user,
  onLogout,
  onViewProfile,
  onSettings,
  rightComponent,
  stickyTop = false,
  showBackButton = false,
}) => {
  const navigate = useNavigate();

  // Sticky classes for different breakpoints
  const stickyClasses = stickyTop
    ? cn("sticky top-0", Z_INDEX.sticky, `py-${SPACING.base}`, "-mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8")
    : "";

  return (
    <header className={cn(`mb-${SPACING.md} lg:mb-${SPACING['2xl']}`, stickyClasses)}>
      {/* Mobile: offset for hamburger menu (pt-12), tablets and up: no offset */}
      <div className="pt-12 md:pt-0">
        {/* Flex container for the entire top section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {/* Left side: Back button (if any) and Title/Subtitle */}
          <div className="flex-1 min-w-0 flex flex-col items-start">
            {showBackButton && (
              <Button
                variant="link"
                onClick={() => navigate(-1)}
                className="text-primary hover:text-primary/80 p-0 mb-2 h-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-1 md:mr-2" />
                <span className="text-sm">Back</span>
              </Button>
            )}

            <div className="w-full">
              <h1 className={cn(
                "font-montserrat-bold text-gray-900 truncate",
                "text-lg md:text-xl lg:text-2xl"
              )}>
                {title}
              </h1>
              {subtitle && (
                <p className={cn(
                  "text-gray-600 text-xs md:text-sm",
                  `mt-${SPACING.xs}`
                )}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right side: Right component and Profile Avatar */}
          <div className={cn("flex items-center shrink-0", GAP.sm, "place-self-end")}>
            {rightComponent && <div className="hidden sm:block">{rightComponent}</div>}
            <ProfileAvatar
              user={user}
              onLogout={onLogout}
              onViewProfile={onViewProfile}
              onSettings={onSettings}
            />
          </div>

          {/* Mobile Right Component - Only if specifically needed to be separate */}
          {rightComponent && (
            <div className="sm:hidden w-full flex justify-end">
              {rightComponent}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default GeneralHeader;
