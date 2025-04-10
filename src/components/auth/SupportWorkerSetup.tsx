
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SupportWorkerSkill } from "@/entities/types";
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
  CardFooter,
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
  Bandage
} from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { TimeInput } from "@/components/auth/TimeInput";

const bioSchema = z.object({
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
  languages: z.string().min(1, { message: "Please enter at least one language." }),
});

const skillsSchema = z.object({
  skills: z.array(z.string()).min(1, { message: "Please select at least one skill." }),
});

const experienceSchema = z.object({
  title: z.string().min(2, { message: "Job title is required." }),
  organization: z.string().min(2, { message: "Organization name is required." }),
  startDate: z.string().min(1, { message: "Start date is required." }),
  endDate: z.string().optional(),
  description: z.string().min(10, { message: "Please provide a description of your experience." }),
});

const rateSchema = z.object({
  baseRate: z.string().min(1, { message: "Base rate is required." }),
  weekendRate: z.string().optional(),
  holidayRate: z.string().optional(),
  overnightRate: z.string().optional(),
});

const timeSlotSchema = z.object({
  start: z.string().min(1, { message: "Start time is required." }),
  end: z.string().min(1, { message: "End time is required." }),
});

const availabilitySchema = z.object({
  availableWeekdays: z.array(z.string()).min(1, { message: "Please select at least one day of availability." }),
  timeSlots: z.record(z.array(timeSlotSchema).optional()),
});

interface SupportWorkerSetupProps {
  onComplete: () => void;
}

