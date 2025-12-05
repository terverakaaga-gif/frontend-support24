import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPoint, AddCircle, CloseSquare, Magnifer } from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { FileDropZone, UploadedFile } from "@/components/ui/FileDropZone";
import {
  useStates,
  useRegions,
  useServiceAreasByRegion,
} from "@/hooks/useLocationHooks";
import { useGetServiceTypes } from "@/hooks/useServiceTypeHooks";
import { cn } from "@/lib/utils";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { commonLanguages } from "@/constants/common-languages";

// Mock job data for edit mode
const mockJobData = {
  id: 1,
  workerName: "Sarah Johnson",
  title: "Support Worker Position",
  location: "Sydney, NSW 2000",
  hourlyRate: "35",
  availability: "full-time",
  status: "available",
  experience: "5",
  description:
    "Sarah is an experienced and compassionate support worker with over 5 years of dedicated service in the disability support sector. She is passionate about empowering individuals to live their best lives and achieve their personal goals.",
  skills: ["personalCare", "mobilityAssistance", "mealPrep", "transport"],
  qualifications: ["certIII", "certIV", "firstAid", "ndisCheck"],
  languages: ["English", "Mandarin"],
  stateId: "",
  regionId: "",
  serviceAreaIds: [],
  image: null,
};

interface JobFormData {
  title: string;
  location: string;
  hourlyRate: string;
  availability: string;
  status: string;
  experience: string;
  description: string;
  skills: string[];
  qualifications: string[];
  languages: string[];
  stateId: string;
  regionId: string;
  serviceAreaIds: string[];
}

const qualificationOptions = [
  { id: "certIII", label: "Certificate III in Individual Support" },
  { id: "certIV", label: "Certificate IV in Disability" },
  { id: "firstAid", label: "First Aid & CPR Certified" },
  { id: "manualHandling", label: "Manual Handling Certified" },
  { id: "ndisCheck", label: "NDIS Worker Screening Check" },
  { id: "wwcc", label: "Working with Children Check" },
  { id: "driversLicense", label: "Driver's License" },
  { id: "ownVehicle", label: "Own Vehicle" },
];

const availabilityOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "casual", label: "Casual" },
];

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];

