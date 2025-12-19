import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, CloseCircle } from "@solar-icons/react";
import { Badge } from "@/components/ui/badge";

interface ServiceType {
  _id: string;
  name: string;
  code?: string;
}

interface Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  supportNeeds?: ServiceType[];
  isLoadingSupportNeeds?: boolean;
  addItem?: (field: string, value: any) => void;
  removeItem?: (field: string, value: any) => void;
}

export const NDISSupportStep = React.memo(
  ({
    formData,
    onChange,
    supportNeeds = [],
    isLoadingSupportNeeds = false,
    addItem,
    removeItem,
  }: Props) => {
    const handleSupportNeedToggle = (needId: string) => {
      const currentNeeds = formData.supportNeeds || [];
      if (currentNeeds.includes(needId)) {
        if (removeItem) {
          removeItem("supportNeeds", needId);
        } else {
          const updated = currentNeeds.filter((id: string) => id !== needId);
          onChange("supportNeeds", updated);
        }
      } else {
        if (addItem) {
          addItem("supportNeeds", needId);
        } else {
          onChange("supportNeeds", [...currentNeeds, needId]);
        }
      }
    };

    const isSupportNeedSelected = (needId: string) => {
      return (formData.supportNeeds || []).includes(needId);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              NDIS & Support Needs
            </h2>
            <p className="text-sm text-gray-600">
              Your NDIS information and support requirements
            </p>
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

        {/* Support Needs Selection */}
        <div className="space-y-3">
          <Label>Support Needs</Label>
          <p className="text-sm text-gray-600">
            Select the types of support you require
          </p>

          {isLoadingSupportNeeds ? (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600">Loading support needs...</p>
            </div>
          ) : supportNeeds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supportNeeds
                .filter((s: any) => s.status === "active")
                .map((need) => (
                  <div
                    key={need._id}
                    onClick={() => handleSupportNeedToggle(need._id)}
                    className={`
                  flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    isSupportNeedSelected(need._id)
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
                  >
                    <Checkbox
                      checked={isSupportNeedSelected(need._id)}
                      onCheckedChange={() => handleSupportNeedToggle(need._id)}
                    />
                    <Label className="cursor-pointer flex-1">{need.name}</Label>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600">
                No support needs available
              </p>
            </div>
          )}

          {/* Selected Support Needs Badges */}
          {formData.supportNeeds && formData.supportNeeds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.supportNeeds.map((needId: string) => {
                const need = supportNeeds.find((n) => n._id === needId);
                return need ? (
                  <Badge
                    key={needId}
                    variant="secondary"
                    className="text-xs cursor-pointer bg-primary/10 text-primary"
                    onClick={() => handleSupportNeedToggle(needId)}
                  >
                    {need.name}
                    <CloseCircle className="h-3 w-3 ml-1" />
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <Checkbox
            id="requiresSupervision"
            checked={formData.requiresSupervision || false}
            onCheckedChange={(checked) =>
              onChange("requiresSupervision", checked)
            }
          />
          <Label htmlFor="requiresSupervision" className="cursor-pointer">
            Requires Supervision
          </Label>
        </div>
      </div>
    );
  }
);
