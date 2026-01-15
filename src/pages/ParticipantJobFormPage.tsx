import React from "react";
import { useNavigate } from "react-router-dom";
import GeneralHeader from "@/components/GeneralHeader";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";

// Custom Logic Hook
import { useJobForm } from "@/hooks/useJobForm";

// Modular Components
import { JobBasicInfoSection } from "@/components/provider/jobs/JobBasicInfoSection";
import { JobLocationSection } from "@/components/provider/jobs/JobLocationSection";
import { JobDetailsSection } from "@/components/provider/jobs/JobDetailsSection";
import { JobCompetenciesSection } from "@/components/provider/jobs/JobCompetenciesSection";

export default function ParticipantJobFormPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const {
    isEditMode,
    isLoading,
    isSubmitting,
    error,
    formData,
    errors,
    addressInputValue,
    setAddressInputValue,
    handleChange,
    handleCompetencyToggle,
    handleSubmit
  } = useJobForm();

  if (isLoading) return <Loader />;
  if (error && isEditMode) return <div className="p-6"><ErrorDisplay message="Failed to load job details" /></div>;

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      {/* Header */}
      <GeneralHeader
        showBackButton
        title={isEditMode ? "Edit Job Posting" : "Create Job Posting"}
        subtitle=""
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/participant/profile")}
      />

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        
        <JobBasicInfoSection 
          formData={formData} 
          errors={errors} 
          onChange={handleChange} 
        />

        <JobLocationSection 
          formData={formData} 
          errors={errors} 
          onChange={handleChange} 
          addressInputValue={addressInputValue}
          setAddressInputValue={setAddressInputValue}
        />

        <JobDetailsSection 
          formData={formData} 
          errors={errors} 
          onChange={handleChange} 
        />

        <JobCompetenciesSection 
          requiredCompetencies={formData.requiredCompetencies} 
          onToggle={handleCompetencyToggle} 
        />

        {/* Additional Notes */}
        <div className="mb-6">
          <Label htmlFor="additionalNote" className="text-sm font-semibold text-gray-700 mb-2 block">
            Additional Notes
          </Label>
          <Textarea
            id="additionalNote"
            placeholder="Any additional information..."
            value={formData.additionalNote}
            onChange={(e) => handleChange("additionalNote", e.target.value)}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 h-12 text-base">
          {isSubmitting ? "Submitting..." : isEditMode ? "Update Job Posting" : "Create Job Posting"}
        </Button>
      </form>

      {/* Quill Styles (Global or Scoped) */}
      <style>{`
        .quill-wrapper .ql-toolbar { border-radius: 0.5rem 0.5rem 0 0; border-color: #e5e7eb; }
        .quill-wrapper .ql-container { border-radius: 0 0 0.5rem 0.5rem; border-color: #e5e7eb; min-height: 150px; }
      `}</style>
    </div>
  );
}
