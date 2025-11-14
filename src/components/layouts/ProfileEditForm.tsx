import React, { useState, useEffect, useMemo } from "react";
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
  Refresh,
} from "@solar-icons/react";
import { Participant, SupportWorker, EUserRole } from "@/types/user.types";
import { UpdateProfileData } from "@/api/services/userService";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
import { commonLanguages } from "@/constants/common-languages";

import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import {
  useStates,
  useRegions,
  useServiceAreasByRegion,
  useServiceAreasByState,
} from "@/hooks/useLocationHooks";

// Simple debounce function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

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
  { id: 2, title: "Contact & Location", icon: MapPoint },
  { id: 3, title: "NDIS & Support", icon: Heart },
  { id: 4, title: "Emergency Contact", icon: DangerCircle },
  { id: 5, title: "Care Team", icon: Buildings2 },
  { id: 6, title: "Preferences", icon: Star },
];

// Step configurations for Support Worker
const SUPPORT_WORKER_STEPS = [
  { id: 1, title: "Basic Information", icon: User },
  { id: 2, title: "Professional Bio", icon: CaseRoundMinimalistic },
  { id: 3, title: "Skills & Languages", icon: Star },
  { id: 4, title: "Experience", icon: Translation },
  { id: 5, title: "Location & Service Areas", icon: MapPoint },
  { id: 6, title: "Rates & Availability", icon: CalendarMark },
];

