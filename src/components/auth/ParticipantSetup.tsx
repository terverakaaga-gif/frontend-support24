import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import authService from "@/api/services/authService";
import { useGetActiveServiceTypes } from "@/hooks/useServiceTypeHooks";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../Spinner";
import {
  useRegions,
  useServiceAreasByRegion,
  useStates,
  useSuburbsByRegion,
} from "@/hooks/useLocationHooks";
import {
  AltArrowLeft,
  AltArrowRight,
  MapPoint,
  Magnifer,
  User,
  Heart,
  UsersGroupTwoRounded,
  HashtagSquare,
  CheckCircle,
  CloseCircle,
  Refresh,
} from "@solar-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { commonLanguages } from "@/constants/common-languages";
import { ParticipantOnboardingInput } from "@/types/user.types";

// Validation Schemas
const personalInfoSchema = z.object({
  ndisNumber: z
    .string()
    .min(12, { message: "NDIS number must be at least 12 characters." }),
  preferredLanguages: z
    .array(z.string().min(1))
    .min(1, { message: "Please select at least one language." }),
  address: z.string().min(5, { message: "Please enter your address." }),
  stateId: z.string().min(1, { message: "Please select a state." }),
  regionId: z.string().min(1, { message: "Please select a region." }),
  suburbId: z.string().min(1, { message: "Please select a suburb." }),
  serviceAreaId: z
    .string()
    .min(1, { message: "Please select a service area." }),
});

const supportNeedsSchema = z.object({
  supportNeeds: z
    .array(z.string())
    .min(1, { message: "Please select at least one support need." }),
});

const emergencyContactSchema = z.object({
  emergencyContact: z.object({
    name: z.string().min(2, { message: "Contact name is required." }),
    relationship: z.string().min(2, { message: "Relationship is required." }),
    phone: z.string().min(10, { message: "Valid phone number is required." }),
  }),
});

const coordinationSchema = z.object({
  planManager: z.object({
    name: z.string().min(2, { message: "Plan manager name is required." }),
    email: z.string().email({ message: "Valid email is required." }),
  }),
  coordinator: z.object({
    name: z.string().min(2, { message: "Coordinator name is required." }),
    email: z.string().email({ message: "Valid email is required." }),
  }),
});

interface ParticipantSetupProps {
  onComplete: () => void;
  isSubmitting?: boolean;
}

