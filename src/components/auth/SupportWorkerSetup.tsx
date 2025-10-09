import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Languages,
  Clock,
  DollarSign,
  CheckCircle,
  Heart,
  Plus,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import authService from "@/api/services/authService";
import { useGetServiceTypes } from "@/hooks/useServiceTypeHooks";
import { useGetRateTimeBands } from "@/hooks/useRateTimeBandHooks";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const bioSchema = z.object({
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
  languages: z
    .array(z.string().min(1))
    .min(1, { message: "Please enter at least one language." }),
});

const skillsSchema = z.object({
  skills: z
    .array(z.string())
    .min(1, { message: "Please select at least one skill." }),
});

const experienceSchema = z.object({
  experience: z
    .array(
      z.object({
        title: z.string().min(2, { message: "Job title is required." }),
        organization: z
          .string()
          .min(2, { message: "Organization name is required." }),
        startDate: z.string().min(1, { message: "Start date is required." }),
        endDate: z.string().optional(),
        description: z.string().min(10, {
          message: "Please provide a description of your experience.",
        }),
      })
    )
    .min(1, { message: "Please add at least one experience." }),
});

const rateSchema = z.object({
  shiftRates: z
    .array(
      z.object({
        rateTimeBandId: z
          .string()
          .min(1, { message: "Rate time band is required." }),
        hourlyRate: z.string().min(1, { message: "Hourly rate is required." }),
      })
    )
    .min(1, { message: "Please set at least one rate." }),
});

const timeSlotSchema = z.object({
  start: z.string().min(1, { message: "Start time is required." }),
  end: z.string().min(1, { message: "End time is required." }),
});

const availabilitySchema = z.object({
  availability: z.object({
    weekdays: z
      .array(
        z.object({
          day: z.string(),
          available: z.boolean(),
          slots: z.array(timeSlotSchema),
        })
      )
      .min(1, { message: "Please set your availability." }),
  }),
});

interface SupportWorkerSetupProps {
  onComplete: () => void;
  isSubmitting?: boolean;
}

const commonLanguages = [
  "English",
  "Mandarin",
  "Spanish",
  "Arabic",
  "French",
  "Italian",
  "German",
  "Portuguese",
  "Japanese",
  "Korean",
];

