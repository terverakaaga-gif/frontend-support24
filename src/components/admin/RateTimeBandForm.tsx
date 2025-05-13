import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Save,
  Clock,
  Calendar,
  Bed,
  Info
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define the schema for time band validation
const timeBandSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(50, {
    message: "Name must not exceed 50 characters.",
  }),
  code: z.string().min(1, {
    message: "Code is required.",
  }).max(20, {
    message: "Code must not exceed 20 characters.",
  }).toUpperCase(),
  description: z.string().optional(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  isWeekend: z.boolean().default(false),
  isPublicHoliday: z.boolean().default(false),
  isSleepover: z.boolean().default(false),
  isActive: z.boolean().default(true),
  baseRateMultiplier: z.number().min(0.01, {
    message: "Base rate multiplier must be greater than 0.",
  }).max(10, {
    message: "Base rate multiplier must not exceed 10.",
  }),
});

// Define the interface for the time band data
interface RateTimeBand {
  _id: string;
  name: string;
  code: string;
  startTime?: string;
  endTime?: string;
  description: string;
  isWeekend: boolean;
  isPublicHoliday: boolean;
  isSleepover: boolean;
  isActive: boolean;
  baseRateMultiplier: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Mock data
const mockTimeBands: RateTimeBand[] = [
  {
    "_id": "681c6f750ab224ca6685d05d",
    "name": "Afternoon Shift",
    "code": "AFTERNOON",
    "startTime": "14:00",
    "endTime": "22:00",
    "description": "Early afternoon to late evening shift",
    "isWeekend": false,
    "isPublicHoliday": false,
    "isSleepover": false,
    "isActive": true,
    "baseRateMultiplier": 1,
    "__v": 0,
    "createdAt": "2025-05-08T08:46:45.660Z",
    "updatedAt": "2025-05-08T08:46:45.660Z"
  },
  {
    "_id": "681c6f750ab224ca6685d05c",
    "name": "Morning Shift",
    "code": "MORNING",
    "startTime": "06:00",
    "endTime": "14:00",
    "description": "Early morning to early afternoon shift",
    "isWeekend": false,
    "isPublicHoliday": false,
    "isSleepover": false,
    "isActive": true,
    "baseRateMultiplier": 1,
    "__v": 0,
    "createdAt": "2025-05-08T08:46:45.659Z",
    "updatedAt": "2025-05-08T08:46:45.659Z"
  },
  {
    "_id": "681c6f750ab224ca6685d05e",
    "name": "Night Shift",
    "code": "NIGHT",
    "startTime": "22:00",
    "endTime": "06:00",
    "description": "Overnight shift",
    "isWeekend": false,
    "isPublicHoliday": false,
    "isSleepover": true,
    "isActive": true,
    "baseRateMultiplier": 1.25,
    "__v": 0,
    "createdAt": "2025-05-08T08:46:45.660Z",
    "updatedAt": "2025-05-08T08:46:45.660Z"
  },
  {
    "_id": "681c6f750ab224ca6685d060",
    "name": "Public Holiday Shift",
    "code": "HOLIDAY",
    "description": "Any shift during a public holiday",
    "isWeekend": false,
    "isPublicHoliday": true,
    "isSleepover": false,
    "isActive": true,
    "baseRateMultiplier": 2,
    "__v": 0,
    "createdAt": "2025-05-08T08:46:45.662Z",
    "updatedAt": "2025-05-08T08:46:45.662Z"
  },
  {
    "_id": "681c6f750ab224ca6685d05f",
    "name": "Weekend Shift",
    "code": "WEEKEND",
    "description": "Any shift during the weekend",
    "isWeekend": true,
    "isPublicHoliday": false,
    "isSleepover": false,
    "isActive": true,
    "baseRateMultiplier": 1.5,
    "__v": 0,
    "createdAt": "2025-05-08T08:46:45.661Z",
    "updatedAt": "2025-05-08T08:46:45.661Z"
  }
];

export function RateTimeBandForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const isEditMode = id !== 'create';