export function ParticipantSetup({
  onComplete,
  isSubmitting = false,
}: ParticipantSetupProps) {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [languageInput, setLanguageInput] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showAddressPredictions, setShowAddressPredictions] = useState(false);
  const [addressInputValue, setAddressInputValue] = useState("");

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

  const { data: supportNeeds = [], isLoading: isLoadingSupportNeeds } =
    useGetActiveServiceTypes();

  // Location hooks
  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");

  const { data: regions = [], isLoading: isLoadingRegions } = useRegions(
    selectedStateId,
    !!selectedStateId
  );

  const { data: suburbs = [], isLoading: isLoadingSuburbs } =
    useSuburbsByRegion(selectedRegionId, !!selectedRegionId);

  const { data: serviceAreas = [], isLoading: isLoadingServiceAreas } =
    useServiceAreasByRegion(selectedRegionId, !!selectedRegionId);

  const [formData, setFormData] = useState({
    ndisNumber: "",
    preferredLanguages: [] as string[],
    address: "",
    stateId: "",
    regionId: "",
    suburbId: "",
    serviceAreaId: "",
    supportNeeds: [] as string[],
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    planManager: {
      name: "",
      email: "",
    },
    coordinator: {
      name: "",
      email: "",
    },
  });

  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      ndisNumber: formData.ndisNumber,
      preferredLanguages: formData.preferredLanguages,
      address: formData.address,
      stateId: formData.stateId,
      regionId: formData.regionId,
      suburbId: formData.suburbId,
      serviceAreaId: formData.serviceAreaId,
    },
  });

  const supportNeedsForm = useForm<z.infer<typeof supportNeedsSchema>>({
    resolver: zodResolver(supportNeedsSchema),
    defaultValues: {
      supportNeeds: formData.supportNeeds,
    },
  });

  const emergencyContactForm = useForm<z.infer<typeof emergencyContactSchema>>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      emergencyContact: formData.emergencyContact,
    },
  });

  const coordinationForm = useForm<z.infer<typeof coordinationSchema>>({
    resolver: zodResolver(coordinationSchema),
    defaultValues: {
      planManager: formData.planManager,
      coordinator: formData.coordinator,
    },
  });

  // Handle address input changes with debouncing
  const handleAddressInputChange = React.useCallback(
    (value: string) => {
      setAddressInputValue(value);
      setFormData({ ...formData, address: value });
      personalInfoForm.setValue("address", value);

      if (value.trim().length > 2) {
        getPlacePredictions({ input: value });
        setShowAddressPredictions(true);
      } else {
        setShowAddressPredictions(false);
      }
    },
    [formData, getPlacePredictions, personalInfoForm]
  );

  // Handle address selection from predictions
  const handleAddressSelect = React.useCallback(
    (prediction: any) => {
      const selectedAddress = prediction.description;
      setAddressInputValue(selectedAddress);
      setFormData({ ...formData, address: selectedAddress });
      personalInfoForm.setValue("address", selectedAddress);
      setShowAddressPredictions(false);

      // Optional: Get detailed place information
      if (placesService) {
        placesService.getDetails(
          {
            placeId: prediction.place_id,
          },
          (placeDetails: any) => {
            console.log("Place details:", placeDetails);
          }
        );
      }
    },
    [formData, placesService, personalInfoForm]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#address-autocomplete-container")) {
        setShowAddressPredictions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset dependent fields when state changes
  React.useEffect(() => {
    if (selectedStateId !== formData.stateId) {
      setSelectedRegionId("");
      setFormData((prev) => ({
        ...prev,
        regionId: "",
        suburbId: "",
        serviceAreaId: "",
      }));
      personalInfoForm.setValue("regionId", "");
      personalInfoForm.setValue("suburbId", "");
      personalInfoForm.setValue("serviceAreaId", "");
    }
  }, [selectedStateId, formData.stateId, personalInfoForm]);

  // Reset suburbs and service areas when region changes
  React.useEffect(() => {
    if (selectedRegionId !== formData.regionId) {
      setFormData((prev) => ({
        ...prev,
        suburbId: "",
        serviceAreaId: "",
      }));
      personalInfoForm.setValue("suburbId", "");
      personalInfoForm.setValue("serviceAreaId", "");
    }
  }, [selectedRegionId, formData.regionId, personalInfoForm]);

  const nextStep = React.useCallback(() => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    setStep(step + 1);
  }, [completedSteps, step]);

  const prevStep = React.useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const goToStep = React.useCallback(
    (targetStep: number) => {
      if (targetStep <= step || completedSteps.includes(targetStep - 1)) {
        setStep(targetStep);
      }
    },
    [step, completedSteps]
  );

  const handlePersonalInfoSubmit = React.useCallback(
    async (data: z.infer<typeof personalInfoSchema>) => {
      setFormData({
        ...formData,
        ndisNumber: data.ndisNumber,
        preferredLanguages: data.preferredLanguages,
        address: data.address,
        stateId: data.stateId,
        regionId: data.regionId,
        suburbId: data.suburbId,
        serviceAreaId: data.serviceAreaId,
      });
      nextStep();
    },
    [formData, nextStep]
  );

  const handleSupportNeedsSubmit = React.useCallback(
    async (data: z.infer<typeof supportNeedsSchema>) => {
      setFormData({ ...formData, supportNeeds: data.supportNeeds });
      nextStep();
    },
    [formData, nextStep]
  );

  const handleEmergencyContactSubmit = React.useCallback(
    async (data: z.infer<typeof emergencyContactSchema>) => {
      setFormData({
        ...formData,
        emergencyContact: {
          name: data.emergencyContact.name || "",
          relationship: data.emergencyContact.relationship || "",
          phone: data.emergencyContact.phone || "",
        },
      });
      nextStep();
    },
    [formData, nextStep]
  );

  const handleCoordinationSubmit = React.useCallback(
    async (data: z.infer<typeof coordinationSchema>) => {
      const finalData = {
        ...formData,
        planManager: data.planManager,
        coordinator: data.coordinator,
      };
      setFormData(finalData as any);
      await submitOnboarding(finalData as any);
    },
    [formData]
  );

  const submitOnboarding = React.useCallback(
    async (data: typeof formData) => {
      setIsOnboarding(true);

      try {
        // Transform data to match backend validation exactly
        const transformedData = {
          supportNeeds: data.supportNeeds, // Already array of ObjectId strings
          emergencyContact: data.emergencyContact,
          planManager: data.planManager,
          coordinator: data.coordinator,
          preferredLanguages: data.preferredLanguages,
          ndisNumber: data.ndisNumber,
          stateId: data.stateId,
          regionId: data.regionId,
          suburbId: data.suburbId,
          serviceAreaId: data.serviceAreaId,
          location: data.address
            ? {
                longitude: 0, // You'll need to get this from Google Places if needed
                latitude: 0, // You'll need to get this from Google Places if needed
              }
            : undefined,
          address: data.address,
        };

        await authService.completeParticipantOnboarding(transformedData as ParticipantOnboardingInput);
        completeOnboarding();
        toast.success("Profile setup completed successfully!");
        onComplete();
      } catch (error) {
        console.error("Failed to complete onboarding:", error);
        toast.error("Failed to complete profile setup. Please try again.");
      } finally {
        setIsOnboarding(false);
      }
    },
    [completeOnboarding, onComplete]
  );

  const addLanguage = React.useCallback(() => {
    if (
      languageInput.trim() &&
      !formData.preferredLanguages.includes(languageInput.trim())
    ) {
      const newLanguages = [
        ...formData.preferredLanguages,
        languageInput.trim(),
      ];
      setFormData({ ...formData, preferredLanguages: newLanguages });
      personalInfoForm.setValue("preferredLanguages", newLanguages);
      setLanguageInput("");
    }
  }, [formData, languageInput, personalInfoForm]);

  const removeLanguage = React.useCallback(
    (language: string) => {
      const newLanguages = formData.preferredLanguages.filter(
        (l) => l !== language
      );
      setFormData({ ...formData, preferredLanguages: newLanguages });
      personalInfoForm.setValue("preferredLanguages", newLanguages);
    },
    [formData, personalInfoForm]
  );

  const steps = [
    {
      number: 1,
      label: "Personal Info",
      icon: <User className="h-4 w-4" />,
    },
    { number: 2, label: "Support Needs", icon: <Heart className="h-4 w-4" /> },
    {
      number: 3,
      label: "Emergency Contact",
      icon: <UsersGroupTwoRounded className="h-4 w-4" />,
    },
    {
      number: 4,
      label: "Coordination",
      icon: <HashtagSquare className="h-4 w-4" />,
    },
  ];

  const handleSkipSetup = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 py-6 px-8">
      {/* Back Button & Header */}
      <div className="">
        <button
          onClick={handleSkipSetup}
          className="font-montserrat-semibold flex items-center hover:text-gray-900 mb-6"
        >
          <AltArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-montserrat-semibold">Profile Setup</h2>
            <p className="text-sm text-gray-600 mt-1">
              Answer a few quick questions to complete your participant profile
              and get started
            </p>
          </div>
          <div className="text-sm font-montserrat-semibold text-primary">
            {step}/4
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 gap-5 overflow-hidden mt-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-80 bg-white border rounded-xl border-gray-200 flex-col flex-shrink-0">
          {/* Steps Navigation */}
          <div className="flex-1 p-6">
            <div className="relative">
              {steps.map((s, index) => {
                const isActive = s.number === step;
                const isCompleted = completedSteps.includes(s.number);
                const isAccessible = s.number <= step || isCompleted;

                return (
                  <div key={s.number} className="relative">
                    {/* Vertical Line */}
                    {index < steps.length - 1 && (
                      <div
                        className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 -mb-2"
                        style={{ height: "44px" }}
                      />
                    )}

                    <button
                      onClick={() => goToStep(s.number)}
                      disabled={!isAccessible}
                      className={cn(
                        "relative w-full flex items-center py-3 text-left transition-all",
                        !isAccessible && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 transition-all border-2 z-10 bg-white",
                          isCompleted && "bg-primary border-primary",
                          isActive && !isCompleted && "border-primary bg-white",
                          !isActive &&
                            !isCompleted &&
                            "border-gray-300 bg-white"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <span
                            className={cn(
                              "text-sm font-montserrat-semibold",
                              isActive ? "text-primary" : "text-gray-400"
                            )}
                          >
                            {s.number}
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-base font-montserrat-semibold",
                          isActive ? "text-primary" : "text-gray-700"
                        )}
                      >
                        {s.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full flex-shrink-0">
          {/* Mobile/Desktop Header */}
          <div className="lg:px-8 flex-shrink-0">
            {/* Mobile Progress Steps */}
            <div className="lg:hidden my-4">
              <div className="relative flex items-center justify-between">
                {/* Horizontal connecting line */}
                <div
                  className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200"
                  style={{ zIndex: 0 }}
                />

                {steps.map((s) => {
                  const isCompleted = completedSteps.includes(s.number);
                  const isActive = s.number === step;

                  return (
                    <div
                      key={s.number}
                      className="relative flex flex-col items-center flex-1"
                      style={{ zIndex: 1 }}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 bg-white",
                          isCompleted && "bg-primary border-primary",
                          isActive &&
                            !isCompleted &&
                            "border-primary bg-white ring-4 ring-primary/10",
                          !isActive &&
                            !isCompleted &&
                            "border-gray-300 bg-white"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <span
                            className={cn(
                              "text-xs font-montserrat-semibold",
                              isActive ? "text-primary" : "text-gray-400"
                            )}
                          >
                            {s.number}
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-montserrat-semibold mt-1.5 text-center",
                          isActive ? "text-primary" : "text-gray-1000"
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="w-full">
            {/* Step 1: Personal Info & Location */}
            {step === 1 && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Tell us about yourself and where you're located
                  </p>

                  <Form {...personalInfoForm}>
                    <form
                      onSubmit={personalInfoForm.handleSubmit(
                        handlePersonalInfoSubmit
                      )}
                      className="space-y-6"
                    >
                      <FormField
                        control={personalInfoForm.control}
                        name="ndisNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-montserrat-semibold text-gray-900">
                              NDIS Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="430123456789"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    ndisNumber: e.target.value,
                                  });
                                }}
                                className="text-sm"
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-1000 flex items-start gap-1.5">
                              <span className="text-primary mt-0.5">ⓘ</span>
                              <span>Enter your NDIS participant number</span>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <FormLabel className="text-sm font-montserrat-semibold text-gray-900">
                          Preferred Languages
                        </FormLabel>

                        {formData.preferredLanguages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {formData.preferredLanguages.map(
                              (language, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs"
                                >
                                  {language}
                                  <button
                                    type="button"
                                    onClick={() => removeLanguage(language)}
                                    className="hover:text-gray-700"
                                  >
                                    <CloseCircle className="h-4 w-4" />
                                  </button>
                                </Badge>
                              )
                            )}
                          </div>
                        )}

                        <Input
                          placeholder="Add any language you prefer...."
                          value={languageInput}
                          onChange={(e) => setLanguageInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addLanguage();
                            }
                          }}
                          className="text-sm"
                        />

                        <div className="flex flex-wrap gap-2">
                          {commonLanguages
                            .filter(
                              (lang) =>
                                !formData.preferredLanguages.includes(lang)
                            )
                            .map((language) => (
                              <Button
                                key={language}
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newLanguages = [
                                    ...formData.preferredLanguages,
                                    language,
                                  ];
                                  setFormData({
                                    ...formData,
                                    preferredLanguages: newLanguages,
                                  });
                                  personalInfoForm.setValue(
                                    "preferredLanguages",
                                    newLanguages
                                  );
                                }}
                                className="h-8 px-3 text-xs border hover:text-white hover:bg-primary hover:border-gray-600 text-black"
                              >
                                + {language}
                              </Button>
                            ))}
                        </div>

                        <p className="text-xs text-gray-1000 flex items-start gap-1.5 mt-2">
                          <span className="text-primary mt-0.5">ⓘ</span>
                          <span>
                            Select from common languages or add your own
                          </span>
                        </p>

                        {formData.preferredLanguages.length === 0 &&
                          personalInfoForm.formState.isSubmitted && (
                            <p className="text-sm text-red-500">
                              Please add at least one language.
                            </p>
                          )}
                      </div>

                      {/* Address with Google Autocomplete */}
                      <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPoint className="h-5 w-5 text-primary" />
                          <FormLabel className="text-sm font-montserrat-semibold text-gray-900">
                            Address
                          </FormLabel>
                        </div>

                        <FormField
                          control={personalInfoForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div
                                  id="address-autocomplete-container"
                                  className="relative"
                                >
                                  <div className="relative">
                                    <MapPoint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                                    <Input
                                      {...field}
                                      type="text"
                                      placeholder="Start typing your address..."
                                      value={addressInputValue}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        handleAddressInputChange(
                                          e.target.value
                                        );
                                      }}
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
                                      disabled={isPlacePredictionsLoading}
                                    />
                                    {isPlacePredictionsLoading && (
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
                                            onClick={() =>
                                              handleAddressSelect(prediction)
                                            }
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                          >
                                            <div className="flex items-start gap-3">
                                              <MapPoint className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                              <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 font-medium truncate">
                                                  {prediction
                                                    .structured_formatting
                                                    ?.main_text ||
                                                    prediction.description}
                                                </p>
                                                {prediction
                                                  .structured_formatting
                                                  ?.secondary_text && (
                                                  <p className="text-xs text-gray-500 truncate mt-0.5">
                                                    {
                                                      prediction
                                                        .structured_formatting
                                                        .secondary_text
                                                    }
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs text-gray-1000 flex items-start gap-1.5">
                                <span className="text-primary mt-0.5">ⓘ</span>
                                <span>
                                  Start typing to search for your address in
                                  Australia
                                </span>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Location Section */}
                      <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Magnifer className="h-5 w-5 text-primary" />
                          <FormLabel className="text-sm font-montserrat-semibold text-gray-900">
                            Location Details
                          </FormLabel>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* State Selection */}
                          <FormField
                            control={personalInfoForm.control}
                            name="stateId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">State</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setSelectedStateId(value);
                                    setFormData((prev) => ({
                                      ...prev,
                                      stateId: value,
                                    }));
                                  }}
                                  disabled={isLoadingStates}
                                >
                                  <FormControl>
                                    <SelectTrigger className="text-sm">
                                      <SelectValue placeholder="Select state..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {states.map((state) => (
                                      <SelectItem
                                        key={state._id}
                                        value={state._id}
                                      >
                                        {state.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Region Selection */}
                          <FormField
                            control={personalInfoForm.control}
                            name="regionId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">
                                  Region
                                </FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setSelectedRegionId(value);
                                    setFormData((prev) => ({
                                      ...prev,
                                      regionId: value,
                                    }));
                                  }}
                                  disabled={
                                    !selectedStateId || isLoadingRegions
                                  }
                                >
                                  <FormControl>
                                    <SelectTrigger className="text-sm">
                                      <SelectValue placeholder="Select region..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {regions.map((region) => (
                                      <SelectItem
                                        key={region._id}
                                        value={region._id}
                                      >
                                        {region.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Suburb Selection */}
                          <FormField
                            control={personalInfoForm.control}
                            name="suburbId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">
                                  Suburb
                                </FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setFormData((prev) => ({
                                      ...prev,
                                      suburbId: value,
                                    }));
                                  }}
                                  disabled={
                                    !selectedRegionId || isLoadingSuburbs
                                  }
                                >
                                  <FormControl>
                                    <SelectTrigger className="text-sm">
                                      <SelectValue placeholder="Select suburb..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {suburbs.map((suburb) => (
                                      <SelectItem
                                        key={suburb._id}
                                        value={suburb._id}
                                      >
                                        {suburb.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Service Area Selection */}
                          <FormField
                            control={personalInfoForm.control}
                            name="serviceAreaId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm">
                                  Service Area
                                </FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setFormData((prev) => ({
                                      ...prev,
                                      serviceAreaId: value,
                                    }));
                                  }}
                                  disabled={
                                    !selectedRegionId || isLoadingServiceAreas
                                  }
                                >
                                  <FormControl>
                                    <SelectTrigger className="text-sm">
                                      <SelectValue placeholder="Select service area..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {serviceAreas.map((serviceArea) => (
                                      <SelectItem
                                        key={serviceArea._id}
                                        value={serviceArea._id}
                                      >
                                        {serviceArea.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <p className="text-xs text-gray-1000 flex items-start gap-1.5">
                          <span className="text-primary mt-0.5">ⓘ</span>
                          <span>
                            Your location helps us match you with support
                            workers in your area
                          </span>
                        </p>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          className="bg-primary hover:bg-primary-700 text-white px-8"
                          disabled={
                            formData.preferredLanguages.length === 0 ||
                            !formData.stateId ||
                            !formData.regionId ||
                            !formData.suburbId ||
                            !formData.serviceAreaId
                          }
                        >
                          Next
                          <AltArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            )}

            {/* Step 2: Support Needs */}
            {step === 2 && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                    Support Needs
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Select the types of support you require
                  </p>

                  <Form {...supportNeedsForm}>
                    <form
                      onSubmit={supportNeedsForm.handleSubmit(
                        handleSupportNeedsSubmit
                      )}
                      className="space-y-6"
                    >
                      <FormField
                        control={supportNeedsForm.control}
                        name="supportNeeds"
                        render={({ field }) => (
                          <FormItem>
                            {isLoadingSupportNeeds ? (
                              <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {supportNeeds.map((supportNeed) => {
                                  const isSelected = field.value?.includes(
                                    supportNeed._id
                                  );

                                  return (
                                    <div
                                      key={supportNeed._id}
                                      onClick={() => {
                                        const newNeeds = isSelected
                                          ? field.value?.filter(
                                              (id) => id !== supportNeed._id
                                            )
                                          : [
                                              ...(field.value || []),
                                              supportNeed._id,
                                            ];
                                        field.onChange(newNeeds);
                                        setFormData({
                                          ...formData,
                                          supportNeeds: newNeeds,
                                        });
                                      }}
                                      className={cn(
                                        "cursor-pointer p-4 rounded-xl border-2 transition-all",
                                        isSelected
                                          ? "bg-primary border-primary"
                                          : "border-gray-200 hover:border-primary/50 hover:bg-gray-100"
                                      )}
                                    >
                                      <div className="flex flex-col items-center text-center">
                                        <div
                                          className={cn(
                                            "p-3 rounded-full mb-3 transition-colors",
                                            isSelected
                                              ? "bg-white/20 text-white"
                                              : "bg-gray-100 text-gray-600"
                                          )}
                                        >
                                          <Heart className="h-5 w-5" />
                                        </div>
                                        <span
                                          className={cn(
                                            "font-montserrat-semibold text-sm",
                                            isSelected
                                              ? "text-white"
                                              : "text-gray-900"
                                          )}
                                        >
                                          {supportNeed.name}
                                        </span>
                                        {supportNeed.status && (
                                          <span
                                            className={cn(
                                              "text-xs mt-1",
                                              isSelected
                                                ? "text-white/80"
                                                : "text-gray-100"
                                            )}
                                          >
                                            {supportNeed.status}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="border-primary text-primary hover:bg-primary-700"
                        >
                          <AltArrowLeft className="mr-2 h-8 w-8" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="bg-primary hover:bg-primary-700 text-white"
                        >
                          Next
                          <AltArrowRight className="ml-2 h-8 w-8" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            )}

            {/* Step 3: Emergency Contact */}
            {step === 3 && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                    Emergency Contact
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Provide details of someone we can contact in case of
                    emergency
                  </p>

                  <Form {...emergencyContactForm}>
                    <form
                      onSubmit={emergencyContactForm.handleSubmit(
                        handleEmergencyContactSubmit
                      )}
                      className="space-y-6"
                    >
                      <FormField
                        control={emergencyContactForm.control}
                        name="emergencyContact.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-montserrat-semibold text-gray-900">
                              Contact Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Sarah Johnson"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    emergencyContact: {
                                      ...formData.emergencyContact,
                                      name: e.target.value,
                                    },
                                  });
                                }}
                                className="text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={emergencyContactForm.control}
                        name="emergencyContact.relationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-montserrat-semibold text-gray-900">
                              Relationship
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Mother, Father, Sibling"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    emergencyContact: {
                                      ...formData.emergencyContact,
                                      relationship: e.target.value,
                                    },
                                  });
                                }}
                                className="text-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={emergencyContactForm.control}
                        name="emergencyContact.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-montserrat-semibold text-gray-900">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+61412345678"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setFormData({
                                    ...formData,
                                    emergencyContact: {
                                      ...formData.emergencyContact,
                                      phone: e.target.value,
                                    },
                                  });
                                }}
                                className="text-sm"
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-1000 flex items-start gap-1.5">
                              <span className="text-primary mt-0.5">ⓘ</span>
                              <span>
                                Include country code (e.g. +61 for Australia)
                              </span>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="border-primary text-primary hover:bg-primary-700"
                        >
                          <AltArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          Next
                          <AltArrowRight className="ml-2 h-8 w-8" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            )}

            {/* Step 4: Coordination */}
            {step === 4 && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                    Plan Management & Coordination
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Provide details of your plan manager and support coordinator
                  </p>

                  <Form {...coordinationForm}>
                    <form
                      onSubmit={coordinationForm.handleSubmit(
                        handleCoordinationSubmit
                      )}
                      className="space-y-6"
                    >
                      {/* Plan Manager Section */}
                      <div className="border border-gray-200 rounded-lg p-5 space-y-4 bg-gray-50">
                        <h4 className="font-montserrat-semibold text-gray-900 text-sm">
                          Plan Manager Details
                        </h4>

                        <FormField
                          control={coordinationForm.control}
                          name="planManager.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. NDIS Care Coordinators Pty Ltd"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setFormData({
                                      ...formData,
                                      planManager: {
                                        ...formData.planManager,
                                        name: e.target.value,
                                      },
                                    });
                                  }}
                                  className="text-sm bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={coordinationForm.control}
                          name="planManager.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="admin@ndiscarecoord.com.au"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setFormData({
                                      ...formData,
                                      planManager: {
                                        ...formData.planManager,
                                        email: e.target.value,
                                      },
                                    });
                                  }}
                                  className="text-sm bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Support Coordinator Section */}
                      <div className="border border-gray-200 rounded-lg p-5 space-y-4 bg-gray-50">
                        <h4 className="font-montserrat-semibold text-gray-900 text-sm">
                          Support Coordinator Details
                        </h4>

                        <FormField
                          control={coordinationForm.control}
                          name="coordinator.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Emily Roberts"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setFormData({
                                      ...formData,
                                      coordinator: {
                                        ...formData.coordinator,
                                        name: e.target.value,
                                      },
                                    });
                                  }}
                                  className="text-sm bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={coordinationForm.control}
                          name="coordinator.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="emily.roberts@supportcoordination.com.au"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setFormData({
                                      ...formData,
                                      coordinator: {
                                        ...formData.coordinator,
                                        email: e.target.value,
                                      },
                                    });
                                  }}
                                  className="text-sm bg-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-between pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="border-primary text-primary hover:bg-primary/5"
                        >
                          <AltArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isOnboarding || isSubmitting}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          {isOnboarding || isSubmitting ? (
                            <>
                              <Spinner />
                              <span className="ml-2">Submitting...</span>
                            </>
                          ) : (
                            <>
                              Complete Setup
                              <CheckCircle className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