const weekdays = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export function SupportWorkerSetup({
  onComplete,
  isSubmitting = false,
}: SupportWorkerSetupProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [languageInput, setLanguageInput] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const { completeOnboarding } = useAuth();
  const { data: serviceTypes = [], isLoading: isLoadingServiceTypes } =
    useGetServiceTypes();
  const { data: rateTimeBands = [], isLoading: isLoadingRateTimeBands } =
    useGetRateTimeBands();

  const [formData, setFormData] = useState({
    bio: "",
    languages: [] as string[],
    skills: [] as string[],
    experience: [
      {
        title: "",
        organization: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    shiftRates: [] as { rateTimeBandId: string; hourlyRate: string }[],
    availability: {
      weekdays: weekdays.map((day) => ({
        day: day.value,
        available: false,
        slots: [] as { start: string; end: string }[],
      })),
    },
  });

  const bioForm = useForm<z.infer<typeof bioSchema>>({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      bio: formData.bio,
      languages: formData.languages,
    },
  });

  const skillsForm = useForm<z.infer<typeof skillsSchema>>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: formData.skills,
    },
  });

  const experienceForm = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experience: formData.experience,
    },
  });

  const rateForm = useForm<z.infer<typeof rateSchema>>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      shiftRates: formData.shiftRates,
    },
  });

  const availabilityForm = useForm<z.infer<typeof availabilitySchema>>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      availability: formData.availability,
    },
  });

  React.useEffect(() => {
    if (
      rateTimeBands.length > 0 &&
      formData.shiftRates.length !== rateTimeBands.length
    ) {
      const initialRates = rateTimeBands.map((band) => ({
        rateTimeBandId: band._id,
        hourlyRate: "",
      }));
      setFormData((prev) => ({ ...prev, shiftRates: initialRates }));
      rateForm.reset({ shiftRates: initialRates });
    }
  }, [rateTimeBands, formData.shiftRates.length, rateForm]);

  const nextStep = () => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const goToStep = (targetStep: number) => {
    if (targetStep <= step || completedSteps.includes(targetStep - 1)) {
      setStep(targetStep);
    }
  };

  const handleBioSubmit = async (data: z.infer<typeof bioSchema>) => {
    setFormData({ ...formData, bio: data.bio, languages: data.languages });
    nextStep();
  };

  const handleSkillsSubmit = async (data: z.infer<typeof skillsSchema>) => {
    setFormData({ ...formData, skills: data.skills });
    nextStep();
  };

  const handleExperienceSubmit = async (
    data: z.infer<typeof experienceSchema>
  ) => {
    setFormData({ ...formData, experience: data.experience as any });
    nextStep();
  };

  const handleRateSubmit = async (data: z.infer<typeof rateSchema>) => {
    setFormData({ ...formData, shiftRates: data.shiftRates as any });
    nextStep();
  };

  const handleAvailabilitySubmit = async (
    data: z.infer<typeof availabilitySchema>
  ) => {
    const finalData = { ...formData, availability: data.availability as any };
    setFormData(finalData as any);
    await submitOnboarding(finalData as any);
  };

  const submitOnboarding = async (data: typeof formData) => {
    setIsOnboarding(true);

    try {
      await authService.completeSupportWorkerOnboarding(data);
      completeOnboarding();
      toast.success("Profile setup completed successfully!");
      onComplete();
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      toast.error("Failed to complete profile setup. Please try again.");
    } finally {
      setIsOnboarding(false);
    }
  };

  const addLanguage = () => {
    if (
      languageInput.trim() &&
      !formData.languages.includes(languageInput.trim())
    ) {
      const newLanguages = [...formData.languages, languageInput.trim()];
      setFormData({ ...formData, languages: newLanguages });
      bioForm.setValue("languages", newLanguages);
      setLanguageInput("");
    }
  };

  const removeLanguage = (language: string) => {
    const newLanguages = formData.languages.filter((l) => l !== language);
    setFormData({ ...formData, languages: newLanguages });
    bioForm.setValue("languages", newLanguages);
  };

  const addExperience = () => {
    const newExperience = [
      ...formData.experience,
      {
        title: "",
        organization: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ];
    setFormData({ ...formData, experience: newExperience });
    experienceForm.setValue("experience", newExperience);
  };

  const removeExperience = (index: number) => {
    const newExperience = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: newExperience });
    experienceForm.setValue("experience", newExperience);
  };

  const toggleDayAvailability = (dayIndex: number) => {
    const newAvailability = { ...formData.availability };
    newAvailability.weekdays[dayIndex].available =
      !newAvailability.weekdays[dayIndex].available;

    if (
      newAvailability.weekdays[dayIndex].available &&
      newAvailability.weekdays[dayIndex].slots.length === 0
    ) {
      newAvailability.weekdays[dayIndex].slots.push({
        start: "09:00",
        end: "17:00",
      });
    } else if (!newAvailability.weekdays[dayIndex].available) {
      newAvailability.weekdays[dayIndex].slots = [];
    }

    setFormData({ ...formData, availability: newAvailability });
    availabilityForm.setValue("availability", newAvailability);
  };

  const steps = [
    { number: 1, label: "Bio", icon: <Languages className="h-4 w-4" /> },
    { number: 2, label: "Skills", icon: <Briefcase className="h-4 w-4" /> },
    { number: 3, label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
    { number: 4, label: "Rates", icon: <DollarSign className="h-4 w-4" /> },
    { number: 5, label: "Availability", icon: <Clock className="h-4 w-4" /> },
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
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>

        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-montserrat-semibold">Profile Setup</h2>
            <p className="text-sm text-gray-600 mt-1 ">
              Answer a few quick questions to complete your support worker
              profile and get started
            </p>
          </div>
          <div className="text-sm font-montserrat-semibold text-primary">{step}/5</div>
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
                        className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200 -mb-2"
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
                          <Check className="h-4 w-4 text-white" />
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
                          "text-base font-medium",
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
                          <Check className="h-4 w-4 text-white" />
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
                          "text-[10px] font-medium mt-1.5 text-center",
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
              {/* Step 1: Bio */}
              {step === 1 && (
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 lg:p-8">
                    <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                      Bio
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Tell us about yourself and languages you speak
                    </p>

                    <Form {...bioForm}>
                      <form
                        onSubmit={bioForm.handleSubmit(handleBioSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={bioForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-900">
                                About
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Good day! Tell us about yourself, your experience in supporting people, and what you enjoy about being a support worker....."
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setFormData({
                                      ...formData,
                                      bio: e.target.value,
                                    });
                                  }}
                                  className="min-h-[100px] text-sm resize-none"
                                />
                              </FormControl>
                              <FormDescription className="text-xs text-gray-1000 flex items-start gap-1.5">
                                <span className="text-primary mt-0.5">ⓘ</span>
                                <span>
                                  You can edit this info later in your profile
                                </span>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-3">
                          <FormLabel className="text-sm font-medium text-gray-900">
                            Languages
                          </FormLabel>

                          {formData.languages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {formData.languages.map((language, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm"
                                >
                                  {language}
                                  <button
                                    type="button"
                                    onClick={() => removeLanguage(language)}
                                    className="hover:text-gray-700"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}

                          <Input
                            placeholder="Add any language you speak...."
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
                                (lang) => !formData.languages.includes(lang)
                              )
                              .map((language) => (
                                <Button
                                  key={language}
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newLanguages = [
                                      ...formData.languages,
                                      language,
                                    ];
                                    setFormData({
                                      ...formData,
                                      languages: newLanguages,
                                    });
                                    bioForm.setValue("languages", newLanguages);
                                  }}
                                  className="h-8 px-3 text-xs bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-700"
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

                          {formData.languages.length === 0 &&
                            bioForm.formState.isSubmitted && (
                              <p className="text-sm text-red-500">
                                Please add at least one language.
                              </p>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white px-8"
                            disabled={formData.languages.length === 0}
                          >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              )}

              {/* Step 2: Skills */}
              {step === 2 && (
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 lg:p-8">
                    <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                      Skills & Services
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Select the services you can provide, you can update later.
                    </p>

                    <Form {...skillsForm}>
                      <form
                        onSubmit={skillsForm.handleSubmit(handleSkillsSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={skillsForm.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              {isLoadingServiceTypes ? (
                                <div className="flex justify-center py-12">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {serviceTypes.map((serviceType) => {
                                    const isSelected = field.value?.includes(
                                      serviceType._id
                                    );

                                    return (
                                      <div
                                        key={serviceType._id}
                                        onClick={() => {
                                          const newSkills = isSelected
                                            ? field.value?.filter(
                                                (id) => id !== serviceType._id
                                              )
                                            : [
                                                ...(field.value || []),
                                                serviceType._id,
                                              ];
                                          field.onChange(newSkills);
                                          setFormData({
                                            ...formData,
                                            skills: newSkills,
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
                                              "font-medium text-sm",
                                              isSelected
                                                ? "text-white"
                                                : "text-gray-900"
                                            )}
                                          >
                                            {serviceType.name}
                                          </span>
                                          <span
                                            className={cn(
                                              "text-xs mt-1",
                                              isSelected
                                                ? "text-white/80"
                                                : "text-gray-1000"
                                            )}
                                          >
                                            {serviceType.code}
                                          </span>
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
                            className="border-primary text-primary hover:bg-primary/5"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white"
                          >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              )}

              {/* Step 3: Experience */}
              {step === 3 && (
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 lg:p-8">
                    <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                      Work Experience
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Add your relevant work experience
                    </p>

                    <Form {...experienceForm}>
                      <form
                        onSubmit={experienceForm.handleSubmit(
                          handleExperienceSubmit
                        )}
                        className="space-y-6"
                      >
                        {formData.experience.map((exp, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-5 space-y-4 bg-gray-100"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-700 text-sm italic">
                                Experience {index + 1}
                              </h4>
                              {formData.experience.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExperience(index)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-4 w-4 text-gray-1000" />
                                </Button>
                              )}
                            </div>

                            <FormField
                              control={experienceForm.control}
                              name={`experience.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">
                                    Job Title
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g Support Worker"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        const newExp = [...formData.experience];
                                        newExp[index].title = e.target.value;
                                        setFormData({
                                          ...formData,
                                          experience: newExp,
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
                              control={experienceForm.control}
                              name={`experience.${index}.organization`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">
                                    Organization
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g Support Worker"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        const newExp = [...formData.experience];
                                        newExp[index].organization =
                                          e.target.value;
                                        setFormData({
                                          ...formData,
                                          experience: newExp,
                                        });
                                      }}
                                      className="text-sm bg-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={experienceForm.control}
                                name={`experience.${index}.startDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">
                                      Start Date
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="date"
                                        placeholder="dd/mm/yy"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          const newExp = [
                                            ...formData.experience,
                                          ];
                                          newExp[index].startDate =
                                            e.target.value;
                                          setFormData({
                                            ...formData,
                                            experience: newExp,
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
                                control={experienceForm.control}
                                name={`experience.${index}.endDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">
                                      End Date
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="date"
                                        placeholder="dd/mm/yy"
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          const newExp = [
                                            ...formData.experience,
                                          ];
                                          newExp[index].endDate =
                                            e.target.value;
                                          setFormData({
                                            ...formData,
                                            experience: newExp,
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

                            <FormField
                              control={experienceForm.control}
                              name={`experience.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm">
                                    Description
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enter job experience here....."
                                      className="min-h-[80px] text-sm resize-none bg-white"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        const newExp = [...formData.experience];
                                        newExp[index].description =
                                          e.target.value;
                                        setFormData({
                                          ...formData,
                                          experience: newExp,
                                        });
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={addExperience}
                          className="w-full text-primary border-primary/30 hover:bg-primary/5 hover:border-primary/50"
                        >
                          + Add Another Experience
                        </Button>

                        <div className="flex justify-between pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="border-primary text-primary hover:bg-primary/5"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white"
                          >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              )}

              {/* Step 4: Rates */}
              {step === 4 && (
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 lg:p-8">
                    <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                      Hourly Rates
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Set your hourly rates for different time bands
                    </p>

                    <Form {...rateForm}>
                      <form
                        onSubmit={rateForm.handleSubmit(handleRateSubmit)}
                        className="space-y-4"
                      >
                        {isLoadingRateTimeBands ? (
                          <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rateTimeBands.map((band, index) => {
                              const rate = formData.shiftRates[index];
                              const isSelected = rate && rate.hourlyRate;

                              return (
                                <div
                                  key={band._id}
                                  className={cn(
                                    "border-2 rounded-xl p-5 transition-all",
                                    isSelected
                                      ? "border-primary bg-primary/5"
                                      : "border-gray-200 hover:border-primary/30"
                                  )}
                                >
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                      <h4 className="font-montserrat-semibold text-gray-900 text-base mb-1">
                                        {band.name}
                                      </h4>
                                      <p className="text-sm text-gray-600 mb-1">
                                        {band.description}
                                      </p>
                                      <p className="text-xs text-gray-1000">
                                        {band.startTime} - {band.endTime}
                                      </p>
                                    </div>
                                    <div
                                      className={cn(
                                        "w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all",
                                        isSelected
                                          ? "bg-primary border-primary"
                                          : "border-gray-300 bg-white"
                                      )}
                                    >
                                      {isSelected && (
                                        <Check className="h-4 w-4 text-white" />
                                      )}
                                    </div>
                                  </div>

                                  <FormField
                                    control={rateForm.control}
                                    name={`shiftRates.${index}.hourlyRate`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-sm text-gray-700">
                                          Hourly Rate ($)
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            placeholder="35"
                                            {...field}
                                            onChange={(e) => {
                                              field.onChange(e);
                                              const newRates = [
                                                ...(formData.shiftRates || []),
                                              ];
                                              if (newRates[index]) {
                                                newRates[index].hourlyRate =
                                                  e.target.value;
                                                setFormData({
                                                  ...formData,
                                                  shiftRates: newRates,
                                                });
                                              }
                                            }}
                                            className="text-sm"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <input
                                    type="hidden"
                                    {...rateForm.register(
                                      `shiftRates.${index}.rateTimeBandId`
                                    )}
                                    value={band._id}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="flex justify-between pt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="border-primary text-primary hover:bg-primary/5"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white"
                          >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              )}

              {/* Step 5: Availability */}
              {step === 5 && (
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="p-6 lg:p-8">
                    <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                      Availability
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Set your weekly availability
                    </p>

                    <Form {...availabilityForm}>
                      <form
                        onSubmit={availabilityForm.handleSubmit(
                          handleAvailabilitySubmit
                        )}
                        className="space-y-3"
                      >
                        {formData.availability.weekdays.map((day, dayIndex) => (
                          <div
                            key={day.day}
                            className={cn(
                              "border-2 rounded-xl transition-all",
                              day.available
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 bg-white"
                            )}
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    onClick={() =>
                                      toggleDayAvailability(dayIndex)
                                    }
                                    className={cn(
                                      "w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all",
                                      day.available
                                        ? "bg-primary border-primary"
                                        : "border-gray-300 bg-white hover:border-primary/40"
                                    )}
                                  >
                                    {day.available && (
                                      <Check className="h-4 w-4 text-white" />
                                    )}
                                  </div>
                                  <label
                                    className="font-montserrat-semibold text-gray-900 capitalize cursor-pointer text-base"
                                    onClick={() =>
                                      toggleDayAvailability(dayIndex)
                                    }
                                  >
                                    {day.day}
                                  </label>
                                </div>
                              </div>

                              {day.available && day.slots.length > 0 && (
                                <div className="mt-4 space-y-3 pl-9">
                                  {day.slots.map((slot, slotIndex) => (
                                    <div
                                      key={slotIndex}
                                      className="bg-white rounded-lg p-3 border border-gray-200"
                                    >
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs text-gray-600 block mb-1.5 font-medium">
                                            Start Time
                                          </label>
                                          <Input
                                            type="time"
                                            value={slot.start}
                                            onChange={(e) => {
                                              const newAvailability = {
                                                ...formData.availability,
                                              };
                                              newAvailability.weekdays[
                                                dayIndex
                                              ].slots[slotIndex].start =
                                                e.target.value;
                                              setFormData({
                                                ...formData,
                                                availability: newAvailability,
                                              });
                                            }}
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-gray-600 block mb-1.5 font-medium">
                                            End Time
                                          </label>
                                          <Input
                                            type="time"
                                            value={slot.end}
                                            onChange={(e) => {
                                              const newAvailability = {
                                                ...formData.availability,
                                              };
                                              newAvailability.weekdays[
                                                dayIndex
                                              ].slots[slotIndex].end =
                                                e.target.value;
                                              setFormData({
                                                ...formData,
                                                availability: newAvailability,
                                              });
                                            }}
                                            className="text-sm"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        <div className="flex justify-between pt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="border-primary text-primary hover:bg-primary/5"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isOnboarding || isSubmitting}
                            className="bg-primary hover:bg-primary/90 text-white"
                          >
                            {isOnboarding || isSubmitting ? (
                              "Completing Setup..."
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
