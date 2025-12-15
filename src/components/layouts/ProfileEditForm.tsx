import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloseCircle, AltArrowLeft, AltArrowRight, CheckCircle, DangerCircle } from "@solar-icons/react";
import { useEditProfileForm } from "@/hooks/useEditProfileFormHooks";
import { PARTICIPANT_STEPS, SUPPORT_WORKER_STEPS } from "@/constants/profile-steps";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { cn } from "@/lib/utils";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

// Shared
import { ProfilePreviewStep } from "@/components/profile-edit/steps/ProfilePreviewStep";
import { BasicInfoStep } from "@/components/profile-edit/steps/BasicInfoStep";
import { LocationStep } from "@/components/profile-edit/steps/LocationStep";

// Participant
import { NDISSupportStep } from "@/components/profile-edit/steps/NDISSupportStep";
import { EmergencyContactStep } from "@/components/profile-edit/steps/EmergencyContactStep";
import { CareTeamStep } from "@/components/profile-edit/steps/CareTeamStep";
import { PreferencesStep } from "@/components/profile-edit/steps/PreferencesStep";

// Worker
import { WorkerBioStep } from "@/components/profile-edit/steps/WorkerBioStep";
import { SkillsLanguagesStep } from "@/components/profile-edit/steps/SkillsLanguagesStep";
import { ExperienceStep } from "@/components/profile-edit/steps/ExperienceStep";
import { ServiceLocationStep } from "@/components/profile-edit/steps/ServiceLocationStep";
import { RatesStep } from "@/components/profile-edit/steps/RatesStep";

