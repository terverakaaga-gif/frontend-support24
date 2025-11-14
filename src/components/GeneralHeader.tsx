import React from "react";
import ProfileAvatar from "./ProfileAvater";
import { User } from "@/types/user.types";
import { Button } from "./ui/button";
import { ArrowLeft } from "@solar-icons/react";

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
  return (
    <>
      {/* Desktop view */}
      <header
        className={`hidden md:flex items-center justify-between mb-12 ${
          stickyTop ? "sticky top-0 z-10" : ""
        }`}
      >
        <div>
          {showBackButton && (
            <Button
              variant="ghost"
              className="flex gap-3 items-center hover:bg-transparent hover:text-black"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
          )}
          <h1 className="text-2xl font-montserrat-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm font-montserrat-semibold text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 mb-3">
          {rightComponent && rightComponent}
          <ProfileAvatar
            user={user}
            onLogout={onLogout}
            onViewProfile={onViewProfile}
            onSettings={onSettings}
          />
        </div>
      </header>
      {/* Mobile view */}
      <header className="md:hidden top-10 relative">
        <div className="flex items-center gap-3 place-self-end -mt-3 mb-1">
          {showBackButton && (
            <Button
              variant="ghost"
              className="flex gap-3 items-center hover:bg-transparent hover:text-black text-xs font-montserrat-semibold"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
          )}
          {rightComponent && rightComponent}
          <ProfileAvatar
            user={user}
            onLogout={onLogout}
            onViewProfile={onViewProfile}
            onSettings={onSettings}
          />
        </div>
        <div className="mb-3">
          <h1 className="text-xl font-montserrat-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm font-montserrat-semibold text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </header>
    </>
  );
};

export default GeneralHeader;
