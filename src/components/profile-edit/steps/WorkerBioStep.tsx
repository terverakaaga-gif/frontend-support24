import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CaseRoundMinimalistic } from "@solar-icons/react";
// Reuse LocationStep logic or Import it here
import { LocationStep } from "./LocationStep"; 

export const WorkerBioStep = ({ 
  formData, onChange, 
  addressProps // Props passed down for google autocomplete
}: any) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <CaseRoundMinimalistic className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Professional Bio</h2>
          <p className="text-sm text-gray-600">Your address and professional summary</p>
        </div>
      </div>

      {/* Address */}
      <LocationStep {...addressProps} />

      {/* Bio */}
      <div className="space-y-2">
        <Label>Professional Bio</Label>
        <Textarea
          value={formData.bio || ""}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="Tell us about your experience..."
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
};