export default function EditProfile() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    formData, isParticipant, isLoading, isError, error, validationErrors,
    handleInputChange, handleNestedChange, addItem, removeItem,
    saveCurrentStep, setValidationErrors, isPending,
    // Dynamic props
    newLanguage, setNewLanguage,
    newExperience, setNewExperience, addExperience, removeExperience,
    // Resume props
    resumeFile, setResumeFile
  } = useEditProfileForm();

  const STEPS = isParticipant ? PARTICIPANT_STEPS : SUPPORT_WORKER_STEPS;

  // Google Places (Shared Logic)
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } = usePlacesService({
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
    options: { types: ["address"], componentRestrictions: { country: "au" } },
  });
  const [showPredictions, setShowPredictions] = useState(false);

  const handleAddressChange = (val: string) => {
      handleInputChange("address", val);
      if(val.length > 2) { getPlacePredictions({ input: val }); setShowPredictions(true); }
      else setShowPredictions(false);
  }

  // Common Props for Location Component
  const locationProps = {
    addressValue: formData.address || "",
    onAddressChange: handleAddressChange,
    predictions: placePredictions,
    showPredictions: showPredictions,
    isLoadingPredictions: isPlacePredictionsLoading,
    onPredictionSelect: (p: any) => { handleInputChange("address", p.description); setShowPredictions(false); }
  };

  const handleNext = async () => {
    // Skip saving on preview step (step 0)
    if (currentStep === 0) {
      setCurrentStep((prev) => prev + 1);
      return;
    }
    
    const saved = await saveCurrentStep();
    if (saved && currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      setValidationErrors([]);
    }
  };

  const handleFinish = async () => {
    const saved = await saveCurrentStep();
    if (saved) {
      navigate(isParticipant ? "/participant/profile" : "/support-worker/profile");
    }
  };

  if (isLoading) return <Loader type="pulse" />;
  if (isError) return <ErrorDisplay title="Failed to load" message={error?.message} />;

  const renderStep = () => {
    if (currentStep === 0) return <ProfilePreviewStep formData={formData} isParticipant={isParticipant} />;
    if (currentStep === 1) return <BasicInfoStep formData={formData} onChange={handleInputChange} />;

    if (isParticipant) {
      switch(currentStep) {
        case 2: return <LocationStep {...locationProps} />;
        case 3: return <NDISSupportStep formData={formData} onChange={handleInputChange} />;
        case 4: return <EmergencyContactStep formData={formData} onNestedChange={handleNestedChange} />;
        case 5: return <CareTeamStep formData={formData} onNestedChange={handleNestedChange} />;
        case 6: return <PreferencesStep formData={formData} onChange={handleInputChange} addItem={addItem} removeItem={removeItem} newLanguage={newLanguage} setNewLanguage={setNewLanguage} />;
        default: return null;
      }
    } else {
      switch(currentStep) {
        case 2: return <WorkerBioStep formData={formData} onChange={handleInputChange} addressProps={locationProps} />;
        case 3: return <SkillsLanguagesStep formData={formData} addItem={addItem} removeItem={removeItem} newLanguage={newLanguage} setNewLanguage={setNewLanguage} />;
        case 4: return <ExperienceStep formData={formData} removeExperience={removeExperience} addExperience={addExperience} newExperience={newExperience} setNewExperience={setNewExperience} resumeFile={resumeFile} setResumeFile={setResumeFile} />;
        case 5: return <ServiceLocationStep formData={formData} onChange={handleInputChange} />;
        case 6: return <RatesStep formData={formData} />;
        default: return null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">
            {currentStep === 0 ? "Preview" : `Step ${currentStep} of ${STEPS.length}`}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2 shadow-lg">
          <CloseCircle className="w-5 h-5" /> Cancel
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <div 
            onClick={() => setCurrentStep(0)} 
            className={cn(
              "h-2 flex-1 rounded-full transition-all cursor-pointer",
              currentStep === 0 ? "bg-primary" : currentStep > 0 ? "bg-green-500" : "bg-gray-300"
            )} 
          />
          {STEPS.map((step) => (
            <div 
              key={step.id} 
              onClick={() => setCurrentStep(step.id)} 
              className={cn(
                "h-2 flex-1 rounded-full transition-all cursor-pointer",
                step.id === currentStep ? "bg-primary" : step.id < currentStep ? "bg-green-500" : "bg-gray-300"
              )} 
            />
          ))}
        </div>
        
        {/* Step Labels */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${STEPS.length + 1}, 1fr)` }}>
          <div 
            onClick={() => setCurrentStep(0)}
            className="cursor-pointer group"
          >
            <p className={cn(
              "text-xs font-semibold transition-colors",
              currentStep === 0 ? "text-primary" : "text-gray-500 group-hover:text-primary"
            )}>
              Preview
            </p>
            <p className="text-[10px] text-gray-400 hidden md:block">Review current info</p>
          </div>
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className="cursor-pointer group"
              >
                <div className="flex items-center gap-1">
                  <Icon className={cn(
                    "w-3 h-3 transition-colors",
                    step.id === currentStep ? "text-primary" : "text-gray-400 group-hover:text-primary"
                  )} />
                  <p className={cn(
                    "text-xs font-semibold transition-colors",
                    step.id === currentStep ? "text-primary" : "text-gray-500 group-hover:text-primary"
                  )}>
                    {step.title}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 hidden md:block truncate">
                  {step.id === 1 && "Personal details"}
                  {step.id === 2 && (isParticipant ? "Address info" : "Bio & address")}
                  {step.id === 3 && (isParticipant ? "NDIS details" : "Skills & languages")}
                  {step.id === 4 && (isParticipant ? "Emergency contact" : "Work history")}
                  {step.id === 5 && (isParticipant ? "Support team" : "Service areas")}
                  {step.id === 6 && (isParticipant ? "Languages & more" : "Rates & times")}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="p-4 flex items-start gap-3">
            <DangerCircle className="w-5 h-5 text-red-500" />
            <div>
                <h3 className="text-red-800 font-bold mb-1">Please fix errors:</h3>
                <ul className="text-red-700 text-sm list-disc pl-4">{validationErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card className="border-0 shadow-lg mb-6">
        <CardContent className="p-6">
            {renderStep()}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 0} className="gap-2">
            <AltArrowLeft className="w-5 h-5" /> Back
        </Button>
        
        {currentStep < STEPS.length ? (
            <Button onClick={handleNext} disabled={isPending && currentStep > 0} className="gap-2">
                {isPending && currentStep > 0 ? "Saving..." : "Next"} <AltArrowRight className="w-5 h-5" />
            </Button>
        ) : (
            <Button onClick={handleFinish} disabled={isPending} className="gap-2 bg-green-600 hover:bg-green-700">
                {isPending ? "Saving..." : "Finish"} <CheckCircle className="w-5 h-5" />
            </Button>
        )}
      </div>
    </div>
  );
}