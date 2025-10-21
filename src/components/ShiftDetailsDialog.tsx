import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  MapPoint,
  Calendar,
  CloseCircle,
  ClockCircle,
} from "@solar-icons/react";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";

interface ShiftDetailsDialogProps {
  shift: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShiftDetailsDialog: React.FC<ShiftDetailsDialogProps> = ({
  shift,
  open,
  onOpenChange,
}) => {
  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-primary-50 text-primary border-primary-200";
      case "pending":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "in_progress":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "completed":
        return "bg-green-50 text-green-600 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200";
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatLongDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!shift) return null;
  
  const participant: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    profileImage: string;
  } = shift.participantId;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-100 rounded-lg max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-10 z-50">
          <Dialog.Close className="absolute right-3 top-3 sm:right-4 sm:top-4 p-1 hover:bg-gray-100 rounded-full">
            <CloseCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-1000" />
          </Dialog.Close>

          <div className="flex gap-2 mb-3 sm:mb-4 items-center">
            <Dialog.Title className="text-lg sm:text-xl font-montserrat-semibold text-gray-900">
              {shift.serviceTypeId.name}
            </Dialog.Title>
            <span
              className={`px-2 py-1 sm:px-3 sm:py-1 text-xs font-montserrat-semibold border rounded-full ${getStatusBadgeStyle(
                shift.status
              )}`}
            >
              {getStatusLabel(shift.status)}
            </span>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Schedule */}
            <div className="py-3 sm:py-4">
              <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-2 sm:mb-3">
                Schedule
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-1000">Date</p>
                    <p className="text-sm font-montserrat-semibold text-gray-900">
                      {formatLongDate(shift.startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <ClockCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-1000">Time</p>
                    <p className="text-sm font-montserrat-semibold text-gray-900">
                      {formatTime(shift.startTime)} -{" "}
                      {formatTime(shift.endTime)} (
                      {Math.round(
                        (new Date(shift.endTime).getTime() -
                          new Date(shift.startTime).getTime()) /
                          60000
                      )}{" "}
                      mins)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-2 sm:mb-3">
                Location
              </h3>
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPoint className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-1000 mb-1">
                    In-person Service
                  </p>
                  <p className="text-sm font-montserrat-semibold text-gray-900">
                    {shift.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Shift Information */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-2 sm:mb-3">
                Shift Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-y-3 text-xs md:text-sm">
                <div className="flex justify-between items-center">
                  <p className="text-gray-1000">Shift ID:</p>
                  <p className="font-montserrat-semibold text-gray-900">
                    {shift.shiftId}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-1000">Service Type:</p>
                  <p className="font-montserrat-semibold text-gray-900">
                    {shift.serviceTypeId.name}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-1000">Requires Supervision:</p>
                  <p className="font-montserrat-semibold text-gray-900">
                    {shift.requiresSupervision ? "Yes" : "No"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-1000">Participant:</p>
                 <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={participant.profileImage}
                      alt={`${participant.firstName} ${participant.lastName}`}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <AvatarFallback
                      className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-montserrat-semibold text-xs"
                      delayMs={600}
                    >
                      {participant.firstName.charAt(0)}
                      {participant.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                   <p className="font-montserrat-semibold text-gray-900">
                    {participant.firstName}{" "}
                    {participant.lastName}
                  </p>
                 </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {shift.specialInstructions && (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 sm:p-4">
                <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-2 sm:mb-3">
                  Special Instructions
                </h3>
                <div className="bg-primary-800/10 rounded-md p-2 sm:p-3">
                  <p className="text-xs md:text-sm text-primary">
                    {shift.specialInstructions}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ShiftDetailsDialog;
