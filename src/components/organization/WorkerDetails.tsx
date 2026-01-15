import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "@solar-icons/react";
import { Worker } from "@/types/organization.types";
import { getWorkerDisplayName, getWorkerEmail, getWorkerInitials, getWorkerPhone, getWorkerProfileImage } from "@/lib/utils";
import { getRateBandCode, getRateBandName } from "@/lib/organization";

import {
  cn,
  FLEX_ROW_BETWEEN,
} from "@/lib/design-utils";
import {
  GAP,
  BG_COLORS,
  SPACING,
  FONT_FAMILY,
  TEXT_COLORS,
  TEXT_STYLES,
  RADIUS,
} from "@/constants/design-system";

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
    <div className={cn("p-3 md:p-4", `space-y-${SPACING.md}`)}>
      {/* Worker Info Header */}
      <div className="text-center">
        <Avatar className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-3">
          {getWorkerProfileImage(worker.workerId) ? (
            <AvatarImage src={getWorkerProfileImage(worker.workerId)} />
          ) : (
            <AvatarFallback className={cn("bg-primary-100 text-primary-600 text-base md:text-2xl", FONT_FAMILY.montserratSemibold)}>
              {getWorkerInitials(worker.workerId)}
            </AvatarFallback>
          )}
        </Avatar>
        <h4 className={cn(FONT_FAMILY.montserratBold, TEXT_COLORS.gray900, "text-sm md:text-base mb-1")}>
          {getWorkerDisplayName(worker.workerId)}
        </h4>
        <p className={cn(TEXT_STYLES.small, TEXT_COLORS.gray600, "mb-0.5")}>
          {getWorkerEmail(worker.workerId)}
        </p>
        <p className={cn(TEXT_STYLES.small, TEXT_COLORS.gray600)}>
          {getWorkerPhone(worker.workerId)}
        </p>
      </div>

      {/* Service Agreement Section */}
      <div>
        <h5 className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900, "text-sm md:text-base mb-2 md:mb-3")}>
          Service Agreement
        </h5>
        <div className={cn("space-y-2 md:space-y-3 text-xs md:text-sm")}>
          <div className={cn(FLEX_ROW_BETWEEN)}>
            <span className={TEXT_COLORS.gray600}>Base Hourly Rate:</span>
            <span className={cn(FONT_FAMILY.montserratBold, "text-primary-600")}>
              ${worker.serviceAgreement.baseHourlyRate}/hr
            </span>
          </div>
          <div className={cn(FLEX_ROW_BETWEEN)}>
            <span className={TEXT_COLORS.gray600}>Distance Travel Rate:</span>
            <span className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900)}>
              ${worker.serviceAgreement.distanceTravelRate}/km
            </span>
          </div>
          <div className={cn(FLEX_ROW_BETWEEN)}>
            <span className={TEXT_COLORS.gray600}>Start Date:</span>
            <span className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900)}>
              {formattedDates.start}
            </span>
          </div>
          <div className={cn(FLEX_ROW_BETWEEN)}>
            <span className={TEXT_COLORS.gray600}>Terms Accepted:</span>
            <span className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900)}>
              {worker.serviceAgreement.termsAccepted ? (
                <span className="text-green-600 flex items-center gap-1">
                  Yes <CheckCircle className="w-3 h-3" />
                </span>
              ) : (
                "No"
              )}
            </span>
          </div>
          <div className={cn(FLEX_ROW_BETWEEN)}>
            <span className={TEXT_COLORS.gray600}>Joined Date:</span>
            <span className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900)}>
              {formattedDates.joined}
            </span>
          </div>
          <div className={cn(FLEX_ROW_BETWEEN)}>
            <span className={TEXT_COLORS.gray600}>Status:</span>
            <Badge className="bg-green-50 text-green-600 text-xs">Active</Badge>
          </div>
        </div>
      </div>

      {/* Shift Rates Section */}
      <div>
        <h5 className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900, "text-sm md:text-base mb-2 md:mb-3")}>
          Shift Rates
        </h5>
        <div className={cn("space-y-1 md:space-y-2")}>
          {worker.serviceAgreement.shiftRates.map((rate) => (
            <div key={rate._id} className={cn("p-2 md:p-3", BG_COLORS.gray50, RADIUS.lg)}>
              <div className={cn(FLEX_ROW_BETWEEN, "items-start mb-1")}>
                <span className={cn(FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900, "text-xs md:text-sm")}>
                  {getRateBandName(rate.rateTimeBandId)}
                </span>
                <span className={cn(FONT_FAMILY.montserratBold, "text-primary-600 text-xs md:text-sm")}>
                  ${rate.hourlyRate}/hr
                </span>
              </div>
              {getRateBandCode(rate.rateTimeBandId) && (
                <p className={cn("text-xs text-gray-500")}>
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
          className={cn("w-full bg-red-600 hover:bg-red-700 text-white text-sm md:text-base min-h-[44px]", FONT_FAMILY.montserratSemibold)}
        >
          Remove Worker {isRemoving ? "..." : ""}
        </Button>
      )}
    </div>
  );
};