import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AltArrowLeft,
  CloseCircle,
  UploadMinimalistic,
  Calendar as CalendarIcon,
  ClockCircle,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { FileDropZone, UploadedFile } from "@/components/ui/FileDropZone";

// Mock event data for edit mode
const mockEventData = {
  id: 1,
  title: "Local City Tour 2025",
  startDate: "2025-11-22",
  endDate: "2025-11-29",
  startTime: "08:00",
  endTime: "12:00",
  location: "Albion Park, AU",
  description:
    "Join us for an exciting city tour experience where participants explore local attractions.",
  image: null,
};

interface EventFormData {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  image: File | null;
}

export default function ProviderEventFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eventId } = useParams();
  const isEditMode = !!eventId;

  // Initialize form with mock data if in edit mode
  const [formData, setFormData] = useState<EventFormData>(
    isEditMode
      ? {
          title: mockEventData.title,
          startDate: mockEventData.startDate,
          endDate: mockEventData.endDate,
          startTime: mockEventData.startTime,
          endTime: mockEventData.endTime,
          location: mockEventData.location,
          description: mockEventData.description,
          image: null,
        }
      : {
          title: "",
          startDate: "",
          endDate: "",
          startTime: "",
          endTime: "",
          location: "",
          description: "",
          image: null,
        }
  );

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
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Handle form submission
    console.log("Form data:", formData);

    if (isEditMode) {
      console.log("Updating event:", eventId);
      // Add your update logic here
    } else {
      console.log("Creating new event");
      // Add your create logic here
    }

    // Navigate back to events list
    navigate("/provider/events");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
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
            <Label
              htmlFor="startTime"
              className="text-sm font-semibold text-gray-700 mb-2 block"
            >
              Event Start Time
            </Label>
            <div className="relative">
              <Input
                id="startTime"
                name="startTime"
                type="time"
                placeholder="Enter start time"
                value={formData.startTime}
                onChange={handleInputChange}
                className={errors.startTime ? "border-red-500" : ""}
              />
              <ClockCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.startTime && (
              <p className="text-xs text-red-600 mt-1">{errors.startTime}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="endTime"
              className="text-sm font-semibold text-gray-700 mb-2 block"
            >
              Event End Time
            </Label>
            <div className="relative">
              <Input
                id="endTime"
                name="endTime"
                type="time"
                placeholder="Enter end time"
                value={formData.endTime}
                onChange={handleInputChange}
                className={errors.endTime ? "border-red-500" : ""}
              />
              <ClockCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.endTime && (
              <p className="text-xs text-red-600 mt-1">{errors.endTime}</p>
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

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label
              htmlFor="startDate"
              className="text-sm font-semibold text-gray-700 mb-2 block"
            >
              Event Start Date
            </Label>
            <div className="relative">
              <Input
                id="startDate"
                name="startDate"
                type="date"
                placeholder="Enter start date"
                value={formData.startDate}
                onChange={handleInputChange}
                className={errors.startDate ? "border-red-500" : ""}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.startDate && (
              <p className="text-xs text-red-600 mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="endDate"
              className="text-sm font-semibold text-gray-700 mb-2 block"
            >
              Event End Date
            </Label>
            <div className="relative">
              <Input
                id="endDate"
                name="endDate"
                type="date"
                placeholder="Enter end date"
                value={formData.endDate}
                onChange={handleInputChange}
                className={errors.endDate ? "border-red-500" : ""}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.endDate && (
              <p className="text-xs text-red-600 mt-1">{errors.endDate}</p>
            )}
          </div>
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
        >
          {isEditMode ? "Update Event" : "Post"}
        </Button>
      </form>
    </div>
  );
}
