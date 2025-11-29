import React from "react";
import ProfileAvatar from "./ProfileAvater";
import { User } from "@/types/user.types";
import { Button } from "./ui/button";
import { ArrowLeft } from "@solar-icons/react";
import { useNavigate } from "react-router-dom";

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
  
  return (
    <>
      {/* Desktop view - lg and above */}
      <header
        className={`hidden lg:flex items-center justify-between mb-8 ${
          stickyTop ? "sticky top-0 z-10 bg-gray-100 py-4 -mx-8 px-8" : ""
        }`}
      >
        <div>
          {showBackButton && (
            <Button
              variant="link"
              onClick={() => navigate(-1)}
              className="text-primary hover:text-primary/80 p-0 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
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
        <div className="flex items-center gap-3">
          {rightComponent && rightComponent}
          <ProfileAvatar
            user={user}
            onLogout={onLogout}
            onViewProfile={onViewProfile}
            onSettings={onSettings}
          />
        </div>
      </header>

      {/* Tablet view - md to lg */}
      <header
        className={`hidden md:flex lg:hidden flex-col mb-6 ${
          stickyTop ? "sticky top-0 z-10 bg-gray-100 py-4 -mx-6 px-6" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <Button
                variant="link"
                onClick={() => navigate(-1)}
                className="text-primary hover:text-primary/80 p-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {rightComponent && rightComponent}
            <ProfileAvatar
              user={user}
              onLogout={onLogout}
              onViewProfile={onViewProfile}
              onSettings={onSettings}
            />
          </div>
        </div>
        <div>
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

      {/* Mobile view - below md */}
      <header
        className={`md:hidden mb-6 ${
          stickyTop ? "sticky top-0 z-10 bg-gray-100 py-4 -mx-4 px-4" : ""
        }`}
      >
        {/* Top row: Back button (if any) and actions - offset for hamburger menu */}
        <div className="flex items-center justify-end gap-2 mb-4 pt-12">
          {showBackButton && (
            <Button
              variant="link"
              onClick={() => navigate(-1)}
              className="text-primary hover:text-primary/80 p-0 mr-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-sm">Back</span>
            </Button>
          )}
          {rightComponent && (
            <div className="flex-shrink-0">{rightComponent}</div>
          )}
          <ProfileAvatar
            user={user}
            onLogout={onLogout}
            onViewProfile={onViewProfile}
            onSettings={onSettings}
          />
        </div>

        {/* Title and subtitle */}
        <div>
          <h1 className="text-lg font-montserrat-bold text-gray-900 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs font-montserrat-semibold text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </header>
    </>
  );
};

export default GeneralHeader;
