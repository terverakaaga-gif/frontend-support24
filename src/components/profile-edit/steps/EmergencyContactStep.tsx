import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DangerCircle } from "@solar-icons/react";

export const EmergencyContactStep = ({ formData, onNestedChange }: any) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <DangerCircle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Emergency Contact</h2>
          <p className="text-sm text-gray-600">Person to contact in case of emergency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={formData.emergencyContact?.name || ""}
            onChange={(e) => onNestedChange("emergencyContact", "name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Relationship</Label>
          <Input
            value={formData.emergencyContact?.relationship || ""}
            onChange={(e) => onNestedChange("emergencyContact", "relationship", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Phone Number</Label>
        <Input
          type="tel"
          value={formData.emergencyContact?.phone || ""}
          onChange={(e) => onNestedChange("emergencyContact", "phone", e.target.value)}
        />
      </div>
    </div>
  );
};