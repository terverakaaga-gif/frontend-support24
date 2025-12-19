import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AltArrowLeft, CheckCircle } from "@solar-icons/react";
import { cn } from "@/lib/utils";
import { StepBioLocation } from "./steps/StepBioLocation";
import { StepExperience } from "./steps/StepExperience";
import { StepServices } from "./steps/StepServices";
import { StepRates } from "./steps/StepRates";
import { StepAvailability } from "./steps/StepAvailability";
import { SupportWorkerOnboardingInput } from "@/types/user.types";
import authService from "@/api/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Define initial state types matching your schemas
// ... (Initial state constant essentially same as your original code)

export default function SupportWorkerSetup() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalFormData, setGlobalFormData] = useState<any>({
    // Initialize with defaults
    bio: "",
    languages: [],
    experience: [],
    serviceCategories: [],
    shiftRates: [],
    availability: {
      weekdays: [
        { day: "monday", available: false, slots: [] },
        { day: "tuesday", available: false, slots: [] },
        { day: "wednesday", available: false, slots: [] },
        { day: "thursday", available: false, slots: [] },
        { day: "friday", available: false, slots: [] },
        { day: "saturday", available: false, slots: [] },
        { day: "sunday", available: false, slots: [] },
      ],
    },
  });

  const updateFormData = (newData: any) => {
    setGlobalFormData((prev: any) => ({ ...prev, ...newData }));
  };

  const handleNext = (data: any) => {
    updateFormData(data);
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = async (finalDataPartial: any) => {
    const fullData = { ...globalFormData, ...finalDataPartial };
    console.log("Submitting Support Worker Onboarding:", fullData);

    setIsSubmitting(true);
    const RESUME_STORAGE_KEY = "sw_onboarding_resume_url";
    
    try {
      // Check if resume was already uploaded (stored in localStorage)
      let resumeUrl = localStorage.getItem(RESUME_STORAGE_KEY) || "";
      
      // If no stored resume and a new file exists, upload it
      if (!resumeUrl && fullData.resume instanceof File) {
        toast.loading("Uploading resume...", { id: "resume-upload" });
        const uploadResponse = await authService.uploadResume(fullData.resume);
        resumeUrl = uploadResponse.user;
        
        // Store the resume URL in localStorage to prevent re-upload on retry
        localStorage.setItem(RESUME_STORAGE_KEY, resumeUrl);
        toast.success("Resume uploaded successfully", { id: "resume-upload" });
      }

      // Prepare the final data with resume URL instead of File
      const { resume, ...onboardingData } = fullData;
      const finalSubmissionData = {
        ...onboardingData,
        resume: resumeUrl,
      };

      // Submit the onboarding data
      toast.loading("Completing setup...", { id: "onboarding" });
      await authService.completeSupportWorkerOnboarding(finalSubmissionData);
      
      // Clear the stored resume URL after successful submission
      localStorage.removeItem(RESUME_STORAGE_KEY);
      
      toast.success("Setup Complete", { id: "onboarding" });
      completeOnboarding();
      
      // Redirect to dashboard after successful onboarding
      setTimeout(() => {
        navigate("/support-worker");
      }, 1000);
    } catch (e: any) {
      console.error("Onboarding error:", e);
      toast.error(e.response?.data?.message || "Error submitting profile", { id: "onboarding" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: "Bio" },
    { number: 2, label: "Skills" },
    { number: 3, label: "Experience" },
    { number: 4, label: "Rates" },
    { number: 5, label: "Availability" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-montserrat">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-montserrat-semibold mb-6"
        >
          <AltArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-montserrat-bold">Profile Setup</h1>
            <p className="text-gray-500 mt-1 text-sm hidden md:block">
              Answer a few quick questions to complete your profile.
            </p>
          </div>
          <span className="text-primary font-montserrat-bold">{step}/5</span>
        </div>
      </div>

      {/* Stepper (Desktop & Mobile Unified for simplicity, or hide on mobile) */}
      <div className="flex justify-between mb-8 relative">
        {/* Simple Visual Stepper */}
        {steps.map((s, i) => (
          <div key={s.number} className="flex flex-col items-center z-10">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-montserrat-bold border-2 transition-all",
                step === s.number
                  ? "border-primary text-primary bg-white"
                  : completedSteps.includes(s.number)
                  ? "bg-primary border-primary text-white"
                  : "border-gray-200 text-gray-400 bg-white"
              )}
            >
              {completedSteps.includes(s.number) ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                s.number
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-2 font-medium hidden md:block",
                step === s.number ? "text-primary" : "text-gray-500"
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 -z-0" />
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        {step === 1 && (
          <StepBioLocation defaultValues={globalFormData} onNext={handleNext} />
        )}
        {step === 2 && (
          <StepServices
            defaultValues={globalFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <StepExperience
            defaultValues={globalFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 4 && (
          <StepRates
            defaultValues={globalFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 5 && (
          <StepAvailability
            defaultValues={globalFormData}
            onSubmit={handleFinalSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