export default function ProviderJobFormPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { jobId } = useParams();
  const isEditMode = !!jobId;

  // Location hooks
  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");

  const { data: regions = [], isLoading: isLoadingRegions } = useRegions(
    selectedStateId,
    !!selectedStateId
  );

  const { data: serviceAreas = [], isLoading: isLoadingServiceAreas } =
    useServiceAreasByRegion(selectedRegionId, !!selectedRegionId);

  // Service types hook
  const { data: serviceTypes = [], isLoading: isLoadingServiceTypes } =
    useGetServiceTypes();

  // Google Places Autocomplete
  const { placePredictions, getPlacePredictions } = usePlacesService({
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "",
    options: {
      types: ["address"],
      componentRestrictions: { country: "au" },
    },
  });

  const [showAddressPredictions, setShowAddressPredictions] = useState(false);
  const [addressInputValue, setAddressInputValue] = useState("");

  // Initialize form with mock data if in edit mode
  const [formData, setFormData] = useState<JobFormData>(
    isEditMode
      ? {
          title: mockJobData.title,
          location: mockJobData.location,
          hourlyRate: mockJobData.hourlyRate,
          availability: mockJobData.availability,
          status: mockJobData.status,
          experience: mockJobData.experience,
          description: mockJobData.description,
          skills: mockJobData.skills,
          qualifications: mockJobData.qualifications,
          languages: mockJobData.languages,
          stateId: mockJobData.stateId,
          regionId: mockJobData.regionId,
          serviceAreaIds: mockJobData.serviceAreaIds,
        }
      : {
          title: "",
          location: "",
          hourlyRate: "",
          availability: "",
          status: "available",
          experience: "",
          description: "",
          skills: [],
          qualifications: [],
          languages: [],
          stateId: "",
          regionId: "",
          serviceAreaIds: [],
        }
  );

  // File upload state
  const [profileImage, setProfileImage] = useState<UploadedFile[]>([]);
  const [newLanguage, setNewLanguage] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof JobFormData | "image", string>>
  >({});

  // Sync selected state/region with form data
  useEffect(() => {
    if (isEditMode && mockJobData.stateId) {
      setSelectedStateId(mockJobData.stateId);
      setSelectedRegionId(mockJobData.regionId);
      setAddressInputValue(mockJobData.location);
    }
  }, [isEditMode]);

  // Reset dependent fields when state changes
  useEffect(() => {
    if (selectedStateId !== formData.stateId) {
      setSelectedRegionId("");
      setFormData((prev) => ({
        ...prev,
        stateId: selectedStateId,
        regionId: "",
        serviceAreaIds: [],
      }));
    }
  }, [selectedStateId]);

  // Reset service areas when region changes
  useEffect(() => {
    if (selectedRegionId !== formData.regionId) {
      setFormData((prev) => ({
        ...prev,
        regionId: selectedRegionId,
        serviceAreaIds: [],
      }));
    }
  }, [selectedRegionId]);

  // Handle address input
  const handleAddressInputChange = (value: string) => {
    setAddressInputValue(value);
    setFormData((prev) => ({ ...prev, location: value }));

    if (value.trim().length > 2) {
      getPlacePredictions({ input: value });
      setShowAddressPredictions(true);
    } else {
      setShowAddressPredictions(false);
    }
  };

  const handleAddressSelect = (prediction: any) => {
    const selectedAddress = prediction.description;
    setAddressInputValue(selectedAddress);
    setFormData((prev) => ({ ...prev, location: selectedAddress }));
    setShowAddressPredictions(false);
  };

  // Close address dropdown on outside click
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof JobFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillToggle = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((s) => s !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  const handleQualificationToggle = (qualId: string) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.includes(qualId)
        ? prev.qualifications.filter((q) => q !== qualId)
        : [...prev.qualifications, qualId],
    }));
  };

  const handleServiceAreaToggle = (areaId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreaIds: prev.serviceAreaIds.includes(areaId)
        ? prev.serviceAreaIds.filter((id) => id !== areaId)
        : [...prev.serviceAreaIds, areaId],
    }));
  };

  const handleAddLanguage = () => {
    if (
      newLanguage.trim() &&
      !formData.languages.includes(newLanguage.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData | "image", string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.hourlyRate.trim()) {
      newErrors.hourlyRate = "Hourly rate is required";
    } else if (
      isNaN(Number(formData.hourlyRate)) ||
      Number(formData.hourlyRate) <= 0
    ) {
      newErrors.hourlyRate = "Please enter a valid hourly rate";
    }

    if (!formData.availability) {
      newErrors.availability = "Availability is required";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Bio/description is required";
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "Select at least one skill";
    }

    if (!formData.stateId) {
      newErrors.stateId = "Please select a state";
    }

    if (!formData.regionId) {
      newErrors.regionId = "Please select a region";
    }

    if (formData.serviceAreaIds.length === 0) {
      newErrors.serviceAreaIds = "Please select at least one service area";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const imageFile = profileImage.length > 0 ? profileImage[0].file : null;

    console.log("Form data:", { ...formData, image: imageFile });

    if (isEditMode) {
      console.log("Updating job listing:", jobId);
    } else {
      console.log("Creating new job listing");
    }

    navigate("/participant/provider/jobs");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <GeneralHeader
        showBackButton
        stickyTop={false}
        title={isEditMode ? "Edit Support Worker" : "Add Support Worker"}
        subtitle=""
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/participant/provider/profile")}
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        {/* Image Upload */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
            Profile Photo
          </Label>
          <FileDropZone
            files={profileImage}
            onFilesChange={setProfileImage}
            maxFiles={1}
            maxSizeMB={5}
            acceptedTypes={["image/png", "image/jpeg"]}
            showProgress={false}
            simulateUpload={false}
            title="Drop your photo here or"
            subtitle="File type: PNG + JPG, File limit: 5MB"
          />
          {errors.image && (
            <p className="text-xs text-red-600 mt-1">{errors.image}</p>
          )}
        </div>

        {/* Job Title */}
        <div className="mb-6">
          <Label
            htmlFor="title"
            className="text-sm font-semibold text-gray-700 mb-2 block"
          >
            Job Title
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Personal Care Support Needed"
            value={formData.title}
            onChange={handleInputChange}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-xs text-red-600 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <Label
            htmlFor="description"
            className="text-sm font-semibold text-gray-700 mb-2 block"
          >
            Job Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe what kind of support you need, your requirements, and any specific details..."
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-xs text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Location with Google Places Autocomplete */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
            Address
          </Label>
          <div id="address-autocomplete-container" className="relative">
            <div className="relative">
              <MapPoint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
              <Input
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
                className={cn("pl-10", errors.location ? "border-red-500" : "")}
                autoComplete="off"
              />
            </div>

            {/* Predictions Dropdown */}
            {showAddressPredictions && placePredictions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {placePredictions.map((prediction) => (
                  <div
                    key={prediction.place_id}
                    onClick={() => handleAddressSelect(prediction)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <MapPoint className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium truncate">
                          {prediction.structured_formatting?.main_text ||
                            prediction.description}
                        </p>
                        {prediction.structured_formatting?.secondary_text && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {prediction.structured_formatting.secondary_text}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.location && (
            <p className="text-xs text-red-600 mt-1">{errors.location}</p>
          )}
        </div>

        {/* Service Location Section */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <Magnifer className="h-5 w-5 text-primary" />
            <Label className="text-sm font-semibold text-gray-900">
              Service Location (Where this worker provides services)
            </Label>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Select the location where this support worker provides services.
            Participants in these areas will see this listing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* State Selection */}
            <div>
              <Label className="text-sm mb-2 block">State</Label>
              <Select
                value={selectedStateId}
                onValueChange={(value) => setSelectedStateId(value)}
                disabled={isLoadingStates}
              >
                <SelectTrigger
                  className={errors.stateId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select state..." />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state._id} value={state._id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.stateId && (
                <p className="text-xs text-red-600 mt-1">{errors.stateId}</p>
              )}
            </div>

            {/* Region Selection */}
            <div>
              <Label className="text-sm mb-2 block">Region</Label>
              <Select
                value={selectedRegionId}
                onValueChange={(value) => setSelectedRegionId(value)}
                disabled={!selectedStateId || isLoadingRegions}
              >
                <SelectTrigger
                  className={errors.regionId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select region..." />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region._id} value={region._id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.regionId && (
                <p className="text-xs text-red-600 mt-1">{errors.regionId}</p>
              )}
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <Label className="text-sm mb-2 block">Service Areas</Label>
            {selectedRegionId && !isLoadingServiceAreas ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {serviceAreas.map((area) => {
                  const isSelected = formData.serviceAreaIds.includes(area._id);
                  return (
                    <div
                      key={area._id}
                      onClick={() => handleServiceAreaToggle(area._id)}
                      className={cn(
                        "cursor-pointer p-3 rounded-lg border-2 transition-all text-center",
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-gray-200 hover:border-primary/50 hover:bg-gray-100 bg-white"
                      )}
                    >
                      <span className="text-sm font-medium">{area.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-gray-500 text-sm bg-white rounded-lg border border-gray-200">
                {!selectedRegionId
                  ? "Please select a region first"
                  : "Loading service areas..."}
              </div>
            )}
            {errors.serviceAreaIds && (
              <p className="text-xs text-red-600 mt-1">
                {errors.serviceAreaIds}
              </p>
            )}
          </div>
        </div>

        {/* Hourly Rate, Availability, Status, Experience */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Label
              htmlFor="hourlyRate"
              className="text-sm font-semibold text-gray-700 mb-2 block"
            >
              Hourly Rate ($)
            </Label>
            <Input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              placeholder="35"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              className={errors.hourlyRate ? "border-red-500" : ""}
            />
            {errors.hourlyRate && (
              <p className="text-xs text-red-600 mt-1">{errors.hourlyRate}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Availability
            </Label>
            <Select
              value={formData.availability}
              onValueChange={(value) =>
                handleSelectChange("availability", value)
              }
            >
              <SelectTrigger
                className={errors.availability ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.availability && (
              <p className="text-xs text-red-600 mt-1">{errors.availability}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="experience"
              className="text-sm font-semibold text-gray-700 mb-2 block"
            >
              Experience (years)
            </Label>
            <Input
              id="experience"
              name="experience"
              type="number"
              placeholder="5"
              value={formData.experience}
              onChange={handleInputChange}
              className={errors.experience ? "border-red-500" : ""}
            />
            {errors.experience && (
              <p className="text-xs text-red-600 mt-1">{errors.experience}</p>
            )}
          </div>
        </div>

        {/* Skills/Services */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">
            Skills & Services
          </Label>
          {errors.skills && (
            <p className="text-xs text-red-600 mb-2">{errors.skills}</p>
          )}
          {isLoadingServiceTypes ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {serviceTypes.map((service) => {
                const isSelected = formData.skills.includes(service._id);
                return (
                  <div
                    key={service._id}
                    onClick={() => handleSkillToggle(service._id)}
                    className={cn(
                      "cursor-pointer p-3 rounded-lg border-2 transition-all",
                      isSelected
                        ? "bg-primary border-primary text-white"
                        : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={isSelected}
                        className={isSelected ? "border-white" : ""}
                      />
                      <span className="text-sm font-medium">
                        {service.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Qualifications & Certifications - Two column layout */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">
            Qualifications & Certifications
          </Label>
          <p className="text-xs text-gray-500 mb-3">
            Select the qualifications this support worker holds
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {qualificationOptions.map((qual) => {
              const isSelected = formData.qualifications.includes(qual.id);
              return (
                <div
                  key={qual.id}
                  onClick={() => handleQualificationToggle(qual.id)}
                  className={cn(
                    "cursor-pointer p-3 rounded-lg border-2 transition-all",
                    isSelected
                      ? "bg-green-50 border-green-500"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      className={
                        isSelected
                          ? "border-green-500 data-[state=checked]:bg-green-500"
                          : ""
                      }
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-green-700" : "text-gray-700"
                      )}
                    >
                      {qual.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">
            Languages
          </Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.languages.map((lang) => (
              <span
                key={lang}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {lang}
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(lang)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <CloseSquare className="h-4 w-4" />
                </button>
              </span>
            ))}
            {formData.languages.length === 0 && (
              <span className="text-sm text-gray-400">
                No languages added yet
              </span>
            )}
          </div>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add a language"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddLanguage();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddLanguage}
              variant="outline"
              className="shrink-0"
            >
              <AddCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {commonLanguages
              .filter((lang) => !formData.languages.includes(lang))
              .map((language) => (
                <Button
                  key={language}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      languages: [...prev.languages, language],
                    }));
                  }}
                  className="h-8 px-3 text-xs border hover:text-white hover:bg-primary hover:border-gray-600 text-black"
                >
                  + {language}
                </Button>
              ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 h-12"
        >
          {isEditMode ? "Update Listing" : "Publish Listing"}
        </Button>
      </form>
    </div>
  );
}
