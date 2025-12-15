import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "@solar-icons/react";
import { Worker } from "@/types/organization.types";
import { getWorkerDisplayName, getWorkerEmail, getWorkerInitials, getWorkerPhone, getWorkerProfileImage } from "@/lib/utils";
import { getRateBandCode, getRateBandName } from "@/lib/organization";

interface WorkerDetailsProps {
  worker: Worker;
  canRemove: boolean;
  isRemoving: boolean;
  onRemove: (workerId: string) => void;
}

export const WorkerDetails = ({ worker, canRemove, isRemoving, onRemove }: WorkerDetailsProps) => {
  // Memoize date formatting
  const formattedDates = useMemo(() => ({
    start: format(parseISO(worker.serviceAgreement.startDate), "dd/MM/yyyy"),
    joined: format(parseISO(worker.joinedDate), "dd/MM/yyyy")
  }), [worker.serviceAgreement.startDate, worker.joinedDate]);

  return (
    <div className="p-3 md:p-4 space-y-3 md:space-y-4">
      {/* Worker Info Header */}
      <div className="text-center">
        <Avatar className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-3">
          {getWorkerProfileImage(worker.workerId) ? (
            <AvatarImage src={getWorkerProfileImage(worker.workerId)} />
          ) : (
            <AvatarFallback className="bg-primary-100 text-primary-600 text-base md:text-2xl font-montserrat-semibold">
              {getWorkerInitials(worker.workerId)}
            </AvatarFallback>
          )}
        </Avatar>
        <h4 className="font-montserrat-bold text-gray-900 text-sm md:text-base mb-1">
          {getWorkerDisplayName(worker.workerId)}
        </h4>
        <p className="text-xs md:text-sm text-gray-600 mb-0.5">
          {getWorkerEmail(worker.workerId)}
        </p>
        <p className="text-xs md:text-sm text-gray-600">
          {getWorkerPhone(worker.workerId)}
        </p>
      </div>

      {/* Service Agreement Section */}
      <div>
        <h5 className="font-montserrat-semibold text-gray-900 text-sm md:text-base mb-2 md:mb-3">
          Service Agreement
        </h5>
        <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Hourly Rate:</span>
            <span className="font-montserrat-bold text-primary-600">
              ${worker.serviceAgreement.baseHourlyRate}/hr
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Distance Travel Rate:</span>
            <span className="font-montserrat-semibold text-gray-900">
              ${worker.serviceAgreement.distanceTravelRate}/km
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Start Date:</span>
            <span className="font-montserrat-semibold text-gray-900">
              {formattedDates.start}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Terms Accepted:</span>
            <span className="font-montserrat-semibold text-gray-900">
              {worker.serviceAgreement.termsAccepted ? (
                <span className="text-green-600 flex items-center gap-1">
                  Yes <CheckCircle className="w-3 h-3" />
                </span>
              ) : (
                "No"
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Joined Date:</span>
            <span className="font-montserrat-semibold text-gray-900">
              {formattedDates.joined}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <Badge className="bg-green-50 text-green-600 text-xs">Active</Badge>
          </div>
        </div>
      </div>

      {/* Shift Rates Section */}
      <div>
        <h5 className="font-montserrat-semibold text-gray-900 text-sm md:text-base mb-2 md:mb-3">
          Shift Rates
        </h5>
        <div className="space-y-1 md:space-y-2">
          {worker.serviceAgreement.shiftRates.map((rate) => (
            <div key={rate._id} className="p-2 md:p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="font-montserrat-semibold text-gray-900 text-xs md:text-sm">
                  {getRateBandName(rate.rateTimeBandId)}
                </span>
                <span className="font-montserrat-bold text-primary-600 text-xs md:text-sm">
                  ${rate.hourlyRate}/hr
                </span>
              </div>
              {getRateBandCode(rate.rateTimeBandId) && (
                <p className="text-xs text-gray-500">
                  Code: {getRateBandCode(rate.rateTimeBandId)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {canRemove && (
        <Button
          disabled={isRemoving}
          onClick={() => onRemove(typeof worker.workerId === 'string' ? worker.workerId : worker.workerId._id as string)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-montserrat-semibold text-sm md:text-base min-h-[44px]"
        >
          Remove Worker {isRemoving ? "..." : ""}
        </Button>
      )}
    </div>
  );
};