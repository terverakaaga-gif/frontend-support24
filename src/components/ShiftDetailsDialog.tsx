import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  MapPoint,
  Calendar,
  CloseCircle,
  ClockCircle
} from '@solar-icons/react';
    
interface ShiftDetailsDialogProps {
  shift: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShiftDetailsDialog: React.FC<ShiftDetailsDialogProps> = ({ 
  shift, 
  open, 
  onOpenChange 
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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg max-w-2xl w-[90vw] max-h-[90vh] overflow-y-auto p-6 z-50">
          <Dialog.Close className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full">
            <CloseCircle className="w-6 h-6 text-gray-1000" />
          </Dialog.Close>

          <div className="flex gap-2 mb-4 items-center">
            <Dialog.Title className="text-xl font-montserrat-semibold text-gray-900">
              {shift.serviceTypeId.name}
            </Dialog.Title>
            <span
              className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusBadgeStyle(
                shift.status
              )}`}
            >
              {getStatusLabel(shift.status)}
            </span>
          </div>

          <div className="space-y-6">
            {/* Schedule */}
            <div className="py-4">
              <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-3">
                Schedule
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-1000">Date</p>
                    <p className="text-sm font-montserrat-semibold text-gray-900">
                      {formatLongDate(shift.startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClockCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-1000">Time</p>
                    <p className="text-sm font-montserrat-semibold text-gray-900">
                      {formatTime(shift.startTime)} - {formatTime(shift.endTime)} (
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
              <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-3">
                Location
              </h3>
              <div className="flex items-start gap-3">
                <MapPoint className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-1000 mb-1">
                    In-person Service
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {shift.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Shift Information */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-3">
                Shift Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-gray-1000">Shift ID:</p>
                  <p className="font-medium text-gray-900">
                    {shift.shiftId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-1000">Service Type:</p>
                  <p className="font-medium text-gray-900">
                    {shift.serviceTypeId.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-1000">Requires Supervision:</p>
                  <p className="font-medium text-gray-900">
                    {shift.requiresSupervision ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-1000">Participant:</p>
                  <p className="font-medium text-gray-900">
                    {shift.participantId?.firstName} {shift.participantId?.lastName}
                  </p>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {shift.specialInstructions && (
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-3">
                  Special Instructions
                </h3>
                <div className="bg-primary-50 border border-primary-100 rounded-md p-3">
                  <p className="text-sm text-primary-900">
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