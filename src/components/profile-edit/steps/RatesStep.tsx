import React from "react";
import { Label } from "@/components/ui/label";
import { CalendarMark, Dollar } from "@solar-icons/react";

export const RatesStep = ({ formData }: any) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <CalendarMark className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Rates & Availability</h2>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
            <Dollar className="w-5 h-5 text-primary" />
            <Label>Shift Rates</Label>
        </div>
        <p className="text-sm text-gray-600">{formData.shiftRates?.length || 0} rates configured. (Managed by Admin)</p>
      </div>

      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <Label>Availability</Label>
        <p className="text-sm text-gray-600">
            {formData.availability?.weekdays?.filter((d:any) => d.available).length || 0} days available. (Managed in Schedule Tab)
        </p>
      </div>
    </div>
  );
};