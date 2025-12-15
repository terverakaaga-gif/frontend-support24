import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPoint } from "@solar-icons/react";

export const ServiceLocationStep = ({ formData, onChange }: any) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <MapPoint className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Location & Service Areas</h2>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Travel Radius (km)</Label>
        <Input 
            type="number" 
            value={formData.travelRadiusKm || ""} 
            onChange={(e) => onChange("travelRadiusKm", parseFloat(e.target.value))} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <Label>State IDs</Label>
            <p className="text-sm text-gray-600 mt-1">{formData.stateIds?.length || 0} configured</p>
         </div>
         {/* ... Regions and Service Area counts similarly ... */}
      </div>
    </div>
  );
};