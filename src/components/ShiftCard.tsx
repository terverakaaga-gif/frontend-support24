import {
  ArrowRightUp,
  Calendar,
  ClockCircle,
  MapPoint,
  User,
} from "@solar-icons/react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  CARD,
  FLEX_ROW_CENTER,
  FLEX_ROW_BETWEEN,
  FLEX_COL,
  TEXT_SMALL,
  TEXT_MUTED,
  BUTTON_BASE,
  cn,
} from "@/lib/design-utils";
import { CONTAINER_PADDING, GAP } from "@/constants/design-system";

interface ShiftCardProps {
  shift: any;
  onClick: () => void;
  viewMode?: "grid" | "list";
}

const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  onClick,
  viewMode = "grid",
}) => {
  const { user } = useAuth();
  console.log("Shift Data:", shift);

  const participant: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    profileImage: string;
  } = shift.participantId;

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-primary-100/70 text-primary border-primary-200";
      case "pending":
        return "bg-orange-100/70 text-orange-600 border-orange-200";
      case "in progress":
      case "in_progress":
        return "bg-purple-100/70 text-purple-600 border-purple-200";
      case "completed":
        return "bg-green-100/70 text-green-600 border-green-200";
      case "cancelled":
        return "bg-red-100/70 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    return (
      status.replace(/_/g, " ").charAt(0).toUpperCase() +
      status.replace(/_/g, " ").slice(1)
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return `${diff.toFixed(1)}hr duration`;
  };

  if (viewMode === "list") {
    return (
      <div className={cn(CARD,CONTAINER_PADDING.card, "cursor-pointer")} onClick={onClick}>
        <div className={cn(FLEX_COL, "sm:flex-row md:items-start items-center justify-between", GAP.sm, "sm:gap-4")}>
          {/* Left Section - Service Info */}
          <div className="flex-shrink-0 min-w-0 w-full sm:w-auto">
            <div className="flex items-start gap-1 flex-1 min-w-0 mb-3">
              <h3 className={cn(TEXT_SMALL, "font-montserrat-semibold mt-1.5")}>
                {shift.serviceTypeId?.name || "No Service Type"}
              </h3>
              <span
                className={`inline-flex px-2 sm:px-3 py-1 text-xs font-montserrat-semibold rounded-full ${getStatusBadgeStyle(
                  shift.status
                )}`}
              >
                {getStatusLabel(shift.status)}
              </span>
            </div>
            <div className={cn(FLEX_ROW_CENTER, GAP.sm, TEXT_MUTED)}>
              <span>Date: {formatDate(shift.startTime)}</span>
              <span>|</span>
              <span>
                Time: {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
              </span>
            </div>
          </div>

          {/* Middle Section - User & Location */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 flex-1 min-w-0 w-full sm:w-auto">
            <div className={cn(FLEX_ROW_CENTER, GAP.sm, "text-xs md:text-sm")}>
              <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">
                {participant.firstName} {participant.lastName}
              </span>
            </div>

            <div className={cn(FLEX_ROW_CENTER, GAP.sm, "text-xs sm:text-sm", "flex-1 min-w-0", TEXT_MUTED)}>
              <MapPoint className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{shift.address}</span>
            </div>
          </div>

          {/* Right Section - Status & Action */}
          <div className={cn(FLEX_ROW_CENTER, GAP.sm, "flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end")}>
            <Button className={cn(BUTTON_BASE, "bg-primary w-6 h-6 text-white p-1.5 sm:p-2 rounded-full")}>
              <ArrowRightUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className={cn(CARD,CONTAINER_PADDING.card, "cursor-pointer")} onClick={onClick}>
      {/* Header with Title and Status */}
      <div className={cn(FLEX_ROW_BETWEEN, "items-start mb-3 sm:mb-4")}>
        <div className={cn(FLEX_ROW_CENTER, GAP.sm, "flex-1 min-w-0")}>
          <h3 className={cn(TEXT_SMALL, "font-montserrat-semibold mt-1.5")}>
            {shift.serviceTypeId?.name || "No Service Type"}
          </h3>
          <span
            className={`inline-flex px-2 sm:px-3 py-1 text-xs font-montserrat-semibold rounded-full ${getStatusBadgeStyle(
              shift.status
            )}`}
          >
            {getStatusLabel(shift.status)}
          </span>
        </div>

        {/* Avatar Stack */}
        <div className={cn("flex -space-x-1 sm:-space-x-2 flex-shrink-0")}>
          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white">
            <AvatarImage src={participant.profileImage} alt="Avatar" />
            <AvatarFallback>
              {participant.firstName.charAt(0)}
              {participant.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white">
            <AvatarImage src={user.profileImage} alt="Avatar" />
            <AvatarFallback>
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Date and Time Info */}
      <div className={cn("space-y-1 sm:space-y-2 mb-3 sm:mb-4")}>
        <div className={cn(FLEX_ROW_CENTER, GAP.sm, "text-xs sm:text-sm", TEXT_MUTED)}>
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className={cn("font-montserrat-semibold")}>Date:</span>
          <span>{formatDate(shift.startTime)}</span>
        </div>
        <div className={cn(FLEX_ROW_CENTER, GAP.sm, "text-xs sm:text-sm", TEXT_MUTED)}>
          <ClockCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className={cn("font-montserrat-semibold")}>Time:</span>
          <span>
            {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
          </span>
          <span className={cn(TEXT_MUTED, "text-xs")}>
            ({calculateDuration(shift.startTime, shift.endTime)})
          </span>
        </div>
      </div>

      {/* Participant and Location Pills */}
      <div className={cn(FLEX_COL, "sm:flex-row items-start sm:items-center gap-2 flex-wrap")}>
        <div className={cn("bg-gray-100 rounded-full border border-gray-200 px-2 sm:px-3 py-1 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 w-fit sm:w-auto")}>
          <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate font-montserrat-semibold">
            {shift.participantId?.firstName} {shift.participantId?.lastName}
          </span>
        </div>
        <div className={cn("bg-gray-100 rounded-full border border-gray-200 px-2 sm:px-3 py-1 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 flex-1 min-w-0 w-fit sm:w-auto")}>
          <MapPoint className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate font-montserrat-semibold">
            {shift.address}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShiftCard;
