import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { 
  Card,
  CardContent,
  CardDescription,
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useGetRateTimeBandById, 
  useCreateRateTimeBand, 
  useUpdateRateTimeBand 
} from "@/hooks/useRateTimeBandHooks";
import { CreateRateTimeBandRequest, UpdateRateTimeBandRequest } from "@/entities/RateTimeBand";
import { AltArrowLeft, ArchiveMinimalistic, Bed, Calendar, InfoCircle, Refresh } from "@solar-icons/react";

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

export function RateTimeBandForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const isEditMode = id !== 'create';

  // API hooks
  const { data: timeBand, isLoading: isLoadingTimeBand, error: loadError } = useGetRateTimeBandById(
    isEditMode ? id : undefined
  );
  const createMutation = useCreateRateTimeBand();
  const updateMutation = useUpdateRateTimeBand();

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
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    // If editing and we have data, populate the form
    if (isEditMode && timeBand) {
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
    }
  }, [timeBand, isEditMode, form]);

  const onSubmit = async (values: z.infer<typeof timeBandSchema>) => {
    try {
      // Prepare the data object
      const dataToSubmit = {
        ...values,
        // Convert empty strings to undefined for optional fields
        startTime: values.startTime || undefined,
        endTime: values.endTime || undefined,
        description: values.description || undefined,
      };

      if (isEditMode) {
        // Update existing rate time band
        await updateMutation.mutateAsync({ 
          id: id!, 
          data: dataToSubmit as UpdateRateTimeBandRequest 
        });
      } else {
        // Create new rate time band
        await createMutation.mutateAsync(dataToSubmit as CreateRateTimeBandRequest);
      }
      
      // Navigate back to the list on success
      navigate("/admin/rate-time-band");
    } catch (error) {
      // Error handling is done in the hooks
      console.error("Error saving rate time band:", error);
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

  // Loading state
  if (isEditMode && isLoadingTimeBand) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleCancel} className="mr-4">
            <AltArrowLeft className="h-4 w-4 mr-2" />
            Back to Time Bands
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (isEditMode && loadError) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleCancel} className="mr-4">
            <AltArrowLeft className="h-4 w-4 mr-2" />
            Back to Time Bands
          </Button>
          <h1 className="text-2xl font-montserrat-bold">Error Loading Rate Time Band</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-red-600">
                <Refresh className="h-8 w-8 mx-auto mb-4" />
                <p className="font-montserrat-semibold">Error loading rate time band details</p>
                <p className="text-sm text-gray-600 mt-1">Please try again later</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If editing but no data found
  if (isEditMode && !timeBand && !isLoadingTimeBand) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleCancel} className="mr-4">
            <AltArrowLeft className="h-4 w-4 mr-2" />
            Back to Time Bands
          </Button>
          <h1 className="text-2xl font-montserrat-bold">Rate Time Band Not Found</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-lg font-montserrat-semibold mb-2">Rate Time Band Not Found</p>
              <p className="text-gray-600 mb-4">
                The rate time band you're trying to edit could not be found.
              </p>
              <Button onClick={() => navigate("/admin/rate-time-band")}>
                Return to Rate Time Bands
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="mr-4">
          <AltArrowLeft className="h-4 w-4 mr-2" />
          Back to Time Bands
        </Button>
        <h1 className="text-2xl font-montserrat-bold">
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
                            <Bed className="h-4 w-4 mr-2 text-primary-500" />
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
                <InfoCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-montserrat-semibold text-yellow-800">Important Note</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Changes to this time band will affect all rates that use it. Make sure your changes are consistent with existing rate configurations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <ArchiveMinimalistic className="h-4 w-4 mr-2" />
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