import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AltArrowLeft,
  AltArrowRight,
  CheckCircle,
  User,
  MapPoint,
  Heart,
  Shield,
  DangerCircle,
  Buildings2,
  Star,
  CloseCircle,
  CaseRoundMinimalistic,
  Translation,
  Dollar,
  CalendarMark,
  DocumentText,
} from "@solar-icons/react";
import { Participant, SupportWorker, EUserRole } from "@/types/user.types";
import { UpdateProfileData } from "@/api/services/userService";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";

// Helper functions
const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual((a as any)[key], (b as any)[key]));
  }

  return false;
};

const getChangedFields = (original: unknown, updated: unknown) => {
  const changes = {};

  Object.keys(updated as object).forEach((key) => {
    const originalValue = (original as any)?.[key];
    const updatedValue = (updated as any)?.[key];

    if (!deepEqual(originalValue, updatedValue)) {
      if (
        typeof updatedValue === "string" &&
        updatedValue.trim() === "" &&
        !originalValue
      ) {
        return;
      }
      if (
        Array.isArray(updatedValue) &&
        updatedValue.length === 0 &&
        (!originalValue || originalValue.length === 0)
      ) {
        return;
      }

      changes[key] = updatedValue;
    }
  });

  return changes;
};

// Step configurations for Participant
const PARTICIPANT_STEPS = [
  { id: 1, title: "Basic Information", icon: User },
  { id: 2, title: "Address", icon: MapPoint },
  { id: 3, title: "Support Needs", icon: Heart },
  { id: 4, title: "NDIS Information", icon: Shield },
  { id: 5, title: "Emergency Contact", icon: DangerCircle },
  { id: 6, title: "Care Team", icon: Buildings2 },
  { id: 7, title: "Preferences", icon: Star },
];

// Step configurations for Support Worker
const SUPPORT_WORKER_STEPS = [
  { id: 1, title: "Basic Information", icon: User },
  { id: 2, title: "Professional Details", icon: CaseRoundMinimalistic },
  { id: 3, title: "Skills & Experience", icon: Star },
  { id: 4, title: "Languages & Rates", icon: Translation },
  { id: 5, title: "Availability", icon: CalendarMark },
  { id: 6, title: "Bio & Preferences", icon: DocumentText },
];

