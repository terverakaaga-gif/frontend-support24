import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFormData, JOB_TYPE_OPTIONS, STATUS_OPTIONS } from "@/types/job";

interface Props {
  formData: JobFormData;
  errors: Partial<Record<keyof JobFormData, string>>;
  onChange: (field: keyof JobFormData, value: any) => void;
}

export const JobDetailsSection = React.memo(({ formData, errors, onChange }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2 block">Price ($)</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="35.50"
          value={formData.price}
          onChange={(e) => onChange("price", e.target.value)}
          className={errors.price ? "border-red-500" : ""}
        />
        {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2 block">Job Type</Label>
        <Select value={formData.jobType} onValueChange={(val) => onChange("jobType", val)}>
          <SelectTrigger className={errors.jobType ? "border-red-500" : ""}><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            {JOB_TYPE_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.jobType && <p className="text-xs text-red-600 mt-1">{errors.jobType}</p>}
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2 block">Status</Label>
        <Select value={formData.status} onValueChange={(val) => onChange("status", val)}>
          <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});