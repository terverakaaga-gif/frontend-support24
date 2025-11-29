import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CloseCircle,
  UploadMinimalistic,
  MapPoint,
  AddCircle,
  CloseSquare,
} from "@solar-icons/react";
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
  bio: "Sarah is an experienced and compassionate support worker...",
  skills: ["personalCare", "mobilityAssistance", "mealPrep", "transport"],
  qualifications: ["certIII", "certIV", "firstAid", "ndisCheck"],
  languages: ["English", "Mandarin"],
  serviceAreas: ["Sydney CBD", "Inner West"],
  image: null,
};

interface JobFormData {
  workerName: string;
  title: string;
  location: string;
  hourlyRate: string;
  availability: string;
  status: string;
  experience: string;
  bio: string;
  skills: string[];
  qualifications: string[];
  languages: string[];
  serviceAreas: string[];
  image: File | null;
}

const skillOptions = [
  { id: "personalCare", label: "Personal Care" },
  { id: "mobilityAssistance", label: "Mobility Assistance" },
  { id: "mealPrep", label: "Meal Preparation" },
  { id: "transport", label: "Transport" },
  { id: "medicationSupport", label: "Medication Support" },
  { id: "communityAccess", label: "Community Access" },
  { id: "socialSupport", label: "Social Support" },
  { id: "householdTasks", label: "Household Tasks" },
  { id: "behaviorSupport", label: "Behavior Support" },
  { id: "therapySupport", label: "Therapy Support" },
  { id: "respiteCare", label: "Respite Care" },
  { id: "overnightSupport", label: "Overnight Support" },
];

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
  const { user } = useAuth();
  const { jobId } = useParams();
  const isEditMode = !!jobId;

  // Initialize form with mock data if in edit mode
  const [formData, setFormData] = useState<JobFormData>(
    isEditMode
      ? {
          workerName: mockJobData.workerName,
          title: mockJobData.title,
          location: mockJobData.location,
          hourlyRate: mockJobData.hourlyRate,
          availability: mockJobData.availability,
          status: mockJobData.status,
          experience: mockJobData.experience,
          bio: mockJobData.bio,
          skills: mockJobData.skills,
          qualifications: mockJobData.qualifications,
          languages: mockJobData.languages,
          serviceAreas: mockJobData.serviceAreas,
          image: null,
        }
      : {
          workerName: "",
          title: "",
          location: "",
          hourlyRate: "",
          availability: "",
          status: "available",
          experience: "",
          bio: "",
          skills: [],
          qualifications: [],
          languages: [],
          serviceAreas: [],
          image: null,
        }
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState("");
  const [newServiceArea, setNewServiceArea] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

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

  const handleCheckboxToggle = (id: string, field: "skills" | "qualifications") => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter((item) => item !== id)
        : [...prev[field], id],
    }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
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

  const handleAddServiceArea = () => {
    if (newServiceArea.trim() && !formData.serviceAreas.includes(newServiceArea.trim())) {
      setFormData((prev) => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, newServiceArea.trim()],
      }));
      setNewServiceArea("");
    }
  };

  const handleRemoveServiceArea = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((a) => a !== area),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
        setErrors((prev) => ({
          ...prev,
          image: "File must be PNG or JPG",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.workerName.trim()) {
      newErrors.workerName = "Worker name is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.hourlyRate.trim()) {
      newErrors.hourlyRate = "Hourly rate is required";
    } else if (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = "Please enter a valid hourly rate";
    }

    if (!formData.availability) {
      newErrors.availability = "Availability is required";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio/description is required";
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "Select at least one skill";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("Form data:", formData);

    if (isEditMode) {
      console.log("Updating job listing:", jobId);
    } else {
      console.log("Creating new job listing");
    }

    navigate("/provider/jobs");
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
            Profile Photo
          </Label>

          {imagePreview ? (
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-6 right-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              >
                <CloseCircle className="h-5 w-5 text-red-600" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <UploadMinimalistic className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-sm text-gray-600 mb-2">
                  Drop and drop your file or{" "}
                  <label className="text-primary cursor-pointer hover:underline">
                    Browse
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-400">
                  File type: PNG + JPG, File limit: 5MB
                </p>
              </div>
            </div>
          )}
          {errors.image && (
            <p className="text-xs text-red-600 mt-1">{errors.image}</p>
          )}
        </div>

        {/* Worker Name and Job Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="workerName" className="text-sm font-semibold text-gray-700 mb-2 block">
              Worker Name
            </Label>
            <Input
              id="workerName"
              name="workerName"
              placeholder="e.g., Sarah Johnson"
              value={formData.workerName}
              onChange={handleInputChange}
              className={errors.workerName ? "border-red-500" : ""}
            />
            {errors.workerName && (
              <p className="text-xs text-red-600 mt-1">{errors.workerName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2 block">
              Job Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Support Worker Position"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <Label htmlFor="location" className="text-sm font-semibold text-gray-700 mb-2 block">
            Location
          </Label>
          <div className="relative">
            <Input
              id="location"
              name="location"
              placeholder="Sydney, NSW"
              value={formData.location}
              onChange={handleInputChange}
              className={errors.location ? "border-red-500 pr-10" : "pr-10"}
            />
            <MapPoint className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.location && (
            <p className="text-xs text-red-600 mt-1">{errors.location}</p>
          )}
        </div>

        {/* Hourly Rate, Availability, Status, Experience */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Label htmlFor="hourlyRate" className="text-sm font-semibold text-gray-700 mb-2 block">
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
              onValueChange={(value) => handleSelectChange("availability", value)}
            >
              <SelectTrigger className={errors.availability ? "border-red-500" : ""}>
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
            <Label htmlFor="experience" className="text-sm font-semibold text-gray-700 mb-2 block">
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

        {/* Bio/Description */}
        <div className="mb-6">
          <Label htmlFor="bio" className="text-sm font-semibold text-gray-700 mb-2 block">
            Bio / Description
          </Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Provide a detailed description of the support worker, their experience, and approach to care..."
            value={formData.bio}
            onChange={handleInputChange}
            rows={6}
            className={errors.bio ? "border-red-500" : ""}
          />
          {errors.bio && (
            <p className="text-xs text-red-600 mt-1">{errors.bio}</p>
          )}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">
            Skills & Services
          </Label>
          {errors.skills && (
            <p className="text-xs text-red-600 mb-2">{errors.skills}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {skillOptions.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-2">
                <Checkbox
                  id={skill.id}
                  checked={formData.skills.includes(skill.id)}
                  onCheckedChange={() => handleCheckboxToggle(skill.id, "skills")}
                />
                <label
                  htmlFor={skill.id}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {skill.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Qualifications */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">
            Qualifications & Certifications
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {qualificationOptions.map((qual) => (
              <div key={qual.id} className="flex items-center space-x-2">
                <Checkbox
                  id={qual.id}
                  checked={formData.qualifications.includes(qual.id)}
                  onCheckedChange={() => handleCheckboxToggle(qual.id, "qualifications")}
                />
                <label
                  htmlFor={qual.id}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {qual.label}
                </label>
              </div>
            ))}
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
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a language"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLanguage())}
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
        </div>

        {/* Service Areas */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">
            Service Areas
          </Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.serviceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full"
              >
                {area}
                <button
                  type="button"
                  onClick={() => handleRemoveServiceArea(area)}
                  className="text-primary hover:text-red-600"
                >
                  <CloseSquare className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a service area (e.g., Sydney CBD)"
              value={newServiceArea}
              onChange={(e) => setNewServiceArea(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddServiceArea())}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddServiceArea}
              variant="outline"
              className="shrink-0"
            >
              <AddCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
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