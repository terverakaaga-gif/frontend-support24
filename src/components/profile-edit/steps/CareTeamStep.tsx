import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Buildings2 } from "@solar-icons/react";

export const CareTeamStep = React.memo(({ formData, onNestedChange }: any) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <Buildings2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Care Team</h2>
          <p className="text-sm text-gray-600">Your plan manager and coordinator details</p>
        </div>
      </div>

      {/* Plan Manager */}
      <div className="space-y-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h3 className="font-semibold text-gray-900">Plan Manager</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.planManager?.name || ""}
              onChange={(e) => onNestedChange("planManager", "name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.planManager?.email || ""}
              onChange={(e) => onNestedChange("planManager", "email", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Coordinator */}
      <div className="space-y-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h3 className="font-semibold text-gray-900">Coordinator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.coordinator?.name || ""}
              onChange={(e) => onNestedChange("coordinator", "name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.coordinator?.email || ""}
              onChange={(e) => onNestedChange("coordinator", "email", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Behavior Support Practitioner */}
      <div className="space-y-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h3 className="font-semibold text-gray-900">Behavior Support Practitioner</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.behaviorSupportPractitioner?.name || ""}
              onChange={(e) => onNestedChange("behaviorSupportPractitioner", "name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.behaviorSupportPractitioner?.email || ""}
              onChange={(e) => onNestedChange("behaviorSupportPractitioner", "email", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});