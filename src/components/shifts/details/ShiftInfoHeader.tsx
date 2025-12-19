import React from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, ClockCircle, MapPoint, UsersGroupRounded } from "@solar-icons/react";
import { Shift } from "@/types/shift-details";

interface Props {
  shift: Shift;
  statusBadgeStyle: string;
  statusLabel: string;
  formatLongDate: (date: string) => string;
  formatTime: (date: string) => string;
}

export const ShiftInfoHeader = React.memo(({ shift, statusBadgeStyle, statusLabel, formatLongDate, formatTime }: Props) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex gap-2 mb-3 sm:mb-4 items-center flex-wrap">
        <DialogTitle className="text-lg sm:text-xl font-montserrat-semibold text-gray-900">
          {shift.serviceTypeId?.name || "No Service Type"}
        </DialogTitle>
        <Badge className={statusBadgeStyle}>{statusLabel}</Badge>
        {shift.isMultiWorkerShift && (
          <Badge className="bg-primary-50 text-primary-700 border-primary-200">
            <UsersGroupRounded className="w-3 h-3 mr-1" /> Multi-Worker
          </Badge>
        )}
      </div>

      {/* Schedule */}
      <div className="py-3 sm:py-4">
        <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-2 sm:mb-3">Schedule</h3>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-1000">Date</p>
              <p className="text-sm font-montserrat-semibold text-gray-900">{formatLongDate(shift.startTime)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:gap-3">
            <ClockCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-1000">Time</p>
              <p className="text-sm font-montserrat-semibold text-gray-900">
                {formatTime(shift.startTime)} - {formatTime(shift.endTime)} 
                ({Math.round((new Date(shift.endTime).getTime() - new Date(shift.startTime).getTime()) / 60000)} mins)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-sm font-montserrat-semibold text-gray-900 mb-2 sm:mb-3">Location</h3>
        <div className="flex items-start gap-2 sm:gap-3">
          <MapPoint className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-1000 mb-1">
              {shift.locationType === "inPerson" ? "In-person Service" : "Remote Service"}
            </p>
            <p className="text-sm font-montserrat-semibold text-gray-900">{shift.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
});