const availableSkills: { value: SupportWorkerSkill; label: string; icon: React.ElementType }[] = [
  { value: "personal-care", label: "Personal Care", icon: Heart },
  { value: "transport", label: "Transport", icon: Car },
  { value: "therapy", label: "Therapy Support", icon: Stethoscope },
  { value: "social-support", label: "Social Support", icon: Users },
  { value: "household", label: "Household Tasks", icon: Home },
  { value: "communication", label: "Communication Support", icon: MessageSquare },
  { value: "behavior-support", label: "Behavior Support", icon: ShieldAlert },
  { value: "medication-management", label: "Medication Management", icon: Pill },
  { value: "meal-preparation", label: "Meal Preparation", icon: UtensilsCrossed },
  { value: "first-aid", label: "First Aid", icon: Bandage },
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

// Australian names and details for mock data
const australianCities = [
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", 
  "Gold Coast", "Newcastle", "Canberra", "Wollongong", "Hobart"
];

export function SupportWorkerSetup({ onComplete }: SupportWorkerSetupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: "",
    languages: "English, Australian Sign Language",
    skills: [] as string[],
    experience: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
    },
    rates: {
      baseRate: "",
      weekendRate: "",
      holidayRate: "",
      overnightRate: "",
    },
    availability: {
      availableWeekdays: [] as string[],
      timeSlots: {} as Record<string, { start: string; end: string }[]>,
    }
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
      title: formData.experience.title,
      organization: formData.experience.organization,
      startDate: formData.experience.startDate,
      endDate: formData.experience.endDate,
      description: formData.experience.description,
    },
  });

  const rateForm = useForm<z.infer<typeof rateSchema>>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      baseRate: formData.rates.baseRate,
      weekendRate: formData.rates.weekendRate,
      holidayRate: formData.rates.holidayRate,
      overnightRate: formData.rates.overnightRate,
    },
  });

  const availabilityForm = useForm<z.infer<typeof availabilitySchema>>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      availableWeekdays: formData.availability.availableWeekdays,
      timeSlots: formData.availability.timeSlots,
    },
  });

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleBioSubmit = (data: z.infer<typeof bioSchema>) => {
    setFormData({ ...formData, bio: data.bio, languages: data.languages });
    nextStep();
  };

  const handleSkillsSubmit = (data: z.infer<typeof skillsSchema>) => {
    setFormData({ ...formData, skills: data.skills });
    nextStep();
  };

  const handleExperienceSubmit = (data: z.infer<typeof experienceSchema>) => {
    setFormData({ 
      ...formData, 
      experience: {
        title: data.title,
        organization: data.organization,
        startDate: data.startDate,
        endDate: data.endDate || "",
        description: data.description,
      }
    });
    nextStep();
  };

  const handleRateSubmit = (data: z.infer<typeof rateSchema>) => {
    setFormData({
      ...formData,
      rates: {
        baseRate: data.baseRate,
        weekendRate: data.weekendRate || "",
        holidayRate: data.holidayRate || "",
        overnightRate: data.overnightRate || "",
      }
    });
    nextStep();
  };

  const handleAvailabilitySubmit = (data: z.infer<typeof availabilitySchema>) => {
    const timeSlots: Record<string, { start: string; end: string }[]> = {};
    
    Object.entries(data.timeSlots || {}).forEach(([day, slots]) => {
      if (slots && slots.length > 0) {
        timeSlots[day] = slots.map(slot => ({
          start: slot.start || "09:00",
          end: slot.end || "17:00"
        }));
      }
    });

    setFormData({
      ...formData,
      availability: {
        availableWeekdays: data.availableWeekdays,
        timeSlots: timeSlots,
      }
    });
    
    toast.success("Profile setup completed!");
    
    onComplete();
  };

  const addTimeSlot = (day: string) => {
    const currentSlots = availabilityForm.getValues().timeSlots || {};
    const daySlots = currentSlots[day] || [];
    
    const updatedSlots = {
      ...currentSlots,
      [day]: [...daySlots, { start: "09:00", end: "17:00" }]
    };
    
    availabilityForm.setValue("timeSlots", updatedSlots);
  };

  const removeTimeSlot = (day: string, index: number) => {
    const currentSlots = availabilityForm.getValues().timeSlots || {};
    const daySlots = currentSlots[day] || [];
    
    if (daySlots.length > 0) {
      const updatedDaySlots = daySlots.filter((_, i) => i !== index);
      
      const updatedSlots = {
        ...currentSlots,
        [day]: updatedDaySlots
      };
      
      availabilityForm.setValue("timeSlots", updatedSlots);
    }
  };

  const stepComponents = [
    <Card key="bio" className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="bg-guardian text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">1</span>
          About You
        </CardTitle>
        <CardDescription>Tell us about yourself and languages you speak.</CardDescription>
      </CardHeader>
      <CardContent>
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
            <FormField
              control={bioForm.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="English, Auslan, etc." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    List languages you speak, separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="w-full mt-4">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>,

    <Card key="skills" className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="bg-guardian text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">2</span>
          Skills & Qualifications
        </CardTitle>
        <CardDescription>Select the services you can provide.</CardDescription>
      </CardHeader>
      <CardContent>
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
                      Choose all that apply. You can update these later.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableSkills.map((skill) => {
                      const isSelected = field.value?.includes(skill.value);
                      
                      return (
                        <div
                          key={skill.value}
                          onClick={() => {
                            if (isSelected) {
                              field.onChange(field.value?.filter((value) => value !== skill.value));
                            } else {
                              field.onChange([...(field.value || []), skill.value]);
                            }
                          }}
                          className={`cursor-pointer p-3 rounded-lg border transition-all ${
                            isSelected
                              ? "border-guardian bg-guardian/10 shadow-sm"
                              : "border-gray-200 hover:border-guardian/50 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className={`p-2 rounded-full mb-2 ${
                              isSelected ? "bg-guardian text-white" : "bg-gray-100 text-gray-600"
                            }`}>
                              <skill.icon className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-sm">{skill.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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

    <Card key="experience" className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="bg-guardian text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">3</span>
          Work Experience
        </CardTitle>
        <CardDescription>Add your most relevant work experience.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...experienceForm}>
          <form onSubmit={experienceForm.handleSubmit(handleExperienceSubmit)} className="space-y-4">
            <FormField
              control={experienceForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Support Worker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={experienceForm.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="NDIS Provider Sydney" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={experienceForm.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={experienceForm.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (leave empty if current)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={experienceForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Supported participants in Sydney with daily activities and community access..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    You can add more experiences later in your profile.
                  </FormDescription>
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

    <Card key="rates" className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="bg-guardian text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">4</span>
          Hourly Rates
        </CardTitle>
        <CardDescription>Set your hourly rates for different types of work.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...rateForm}>
          <form onSubmit={rateForm.handleSubmit(handleRateSubmit)} className="space-y-4">
            <FormField
              control={rateForm.control}
              name="baseRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Hourly Rate (AUD $)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="35" {...field} />
                  </FormControl>
                  <FormDescription>
                    Standard weekday rate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={rateForm.control}
              name="weekendRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weekend Rate (AUD $) (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="45" {...field} />
                  </FormControl>
                  <FormDescription>
                    Rate for weekend shifts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={rateForm.control}
              name="holidayRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Holiday Rate (AUD $) (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="55" {...field} />
                  </FormControl>
                  <FormDescription>
                    Rate for holiday shifts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={rateForm.control}
              name="overnightRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overnight Rate (AUD $) (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="65" {...field} />
                  </FormControl>
                  <FormDescription>
                    Rate for overnight shifts
                  </FormDescription>
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

    <Card key="availability" className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="bg-guardian text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">5</span>
          Availability
        </CardTitle>
        <CardDescription>Let us know when you're available to work.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...availabilityForm}>
          <form onSubmit={availabilityForm.handleSubmit(handleAvailabilitySubmit)} className="space-y-6">
            <FormField
              control={availabilityForm.control}
              name="availableWeekdays"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Available Days</FormLabel>
                    <FormDescription>
                      Select the days you're typically available to work and set your available hours.
                    </FormDescription>
                  </div>
                  <div className="space-y-6">
                    {weekdays.map((day) => {
                      const isSelected = availabilityForm.watch("availableWeekdays")?.includes(day.value);
                      
                      return (
                        <div key={day.value} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`day-${day.value}`}
                                checked={isSelected}
                                onChange={(e) => {
                                  const currentWeekdays = availabilityForm.getValues("availableWeekdays") || [];
                                  
                                  if (e.target.checked) {
                                    if (!currentWeekdays.includes(day.value)) {
                                      availabilityForm.setValue("availableWeekdays", [...currentWeekdays, day.value]);
                                      // Add a default time slot when day is selected
                                      addTimeSlot(day.value);
                                    }
                                  } else {
                                    availabilityForm.setValue(
                                      "availableWeekdays",
                                      currentWeekdays.filter((d) => d !== day.value)
                                    );
                                    
                                    const currentTimeSlots = availabilityForm.getValues("timeSlots") || {};
                                    const { [day.value]: _, ...restTimeSlots } = currentTimeSlots;
                                    availabilityForm.setValue("timeSlots", restTimeSlots);
                                  }
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-guardian focus:ring-guardian"
                              />
                              <label htmlFor={`day-${day.value}`} className="font-medium">
                                {day.label}
                              </label>
                            </div>
                            
                            {isSelected && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => addTimeSlot(day.value)}
                              >
                                Add Time Slot
                              </Button>
                            )}
                          </div>
                          
                          {isSelected && (
                            <div className="mt-3 space-y-3 pl-6">
                              {(availabilityForm.watch(`timeSlots.${day.value}`) || []).map((slot, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                  <div className="grid grid-cols-2 gap-2 flex-1">
                                    <div>
                                      <FormLabel className="text-xs">Start Time</FormLabel>
                                      <TimeInput
                                        value={slot.start || ""}
                                        onChange={(value) => {
                                          const currentSlots = availabilityForm.getValues().timeSlots || {};
                                          const daySlots = [...(currentSlots[day.value] || [])];
                                          daySlots[index] = { ...daySlots[index], start: value };
                                          
                                          availabilityForm.setValue("timeSlots", {
                                            ...currentSlots,
                                            [day.value]: daySlots
                                          });
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <FormLabel className="text-xs">End Time</FormLabel>
                                      <TimeInput
                                        value={slot.end || ""}
                                        onChange={(value) => {
                                          const currentSlots = availabilityForm.getValues().timeSlots || {};
                                          const daySlots = [...(currentSlots[day.value] || [])];
                                          daySlots[index] = { ...daySlots[index], end: value };
                                          
                                          availabilityForm.setValue("timeSlots", {
                                            ...currentSlots,
                                            [day.value]: daySlots
                                          });
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 mt-4"
                                    onClick={() => removeTimeSlot(day.value, index)}
                                  >
                                    ✕
                                  </Button>
                                </div>
                              ))}
                              
                              {!(availabilityForm.watch(`timeSlots.${day.value}`) || []).length && (
                                <div className="flex justify-center">
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => addTimeSlot(day.value)}
                                    className="text-guardian"
                                  >
                                    + Add Time Slot
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <FormMessage />
                  <FormDescription className="mt-4">
                    You can set more detailed availability preferences later.
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit">
                Complete Setup
                <CheckCircle className="ml-2 h-4 w-4" />
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
      <div className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="flex justify-between items-center overflow-x-auto pb-2">
            {steps.map((item, i) => (
              <div key={i} className="flex flex-col items-center mx-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    i + 1 === step
                      ? "bg-guardian text-white"
                      : i + 1 < step
                      ? "bg-gray-200 text-guardian"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i + 1 < step ? <CheckCircle className="h-5 w-5" /> : item.icon}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    i + 1 === step ? "text-guardian font-medium" : "text-gray-500"
                  }`}
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