export default function EditProfile() {
  const navigate = useNavigate();
  const { data: profileData, isLoading, isError, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<any>>({});
  const [originalData, setOriginalData] = useState<Partial<any>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [showAddressPredictions, setShowAddressPredictions] = useState(false);
  const [addressInputValue, setAddressInputValue] = useState("");

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
  const isParticipant = userRole === EUserRole.PARTICIPANT;
  const STEPS = isParticipant ? PARTICIPANT_STEPS : SUPPORT_WORKER_STEPS;

  // Google Places Autocomplete Hook
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "",
    options: {
      types: ["address"],
      componentRestrictions: { country: "au" },
    },
  });

  // Add these state variables for better control
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Initialize address input value from form data
  useEffect(() => {
    if (formData.address) {
      setSelectedAddress(formData.address);
      setAddressInputValue(formData.address);
    }
  }, [formData.address]);

  // Debounced function for getting predictions
  const debouncedGetPredictions = useMemo(
    () =>
      debounce((input: string) => {
        if (input.length > 2) {
          getPlacePredictions({ input });
          setShowAddressPredictions(true);
        } else {
          setShowAddressPredictions(false);
        }
      }, 300),
    [getPlacePredictions]
  );

  // Handle input change with proper debouncing
  const handleAddressInputChange = (value: string) => {
    setAddressInputValue(value);
    setIsTyping(true);

    // Update form data immediately for local state
    handleInputChange("address", value);

    // Debounced prediction fetch
    debouncedGetPredictions(value);

    // Stop typing indicator after a delay
    setTimeout(() => setIsTyping(false), 1000);
  };

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
          address: participant.address || "",
          notificationPreferences: participant.notificationPreferences || "",
          // NDIS & Support
          ndisNumber: participant.ndisNumber || "",
          supportNeeds:
            participant.supportNeeds?.map((need: any) => need._id) || [],
          requiresSupervision: participant.requiresSupervision || false,
          // Location - FIX: Use the correct field names
          stateId: participant.stateId || "",
          regionId: participant.regionId || "",
          suburbId: participant.suburbId || "",
          serviceAreaId: participant.serviceAreaId || "",
          // Emergency Contact
          emergencyContact: participant.emergencyContact || {
            name: "",
            relationship: "",
            phone: "",
          },
          // Care Team - FIX: Add these fields
          planManager: participant.planManager || {
            name: "",
            email: "",
          },
          coordinator: participant.coordinator || {
            name: "",
            email: "",
          },
          // Preferences - FIX: Add these fields
          preferredLanguages: participant.preferredLanguages || [],
          preferredGenders: participant.preferredGenders || [],
          notes: participant.notes || "",
          // Add missing fields
          subscription: participant.subscription || {},
          supportCoordinators: participant.supportCoordinators || [],
          onboardingComplete: participant.onboardingComplete || false,
        };
        setFormData(userData);
        setOriginalData(JSON.parse(JSON.stringify(userData)));
      } else {
        const supportWorker = profileData.user as SupportWorker;
        const userData = {
          // Basic Info
          firstName: supportWorker.firstName || "",
          lastName: supportWorker.lastName || "",
          phone: supportWorker.phone || "",
          gender: supportWorker.gender || "",
          dateOfBirth: supportWorker.dateOfBirth || null,
          // Professional
          bio: supportWorker.bio || "",
          address: supportWorker.address || "",
          // Skills & Languages
          skills: supportWorker.skills?.map((s: any) => s._id) || [],
          languages: supportWorker.languages || [],
          // Experience
          experience: supportWorker.experience || [],
          qualifications: supportWorker.qualifications || [],
          // Location & Service
          stateIds: supportWorker.stateIds || [],
          regionIds: supportWorker.regionIds || [],
          serviceAreaIds: supportWorker.serviceAreaIds || [],
          serviceAreas: supportWorker.serviceAreas || [],
          travelRadiusKm: supportWorker.travelRadiusKm || 20,
          baseLocation: supportWorker.baseLocation || null,
          // Rates & Availability
          shiftRates: supportWorker.shiftRates || [],
          availability: supportWorker.availability || {
            weekdays: [],
            unavailableDates: [],
          },
          // Verification & Organizations
          verificationStatus: supportWorker.verificationStatus || {},
          ratings: supportWorker.ratings || { average: 0, count: 0 },
          organizations: supportWorker.organizations || [],
          // Additional fields
          notificationPreferences: supportWorker.notificationPreferences || "",
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

  // Handle address selection from predictions

  const handleAddressSelect = React.useCallback(
    (prediction: any) => {
      const selectedAddress = prediction.description;

      console.log("Address selected:", selectedAddress);

      // Update all address-related state
      setAddressInputValue(selectedAddress);
      setSelectedAddress(selectedAddress);
      handleInputChange("address", selectedAddress);
      setShowAddressPredictions(false);

      // Get detailed place information for additional data
      if (placesService) {
        placesService.getDetails(
          {
            placeId: prediction.place_id,
            fields: [
              "address_components",
              "formatted_address",
              "geometry",
              "name",
            ],
          },
          (placeDetails: any) => {
            if (placeDetails) {
              console.log("Place details:", placeDetails);
            }
          }
        );
      }
    },
    [placesService, handleInputChange]
  );

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

    if (isParticipant && step === 5) {
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
  // Allow navigation to any step without restriction
  if (stepId !== currentStep) {
    // Save current step before navigating
    if (hasChanges) {
      const saved = await saveCurrentStep();
      if (!saved) {
        toast.error("Please fix validation errors before switching tabs");
        return;
      }
    }
    
    setCurrentStep(stepId);
    setValidationErrors([]);
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

  // state management for location selections
  const [selectedStateIds, setSelectedStateIds] = useState<string[]>([]);
  const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>([]);

  // Location data hooks
  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const { data: allRegions = [], isLoading: isLoadingRegions } = useRegions(
    selectedStateIds.length > 0 ? selectedStateIds[0] : undefined,
    selectedStateIds.length > 0
  );
  const { data: allServiceAreas = [], isLoading: isLoadingServiceAreas } =
    useServiceAreasByRegion(
      selectedRegionIds.length > 0 ? selectedRegionIds[0] : undefined,
      selectedRegionIds.length > 0
    );

  // Initialize selected IDs from form data
  useEffect(() => {
    if (isParticipant) {
      if (formData.stateId) setSelectedStateIds([formData.stateId]);
      if (formData.regionId) setSelectedRegionIds([formData.regionId]);
    } else {
      if (formData.stateIds) setSelectedStateIds(formData.stateIds);
      if (formData.regionIds) setSelectedRegionIds(formData.regionIds);
    }
  }, [
    formData.stateId,
    formData.regionId,
    formData.stateIds,
    formData.regionIds,
    isParticipant,
  ]);

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
          "flex h-8 items-center gap-2 px-4 py-2 rounded-full text-xs font-montserrat-semibold whitespace-nowrap transition-all duration-200 cursor-pointer hover:scale-105",
          currentStep === step.id
            ? "bg-primary text-white shadow-lg"
            : step.id < currentStep
            ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
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

                {/* Step 2: Contact & Location */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <MapPoint className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Contact & Location
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your address and location information
                        </p>
                      </div>
                    </div>

                    {/* Address Input with Autocomplete */}
                    <div className="space-y-2">
                      <Label htmlFor="address" className="font-montserrat-semibold">
                        Address
                      </Label>
                      <div className="relative">
                        <div className="relative">
                          <MapPoint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                          <Input
                            id="address"
                            type="text"
                            placeholder="Start typing your address..."
                            value={addressInputValue}
                            onChange={(e) => handleAddressInputChange(e.target.value)}
                            onFocus={() => {
                              if (
                                addressInputValue.trim().length > 2 &&
                                placePredictions.length > 0
                              ) {
                                setShowAddressPredictions(true);
                              }
                            }}
                            className="pl-10 text-sm"
                            autoComplete="off"
                          />
                          {(isPlacePredictionsLoading || isTyping) && (
                            <Refresh className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                          )}
                        </div>

                        {/* Predictions Dropdown */}
                        {showAddressPredictions && placePredictions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {placePredictions.map((prediction) => (
                              <div
                                key={prediction.place_id}
                                onClick={() => handleAddressSelect(prediction)}
                                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex items-start gap-3">
                                  <MapPoint className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 font-medium truncate">
                                      {prediction.structured_formatting?.main_text ||
                                        prediction.description.split(",")[0]}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                      {prediction.structured_formatting?.secondary_text ||
                                        prediction.description.split(",").slice(1).join(",").trim()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location Selection - State, Region, Service Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* State Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="stateId" className="font-montserrat-semibold">
                          State
                        </Label>
                        <Select
                          value={formData.stateId || ""}
                          onValueChange={(value) => {
                            handleInputChange("stateId", value);
                            setSelectedStateIds([value]);
                            // Reset dependent fields
                            setSelectedRegionIds([]);
                            handleInputChange("regionId", "");
                            handleInputChange("serviceAreaId", "");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state._id} value={state._id}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Region Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="regionId" className="font-montserrat-semibold">
                          Region
                        </Label>
                        <Select
                          value={formData.regionId || ""}
                          onValueChange={(value) => {
                            handleInputChange("regionId", value);
                            setSelectedRegionIds([value]);
                            // Reset dependent fields
                            handleInputChange("serviceAreaId", "");
                          }}
                          disabled={!formData.stateId || isLoadingRegions}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            {allRegions.map((region) => (
                              <SelectItem key={region._id} value={region._id}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Service Area Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="serviceAreaId" className="font-montserrat-semibold">
                          Service Area
                        </Label>
                        <Select
                          value={formData.serviceAreaId || ""}
                          onValueChange={(value) => handleInputChange("serviceAreaId", value)}
                          disabled={!formData.regionId || isLoadingServiceAreas}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service area" />
                          </SelectTrigger>
                          <SelectContent>
                            {allServiceAreas.map((serviceArea) => (
                              <SelectItem key={serviceArea._id} value={serviceArea._id}>
                                {serviceArea.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Comment out suburb selection */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="suburbId" className="font-montserrat-semibold">
                        Suburb ID
                      </Label>
                      <Input
                        id="suburbId"
                        value={formData.suburbId || ""}
                        onChange={(e) => handleInputChange("suburbId", e.target.value)}
                        placeholder="Suburb identifier"
                      />
                    </div> */}
                  </div>
                )}

                {/* Step 3: NDIS & Support */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          NDIS & Support Needs
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your NDIS information and support requirements
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

                    <div className="space-y-4">
                      <Label className="font-montserrat-semibold">
                        Support Needs
                      </Label>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Current support needs (managed by system
                          administrator)
                        </p>
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                          {formData.supportNeeds?.length > 0 ? (
                            <div className="text-sm text-gray-700">
                              {formData.supportNeeds.length} support need(s)
                              configured
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              No support needs configured yet
                            </div>
                          )}
                        </div>
                      </div>
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

                {/* Step 4: Emergency Contact */}
                {currentStep === 4 && (
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

                {/* Step 5: Care Team */}
                {currentStep === 5 && (
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

                {/* Step 6: Preferences */}
                {currentStep === 6 && (
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
                              className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-xs pr-1 h-6"
                            >
                              {lang}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs p-0 ml-2 hover:bg-transparent"
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
                      {/* Show a list of common languages to add */}
                      <div className="flex flex-wrap gap-4">
                        {commonLanguages.map((lang) => (
                          <Button
                            key={lang}
                            type="button"
                            variant="outline"
                            onClick={() => addItem("preferredLanguages", lang)}
                            className="text-xs h-6 hover:bg-primary-700 hover:text-white transition-colors rounded-full"
                          >
                            {lang}
                          </Button>
                        ))}
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
                                addItem("preferredLanguages", newLanguage);
                                setNewLanguage("");
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (newLanguage.trim()) {
                              addItem("preferredLanguages", newLanguage);
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

                    <div className="space-y-2">
                      <Label
                        htmlFor="notes"
                        className="font-montserrat-semibold"
                      >
                        Additional Notes
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
                  </div>
                )}

                {/* Step 2: Professional Bio */}
                {currentStep === 2 && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="font-montserrat-semibold"
                    >
                      Address
                    </Label>
                    <div className="relative">
                      <div className="relative">
                        <MapPoint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                        <Input
                          id="address"
                          type="text"
                          placeholder="Start typing your address..."
                          value={addressInputValue}
                          onChange={(e) =>
                            handleAddressInputChange(e.target.value)
                          }
                          onFocus={() => {
                            if (
                              addressInputValue.trim().length > 2 &&
                              placePredictions.length > 0
                            ) {
                              setShowAddressPredictions(true);
                            }
                          }}
                          onBlur={() => {
                            // Delay hiding predictions to allow for selection
                            setTimeout(
                              () => setShowAddressPredictions(false),
                              200
                            );
                          }}
                          className="pl-10 text-sm"
                          autoComplete="off"
                        />
                        {(isPlacePredictionsLoading || isTyping) && (
                          <Refresh className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                        )}
                      </div>

                      {/* Predictions Dropdown */}
                      {showAddressPredictions &&
                        placePredictions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {placePredictions.map((prediction) => (
                              <div
                                key={prediction.place_id}
                                onClick={() => handleAddressSelect(prediction)}
                                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex items-start gap-3">
                                  <MapPoint className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 font-medium truncate">
                                      {prediction.structured_formatting?.main_text ||
                                        prediction.description.split(",")[0]}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                      {prediction.structured_formatting?.secondary_text ||
                                        prediction.description.split(",").slice(1).join(",").trim()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Step 3: Skills & Languages */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Skills & Languages
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your professional skills and languages
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                      <Label className="font-montserrat-semibold">
                        Professional Skills
                      </Label>
                      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <p className="text-sm text-gray-600">
                          Skills are managed by system administrator. Current
                          skills: {formData.skills?.length || 0}
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
                              className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-xs pr-1 h-6"
                            >
                              {lang}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs p-0 ml-2 hover:bg-transparent"
                                onClick={() => removeItem("languages", index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )
                        )}
                      </div>
                      {/* Show a list of common languages to add */}
                      <div className="flex flex-wrap gap-4">
                        {commonLanguages
                          .filter((lang) => !formData.languages?.includes(lang))
                          .map((lang) => (
                            <Button
                              key={lang}
                              type="button"
                              variant="outline"
                              onClick={() => addItem("languages", lang)}
                              className="text-xs h-6 hover:bg-primary-700 hover:text-white transition-colors rounded-full"
                            >
                              {lang}
                            </Button>
                          ))}
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
                  </div>
                )}

                {/* Step 4: Experience */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Translation className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Work Experience
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your professional work experience
                        </p>
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
                                  <p className="text-sm text-gray-600">
                                    {exp.startDate &&
                                      new Date(
                                        exp.startDate
                                      ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {exp.endDate
                                      ? new Date(
                                          exp.endDate
                                        ).toLocaleDateString()
                                      : "Present"}
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

                {/* Step 5: Location & Service Areas */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <MapPoint className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Location & Service Areas
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your service location and travel radius
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="travelRadiusKm"
                        className="font-montserrat-semibold"
                      >
                        Travel Radius (km)
                      </Label>
                      <Input
                        id="travelRadiusKm"
                        type="number"
                        value={formData.travelRadiusKm || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "travelRadiusKm",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="Enter travel radius in kilometers"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <Label className="font-montserrat-semibold">
                          State IDs
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {formData.stateIds?.length || 0} configured
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <Label className="font-montserrat-semibold">
                          Region IDs
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {formData.regionIds?.length || 0} configured
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <Label className="font-montserrat-semibold">
                          Service Area IDs
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {formData.serviceAreaIds?.length || 0} configured
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Rates & Availability */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <CalendarMark className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-montserrat-bold text-gray-900">
                          Rates & Availability
                        </h2>
                        <p className="text-sm text-gray-600">
                          Your shift rates and availability schedule
                        </p>
                      </div>
                    </div>

                    {/* Shift Rates */}
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Dollar className="w-5 h-5 text-primary" />
                        <Label className="font-montserrat-semibold">
                          Shift Rates
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formData.shiftRates?.length || 0} shift rates
                        configured. Contact your administrator to update rates.
                      </p>
                    </div>

                    {/* Availability */}
                    <div className="space-y-4">
                      <Label className="font-montserrat-semibold">
                        Weekly Availability
                      </Label>
                      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <p className="text-sm text-gray-600">
                          Availability is managed through the admin panel.
                          Current status:{" "}
                          {formData.availability?.weekdays?.filter(
                            (day: any) => day.available
                          )?.length || 0}{" "}
                          days available
                        </p>
                      </div>
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
