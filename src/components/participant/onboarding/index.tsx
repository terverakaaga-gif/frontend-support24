import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AltArrowLeft, CheckCircle } from "@solar-icons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/api/services/authService";
import { ParticipantOnboardingInput } from "@/types/user.types";

// Steps
import { StepPersonalInfo } from "./steps/StepPersonalInfo";
import { StepSupportNeeds } from "./steps/StepSupportNeeds";
import { StepEmergencyContact } from "./steps/StepEmergencyContact";
import { StepCoordination } from "./steps/StepCoordination";

export default function ParticipantSetup() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Consolidated State
  const [formData, setFormData] = useState<any>({
    ndisNumber: "",
    preferredLanguages: [],
    address: "",
    stateId: "",
    regionId: "",
    serviceAreaId: "",
    serviceCategories: [],
    emergencyContact: { name: "", relationship: "", phone: "" },
    planManager: { name: "", email: "" },
    coordinator: { name: "", email: "" },
    behaviorSupportPractitioner: { name: "", email: "" },
  });

  const updateFormData = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
  };

  const handleNext = (data: any) => {
    updateFormData(data);
    if (!completedSteps.includes(step))
      setCompletedSteps([...completedSteps, step]);
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = async (finalDataPartial: any) => {
    const fullData = { ...formData, ...finalDataPartial };

    // Construct payload strictly typed
    const payload: ParticipantOnboardingInput = {
      ...fullData,
      location: fullData.address ? { longitude: 0, latitude: 0 } : undefined, // Placeholder for backend req
    };

    setIsSubmitting(true);
    try {
      toast.loading("Completing setup...", { id: "onboarding" });
      await authService.completeParticipantOnboarding(payload);
      toast.success("Profile setup completed!", { id: "onboarding" });
      completeOnboarding();

      // Redirect to dashboard after successful onboarding
      setTimeout(() => {
        navigate("/participant");
      }, 1000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to complete profile setup.", { id: "onboarding" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: "Personal Info" },
    { number: 2, label: "Support Needs" },
    { number: 3, label: "Emergency Contact" },
    { number: 4, label: "Coordination" },
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
            <h1 className="text-2xl font-montserrat-bold">Participant Setup</h1>
            <p className="text-gray-500 mt-1 text-sm hidden md:block">
              Complete your profile to find the best support workers.
            </p>
          </div>
          <span className="text-primary font-montserrat-bold">{step}/4</span>
        </div>
      </div>

      {/* Visual Stepper */}
      <div className="flex justify-between mb-8 relative">
        {steps.map((s) => (
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
                "text-xs mt-2 font-montserrat-medium hidden md:block",
                step === s.number ? "text-primary" : "text-gray-500"
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 -z-0" />
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        {step === 1 && (
          <StepPersonalInfo defaultValues={formData} onNext={handleNext} />
        )}
        {step === 2 && (
          <StepSupportNeeds
            defaultValues={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <StepEmergencyContact
            defaultValues={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 4 && (
          <StepCoordination
            defaultValues={formData}
            onSubmit={handleFinalSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
