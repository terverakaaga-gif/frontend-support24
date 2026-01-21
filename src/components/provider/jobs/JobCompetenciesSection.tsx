import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { JobFormData, COMPETENCY_OPTIONS } from "@/types/job";

interface Props {
  requiredCompetencies: any;
  onToggle: (id: string) => void;
}

export const JobCompetenciesSection = ({ requiredCompetencies, onToggle }: Props) => {
  return (
    <div className="mb-6">
      <Label className="text-sm font-montserrat-semibold text-gray-700 mb-3 block">Required Competencies</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {COMPETENCY_OPTIONS.map((comp) => (
          <div key={comp.id} className="flex items-center space-x-2">
            <Checkbox
              id={comp.id}
              checked={requiredCompetencies[comp.id] === true}
              onCheckedChange={() => onToggle(comp.id)}
            />
            <label htmlFor={comp.id} className="text-sm text-gray-700 cursor-pointer">{comp.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};