  // Initialize form with React Hook Form
  const form = useForm<z.infer<typeof timeBandSchema>>({
    resolver: zodResolver(timeBandSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      startTime: "",
      endTime: "",
      isWeekend: false,
      isPublicHoliday: false,
      isSleepover: false,
      isActive: true,
      baseRateMultiplier: 1.0,
    },
    mode: "onChange",
  });
  
  const { formState } = form;
  const isDirty = formState.isDirty;

  useEffect(() => {
    // If editing, fetch the time band data
    if (isEditMode) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const timeBand = mockTimeBands.find(band => band._id === id);
        if (timeBand) {
          // Reset form with fetched data
          form.reset({
            name: timeBand.name,
            code: timeBand.code,
            description: timeBand.description || "",
            startTime: timeBand.startTime || "",
            endTime: timeBand.endTime || "",
            isWeekend: timeBand.isWeekend,
            isPublicHoliday: timeBand.isPublicHoliday,
            isSleepover: timeBand.isSleepover,
            isActive: timeBand.isActive,
            baseRateMultiplier: timeBand.baseRateMultiplier,
          });
        } else {
          // Time band not found, redirect back
          toast({
            title: "Error",
            description: "Rate time band not found.",
            variant: "destructive",
          });
          navigate("/admin/rate-time-band");
        }
        setLoading(false);
      }, 500);
    } else {
      // For create mode, just set loading to false
      setLoading(false);
    }
  }, [id, isEditMode, form, navigate]);

  const onSubmit = async (values: z.infer<typeof timeBandSchema>) => {
    setSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Log form values for debugging
      console.log("Form values:", values);
      
      // Show success toast
      toast({
        title: isEditMode ? "Rate Time Band Updated" : "Rate Time Band Created",
        description: isEditMode
          ? `The rate time band "${values.name}" has been updated successfully.`
          : `The rate time band "${values.name}" has been created successfully.`,
      });
      
      // Navigate back to the list
      navigate("/admin/rate-time-band");
    } catch (error) {
      console.error("Error saving time band:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the rate time band.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      navigate("/admin/rate-time-band");
    }
  };

  const handleDiscard = () => {
    setShowDiscardDialog(false);
    navigate("/admin/rate-time-band");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Time Bands
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Rate Time Band" : "Create New Rate Time Band"}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details for this rate time band.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Morning Shift" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for this time band.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. MORNING" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormDescription>
                        A unique code for system identification.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the time band..." 
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A detailed description of when this time band applies.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Time Configuration</CardTitle>
              <CardDescription>
                Set the time range and rate multiplier for this time band.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        When this time band starts. Optional for all-day time bands.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        When this time band ends. Optional for all-day time bands.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="baseRateMultiplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Rate Multiplier</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0.01" 
                          max="10" 
                          placeholder="1.0" 
                          className="w-24"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                        <span className="ml-2">× standard rate</span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      The multiplier applied to the base hourly rate (e.g., 1.5 for 50% premium).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Special Categories</CardTitle>
              <CardDescription>
                Define special characteristics of this time band.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isWeekend"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                            <span>Weekend Shift</span>
                          </div>
                        </FormLabel>
                        <FormDescription>
                          This time band applies to weekend days (Saturday and Sunday).
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isPublicHoliday"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-red-500" />
                            <span>Public Holiday</span>
                          </div>
                        </FormLabel>
                        <FormDescription>
                          This time band applies to public holidays.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isSleepover"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-2 text-blue-500" />
                            <span>Sleepover Shift</span>
                          </div>
                        </FormLabel>
                        <FormDescription>
                          This time band applies to overnight stays or sleepovers.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>
                          This time band is active and available for use in the system.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Note</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Changes to this time band will affect all rates that use it. Make sure your changes are consistent with existing rate configurations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update Time Band" : "Create Time Band"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
      
      {/* Discard changes dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscard}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}