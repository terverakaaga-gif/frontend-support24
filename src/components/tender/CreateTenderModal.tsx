import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CloseCircle, Calendar, InfoCircle, Pen } from "@solar-icons/react";
import { cn } from "@/lib/utils";

interface CreateTenderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftData?: any;
  isDraft?: boolean;
}

type Step = "basics" | "participant-needs" | "requirements" | "budget" | "review";

interface TenderFormData {
  // Basics
  participantId: string;
  participantName: string;
  participantAvatar: string;
  serviceType: string;
  serviceStartDate: string;
  duration: string;
  hoursPerWeek: string;
  submissionDeadline: string;
  
  // Participant Needs
  participantAge: string;
  participantGender: string;
  participantLocation: string;
  supportNeeds: string;
  diagnosisCategory: string;
  communicationMethod: string;
  additionalNotes: string;
  
  // Requirements
  mandatoryQualifications: string[];
  preferredQualifications: string[];
  competencies: string;
  experienceRequirement: string;
  
  // Budget
  totalBudget: string;
  hourlyRateRange: string;
  ndisPriceGuide: string;
  visibilityPreference: string;
  fundingSource: string;
  paymentTerms: string;
}

export function CreateTenderModal({ open, onOpenChange, draftData, isDraft = false }: CreateTenderModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("basics");
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  
  const [formData, setFormData] = useState<TenderFormData>({
    participantId: "",
    participantName: "",
    participantAvatar: "",
    serviceType: "",
    serviceStartDate: "",
    duration: "",
    hoursPerWeek: "",
    submissionDeadline: "",
    participantAge: "",
    participantGender: "",
    participantLocation: "",
    supportNeeds: "",
    diagnosisCategory: "",
    communicationMethod: "",
    additionalNotes: "",
    mandatoryQualifications: [],
    preferredQualifications: [],
    competencies: "",
    experienceRequirement: "",
    totalBudget: "",
    hourlyRateRange: "",
    ndisPriceGuide: "",
    visibilityPreference: "show",
    fundingSource: "core",
    paymentTerms: "",
  });

  // Load draft data when modal opens with draft
  useEffect(() => {
    if (open && draftData && isDraft) {
      setFormData({
        participantId: draftData.participantId || "",
        participantName: draftData.participantName || "",
        participantAvatar: draftData.participantAvatar || "",
        serviceType: draftData.serviceType || "",
        serviceStartDate: draftData.startDate || "",
        duration: draftData.minTimeline || "",
        hoursPerWeek: draftData.hoursPerWeek || "",
        submissionDeadline: draftData.responseDeadline || "",
        participantAge: draftData.participantAge || "",
        participantGender: draftData.participantGender || "",
        participantLocation: draftData.location || "",
        supportNeeds: draftData.specificNeeds || "",
        diagnosisCategory: draftData.diagnosisCategory || "",
        communicationMethod: draftData.communicationPreferences || "",
        additionalNotes: draftData.additionalNotes || "",
        mandatoryQualifications: draftData.mustHaveQualifications || [],
        preferredQualifications: draftData.preferredQualifications || [],
        competencies: draftData.competencies || "",
        experienceRequirement: draftData.experienceRequired || "",
        totalBudget: draftData.budgetAllocation || "",
        hourlyRateRange: draftData.hourlyRateRange || "",
        ndisPriceGuide: draftData.ndisPriceGuide || "",
        visibilityPreference: draftData.visibilityPreference || "show",
        fundingSource: draftData.fundingSource || "core",
        paymentTerms: draftData.paymentTerms || "",
      });
    } else if (!open) {
      // Reset form when modal closes
      setFormData({
        participantId: "",
        participantName: "",
        participantAvatar: "",
        serviceType: "",
        serviceStartDate: "",
        duration: "",
        hoursPerWeek: "",
        submissionDeadline: "",
        participantAge: "",
        participantGender: "",
        participantLocation: "",
        supportNeeds: "",
        diagnosisCategory: "",
        communicationMethod: "",
        additionalNotes: "",
        mandatoryQualifications: [],
        preferredQualifications: [],
        competencies: "",
        experienceRequirement: "",
        totalBudget: "",
        hourlyRateRange: "",
        ndisPriceGuide: "",
        visibilityPreference: "show",
        fundingSource: "core",
        paymentTerms: "",
      });
      setCurrentStep("basics");
    }
  }, [open, draftData, isDraft]);

  const steps = [
    { id: "basics", label: "Basics" },
    { id: "participant-needs", label: "Participant Needs" },
    { id: "requirements", label: "Requirement & Competencies" },
    { id: "budget", label: "Budget" },
    { id: "review", label: "Review" },
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as Step);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as Step);
    }
  };

  const handlePublish = () => {
    setShowInvitationModal(true);
  };

  const handleSaveDraft = () => {
    console.log("Save as draft:", formData);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !showInvitationModal} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-montserrat-bold">
                Create New Tender
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 rounded-full hover:bg-gray-100"
              >
                <CloseCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* Step Tabs */}
            <div className="flex items-center gap-4 mt-4 border-b overflow-x-auto">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id as Step)}
                  className={cn(
                    "pb-3 px-2 text-sm font-montserrat-semibold whitespace-nowrap transition-colors border-b-2",
                    currentStep === step.id
                      ? "text-primary-600 border-primary-600"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  )}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </DialogHeader>

          <div className="px-6 pb-6">
            {/* Basics Step */}
            {currentStep === "basics" && (
              <BasicsStep formData={formData} updateFormData={updateFormData} />
            )}

            {/* Participant Needs Step */}
            {currentStep === "participant-needs" && (
              <ParticipantNeedsStep formData={formData} updateFormData={updateFormData} />
            )}

            {/* Requirements Step */}
            {currentStep === "requirements" && (
              <RequirementsStep formData={formData} updateFormData={updateFormData} />
            )}

            {/* Budget Step */}
            {currentStep === "budget" && (
              <BudgetStep formData={formData} updateFormData={updateFormData} />
            )}

            {/* Review Step */}
            {currentStep === "review" && (
              <ReviewStep
                formData={formData}
                onEdit={(step) => setCurrentStep(step as Step)}
                onSaveDraft={handleSaveDraft}
                onPublish={handlePublish}
              />
            )}

            {/* Navigation Buttons */}
            {currentStep !== "review" && (
              <div className="mt-6 flex gap-3">
                {currentStep !== "basics" && (
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 font-montserrat-semibold"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Invitation Method Modal */}
      <InvitationMethodModal
        open={showInvitationModal}
        onOpenChange={setShowInvitationModal}
        onComplete={() => {
          setShowInvitationModal(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}

// Basics Step Component
function BasicsStep({
  formData,
  updateFormData,
}: {
  formData: TenderFormData;
  updateFormData: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Participant Name
        </Label>
        <Select
          value={formData.participantId}
          onValueChange={(value) => {
            updateFormData("participantId", value);
            // Mock data - in real app, fetch participant details
            updateFormData("participantName", "Sarah Reves");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select participant">
              {formData.participantName && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                      SR
                    </AvatarFallback>
                  </Avatar>
                  <span>{formData.participantName}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                    SR
                  </AvatarFallback>
                </Avatar>
                <span>Sarah Reves</span>
              </div>
            </SelectItem>
            <SelectItem value="2">Matthew Tim</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Service Type
        </Label>
        <Select value={formData.serviceType} onValueChange={(value) => updateFormData("serviceType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SIL">SIL</SelectItem>
            <SelectItem value="STA">STA</SelectItem>
            <SelectItem value="Support Worker">Support Worker</SelectItem>
            <SelectItem value="Allied Health">Allied Health</SelectItem>
            <SelectItem value="Transportation">Transportation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
            Service Start Date
          </Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Input service start date"
              value={formData.serviceStartDate}
              onChange={(e) => updateFormData("serviceStartDate", e.target.value)}
              className="pr-10"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
            Duration
          </Label>
          <Input
            type="text"
            placeholder="Input duration"
            value={formData.duration}
            onChange={(e) => updateFormData("duration", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Hours Per Week & Support Ratio
        </Label>
        <Input
          type="text"
          placeholder="Input hours per week & support ratio"
          value={formData.hoursPerWeek}
          onChange={(e) => updateFormData("hoursPerWeek", e.target.value)}
        />
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Submission Deadline
        </Label>
        <Input
          type="text"
          placeholder="Input submission deadline"
          value={formData.submissionDeadline}
          onChange={(e) => updateFormData("submissionDeadline", e.target.value)}
        />
        <div className="flex items-start gap-2 mt-2">
          <InfoCircle className="h-4 w-4 text-gray-400 mt-0.5" />
          <p className="text-xs text-gray-600">
            Minimum: 5 business day, Maximum: 30 business day
          </p>
        </div>
      </div>
    </div>
  );
}

// Participant Needs Step Component
function ParticipantNeedsStep({
  formData,
  updateFormData,
}: {
  formData: TenderFormData;
  updateFormData: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Participant Age
        </Label>
        <Input
          type="text"
          placeholder="Input age"
          value={formData.participantAge}
          onChange={(e) => updateFormData("participantAge", e.target.value)}
        />
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Participant Gender
        </Label>
        <Input
          type="text"
          placeholder="Input gender"
          value={formData.participantGender}
          onChange={(e) => updateFormData("participantGender", e.target.value)}
        />
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Participant Location
        </Label>
        <Input
          type="text"
          placeholder="Input suburbs/postal code only"
          value={formData.participantLocation}
          onChange={(e) => updateFormData("participantLocation", e.target.value)}
        />
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Support Needs
        </Label>
        <Select value={formData.supportNeeds} onValueChange={(value) => updateFormData("supportNeeds", value)}>
          <SelectTrigger>
            <SelectValue placeholder="SIL" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mobility">Mobility</SelectItem>
            <SelectItem value="Communication">Communication</SelectItem>
            <SelectItem value="Behavioral">Behavioral</SelectItem>
            <SelectItem value="Medical">Medical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Diagnosis Category
        </Label>
        <Select
          value={formData.diagnosisCategory}
          onValueChange={(value) => updateFormData("diagnosisCategory", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Autism" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Autism">Autism</SelectItem>
            <SelectItem value="Intellectual Disability">Intellectual Disability</SelectItem>
            <SelectItem value="Physical Disability">Physical Disability</SelectItem>
            <SelectItem value="Medical">Medical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Communication Method
        </Label>
        <Select
          value={formData.communicationMethod}
          onValueChange={(value) => updateFormData("communicationMethod", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Verbal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Verbal">Verbal</SelectItem>
            <SelectItem value="AAC Device">AAC Device</SelectItem>
            <SelectItem value="Sign Language">Sign Language</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Additional Notes
        </Label>
        <Textarea
          placeholder="Input detailed description about participant preference..."
          value={formData.additionalNotes}
          onChange={(e) => updateFormData("additionalNotes", e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  );
}

// Requirements Step Component
function RequirementsStep({
  formData,
  updateFormData,
}: {
  formData: TenderFormData;
  updateFormData: (field: string, value: any) => void;
}) {
  const qualificationsList = [
    "Cert III /IV",
    "First Aid",
    "Manual Handling",
    "NDIS Worker Screening",
  ];

  const toggleQualification = (type: "mandatory" | "preferred", qual: string) => {
    const field = type === "mandatory" ? "mandatoryQualifications" : "preferredQualifications";
    const current = formData[field];
    
    if (current.includes(qual)) {
      updateFormData(field, current.filter((q: string) => q !== qual));
    } else {
      updateFormData(field, [...current, qual]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-montserrat-semibold text-gray-900 mb-3">
          Mandatory Qualifications
        </Label>
        <div className="space-y-3 border rounded-lg p-4">
          {qualificationsList.map((qual) => (
            <div key={qual} className="flex items-center justify-between">
              <span className="text-sm font-montserrat text-gray-700">{qual}</span>
              <Checkbox
                checked={formData.mandatoryQualifications.includes(qual)}
                onCheckedChange={() => toggleQualification("mandatory", qual)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-montserrat-semibold text-gray-900 mb-3">
          Preferred Qualifications
        </Label>
        <div className="space-y-3 border rounded-lg p-4">
          {qualificationsList.map((qual) => (
            <div key={qual} className="flex items-center justify-between">
              <span className="text-sm font-montserrat text-gray-700">{qual}</span>
              <Checkbox
                checked={formData.preferredQualifications.includes(qual)}
                onCheckedChange={() => toggleQualification("preferred", qual)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Competencies
        </Label>
        <Input
          type="text"
          placeholder="Input competencies"
          value={formData.competencies}
          onChange={(e) => updateFormData("competencies", e.target.value)}
        />
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Experience Requirement
        </Label>
        <Textarea
          placeholder="Input experience requirement"
          value={formData.experienceRequirement}
          onChange={(e) => updateFormData("experienceRequirement", e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  );
}

// Budget Step Component
function BudgetStep({
  formData,
  updateFormData,
}: {
  formData: TenderFormData;
  updateFormData: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Total Budget
        </Label>
        <Input
          type="text"
          placeholder="Input total budget"
          value={formData.totalBudget}
          onChange={(e) => updateFormData("totalBudget", e.target.value)}
        />
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Hourly Rate Range
        </Label>
        <Input
          type="text"
          placeholder="Input min-max hourly rate range"
          value={formData.hourlyRateRange}
          onChange={(e) => updateFormData("hourlyRateRange", e.target.value)}
        />
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          NDIS Price Guide Applicability
        </Label>
        <Input
          type="text"
          placeholder="Input NDIS price guide"
          value={formData.ndisPriceGuide}
          onChange={(e) => updateFormData("ndisPriceGuide", e.target.value)}
        />
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-3">
          Visibility Preferences
        </Label>
        <RadioGroup
          value={formData.visibilityPreference}
          onValueChange={(value) => updateFormData("visibilityPreference", value)}
          className="space-y-3 border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="show" className="text-sm font-montserrat text-gray-700 cursor-pointer">
              Show provider
            </Label>
            <RadioGroupItem value="show" id="show" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="hide" className="text-sm font-montserrat text-gray-700 cursor-pointer">
              Don't show provider
            </Label>
            <RadioGroupItem value="hide" id="hide" />
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-3">
          Funding Source
        </Label>
        <RadioGroup
          value={formData.fundingSource}
          onValueChange={(value) => updateFormData("fundingSource", value)}
          className="space-y-3 border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="core" className="text-sm font-montserrat text-gray-700 cursor-pointer">
              Core
            </Label>
            <RadioGroupItem value="core" id="core" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="capacity" className="text-sm font-montserrat text-gray-700 cursor-pointer">
              Capacity Building
            </Label>
            <RadioGroupItem value="capacity" id="capacity" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="capital" className="text-sm font-montserrat text-gray-700 cursor-pointer">
              Capital
            </Label>
            <RadioGroupItem value="capital" id="capital" />
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-sm font-montserrat-semibold text-gray-700 mb-2">
          Payment Terms Preferences
        </Label>
        <Input
          type="text"
          placeholder="Input payment terms preferences"
          value={formData.paymentTerms}
          onChange={(e) => updateFormData("paymentTerms", e.target.value)}
        />
      </div>
    </div>
  );
}

// Review Step Component
function ReviewStep({
  formData,
  onEdit,
  onSaveDraft,
  onPublish,
}: {
  formData: TenderFormData;
  onEdit: (step: string) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Basics Section */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-montserrat-bold text-gray-900">Basics</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit("basics")}
            className="h-8 w-8"
          >
            <Pen className="h-4 w-4 text-primary-600" />
          </Button>
        </div>
        <div className="space-y-3">
          <ReviewItem label="Participant Name" value={formData.participantName || "Sarah Reves"} />
          <ReviewItem label="Service Type" value={formData.serviceType || "SIL"} />
          <ReviewItem label="Service Start Date" value={formData.serviceStartDate || "28 May, 2025"} />
          <ReviewItem label="Duration" value={formData.duration || "3 Weeks"} />
          <ReviewItem label="Hours Per Week & Support Ratio" value={formData.hoursPerWeek || "2 hours & 3:1"} />
          <ReviewItem label="Submission Deadline" value={formData.submissionDeadline || "5 days"} />
        </div>
      </div>

      {/* Participant Needs Section */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-montserrat-bold text-gray-900">Participant Needs</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit("participant-needs")}
            className="h-8 w-8"
          >
            <Pen className="h-4 w-4 text-primary-600" />
          </Button>
        </div>
        <div className="space-y-3">
          <ReviewItem label="Participant Age" value={formData.participantAge || "50 years"} />
          <ReviewItem label="Participant Gender" value={formData.participantGender || "Female"} />
          <ReviewItem label="Participant Location" value={formData.participantLocation || "Sydney, Australia"} />
          <ReviewItem label="Support Needs" value={formData.supportNeeds || "SIL"} />
          <ReviewItem label="Diagnosis Category" value={formData.diagnosisCategory || "Autism"} />
          <ReviewItem label="Communication Method" value={formData.communicationMethod || "Verbal"} />
          <ReviewItem label="Additional Notes" value={formData.additionalNotes || "-"} />
        </div>
      </div>

      {/* Requirements Section */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-montserrat-bold text-gray-900">Requirement & Competencies</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit("requirements")}
            className="h-8 w-8"
          >
            <Pen className="h-4 w-4 text-primary-600" />
          </Button>
        </div>
        <div className="space-y-3">
          <ReviewItem
            label="Mandatory Qualifications"
            value={formData.mandatoryQualifications.join(", ") || "Cert III / IV"}
          />
          <ReviewItem
            label="Preferred Qualifications"
            value={formData.preferredQualifications.join(", ") || "First Aid"}
          />
          <ReviewItem label="Competencies" value={formData.competencies || "Must be in Australia"} />
          <ReviewItem label="Support Needs" value={formData.supportNeeds || "SIL"} />
          <ReviewItem
            label="Experience Requirement"
            value={formData.experienceRequirement || "2+ years autism experience"}
          />
        </div>
      </div>

      {/* Budget Section */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-montserrat-bold text-gray-900">Budget</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit("budget")}
            className="h-8 w-8"
          >
            <Pen className="h-4 w-4 text-primary-600" />
          </Button>
        </div>
        <div className="space-y-3">
          <ReviewItem label="Total Budget" value={formData.totalBudget || "$500,000"} />
          <ReviewItem label="Hourly Range" value={formData.hourlyRateRange || "2-10"} />
          <ReviewItem label="NDIS Price Guide Applicability" value={formData.ndisPriceGuide || "-"} />
          <ReviewItem label="Visibility Preferences" value={formData.visibilityPreference === "show" ? "Show provider" : "Don't show provider"} />
          <ReviewItem label="Funding Source" value={formData.fundingSource || "Core"} />
          <ReviewItem label="Payment terms preference" value={formData.paymentTerms || "Core"} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={onSaveDraft}
          variant="outline"
          className="flex-1 font-montserrat-semibold border-primary-600 text-primary-600 hover:bg-primary-50"
        >
          Save as Draft
        </Button>
        <Button
          onClick={onPublish}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
        >
          Publish Tender
        </Button>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600 font-montserrat">{label}</span>
      <span className="text-sm text-gray-900 font-montserrat-semibold text-right">{value}</span>
    </div>
  );
}

// Invitation Method Modal
function InvitationMethodModal({
  open,
  onOpenChange,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}) {
  const [selectedProviders, setSelectedProviders] = useState<string[]>(["1"]);
  const [inviteMethod, setInviteMethod] = useState<"saved" | "specific" | "open">("saved");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-xl font-montserrat-bold">
              Select Invitation Method
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <CloseCircle className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Invite From Saved Panel */}
          <div className="border rounded-lg">
            <button
              onClick={() => setInviteMethod("saved")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="font-montserrat-semibold text-gray-900">
                Invite From Saved Panel
              </span>
              <svg
                className={`h-5 w-5 transition-transform ${inviteMethod === "saved" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {inviteMethod === "saved" && (
              <div className="border-t p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-200">HC</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-montserrat-semibold">
                        Hope Care Services Ltd
                      </span>
                    </div>
                    <Checkbox
                      checked={selectedProviders.includes(i.toString())}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProviders([...selectedProviders, i.toString()]);
                        } else {
                          setSelectedProviders(selectedProviders.filter((id) => id !== i.toString()));
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invite Specific Providers */}
          <div className="border rounded-lg">
            <button
              onClick={() => setInviteMethod("specific")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="font-montserrat-semibold text-gray-900">
                Invite Specific Providers
              </span>
              <svg
                className={`h-5 w-5 transition-transform ${inviteMethod === "specific" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Publish to Open Market Place */}
          <div className="flex items-center justify-between border rounded-lg p-4">
            <span className="font-montserrat-semibold text-gray-900">
              Publish to Open Market Place
            </span>
            <Checkbox />
          </div>

          {/* Publish Button */}
          <Button
            onClick={onComplete}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
          >
            Publish Tender
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

