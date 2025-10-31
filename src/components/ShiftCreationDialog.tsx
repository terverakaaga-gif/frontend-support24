import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AltArrowLeft,
  AltArrowRight,
  Calendar,
  CheckCircle,
  ClockCircle,
  MapPoint,
  Repeat,
  User,
  UsersGroupRounded,
  AddCircle,
  CloseCircle,
  ListCheck,
  Refresh,
} from "@solar-icons/react";
import { useGetActiveServiceTypes } from "@/hooks/useServiceTypeHooks";
import { useCreateShift } from "@/hooks/useShiftHooks";
import { useGetRoutines, useCreateRoutine } from "@/hooks/useRoutineHooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetOrganizations } from "@/hooks/useOrganizationHooks";
import {
  getWorkerDisplayName,
  getWorkerInitials,
  getWorkerProfileImage,
  filterValidWorkers,
} from "@/lib/utils";

// Types
interface RoutineTask {
  title: string;
  description: string;
}

interface Routine {
  name: string;
  description: string;
  tasks: RoutineTask[];
}

interface ShiftFormData {
  organizationId: string;
  isMultiWorkerShift: boolean;
  workerId?: string;
  workerIds?: string[];
  serviceTypeId: string;
  startTime: string;
  endTime: string;
  locationType: "inPerson" | "virtual";
  address: string;
  shiftType: "directBooking" | "openShift";
  requiresSupervision: boolean;
  specialInstructions: string;
  recurrence?: {
    pattern: "none" | "daily" | "weekly" | "biweekly" | "monthly";
    occurrences?: number;
  };
  routine?: Routine;
  routineId?: string;
}

const SHIFT_TYPES = [
  {
    id: "single",
    title: "Single Worker Shift",
    description: "Assign one worker to this shift",
    icon: User,
  },
  {
    id: "multiple",
    title: "Multiple Workers Shift",
    description: "Assign multiple workers to this shift",
    icon: UsersGroupRounded,
  },
  {
    id: "recurring",
    title: "Recurring Shift",
    description: "Create a repeating shift schedule",
    icon: Repeat,
  },
];

