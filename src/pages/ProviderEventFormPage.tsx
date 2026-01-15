import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AltArrowLeft,
  CloseCircle,
  UploadMinimalistic,
  Calendar as CalendarIcon,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { FileDropZone, UploadedFile } from "@/components/ui/FileDropZone";
import { CustomDateTimePicker } from "@/components/ui/CustomDateTimePicker";
import { useGetEventById, useCreateEvent, useUpdateEvent } from "@/hooks/useEventHooks";



interface EventFormData {
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  location: string;
  description: string;
  image: File | null;
}

export default function ProviderEventFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eventId } = useParams();
  const isEditMode = !!eventId;

  const { data: eventData, isLoading: isLoadingEvent } = useGetEventById(eventId);

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    startDate: undefined,
    endDate: undefined,
    location: "",
    description: "",
    image: null,
  });

  // populate form when editing
  useEffect(() => {
    if (isEditMode && eventData) {
      const startDate = eventData.eventStartDate ? new Date(eventData.eventStartDate) : undefined;
      const endDate = eventData.eventEndDate ? new Date(eventData.eventEndDate) : undefined;

      // Apply times if available
      if (startDate && eventData.eventStartTime) {
        const [hours, minutes] = eventData.eventStartTime.split(':');
        startDate.setHours(parseInt(hours), parseInt(minutes));
      }
      if (endDate && eventData.eventEndTime) {
        const [hours, minutes] = eventData.eventEndTime.split(':');
        endDate.setHours(parseInt(hours), parseInt(minutes));
      }

      setFormData({
        title: eventData.eventName || "",
        startDate,
        endDate,
        location: eventData.eventLocation || "",
        description: eventData.eventDescr || "",
        image: null,
      });
    }
  }, [isEditMode, eventData]);

  const [imageFiles, setImageFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EventFormData, string>>
  >({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof EventFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImageFiles([]);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date and time is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date and time is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate >= formData.endDate
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Build form data for multipart submission
    const fd = new FormData();
    fd.append("eventName", formData.title);
    fd.append("eventDescr", formData.description);
    if (formData.location) fd.append("eventLocation", formData.location);

    if (formData.startDate) {
      // Extract date and time separately
      const startDateStr = formData.startDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const startTimeStr = formData.startDate.toTimeString().slice(0, 5); // HH:MM
      fd.append("eventStartDate", startDateStr);
      fd.append("eventStartTime", startTimeStr);
    }

    if (formData.endDate) {
      // Extract date and time separately
      const endDateStr = formData.endDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const endTimeStr = formData.endDate.toTimeString().slice(0, 5); // HH:MM
      fd.append("eventEndDate", endDateStr);
      fd.append("eventEndTime", endTimeStr);
    }

    if (imageFiles && imageFiles.length > 0) {
      const f = imageFiles[0].file as File | undefined;
      if (f) {
        fd.append("eventImage", f);
      }
    }

    if (isEditMode && eventId) {
      updateEventMutation.mutate({ eventId, formData: fd }, {
        onSuccess: () => {
          navigate("/provider/events");
        },
      });
    } else {
      createEventMutation.mutate(fd, {
        onSuccess: () => {
          navigate("/provider/events");
        },
      });
    }
  };

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      {/* Header */}
        <GeneralHeader
        showBackButton
          stickyTop={false}
          title={isEditMode ? "Edit Event" : "Create Event"}
          subtitle=""
          user={user}
          onLogout={() => {}}
          onViewProfile={() => navigate("/provider/profile")}
        />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        {/* Image Upload */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
            Upload Image Event
          </Label>
          <FileDropZone
            files={imageFiles}
            onFilesChange={setImageFiles}
            maxFiles={1}
            maxSizeMB={5}
            acceptedTypes={["image/png", "image/jpeg"]}
            showProgress={false}
            title="Drop your image here or"
          />
        </div>

        {/* Event Name */}
        <div className="mb-6">
          <Label
            htmlFor="title"
            className="text-sm font-semibold text-gray-700 mb-2 block"
          >
            Event Name
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter name here"
            value={formData.title}
            onChange={handleInputChange}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-xs text-red-600 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <CustomDateTimePicker
              label="Event Start Date & Time"
              date={formData.startDate}
              setDate={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  startDate: date,
                }))
              }
            />
            {errors.startDate && (
              <p className="text-xs text-red-600 mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <CustomDateTimePicker
              label="Event End Date & Time"
              date={formData.endDate}
              setDate={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  endDate: date,
                }))
              }
              minDate={formData.startDate}
            />
            {errors.endDate && (
              <p className="text-xs text-red-600 mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <Label
            htmlFor="location"
            className="text-sm font-semibold text-gray-700 mb-2 block"
          >
            Event Location
          </Label>
          <Input
            id="location"
            name="location"
            placeholder="Provide name here..."
            value={formData.location}
            onChange={handleInputChange}
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="text-xs text-red-600 mt-1">{errors.location}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <Label
            htmlFor="description"
            className="text-sm font-semibold text-gray-700 mb-2 block"
          >
            Event Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Provide a detailed description here"
            value={formData.description}
            onChange={handleInputChange}
            rows={8}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-xs text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 h-12"
          disabled={createEventMutation.isPending || updateEventMutation.isPending}
        >
          { (createEventMutation.isPending || updateEventMutation.isPending)
            ? "Saving..."
            : (isEditMode ? "Update Event" : "Post") }
        </Button>
      </form>
    </div>
  );
}
