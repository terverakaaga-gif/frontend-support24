import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Worker } from "@/types/suport-worker-organization.types";

interface WorkerDetailsProps {
  worker: any; // Using any since the actual structure differs from the type
}

export const SupportWorkerDetails = ({ worker }: WorkerDetailsProps) => {
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getBaseRate = (hourlyRate: any) => {
    if (typeof hourlyRate === 'number') return hourlyRate;
    if (typeof hourlyRate === 'object' && hourlyRate?.baseRate) return hourlyRate.baseRate;
    return 0;
  };

  const joinedDate = useMemo(() => {
    if (worker.createdAt) {
      return format(parseISO(worker.createdAt), "dd/MM/yyyy");
    }
    return "N/A";
  }, [worker.createdAt]);

  return (
    <div className="p-3 md:p-4 space-y-3 md:space-y-4">
      {/* Worker Info */}
      <div className="text-center">
        <Avatar className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-2 md:mb-3">
          {worker.profileImage ? (
            <AvatarImage src={worker.profileImage} />
          ) : (
            <AvatarFallback className="bg-primary-100 text-primary-600 text-lg md:text-2xl font-montserrat-semibold">
              {getInitials(worker.firstName, worker.lastName)}
            </AvatarFallback>
          )}
        </Avatar>
        <h4 className="font-montserrat-bold text-gray-900 text-sm md:text-base mb-1">
          {worker.firstName} {worker.lastName}
        </h4>
        <p className="text-xs md:text-sm text-gray-600 mb-0.5">
          {worker.email}
        </p>
        <p className="text-xs md:text-sm text-gray-600">
          {worker.phone}
        </p>
      </div>

      {/* Basic Info */}
      <div>
        <h5 className="font-montserrat-semibold text-gray-900 text-sm md:text-base mb-2 md:mb-3">
          Profile Information
        </h5>
        <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Hourly Rate:</span>
            <span className="font-montserrat-bold text-primary-600">
              ${getBaseRate(worker.hourlyRate)}/hr
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Travel Radius:</span>
            <span className="font-montserrat-semibold text-gray-900">
              {worker.travelRadiusKm || 0} km
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Member Since:</span>
            <span className="font-montserrat-semibold text-gray-900">
              {joinedDate}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <Badge className="bg-green-50 text-green-600 text-xs capitalize">
              {worker.status || "Active"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Shift Rates */}
      {worker.shiftRates && worker.shiftRates.length > 0 && (
        <div>
          <h5 className="font-montserrat-semibold text-gray-900 text-sm md:text-base mb-2 md:mb-3">
            Shift Rates
          </h5>
          <div className="space-y-1 md:space-y-2">
            {worker.shiftRates.map((rate: any) => (
              <div key={rate._id} className="p-2 md:p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-montserrat-semibold text-gray-900 text-xs md:text-sm">
                    {rate.rateTimeBandId?.name || "Shift"}
                  </span>
                  <span className="font-montserrat-bold text-primary-600 text-xs md:text-sm">
                    ${rate.hourlyRate}/hr
                  </span>
                </div>
                {rate.rateTimeBandId?.code && (
                  <p className="text-xs text-gray-500">
                    Code: {rate.rateTimeBandId.code}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {worker.languages && worker.languages.length > 0 && (
        <div>
          <h5 className="font-montserrat-semibold text-gray-900 text-sm md:text-base mb-2 md:mb-3">
            Languages
          </h5>
          <div className="flex flex-wrap gap-2">
            {worker.languages.map((lang: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
