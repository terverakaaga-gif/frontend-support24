import React from "react";
import ProfileAvatar from "./ProfileAvater";
import { User } from "@/types/user.types";

interface GeneralHeaderProps {
  title: string;
  subtitle?: string;
  user: User;
  onLogout: () => void;
  onViewProfile: () => void;
  onSettings?: () => void;
  rightComponent?: React.ReactNode;
  stickyTop?: boolean;
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
}) => {
  return (
    <header
      className={`flex items-center justify-between mb-3 ${
        stickyTop ? "sticky top-0 z-10" : ""
      }`}
    >
      <div>
        <h1 className="text-2xl font-montserrat-bold text-gray-900">{title}</h1>
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
  );
};

export default GeneralHeader;
