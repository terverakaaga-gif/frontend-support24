import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { JobFormData, JOB_ROLE_OPTIONS } from "@/types/job";

interface Props {
  formData: JobFormData;
  errors: Partial<Record<keyof JobFormData, string>>;
  onChange: (field: keyof JobFormData, value: any) => void;
}

export const JobBasicInfoSection = React.memo(({ formData, errors, onChange }: Props) => {
  return (
    <>
      {/* Job Role */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Job Role</Label>
        <Select value={formData.jobRole} onValueChange={(val) => onChange("jobRole", val)}>
          <SelectTrigger className={errors.jobRole ? "border-red-500" : ""}>
            <SelectValue placeholder="Select job role" />
          </SelectTrigger>
          <SelectContent>
            {JOB_ROLE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.jobRole && <p className="text-xs text-red-600 mt-1">{errors.jobRole}</p>}
      </div>

      {/* Description */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Job Description</Label>
        <Textarea
          placeholder="Describe the job role..."
          value={formData.jobDescription}
          onChange={(e) => onChange("jobDescription", e.target.value)}
          rows={6}
          className={errors.jobDescription ? "border-red-500" : ""}
        />
        {errors.jobDescription && <p className="text-xs text-red-600 mt-1">{errors.jobDescription}</p>}
      </div>

      {/* Key Responsibilities (Quill) */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Key Responsibilities</Label>
        <div className="quill-wrapper">
          <ReactQuill
            theme="snow"
            value={formData.keyResponsibilities}
            onChange={(val) => onChange("keyResponsibilities", val)}
            modules={{
              toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }]],
            }}
            placeholder="Describe key responsibilities..."
          />
        </div>
      </div>
    </>
  );
});