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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Languages,
  Clock,
  DollarSign,
  CheckCircle,
  Heart,
  Car,
  Stethoscope,
  Users,
  Home,
  MessageSquare,
  ShieldAlert,
  Pill,
  UtensilsCrossed,
  Bandage,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { TimeInput } from "@/components/auth/TimeInput";
import { cn } from "@/lib/utils";
import authService from "@/api/services/authService";
import { useGetServiceTypes } from "@/hooks/useServiceTypeHooks";
import { useGetRateTimeBands } from "@/hooks/useRateTimeBandHooks";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

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
        description: z
          .string()
          .min(10, { message: "Please provide a description of your experience." }),
      })
    )
    .min(1, { message: "Please add at least one experience." }),
});

const rateSchema = z.object({
  shiftRates: z
    .array(
      z.object({
        rateTimeBandId: z.string().min(1, { message: "Rate time band is required." }),
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

// Common languages for easier selection
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
  "Vietnamese",
  "Greek",
  "Russian",
  "Hindi",
  "Turkish",
  "Polish",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Australian Sign Language (Auslan)",
  "American Sign Language (ASL)",
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
  const [step, setStep] = useState(1);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [languageInput, setLanguageInput] = useState("");

  // Auth context
  const { completeOnboarding } = useAuth();

  // API queries
  const { data: serviceTypes = [], isLoading: isLoadingServiceTypes } = useGetServiceTypes();
  const { data: rateTimeBands = [], isLoading: isLoadingRateTimeBands } = useGetRateTimeBands();

  // Form state for all steps
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

  // Forms for each step
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

  // Initialize shift rates when rate time bands are loaded
  React.useEffect(() => {
    if (rateTimeBands.length > 0 && formData.shiftRates.length !== rateTimeBands.length) {
      const initialRates = rateTimeBands.map(band => ({
        rateTimeBandId: band._id,
        hourlyRate: ""
      }));
      setFormData(prev => ({ ...prev, shiftRates: initialRates }));
      rateForm.reset({ shiftRates: initialRates });
    }
  }, [rateTimeBands, formData.shiftRates.length, rateForm]);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleBioSubmit = async (data: z.infer<typeof bioSchema>) => {
    setFormData({ ...formData, bio: data.bio, languages: data.languages });
    nextStep();
  };

  const handleSkillsSubmit = async (data: z.infer<typeof skillsSchema>) => {
    setFormData({ ...formData, skills: data.skills });
    nextStep();
  };

  const handleExperienceSubmit = async (data: z.infer<typeof experienceSchema>) => {
    setFormData({ ...formData, experience: data.experience as any });
    nextStep();
  };

  const handleRateSubmit = async (data: z.infer<typeof rateSchema>) => {
    setFormData({ ...formData, shiftRates: data.shiftRates as any });
    nextStep();
  };

  const handleAvailabilitySubmit = async (data: z.infer<typeof availabilitySchema>) => {
    const finalData = { ...formData, availability: data.availability as any };
    setFormData(finalData as any);
    
    // Submit all data to the onboarding API
    await submitOnboarding(finalData as any);
  };

  const submitOnboarding = async (data: typeof formData) => {
    setIsOnboarding(true);
    
    try {
      await authService.completeSupportWorkerOnboarding(data);
      
      // Update local user context to reflect completed onboarding
      completeOnboarding();
      
      toast.success('Profile setup completed successfully!');
      onComplete();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast.error('Failed to complete profile setup. Please try again.');
    } finally {
      setIsOnboarding(false);
    }
  };

  // Helper functions for forms
  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      const newLanguages = [...formData.languages, languageInput.trim()];
      setFormData({ ...formData, languages: newLanguages });
      bioForm.setValue("languages", newLanguages);
      setLanguageInput("");
    }
  };

  const removeLanguage = (language: string) => {
    const newLanguages = formData.languages.filter(l => l !== language);
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

  const addTimeSlot = (dayIndex: number) => {
    const newAvailability = { ...formData.availability };
    newAvailability.weekdays[dayIndex].slots.push({ start: "09:00", end: "17:00" });
    setFormData({ ...formData, availability: newAvailability });
    availabilityForm.setValue("availability", newAvailability);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newAvailability = { ...formData.availability };
    newAvailability.weekdays[dayIndex].slots = newAvailability.weekdays[dayIndex].slots.filter(
      (_, i) => i !== slotIndex
    );
    setFormData({ ...formData, availability: newAvailability });
    availabilityForm.setValue("availability", newAvailability);
  };

  const toggleDayAvailability = (dayIndex: number) => {
    const newAvailability = { ...formData.availability };
    newAvailability.weekdays[dayIndex].available = !newAvailability.weekdays[dayIndex].available;
    
    if (newAvailability.weekdays[dayIndex].available && newAvailability.weekdays[dayIndex].slots.length === 0) {
      newAvailability.weekdays[dayIndex].slots.push({ start: "09:00", end: "17:00" });
    } else if (!newAvailability.weekdays[dayIndex].available) {
      newAvailability.weekdays[dayIndex].slots = [];
    }
    
    setFormData({ ...formData, availability: newAvailability });
    availabilityForm.setValue("availability", newAvailability);
  };

  const stepComponents = [
    // Step 1: Bio and Languages
    <Card key="bio" className="w-full max-w-3xl mx-auto border-[#1e3b93]/10 shadow-lg">
      <CardHeader className="border-b border-[#1e3b93]/10">
        <CardTitle className="flex items-center text-[#1e3b93]">
          <span className="bg-[#1e3b93] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-sm">
            1
          </span>
          About You
        </CardTitle>
        <CardDescription className="text-gray-600">
          Tell us about yourself and languages you speak.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...bioForm}>
          <form onSubmit={bioForm.handleSubmit(handleBioSubmit)} className="space-y-4">
            <FormField
              control={bioForm.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="G'day! Tell us about yourself, your experience in supporting people, and what you enjoy about being a support worker..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setFormData({ ...formData, bio: e.target.value });
                      }}
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormDescription>
                    You can edit this information later in your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Languages</FormLabel>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((language, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {language}
                      <button
                        type="button"
                        onClick={() => removeLanguage(language)}
                        className="ml-1 h-3 w-3 rounded-full hover:bg-gray-300 flex items-center justify-center"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a language..."
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLanguage();
                      }
                    }}
                  />
                  <Button type="button" onClick={addLanguage} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {commonLanguages
                    .filter(lang => !formData.languages.includes(lang))
                    .slice(0, 10)
                    .map((language) => (
                      <Button
                        key={language}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newLanguages = [...formData.languages, language];
                          setFormData({ ...formData, languages: newLanguages });
                          bioForm.setValue("languages", newLanguages);
                        }}
                        className="h-7 px-2 text-xs"
                      >
                        + {language}
                      </Button>
                    ))}
                </div>
              </div>
              <FormDescription>
                Select from common languages or add your own.
              </FormDescription>
              {formData.languages.length === 0 && (
                <p className="text-sm text-red-500">Please add at least one language.</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full mt-4 bg-[#1e3b93] hover:bg-[#1e3b93]/90 shadow-md"
                disabled={formData.languages.length === 0}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>,

    // Step 2: Skills
    <Card key="skills" className="w-full max-w-3xl mx-auto border-[#1e3b93]/10 shadow-lg">
      <CardHeader className="border-b border-[#1e3b93]/10">
        <CardTitle className="flex items-center text-[#1e3b93]">
          <span className="bg-[#1e3b93] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-sm">
            2
          </span>
          Skills & Services
        </CardTitle>
        <CardDescription className="text-gray-600">
          Select the services you can provide.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...skillsForm}>
          <form onSubmit={skillsForm.handleSubmit(handleSkillsSubmit)} className="space-y-4">
            <FormField
              control={skillsForm.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Select your skills</FormLabel>
                    <FormDescription>
                      Choose all services you can provide. You can update these later.
                    </FormDescription>
                  </div>
                  
                  {isLoadingServiceTypes ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3b93]"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {serviceTypes.map((serviceType) => {
                        const isSelected = field.value?.includes(serviceType._id);

                        return (
                          <div
                            key={serviceType._id}
                            onClick={() => {
                              const newSkills = isSelected
                                ? field.value?.filter((id) => id !== serviceType._id)
                                : [...(field.value || []), serviceType._id];
                              field.onChange(newSkills);
                              setFormData({ ...formData, skills: newSkills });
                            }}
                            className={cn(
                              "cursor-pointer p-3 rounded-lg border transition-all hover:shadow-md",
                              isSelected
                                ? "border-[#1e3b93] bg-[#1e3b93]/10 shadow-sm"
                                : "border-gray-200 hover:border-[#1e3b93]/50 hover:bg-[#1e3b93]/5"
                            )}
                          >
                            <div className="flex flex-col items-center text-center">
                              <div
                                className={cn(
                                  "p-2 rounded-full mb-2 transition-colors",
                                  isSelected
                                    ? "bg-[#1e3b93] text-white"
                                    : "bg-gray-100 text-gray-600"
                                )}
                              >
                                <Heart className="h-5 w-5" />
                              </div>
                              <span className="font-medium text-sm">{serviceType.name}</span>
                              <span className="text-xs text-gray-500 mt-1">
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
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>,

    // Step 3: Experience
    <Card key="experience" className="w-full max-w-3xl mx-auto border-[#1e3b93]/10 shadow-lg">
      <CardHeader className="border-b border-[#1e3b93]/10">
        <CardTitle className="flex items-center text-[#1e3b93]">
          <span className="bg-[#1e3b93] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-sm">
            3
          </span>
          Work Experience
        </CardTitle>
        <CardDescription className="text-gray-600">
          Add your relevant work experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...experienceForm}>
          <form onSubmit={experienceForm.handleSubmit(handleExperienceSubmit)} className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                  {formData.experience.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={experienceForm.control}
                    name={`experience.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Support Worker"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              const newExp = [...formData.experience];
                              newExp[index].title = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
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
                        <FormLabel>Organization</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="NDIS Provider Sydney"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              const newExp = [...formData.experience];
                              newExp[index].organization = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={experienceForm.control}
                      name={`experience.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                const newExp = [...formData.experience];
                                newExp[index].startDate = e.target.value;
                                setFormData({ ...formData, experience: newExp });
                              }}
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
                          <FormLabel>End Date (leave empty if current)</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                const newExp = [...formData.experience];
                                newExp[index].endDate = e.target.value;
                                setFormData({ ...formData, experience: newExp });
                              }}
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Supported participants in Sydney with daily activities and community access..."
                            className="min-h-[80px]"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              const newExp = [...formData.experience];
                              newExp[index].description = e.target.value;
                              setFormData({ ...formData, experience: newExp });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addExperience}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Experience
            </Button>
            
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>,

    // Step 4: Rates
    <Card key="rates" className="w-full max-w-3xl mx-auto border-[#1e3b93]/10 shadow-lg">
      <CardHeader className="border-b border-[#1e3b93]/10">
        <CardTitle className="flex items-center text-[#1e3b93]">
          <span className="bg-[#1e3b93] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-sm">
            4
          </span>
          Hourly Rates
        </CardTitle>
        <CardDescription className="text-gray-600">
          Set your hourly rates for different time bands.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...rateForm}>
          <form onSubmit={rateForm.handleSubmit(handleRateSubmit)} className="space-y-4">
            {isLoadingRateTimeBands ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3b93]"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {rateTimeBands.map((band, index) => (
                  <div key={band._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-2">
                      <h4 className="font-medium text-gray-900">{band.name}</h4>
                      <p className="text-sm text-gray-600">{band.description}</p>
                      <p className="text-xs text-gray-500">
                        {band.startTime} - {band.endTime}
                      </p>
                    </div>
                    <FormField
                      control={rateForm.control}
                      name={`shiftRates.${index}.hourlyRate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate (AUD $)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="35"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                const newRates = [...(formData.shiftRates || [])];
                                if (newRates[index]) {
                                  newRates[index].hourlyRate = e.target.value;
                                  setFormData({ ...formData, shiftRates: newRates });
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <input
                      type="hidden"
                      {...rateForm.register(`shiftRates.${index}.rateTimeBandId`)}
                      value={band._id}
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>,

    // Step 5: Availability
    <Card key="availability" className="w-full max-w-3xl mx-auto border-[#1e3b93]/10 shadow-lg">
      <CardHeader className="border-b border-[#1e3b93]/10">
        <CardTitle className="flex items-center text-[#1e3b93]">
          <span className="bg-[#1e3b93] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-sm">
            5
          </span>
          Availability
        </CardTitle>
        <CardDescription className="text-gray-600">
          Set your weekly availability.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...availabilityForm}>
          <form onSubmit={availabilityForm.handleSubmit(handleAvailabilitySubmit)} className="space-y-6">
            <div className="space-y-4">
              {formData.availability.weekdays.map((day, dayIndex) => (
                <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`day-${day.day}`}
                        checked={day.available}
                        onChange={() => toggleDayAvailability(dayIndex)}
                        className="h-4 w-4 rounded border-gray-300 text-[#1e3b93] focus:ring-[#1e3b93]"
                      />
                      <label htmlFor={`day-${day.day}`} className="font-medium capitalize">
                        {day.day}
                      </label>
                    </div>
                    {day.available && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(dayIndex)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Time Slot
                      </Button>
                    )}
                  </div>
                  
                  {day.available && (
                    <div className="space-y-2 pl-6">
                      {day.slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center space-x-2">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Start Time</label>
                              <TimeInput
                                value={slot.start}
                                onChange={(value) => {
                                  const newAvailability = { ...formData.availability };
                                  newAvailability.weekdays[dayIndex].slots[slotIndex].start = value;
                                  setFormData({ ...formData, availability: newAvailability });
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">End Time</label>
                              <TimeInput
                                value={slot.end}
                                onChange={(value) => {
                                  const newAvailability = { ...formData.availability };
                                  newAvailability.weekdays[dayIndex].slots[slotIndex].end = value;
                                  setFormData({ ...formData, availability: newAvailability });
                                }}
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                            className="mt-5"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={isOnboarding || isSubmitting}
                className="bg-[#1e3b93] hover:bg-[#1e3b93]/90 shadow-md"
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
      </CardContent>
    </Card>,
  ];

  const steps = [
    { icon: <Languages className="h-5 w-5" />, label: "Bio" },
    { icon: <Briefcase className="h-5 w-5" />, label: "Skills" },
    { icon: <Briefcase className="h-5 w-5" />, label: "Experience" },
    { icon: <DollarSign className="h-5 w-5" />, label: "Rates" },
    { icon: <Clock className="h-5 w-5" />, label: "Availability" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-sm py-4 sticky top-0 z-10 border-b border-[#1e3b93]/10">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="flex justify-between items-center overflow-x-auto pb-2">
            {steps.map((item, i) => (
              <div key={i} className="flex flex-col items-center mx-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm",
                    i + 1 === step
                      ? "bg-[#1e3b93] text-white"
                      : i + 1 < step
                      ? "bg-[#1e3b93]/10 text-[#1e3b93] border border-[#1e3b93]/20"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {i + 1 < step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    item.icon
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-1 transition-colors",
                    i + 1 === step
                      ? "text-[#1e3b93] font-medium"
                      : "text-gray-500"
                  )}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="container max-w-3xl mx-auto">
          {stepComponents[step - 1]}
        </div>
      </div>
    </div>
  );
}
