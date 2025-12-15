import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart } from "@solar-icons/react";

export const NDISSupportStep = ({ formData, onChange }: any) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">NDIS & Support Needs</h2>
          <p className="text-sm text-gray-600">Your NDIS information and support requirements</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ndisNumber">NDIS Number</Label>
        <Input
          id="ndisNumber"
          value={formData.ndisNumber || ""}
          onChange={(e) => onChange("ndisNumber", e.target.value)}
          placeholder="Enter NDIS number"
        />
      </div>

      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <Label>Support Needs</Label>
        <p className="text-sm text-gray-600 mt-1">
          {formData.supportNeeds?.length > 0
            ? `${formData.supportNeeds.length} support need(s) configured`
            : "No support needs configured (Managed by Admin)"}
        </p>
      </div>

      <div className="flex items-center space-x-2 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <Checkbox
          id="requiresSupervision"
          checked={formData.requiresSupervision || false}
          onCheckedChange={(checked) => onChange("requiresSupervision", checked)}
        />
        <Label htmlFor="requiresSupervision" className="cursor-pointer">Requires Supervision</Label>
      </div>
    </div>
  );
};