const RECURRENCE_PATTERNS = [
  { value: "none", label: "No Recurrence" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

const LOCATION_TYPES = [
  { value: "inPerson", label: "In Person" },
  { value: "virtual", label: "Virtual" },
];

const SHIFT_DURATIONS = [
  { value: 1, label: "1 Hour" },
  { value: 2, label: "2 Hours" },
  { value: 3, label: "3 Hours" },
  { value: 4, label: "4 Hours" },
];

interface ShiftCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShiftCreationDialog({
  open,
  onOpenChange,
}: ShiftCreationDialogProps) {
  const [step, setStep] = useState(1);
  const [shiftTypeSelection, setShiftTypeSelection] = useState<string>("");
  const [routineOption, setRoutineOption] = useState<
    "none" | "create" | "select"
  >("none");

  const { data: serviceTypes = [], isLoading: loadingServiceTypes } =
    useGetActiveServiceTypes();
  const { data: existingRoutines, isLoading: loadingRoutines } =
    useGetRoutines();
  console.log("Existing Routines:  ", existingRoutines);
  const createShiftMutation = useCreateShift();
  const createRoutineMutation = useCreateRoutine();
  const { data: orgs = [], isLoading: orgsLoading } = useGetOrganizations();
  const workers = orgs.length ? filterValidWorkers(orgs[0].workers) : [];

  const [formData, setFormData] = useState<ShiftFormData>({
    organizationId: orgs[0]?._id || "",
    isMultiWorkerShift: false,
    serviceTypeId: "",
    startTime: "",
    endTime: "",
    locationType: "inPerson",
    address: "",
    shiftType: "directBooking",
    requiresSupervision: false,
    specialInstructions: "",
    recurrence: {
      pattern: "none",
    },
  });

  // Get minimum datetime (current time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Calculate end time based on duration
  const calculateEndTime = (startTime: string, hours: number) => {
    const start = new Date(startTime);
    start.setHours(start.getHours() + 1 + hours);
    return start.toISOString().slice(0, 16);
  };

  // ensure that organizationId is set when orgs load
  useMemo(() => {
    if (orgs.length > 0) {
      setFormData((prev) => ({
        ...prev,
        organizationId: orgs[0]._id,
      }));
    }
  }, [orgs]);

  const handleShiftTypeSelect = (type: string) => {
    setShiftTypeSelection(type);
    setFormData((prev) => ({
      ...prev,
      isMultiWorkerShift: type === "multiple",
      recurrence:
        type === "recurring"
          ? { pattern: "weekly", occurrences: 4 }
          : { pattern: "none" },
    }));
  };

  const handleInputChange = (field: keyof ShiftFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDurationSelect = (hours: number) => {
    if (formData.startTime) {
      const endTime = calculateEndTime(formData.startTime, hours);
      handleInputChange("endTime", endTime);
    }
  };

  const handleWorkerToggle = (workerId: string) => {
    setFormData((prev) => {
      const currentWorkers = prev.workerIds || [];
      const isSelected = currentWorkers.includes(workerId);
      return {
        ...prev,
        workerIds: isSelected
          ? currentWorkers.filter((id) => id !== workerId)
          : [...currentWorkers, workerId],
      };
    });
  };

  // Routine management
  const handleRoutineOptionChange = (option: "none" | "create" | "select") => {
    setRoutineOption(option);

    if (option === "create") {
      setFormData((prev) => ({
        ...prev,
        routine: {
          name: "",
          description: "",
          tasks: [{ title: "", description: "" }],
        },
        routineId: undefined,
      }));
    } else if (option === "select") {
      setFormData((prev) => ({
        ...prev,
        routine: undefined,
        routineId: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        routine: undefined,
        routineId: undefined,
      }));
    }
  };

  const handleRoutineChange = (field: keyof Routine, value: string) => {
    setFormData((prev) => ({
      ...prev,
      routine: {
        ...prev.routine!,
        [field]: value,
      },
    }));
  };

  const handleTaskChange = (
    index: number,
    field: keyof RoutineTask,
    value: string
  ) => {
    setFormData((prev) => {
      const tasks = [...(prev.routine?.tasks || [])];
      tasks[index] = { ...tasks[index], [field]: value };
      return {
        ...prev,
        routine: {
          ...prev.routine!,
          tasks,
        },
      };
    });
  };

  const addTask = () => {
    setFormData((prev) => ({
      ...prev,
      routine: {
        ...prev.routine!,
        tasks: [...prev.routine!.tasks, { title: "", description: "" }],
      },
    }));
  };

  const removeTask = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      routine: {
        ...prev.routine!,
        tasks: prev.routine!.tasks.filter((_, i) => i !== index),
      },
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      return !!shiftTypeSelection;
    }
    if (step === 2) {
      return (
        formData.serviceTypeId &&
        formData.startTime &&
        formData.endTime &&
        (formData.locationType === "virtual" || formData.address)
      );
    }
    if (step === 3) {
      if (shiftTypeSelection === "multiple") {
        return formData.workerIds && formData.workerIds.length > 0;
      }
      if (shiftTypeSelection === "single") {
        return !!formData.workerId;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!formData.organizationId) {
      toast.error("Organization is required to create a shift");
      return;
    }

    // Create routine first if the option is "create"
    let routineId = formData.routineId;

    if (routineOption === "create" && formData.routine) {
      if (
        !formData.routine.name ||
        !formData.routine.description ||
        formData.routine.tasks.some((t) => !t.title || !t.description)
      ) {
        toast.error("Please fill in all routine fields");
        return;
      }

      try {
        const routineResponse = await createRoutineMutation.mutateAsync(
          formData.routine
        );
        // The response is already a Routine object, not wrapped in {data: ...}
        routineId = routineResponse.routineId || routineResponse._id;

        console.log("Routine created successfully:", routineResponse);
        console.log("Using routine ID:", routineId);
      } catch (error: any) {
        console.error("Routine creation error:", error);
        // The error is already handled by the mutation's onError
        // Just return to stop shift creation
        return;
      }
    } else if (routineOption === "select" && !formData.routineId) {
      toast.error("Please select a routine");
      return;
    }

    const payload: any = {
      organizationId: formData.organizationId,
      isMultiWorkerShift: formData.isMultiWorkerShift,
      serviceTypeId: formData.serviceTypeId,
      startTime: formData.startTime,
      endTime: formData.endTime,
      locationType: formData.locationType,
      address: formData.address,
      shiftType: formData.shiftType,
      specialInstructions: formData.specialInstructions,
      requiresSupervision: formData.requiresSupervision,
    };

    if (routineId) {
      payload.routineId = routineId;
    }

    // Add worker/workers based on type
    if (formData.isMultiWorkerShift) {
      payload.workerIds = formData.workerIds;
    } else {
      payload.workerId = formData.workerId;
    }

    // Add recurrence if applicable
    if (
      shiftTypeSelection === "recurring" &&
      formData.recurrence?.pattern !== "none"
    ) {
      payload.recurrence = formData.recurrence;
    }

    createShiftMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Shift created successfully!");
        onOpenChange(false);
        resetForm();
      },
      onError: (error: any) => {
        console.error("Shift creation error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create shift";
        toast.error(errorMessage);
      },
    });
  };

  const resetForm = () => {
    setStep(1);
    setShiftTypeSelection("");
    setRoutineOption("none");
    setFormData({
      organizationId: orgs[0]._id || "",
      isMultiWorkerShift: false,
      serviceTypeId: "",
      startTime: "",
      endTime: "",
      locationType: "inPerson",
      address: "",
      shiftType: "directBooking",
      requiresSupervision: false,
      specialInstructions: "",
      recurrence: { pattern: "none" },
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getShiftDuration = () => {
    if (!formData.startTime || !formData.endTime) return "";
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const getSelectedRoutine = () => {
    if (routineOption === "create" && formData.routine) {
      return formData.routine;
    }
    if (routineOption === "select" && formData.routineId) {
      return existingRoutines.find((r) => r.routineId === formData.routineId);
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-gray-100 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-montserrat-bold">
            Create New Shift
          </DialogTitle>
          <DialogDescription>
            Step {step} of 4 - {step === 1 && "Select Shift Type"}
            {step === 2 && "Shift Details"}
            {step === 3 && "Assign Workers"}
            {step === 4 && "Review & Submit"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 flex-1 rounded-full transition-all duration-300",
                s <= step ? "bg-primary" : "bg-gray-200"
              )}
            />
          ))}
        </div>

        {/* Step 1: Select Shift Type */}
        {step === 1 && (
          <div className="space-y-4">
            <Label className="text-base font-montserrat-semibold">
              Choose Shift Type
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SHIFT_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-lg",
                      shiftTypeSelection === type.id
                        ? "border-2 border-primary shadow-lg"
                        : "border-2 border-transparent"
                    )}
                    onClick={() => handleShiftTypeSelect(type.id)}
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-montserrat-semibold text-lg">
                        {type.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {type.description}
                      </p>
                      {shiftTypeSelection === type.id && (
                        <CheckCircle className="w-6 h-6 text-primary mx-auto" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Shift Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="serviceTypeId"
                className="font-montserrat-semibold"
              >
                Service Type *
              </Label>
              <Select
                value={formData.serviceTypeId}
                onValueChange={(value) =>
                  handleInputChange("serviceTypeId", value)
                }
              >
                <SelectTrigger id="serviceTypeId">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service._id} value={service._id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="font-montserrat-semibold">
                  Start Time *
                </Label>
                <Input
                  className="py-3"
                  id="startTime"
                  type="datetime-local"
                  min={getMinDateTime()}
                  value={formData.startTime}
                  onChange={(e) => {
                    handleInputChange("startTime", e.target.value);
                    handleInputChange("endTime", "");
                  }}
                />
              </div>

              {formData.startTime && (
                <div className="space-y-2">
                  <Label className="font-montserrat-semibold">
                    Select Shift Duration *
                  </Label>
                  <div className="grid grid-cols-4 gap-3">
                    {SHIFT_DURATIONS.map((duration) => (
                      <Button
                        key={duration.value}
                        type="button"
                        variant={
                          formData.endTime ===
                          calculateEndTime(formData.startTime, duration.value)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleDurationSelect(duration.value)}
                        className="w-full"
                      >
                        {duration.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {formData.endTime && (
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-montserrat-semibold text-gray-700">
                        End Time
                      </p>
                      <p className="text-lg font-montserrat-bold text-primary">
                        {formatDateTime(formData.endTime)}
                      </p>
                    </div>
                    <Badge className="bg-primary text-white">
                      Duration: {getShiftDuration()}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-montserrat-semibold">
                Location Type *
              </Label>
              <RadioGroup
                value={formData.locationType}
                onValueChange={(value: any) =>
                  handleInputChange("locationType", value)
                }
              >
                <div className="flex gap-4">
                  {LOCATION_TYPES.map((location) => (
                    <div
                      key={location.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={location.value}
                        id={location.value}
                      />
                      <Label
                        htmlFor={location.value}
                        className="cursor-pointer"
                      >
                        {location.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {formData.locationType === "inPerson" && (
              <div className="space-y-2">
                <Label htmlFor="address" className="font-montserrat-semibold">
                  Address *
                </Label>
                <div className="relative">
                  <MapPoint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="address"
                    placeholder="Enter shift location address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {shiftTypeSelection === "recurring" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-montserrat-semibold">
                    Recurrence Pattern *
                  </Label>
                  <Select
                    value={formData.recurrence?.pattern || "none"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        recurrence: {
                          ...prev.recurrence,
                          pattern: value as any,
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RECURRENCE_PATTERNS.map((pattern) => (
                        <SelectItem key={pattern.value} value={pattern.value}>
                          {pattern.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.recurrence?.pattern !== "none" && (
                  <div className="space-y-2">
                    <Label className="font-montserrat-semibold">
                      Number of Occurrences *
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="52"
                      value={formData.recurrence?.occurrences || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          recurrence: {
                            ...prev.recurrence!,
                            occurrences: parseInt(e.target.value),
                          },
                        }))
                      }
                      placeholder="e.g., 8"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="specialInstructions"
                className="font-montserrat-semibold"
              >
                Special Instructions *
              </Label>
              <Textarea
                id="specialInstructions"
                placeholder="Add any special instructions for this shift..."
                value={formData.specialInstructions}
                onChange={(e) =>
                  handleInputChange("specialInstructions", e.target.value)
                }
                rows={4}
              />
            </div>

            {/* <div className="flex items-center space-x-2">
              <Checkbox
                className="w-6 h-6 border-double"
                id="supervision"
                checked={formData.requiresSupervision}
                onCheckedChange={(checked) =>
                  handleInputChange("requiresSupervision", checked)
                }
              />
              <Label htmlFor="supervision" className="cursor-pointer">
                This shift requires supervision
              </Label>
            </div> */}

            {/* Routine Section */}
            <div className="border-t pt-6 space-y-4">
              <div className="space-y-3">
                <Label className="font-montserrat-semibold text-base">
                  Routine Options
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant={routineOption === "none" ? "default" : "outline"}
                    onClick={() => handleRoutineOptionChange("none")}
                    className="w-full h-auto py-4 flex-col gap-2"
                  >
                    <CloseCircle className="w-5 h-5" />
                    <span className="text-sm">No Routine</span>
                  </Button>

                  <Button
                    type="button"
                    variant={routineOption === "create" ? "default" : "outline"}
                    onClick={() => handleRoutineOptionChange("create")}
                    className="w-full h-auto py-4 flex-col gap-2"
                  >
                    <AddCircle className="w-5 h-5" />
                    <span className="text-sm">Create New</span>
                  </Button>

                  <Button
                    type="button"
                    variant={routineOption === "select" ? "default" : "outline"}
                    onClick={() => handleRoutineOptionChange("select")}
                    className="w-full h-auto py-4 flex-col gap-2"
                  >
                    <ListCheck className="w-5 h-5" />
                    <span className="text-sm">Select Existing</span>
                  </Button>
                </div>
              </div>

              {/* Create New Routine */}
              {routineOption === "create" && (
                <Card className="bg-white">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-montserrat-bold text-lg flex items-center gap-2">
                        <ListCheck className="w-5 h-5 text-primary" />
                        Create Routine
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-montserrat-semibold">
                        Routine Name *
                      </Label>
                      <Input
                        placeholder="e.g., Morning Personal Care Routine"
                        value={formData.routine?.name || ""}
                        onChange={(e) =>
                          handleRoutineChange("name", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-montserrat-semibold">
                        Description *
                      </Label>
                      <Textarea
                        placeholder="Describe the routine..."
                        value={formData.routine?.description || ""}
                        onChange={(e) =>
                          handleRoutineChange("description", e.target.value)
                        }
                        rows={2}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="font-montserrat-semibold">
                        Tasks *
                      </Label>
                      {formData.routine?.tasks.map((task, index) => (
                        <Card key={index} className="bg-gray-50">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-montserrat-semibold text-gray-600">
                                Task {index + 1}
                              </span>
                              {formData.routine!.tasks.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTask(index)}
                                >
                                  <CloseCircle className="w-4 h-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Task title"
                              value={task.title}
                              onChange={(e) =>
                                handleTaskChange(index, "title", e.target.value)
                              }
                            />
                            <Textarea
                              placeholder="Task description"
                              value={task.description}
                              onChange={(e) =>
                                handleTaskChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={2}
                            />
                          </CardContent>
                        </Card>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTask}
                        className="w-full gap-2"
                      >
                        <AddCircle className="w-4 h-4" />
                        Add Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Select Existing Routine */}
              {routineOption === "select" && (
                <div className="space-y-3">
                  <Label className="font-montserrat-semibold">
                    Select a Routine *
                  </Label>

                  {loadingRoutines ? (
                    <div className="flex items-center justify-center py-8">
                      <Refresh className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : existingRoutines.length === 0 ? (
                    <Card className="bg-white">
                      <CardContent className="p-6 text-center">
                        <ListCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No routines available</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Create your first routine to get started
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <RadioGroup
                      value={formData.routineId}
                      onValueChange={(value) =>
                        handleInputChange("routineId", value)
                      }
                    >
                      <div className="space-y-3">
                        {existingRoutines.map((routine) => (
                          <Card
                            key={routine.routineId}
                            className={cn(
                              "cursor-pointer transition-all duration-200",
                              formData.routineId === routine.routineId &&
                                "border-2 border-primary"
                            )}
                            onClick={() =>
                              handleInputChange("routineId", routine.routineId)
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <RadioGroupItem
                                  value={routine.routineId}
                                  id={routine.routineId}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-montserrat-semibold">
                                      {routine.name}
                                    </h4>
                                    {formData.routineId ===
                                      routine.routineId && (
                                      <CheckCircle className="w-5 h-5 text-primary" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {routine.description}
                                  </p>
                                  <Badge variant="outline" className="text-xs">
                                    {routine.tasks.length} task
                                    {routine.tasks.length !== 1 ? "s" : ""}
                                  </Badge>
                                </div>
                              </div>

                              {/* Show tasks preview when selected */}
                              {formData.routineId === routine.routineId && (
                                <div className="mt-4 pt-4 border-t space-y-2">
                                  <p className="text-xs font-montserrat-semibold text-gray-600 mb-2">
                                    Tasks Preview:
                                  </p>
                                  {routine.tasks.map((task, idx) => (
                                    <div
                                      key={idx}
                                      className="text-sm bg-gray-50 p-2 rounded"
                                    >
                                      <p className="font-montserrat-semibold">
                                        {idx + 1}. {task.title}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {task.description}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </RadioGroup>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Assign Workers */}
        {step === 3 && (
          <div className="space-y-4">
            <Label className="text-base font-montserrat-semibold">
              {shiftTypeSelection === "multiple"
                ? "Select Workers (Multiple)"
                : "Select Worker"}
            </Label>

            {shiftTypeSelection === "single" && (
              <RadioGroup
                value={formData.workerId}
                onValueChange={(value) => handleInputChange("workerId", value)}
              >
                <div className="space-y-3">
                  {workers.map((worker) => (
                    <Card
                      key={worker.workerId._id}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        formData.workerId === worker.workerId._id &&
                          "border-2 border-primary"
                      )}
                      onClick={() =>
                        handleInputChange("workerId", worker.workerId._id)
                      }
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <RadioGroupItem
                          value={worker.workerId._id}
                          id={worker.workerId._id}
                        />
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={getWorkerProfileImage(worker.workerId)}
                          />
                          <AvatarFallback className="bg-primary-100 text-primary">
                            {getWorkerInitials(worker.workerId)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-montserrat-semibold">
                            {getWorkerDisplayName(worker.workerId)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Available for shift
                          </p>
                        </div>
                        {formData.workerId === worker.workerId._id && (
                          <CheckCircle className="w-6 h-6 text-primary" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            )}

            {shiftTypeSelection === "multiple" && (
              <div className="space-y-3">
                {workers.map((worker) => (
                  <Card
                    key={worker.workerId._id}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      formData.workerIds?.includes(worker.workerId._id) &&
                        "border-2 border-primary"
                    )}
                    onClick={() => handleWorkerToggle(worker.workerId._id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <Checkbox
                        checked={formData.workerIds?.includes(
                          worker.workerId._id
                        )}
                        onCheckedChange={() =>
                          handleWorkerToggle(worker.workerId._id)
                        }
                      />
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={getWorkerProfileImage(worker.workerId)}
                        />
                        <AvatarFallback className="bg-primary-100 text-primary">
                          {getWorkerInitials(worker.workerId)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-montserrat-semibold">
                          {getWorkerDisplayName(worker.workerId)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Available for shift
                        </p>
                      </div>
                      {formData.workerIds?.includes(worker.workerId._id) && (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                ))}
                {formData.workerIds && formData.workerIds.length > 0 && (
                  <p className="text-sm text-gray-600">
                    {formData.workerIds.length} worker(s) selected
                  </p>
                )}
              </div>
            )}

            {shiftTypeSelection === "recurring" && (
              <RadioGroup
                value={formData.workerId}
                onValueChange={(value) => handleInputChange("workerId", value)}
              >
                <div className="space-y-3">
                  {workers.map((worker) => (
                    <Card
                      key={worker.workerId._id}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        formData.workerId === worker.workerId._id &&
                          "border-2 border-primary"
                      )}
                      onClick={() =>
                        handleInputChange("workerId", worker.workerId._id)
                      }
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <RadioGroupItem
                          value={worker.workerId._id}
                          id={worker.workerId._id}
                        />
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={getWorkerProfileImage(worker.workerId)}
                          />
                          <AvatarFallback className="bg-primary-100 text-primary">
                            {getWorkerInitials(worker.workerId)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-montserrat-semibold">
                            {getWorkerDisplayName(worker.workerId)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Available for recurring shift
                          </p>
                        </div>
                        {formData.workerId === worker.workerId._id && (
                          <CheckCircle className="w-6 h-6 text-primary" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <Card className="shadow-md bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    {shiftTypeSelection === "single" && (
                      <User className="w-6 h-6 text-primary" />
                    )}
                    {shiftTypeSelection === "multiple" && (
                      <UsersGroupRounded className="w-6 h-6 text-primary" />
                    )}
                    {shiftTypeSelection === "recurring" && (
                      <Repeat className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-montserrat-bold text-lg">
                      {
                        SHIFT_TYPES.find((t) => t.id === shiftTypeSelection)
                          ?.title
                      }
                    </h3>
                    <p className="text-sm text-gray-600">
                      {
                        serviceTypes.find(
                          (s) => s._id === formData.serviceTypeId
                        )?.name
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Start Time</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="text-sm font-montserrat-semibold">
                        {formatDateTime(formData.startTime)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">End Time</p>
                    <div className="flex items-center gap-2">
                      <ClockCircle className="w-4 h-4 text-primary" />
                      <p className="text-sm font-montserrat-semibold">
                        {formatDateTime(formData.endTime)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  <Badge className="bg-primary text-white">
                    Duration: {getShiftDuration()}
                  </Badge>
                  <Badge variant="outline">{formData.locationType}</Badge>
                  {formData.requiresSupervision && (
                    <Badge variant="outline">Requires Supervision</Badge>
                  )}
                  {routineOption !== "none" && (
                    <Badge className="bg-green-500 text-white">
                      <ListCheck className="w-3 h-3 mr-1" />
                      With Routine
                    </Badge>
                  )}
                </div>

                {formData.locationType === "inPerson" && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-600 mb-1">Location</p>
                    <div className="flex items-start gap-2">
                      <MapPoint className="w-4 h-4 text-primary mt-0.5" />
                      <p className="text-sm">{formData.address}</p>
                    </div>
                  </div>
                )}

                {shiftTypeSelection === "recurring" &&
                  formData.recurrence?.pattern !== "none" && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-600 mb-1">Recurrence</p>
                      <div className="flex items-center gap-2">
                        <Repeat className="w-4 h-4 text-primary" />
                        <p className="text-sm font-montserrat-semibold">
                          {
                            RECURRENCE_PATTERNS.find(
                              (p) => p.value === formData.recurrence?.pattern
                            )?.label
                          }{" "}
                          - {formData.recurrence?.occurrences} occurrences
                        </p>
                      </div>
                    </div>
                  )}

                {formData.specialInstructions && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-600 mb-1">
                      Special Instructions
                    </p>
                    <p className="text-sm bg-primary/10 text-primary p-3 rounded-lg">
                      {formData.specialInstructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Routine Details in Review */}
            {routineOption !== "none" &&
              (() => {
                const selectedRoutine = getSelectedRoutine();
                if (!selectedRoutine) return null;

                return (
                  <Card className="bg-white">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <ListCheck className="w-5 h-5 text-primary" />
                        <h4 className="font-montserrat-bold text-lg">
                          Routine Details
                        </h4>
                        {routineOption === "create" && (
                          <Badge variant="outline" className="ml-auto">
                            New Routine
                          </Badge>
                        )}
                        {routineOption === "select" && (
                          <Badge variant="outline" className="ml-auto">
                            Existing Routine
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">
                            Routine Name
                          </p>
                          <p className="font-montserrat-semibold">
                            {selectedRoutine.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">
                            Description
                          </p>
                          <p className="text-sm text-gray-700">
                            {selectedRoutine.description}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-2">
                            Tasks ({selectedRoutine.tasks.length})
                          </p>
                          <div className="space-y-2">
                            {selectedRoutine.tasks.map((task, index) => (
                              <div
                                key={index}
                                className="p-3 bg-gray-50 rounded-lg"
                              >
                                <p className="font-montserrat-semibold text-sm">
                                  {index + 1}. {task.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {task.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

            <Card>
              <CardContent className="p-6">
                <h4 className="font-montserrat-semibold mb-4">
                  Assigned Worker(s)
                </h4>
                <div className="space-y-3">
                  {shiftTypeSelection === "multiple" ? (
                    <>
                      {formData.workerIds?.map((workerId) => {
                        const worker = workers.find(
                          (w) => w.workerId._id === workerId
                        );
                        if (!worker) return null;
                        return (
                          <div
                            key={workerId}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={getWorkerProfileImage(worker.workerId)}
                              />
                              <AvatarFallback className="bg-primary-100 text-primary">
                                {getWorkerInitials(worker.workerId)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-montserrat-semibold text-sm">
                                {getWorkerDisplayName(worker.workerId)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {formData.workerId &&
                        (() => {
                          const worker = workers.find(
                            (w) => w.workerId._id === formData.workerId
                          );
                          if (!worker) return null;
                          return (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={getWorkerProfileImage(worker.workerId)}
                                />
                                <AvatarFallback className="bg-primary-100 text-primary">
                                  {getWorkerInitials(worker.workerId)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-montserrat-semibold text-sm">
                                  {getWorkerDisplayName(worker.workerId)}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={step === 1 ? () => onOpenChange(false) : handleBack}
            disabled={
              createShiftMutation.isPending || createRoutineMutation.isPending
            }
          >
            <AltArrowLeft className="w-5 h-5 mr-2" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep()}
              className="gap-2"
            >
              Next
              <AltArrowRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={
                createShiftMutation.isPending || createRoutineMutation.isPending
              }
              className="gap-2"
            >
              {createShiftMutation.isPending ||
              createRoutineMutation.isPending ? (
                <>
                  <Refresh className="w-5 h-5 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Create Shift
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