export default function EditProfile() {
  const navigate = useNavigate();
  const { data: profileData, isLoading, isError, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<any>>({});
  const [originalData, setOriginalData] = useState<Partial<any>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Dynamic input states
  const [newSupportNeed, setNewSupportNeed] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newExperience, setNewExperience] = useState({
    title: "",
    organization: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const userRole = profileData?.user?.role;
  const isParticipant = userRole === EUserRole.Participant;
  const STEPS = isParticipant ? PARTICIPANT_STEPS : SUPPORT_WORKER_STEPS;

  // Initialize form data
  useEffect(() => {
    if (profileData?.user) {
      if (isParticipant) {
        const participant = profileData.user as Participant;
        const userData = {
          firstName: participant.firstName || "",
          lastName: participant.lastName || "",
          phone: participant.phone || "",
          gender: participant.gender || "",
          dateOfBirth: participant.dateOfBirth || null,
          address: participant.address || {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
          notificationPreferences: participant.notificationPreferences,
          supportNeeds:
            participant.supportNeeds?.map((need: any) => need.name) || [],
          emergencyContact: participant.emergencyContact || {
            name: "",
            relationship: "",
            phone: "",
          },
          planManager: participant.planManager || {
            name: "",
            email: "",
          },
          coordinator: participant.coordinator || {
            name: "",
            email: "",
          },
          preferredLanguages: participant.preferredLanguages || [],
          preferredGenders: participant.preferredGenders || [],
          notes: participant.notes || "",
          ndisNumber: participant.ndisNumber || "",
          requiresSupervision: participant.requiresSupervision || false,
        };
        setFormData(userData);
        setOriginalData(JSON.parse(JSON.stringify(userData)));
      } else {
        const supportWorker = profileData.user as SupportWorker;
        const userData = {
          firstName: supportWorker.firstName || "",
          lastName: supportWorker.lastName || "",
          phone: supportWorker.phone || "",
          bio: supportWorker.bio || "",
          skills: supportWorker.skills?.map((s: any) => s.name) || [],
          languages: supportWorker.languages || [],
          experience: supportWorker.experience || [],
          shiftRates: supportWorker.shiftRates || [],
          availability: supportWorker.availability || { weekdays: [] },
          certifications: supportWorker.certifications || [],
        };
        setFormData(userData);
        setOriginalData(JSON.parse(JSON.stringify(userData)));
      }
    }
  }, [profileData, isParticipant]);

  // Event handlers
  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const handleNestedChange = (
    parentField: string,
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as object),
        [field]: value,
      },
    }));
  };

  // Array manipulation helpers
  const addItem = (field: string, value: string) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...((prev as any)[field] || []), value.trim()],
      }));
    }
  };

  const removeItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev as any)[field]?.filter(
        (_: unknown, i: number) => i !== index
      ),
    }));
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.organization) {
      setFormData((prev) => ({
        ...prev,
        experience: [...(prev.experience || []), { ...newExperience }],
      }));
      setNewExperience({
        title: "",
        organization: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience?.filter((_: any, i: number) => i !== index),
    }));
  };

  // Validation
  const validateStep = (
    step: number
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (step === 1) {
      if (!formData.firstName?.trim()) errors.push("First name is required");
      if (!formData.lastName?.trim()) errors.push("Last name is required");
    }

    if (isParticipant && step === 6) {
      if (
        formData.planManager?.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.planManager.email)
      ) {
        errors.push("Plan manager email must be valid");
      }
      if (
        formData.coordinator?.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.coordinator.email)
      ) {
        errors.push("Coordinator email must be valid");
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  // Save current step
  const saveCurrentStep = async () => {
    const { isValid, errors } = validateStep(currentStep);

    if (!isValid) {
      setValidationErrors(errors);
      return false;
    }

    const changedFields = getChangedFields(originalData, formData);

    if (Object.keys(changedFields).length > 0) {
      try {
        await updateProfileMutation.mutateAsync(changedFields);
        setOriginalData(JSON.parse(JSON.stringify(formData)));
        toast.success("Changes saved successfully!");
        return true;
      } catch (error) {
        toast.error("Failed to save changes");
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    const saved = await saveCurrentStep();
    if (saved && currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      setValidationErrors([]);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setValidationErrors([]);
    }
  };

  const handleStepClick = async (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      setValidationErrors([]);
    } else if (stepId === currentStep + 1) {
      await handleNext();
    }
  };

  const handleFinish = async () => {
    const saved = await saveCurrentStep();
    if (saved) {
      toast.success("Profile updated successfully!");
      navigate(
        isParticipant ? "/participant/profile" : "/support-worker/profile"
      );
    }
  };

  if (isLoading) {
    return <Loader type="pulse" />;
  }

  if (isError || !profileData) {
    return (
      <ErrorDisplay
        title="Failed to load profile"
        message={error?.message || "Unable to load profile data"}
        onRetry={() => window.location.reload()}
        showRetry={true}
      />
    );
  }

  const hasChanges =
    Object.keys(getChangedFields(originalData, formData)).length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">
              Update your {isParticipant ? "personal" : "professional"}{" "}
              information - Step {currentStep} of {STEPS.length}
              {hasChanges && (
                <span className="text-orange-600 ml-2 font-montserrat-semibold">
                  (Unsaved changes)
                </span>
              )}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                isParticipant
                  ? "/participant/profile"
                  : "/support-worker/profile"
              )
            }
            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CloseCircle className="w-5 h-5" />
            Cancel
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={cn(
                "h-2 flex-1 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80",
                step.id <= currentStep ? "bg-primary" : "bg-gray-300"
              )}
              onClick={() => handleStepClick(step.id)}
            />
          ))}
        </div>

        {/* Step Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-montserrat-semibold whitespace-nowrap transition-all duration-200",
                  currentStep === step.id
                    ? "bg-primary text-white shadow-lg"
                    : step.id < currentStep
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                )}
              >
                <Icon className="w-4 h-4" />
                {step.title}
                {step.id < currentStep && <CheckCircle className="w-4 h-4" />}
              </button>
            );
          })}
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Card className="border-red-200 bg-red-50 mb-6 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <DangerCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-red-800 font-montserrat-semibold mb-2">
                    Please fix the following errors:
                  </h3>
                  <ul className="text-red-700 text-sm space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Content */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
          <CardContent className="p-6">
            {/* PARTICIPANT STEPS */}
            {isParticipant && (
              <>
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Basic Information
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your personal details and contact information
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="font-montserrat-semibold"
                        >
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName || ""}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="font-montserrat-semibold"
                        >
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName || ""}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="font-montserrat-semibold"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone || ""}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="gender"
                          className="font-montserrat-semibold"
                        >
                          Gender
                        </Label>
                        <Select
                          value={formData.gender || ""}
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">
                              Non-binary
                            </SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="dateOfBirth"
                        className="font-montserrat-semibold"
                      >
                        Date of Birth
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={
                          formData.dateOfBirth
                            ? new Date(formData.dateOfBirth)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "dateOfBirth",
                            e.target.value ? new Date(e.target.value) : null
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="notificationPreferences"
                        className="font-montserrat-semibold"
                      >
                        Notification Preferences
                      </Label>
                      <Select
                        value={formData.notificationPreferences || ""}
                        onValueChange={(value) =>
                          handleInputChange("notificationPreferences", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select notification preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="emailAndSms">
                            Both Email & SMS
                          </SelectItem>
                          <SelectItem value="emailAndPush">
                            Email & Push Notification
                          </SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 2: Address */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <MapPoint className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Address Information
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your residential address
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="street"
                        className="font-montserrat-semibold"
                      >
                        Street Address
                      </Label>
                      <Input
                        id="street"
                        value={formData.address?.street || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "address",
                            "street",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="city"
                          className="font-montserrat-semibold"
                        >
                          City
                        </Label>
                        <Input
                          id="city"
                          value={formData.address?.city || ""}
                          onChange={(e) =>
                            handleNestedChange(
                              "address",
                              "city",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="state"
                          className="font-montserrat-semibold"
                        >
                          State
                        </Label>
                        <Input
                          id="state"
                          value={formData.address?.state || ""}
                          onChange={(e) =>
                            handleNestedChange(
                              "address",
                              "state",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="postalCode"
                          className="font-montserrat-semibold"
                        >
                          Postal Code
                        </Label>
                        <Input
                          id="postalCode"
                          value={formData.address?.postalCode || ""}
                          onChange={(e) =>
                            handleNestedChange(
                              "address",
                              "postalCode",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="country"
                          className="font-montserrat-semibold"
                        >
                          Country
                        </Label>
                        <Input
                          id="country"
                          value={formData.address?.country || ""}
                          onChange={(e) =>
                            handleNestedChange(
                              "address",
                              "country",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Support Needs */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Support Needs
                        </h2>
                        <p className="text-sm text-gray-600">
                          Types of support you require
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="font-montserrat-semibold">
                        Your Support Needs
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {(formData.supportNeeds || []).map(
                          (need: string, index: number) => (
                            <Badge
                              key={index}
                              className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-sm pr-1"
                            >
                              {need}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-2 hover:bg-transparent"
                                onClick={() =>
                                  removeItem("supportNeeds", index)
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add support need"
                          value={newSupportNeed}
                          onChange={(e) => setNewSupportNeed(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newSupportNeed.trim()) {
                                addItem("supportNeeds", newSupportNeed);
                                setNewSupportNeed("");
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (newSupportNeed.trim()) {
                              addItem("supportNeeds", newSupportNeed);
                              setNewSupportNeed("");
                            }
                          }}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: NDIS Information */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          NDIS & Care Information
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your NDIS details and care requirements
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="ndisNumber"
                        className="font-montserrat-semibold"
                      >
                        NDIS Number
                      </Label>
                      <Input
                        id="ndisNumber"
                        value={formData.ndisNumber || ""}
                        onChange={(e) =>
                          handleInputChange("ndisNumber", e.target.value)
                        }
                        placeholder="Enter NDIS number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="notes"
                        className="font-montserrat-semibold"
                      >
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes about your care needs"
                        value={formData.notes || ""}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="flex items-center space-x-2 p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <Checkbox
                        id="requiresSupervision"
                        checked={formData.requiresSupervision || false}
                        onCheckedChange={(checked) =>
                          handleInputChange("requiresSupervision", checked)
                        }
                        className="w-5 h-5"
                      />
                      <Label
                        htmlFor="requiresSupervision"
                        className="cursor-pointer font-montserrat-semibold"
                      >
                        Requires Supervision
                      </Label>
                    </div>
                  </div>
                )}

                {/* Step 5: Emergency Contact */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <DangerCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Emergency Contact
                        </h2>
                        <p className="text-sm text-gray-600">
                          Person to contact in case of emergency
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="emergencyContactName"
                          className="font-montserrat-semibold"
                        >
                          Name
                        </Label>
                        <Input
                          id="emergencyContactName"
                          value={formData.emergencyContact?.name || ""}
                          onChange={(e) =>
                            handleNestedChange(
                              "emergencyContact",
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="emergencyContactRelationship"
                          className="font-montserrat-semibold"
                        >
                          Relationship
                        </Label>
                        <Input
                          id="emergencyContactRelationship"
                          value={formData.emergencyContact?.relationship || ""}
                          onChange={(e) =>
                            handleNestedChange(
                              "emergencyContact",
                              "relationship",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="emergencyContactPhone"
                        className="font-montserrat-semibold"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        value={formData.emergencyContact?.phone || ""}
                        onChange={(e) =>
                          handleNestedChange(
                            "emergencyContact",
                            "phone",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Step 6: Care Team */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Buildings2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Care Team
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your plan manager and coordinator details
                        </p>
                      </div>
                    </div>

                    {/* Plan Manager */}
                    <div className="space-y-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <h3 className="font-montserrat-semibold text-gray-900">
                        Plan Manager
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="planManagerName"
                            className="font-montserrat-semibold"
                          >
                            Name
                          </Label>
                          <Input
                            id="planManagerName"
                            value={formData.planManager?.name || ""}
                            onChange={(e) =>
                              handleNestedChange(
                                "planManager",
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="planManagerEmail"
                            className="font-montserrat-semibold"
                          >
                            Email
                          </Label>
                          <Input
                            id="planManagerEmail"
                            type="email"
                            value={formData.planManager?.email || ""}
                            onChange={(e) =>
                              handleNestedChange(
                                "planManager",
                                "email",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Coordinator */}
                    <div className="space-y-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <h3 className="font-montserrat-semibold text-gray-900">
                        Coordinator
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="coordinatorName"
                            className="font-montserrat-semibold"
                          >
                            Name
                          </Label>
                          <Input
                            id="coordinatorName"
                            value={formData.coordinator?.name || ""}
                            onChange={(e) =>
                              handleNestedChange(
                                "coordinator",
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="coordinatorEmail"
                            className="font-montserrat-semibold"
                          >
                            Email
                          </Label>
                          <Input
                            id="coordinatorEmail"
                            type="email"
                            value={formData.coordinator?.email || ""}
                            onChange={(e) =>
                              handleNestedChange(
                                "coordinator",
                                "email",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Preferences */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Preferences
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your care preferences and requirements
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="font-montserrat-semibold">
                        Preferred Languages
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {(formData.preferredLanguages || []).map(
                          (lang: string, index: number) => (
                            <Badge
                              key={index}
                              className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-sm pr-1"
                            >
                              {lang}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-2 hover:bg-transparent"
                                onClick={() =>
                                  removeItem("preferredLanguages", index)
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="font-montserrat-semibold">
                        Preferred Worker Gender
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {(formData.preferredGenders || []).map(
                          (gender: string, index: number) => (
                            <Badge
                              key={index}
                              className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-sm pr-1"
                            >
                              {gender}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-2 hover:bg-transparent"
                                onClick={() =>
                                  removeItem("preferredGenders", index)
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* SUPPORT WORKER STEPS */}
            {!isParticipant && (
              <>
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Basic Information
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your personal details and contact information
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="font-montserrat-semibold"
                        >
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName || ""}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="font-montserrat-semibold"
                        >
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName || ""}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="font-montserrat-semibold"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <CaseRoundMinimalistic className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Professional Details
                        </h2>
                        <p className="text-sm text-gray-600">
                          Tell us about your professional background
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="font-montserrat-semibold">
                        Professional Bio
                      </Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself and your experience in support work..."
                        value={formData.bio || ""}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        className="min-h-[150px]"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Skills & Experience */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Skills & Experience
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your professional skills and work experience
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                      <Label className="font-montserrat-semibold">
                        Professional Skills
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {(formData.skills || []).map(
                          (skill: string, index: number) => (
                            <Badge
                              key={index}
                              className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-sm pr-1"
                            >
                              {skill}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-2 hover:bg-transparent"
                                onClick={() => removeItem("skills", index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newSkill.trim()) {
                                addItem("skills", newSkill);
                                setNewSkill("");
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (newSkill.trim()) {
                              addItem("skills", newSkill);
                              setNewSkill("");
                            }
                          }}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-4">
                      <Label className="font-montserrat-semibold">
                        Work Experience
                      </Label>
                      <div className="space-y-3">
                        {(formData.experience || []).map(
                          (exp: any, index: number) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-montserrat-bold text-gray-900">
                                    {exp.title} at {exp.organization}
                                  </h4>
                                  <p className="text-xs text-gray-600">
                                    {exp.startDate} - {exp.endDate || "Present"}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExperience(index)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              {exp.description && (
                                <p className="text-sm text-gray-700">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>

                      {/* Add New Experience Form */}
                      <div className="p-4 rounded-lg bg-primary-50 border border-primary-100 space-y-3">
                        <h4 className="font-montserrat-semibold text-gray-900">
                          Add Experience
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Job Title"
                            value={newExperience.title}
                            onChange={(e) =>
                              setNewExperience({
                                ...newExperience,
                                title: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Organization"
                            value={newExperience.organization}
                            onChange={(e) =>
                              setNewExperience({
                                ...newExperience,
                                organization: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            type="date"
                            placeholder="Start Date"
                            value={newExperience.startDate}
                            onChange={(e) =>
                              setNewExperience({
                                ...newExperience,
                                startDate: e.target.value,
                              })
                            }
                          />
                          <Input
                            type="date"
                            placeholder="End Date (Optional)"
                            value={newExperience.endDate}
                            onChange={(e) =>
                              setNewExperience({
                                ...newExperience,
                                endDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Textarea
                          placeholder="Description (Optional)"
                          value={newExperience.description}
                          onChange={(e) =>
                            setNewExperience({
                              ...newExperience,
                              description: e.target.value,
                            })
                          }
                          className="min-h-[80px]"
                        />
                        <Button
                          type="button"
                          onClick={addExperience}
                          className="w-full gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add Experience
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Languages & Rates */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Translation className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Languages & Rates
                        </h2>
                        <p className="text-sm text-gray-600">
                          Languages you speak and your shift rates
                        </p>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="space-y-4">
                      <Label className="font-montserrat-semibold">
                        Languages Spoken
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {(formData.languages || []).map(
                          (lang: string, index: number) => (
                            <Badge
                              key={index}
                              className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-sm pr-1"
                            >
                              {lang}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-2 hover:bg-transparent"
                                onClick={() => removeItem("languages", index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add language"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newLanguage.trim()) {
                                addItem("languages", newLanguage);
                                setNewLanguage("");
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (newLanguage.trim()) {
                              addItem("languages", newLanguage);
                              setNewLanguage("");
                            }
                          }}
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Shift Rates - Placeholder for now */}
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Dollar className="w-5 h-5 text-primary" />
                        <Label className="font-montserrat-semibold">
                          Shift Rates
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Contact your administrator to update shift rates
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 5: Availability */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <CalendarMark className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Availability
                        </h2>
                        <p className="text-sm text-gray-600">
                          Set your weekly availability schedule
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-sm text-gray-600">
                        Availability scheduling feature coming soon. Contact
                        your administrator for now.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 6: Bio & Preferences */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <DocumentText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Additional Information
                        </h2>
                        <p className="text-sm text-gray-600">
                          Certifications and additional preferences
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <Label className="font-montserrat-semibold mb-3 block">
                        Certifications
                      </Label>
                      <p className="text-sm text-gray-600">
                        Contact your administrator to add or update
                        certifications
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <AltArrowLeft className="w-5 h-5" />
            Back
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Saving..." : "Next"}
              <AltArrowRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-green-600 hover:bg-green-700"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                "Saving..."
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Finish
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
