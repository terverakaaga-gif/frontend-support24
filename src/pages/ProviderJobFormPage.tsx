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
import { useGetJobById, useCreateJob, useUpdateJob } from "@/hooks/useJobHooks";
import {
  CreateJobRequest,
  UpdateJobRequest,
  JobCompetencies,
} from "@/api/services/jobService";
import { Spinner } from "@/components/Spinner";
import ErrorDisplay from "@/components/ErrorDisplay";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import Loader from "@/components/Loader";

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
  jobRole: string;
  location: string;
  price: string;
  jobType: string;
  status: string;
  jobDescription: string;
  keyResponsibilities: string;
  requiredCompetencies: JobCompetencies;
  additionalNote: string;
  stateId: string;
  regionId: string;
  serviceAreaIds: string[];
}

const jobRoleOptions = [
  { value: "Support Worker", label: "Support Worker" },
  { value: "Youth Worker", label: "Youth Worker" },
  { value: "Nursing Assistant", label: "Nursing Assistant" },
];

const competencyOptions = [
  { id: "rightToWorkInAustralia", label: "Right to Work in Australia" },
  { id: "ndisWorkerScreeningCheck", label: "NDIS Worker Screening Check" },
  { id: "wwcc", label: "Working with Children Check" },
  { id: "policeCheck", label: "Police Check" },
  { id: "firstAid", label: "First Aid Certified" },
  { id: "cpr", label: "CPR Certified" },
  { id: "ahpraRegistration", label: "AHPRA Registration" },
  {
    id: "professionalIndemnityInsurance",
    label: "Professional Indemnity Insurance",
  },
  { id: "covidVaccinationStatus", label: "COVID-19 Vaccination" },
];

const jobTypeOptions = [
  { value: "fullTime", label: "Full-time" },
  { value: "partTime", label: "Part-time" },
  { value: "casual", label: "Casual" },
  { value: "contract", label: "Contract" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
];

export default function ProviderJobFormPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { jobId } = useParams();
  const isEditMode = !!jobId;

  // API hooks
  const {
    data: existingJob,
    isLoading: isLoadingJob,
    error: jobError,
  } = useGetJobById(jobId);
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();

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

  // Form state
  const [formData, setFormData] = useState<JobFormData>({
    jobRole: "",
    location: "",
    price: "",
    jobType: "",
    status: "active",
    jobDescription: "",
    keyResponsibilities: "",
    requiredCompetencies: {},
    additionalNote: "",
    stateId: "",
    regionId: "",
    serviceAreaIds: [],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof JobFormData, string>>
  >({});

  // Load existing job data in edit mode
  useEffect(() => {
    if (isEditMode && existingJob) {
      setFormData({
        jobRole: existingJob.jobRole,
        location: existingJob.location,
        price: String(existingJob.price),
        jobType: existingJob.jobType,
        status: existingJob.status,
        jobDescription: existingJob.jobDescription,
        keyResponsibilities: existingJob.keyResponsibilities || "",
        requiredCompetencies: existingJob.requiredCompetencies,
        additionalNote: existingJob.additionalNote || "",
        stateId: (existingJob as any).stateId || "",
        regionId: (existingJob as any).regionId || "",
        serviceAreaIds: (existingJob as any).serviceAreaIds || [],
      });
      setAddressInputValue(existingJob.location);
      if ((existingJob as any).stateId) {
        setSelectedStateId((existingJob as any).stateId);
      }
      if ((existingJob as any).regionId) {
        setSelectedRegionId((existingJob as any).regionId);
      }
    }
  }, [isEditMode, existingJob]);

  // Sync selected state/region with form data
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

  // Update regionId when region changes
  useEffect(() => {
    if (selectedRegionId !== formData.regionId) {
      setFormData((prev) => ({
        ...prev,
        regionId: selectedRegionId,
        serviceAreaIds: [],
      }));
    }
  }, [selectedRegionId]);

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

  const handleCompetencyToggle = (competencyId: keyof JobCompetencies) => {
    setFormData((prev) => ({
      ...prev,
      requiredCompetencies: {
        ...prev.requiredCompetencies,
        [competencyId]: !prev.requiredCompetencies[competencyId],
      },
    }));
  };

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

  const handleServiceAreaToggle = (areaId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreaIds: prev.serviceAreaIds.includes(areaId)
        ? prev.serviceAreaIds.filter((id) => id !== areaId)
        : [...prev.serviceAreaIds, areaId],
    }));
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

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.jobRole.trim()) {
      newErrors.jobRole = "Job role is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid hourly rate";
    }

    if (!formData.jobType) {
      newErrors.jobType = "Job type is required";
    }

    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required";
    }

    if (!formData.stateId) {
      newErrors.stateId = "State is required";
    }

    if (!formData.regionId) {
      newErrors.regionId = "Region is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditMode && jobId) {
        const jobData: any = {
          jobRole: formData.jobRole,
          jobDescription: formData.jobDescription,
          keyResponsibilities: formData.keyResponsibilities || undefined,
          requiredCompetencies: formData.requiredCompetencies,
          location: formData.location,
          price: parseFloat(formData.price),
          jobType: formData.jobType as any,
          additionalNote: formData.additionalNote || undefined,
          status: formData.status as any,
          stateId: formData.stateId,
          regionId: formData.regionId,
          serviceAreaIds: formData.serviceAreaIds,
        };

        await updateJobMutation.mutateAsync({
          jobId,
          data: jobData,
        });

        toast.success("Job listing updated successfully!");
        navigate("/provider/jobs");
      } else {
        const jobData: any = {
          jobRole: formData.jobRole,
          jobDescription: formData.jobDescription,
          keyResponsibilities: formData.keyResponsibilities || undefined,
          requiredCompetencies: formData.requiredCompetencies,
          location: formData.location,
          price: parseFloat(formData.price),
          jobType: formData.jobType as any,
          additionalNote: formData.additionalNote || undefined,
          stateId: formData.stateId,
          regionId: formData.regionId,
          serviceAreaIds: formData.serviceAreaIds,
        };

        await createJobMutation.mutateAsync(jobData);

        toast.success("Job listing created successfully!");
        navigate("/provider/jobs");
      }
    } catch (error) {
      console.error("Failed to submit job:", error);
    }
  };

  if (isLoadingJob && isEditMode) {
    return <Loader />;
  }

  if (jobError && isEditMode) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <ErrorDisplay message="Failed to load job" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <GeneralHeader
        showBackButton
        stickyTop={false}
        title={isEditMode ? "Edit Job Listing" : "Create Job Listing"}
        subtitle=""
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/provider/profile")}
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        {/* Job Role */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
            Job Role
          </Label>
          <Select
            value={formData.jobRole}
            onValueChange={(value) => handleSelectChange("jobRole", value)}
          >
            <SelectTrigger className={errors.jobRole ? "border-red-500" : ""}>
              <SelectValue placeholder="Select job role" />
            </SelectTrigger>
            <SelectContent>
              {jobRoleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.jobRole && (
            <p className="text-xs text-red-600 mt-1">{errors.jobRole}</p>
          )}
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <Label
            htmlFor="jobDescription"
            className="text-sm font-semibold text-gray-700 mb-2 block"
          >
            Job Description
          </Label>
          <Textarea
            id="jobDescription"
            name="jobDescription"
            placeholder="Describe the job role, requirements, and expectations..."
            value={formData.jobDescription}
            onChange={handleInputChange}
            rows={6}
            className={errors.jobDescription ? "border-red-500" : ""}
          />
          {errors.jobDescription && (
            <p className="text-xs text-red-600 mt-1">{errors.jobDescription}</p>
          )}
        </div>

        {/* Key Responsibilities */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
            Key Responsibilities
          </Label>
          <div className="quill-wrapper">
            <ReactQuill
              theme="snow"
              value={formData.keyResponsibilities}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, keyResponsibilities: value }))
              }
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ align: [] }],
                  ["link"],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "list",
                "bullet",
                "align",
                "link",
              ]}
              placeholder="Describe the key responsibilities and duties..."
            />
          </div>
        </div>

        {/* Service Location Section */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <Magnifer className="h-5 w-5 text-primary" />
            <Label className="text-sm font-semibold text-gray-900">
              Service Location
            </Label>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Select the state and region where this job is located.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State Selection */}
            <div>
              <Label className="text-sm mb-2 block">State *</Label>
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
              <Label className="text-sm mb-2 block">Region *</Label>
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
        </div>

        {/* Location with Google Places Autocomplete */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
            Specific Location/Address
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

        {/* Service Areas */}
        {selectedRegionId && (
          <div className="mb-6">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Service Areas
            </Label>
            <p className="text-xs text-gray-500 mb-3">
              Select the specific areas where this position will provide
              services
            </p>
            {isLoadingServiceAreas ? (
              <div className="flex items-center justify-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-200">
                Loading service areas...
              </div>
            ) : serviceAreas.length > 0 ? (
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
                          : "border-gray-200 hover:border-primary/50 hover:bg-gray-50 bg-white"
                      )}
                    >
                      <span className="text-sm font-medium">{area.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-200">
                No service areas available for this region
              </div>
            )}
          </div>
        )}

        {/* Price, Job Type, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label
              htmlFor="price"
              className="text-sm font-semibold text-gray-700 mb-2 block"
            >
              Price ($)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="35.50"
              value={formData.price}
              onChange={handleInputChange}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-xs text-red-600 mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Job Type
            </Label>
            <Select
              value={formData.jobType}
              onValueChange={(value) => handleSelectChange("jobType", value)}
            >
              <SelectTrigger className={errors.jobType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.jobType && (
              <p className="text-xs text-red-600 mt-1">{errors.jobType}</p>
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
                <SelectValue placeholder="Select status" />
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
        </div>

        {/* Required Competencies */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-gray-700 mb-3 block">
            Required Competencies
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {competencyOptions.map((competency) => (
              <div key={competency.id} className="flex items-center space-x-2">
                <Checkbox
                  id={competency.id}
                  checked={
                    formData.requiredCompetencies[
                      competency.id as keyof JobCompetencies
                    ] === true
                  }
                  onCheckedChange={() =>
                    handleCompetencyToggle(
                      competency.id as keyof JobCompetencies
                    )
                  }
                />
                <label
                  htmlFor={competency.id}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {competency.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mb-6">
          <Label
            htmlFor="additionalNote"
            className="text-sm font-semibold text-gray-700 mb-2 block"
          >
            Additional Notes
          </Label>
          <Textarea
            id="additionalNote"
            name="additionalNote"
            placeholder="Any additional information, special requirements, or notes..."
            value={formData.additionalNote}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={createJobMutation.isPending || updateJobMutation.isPending}
          className="w-full bg-primary hover:bg-primary/90 h-12"
        >
          {createJobMutation.isPending || updateJobMutation.isPending
            ? "Submitting..."
            : isEditMode
            ? "Update Job Listing"
            : "Create Job Listing"}
        </Button>
      </form>

      {/* Custom styles for ReactQuill */}
      <style>
        {`
          .quill-wrapper .ql-toolbar {
            border: 1px solid #d1d5db;
            border-bottom: none;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
          }

          .quill-wrapper .ql-container {
            border: 1px solid #d1d5db;
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }

          .quill-wrapper .ql-editor {
            min-height: 150px;
          }

          .quill-wrapper .ql-editor.ql-blank::before {
            font-style: normal;
            color: #9ca3af;
          }

          .quill-wrapper .ql-toolbar.ql-snow {
            border-color: #d1d5db;
          }

          .quill-wrapper .ql-container.ql-snow {
            border-color: #d1d5db;
          }

          .quill-wrapper .ql-editor:focus {
            outline: none;
          }

          .quill-wrapper:focus-within .ql-toolbar,
          .quill-wrapper:focus-within .ql-container {
            border-color: #008cff;
            box-shadow: 0 0 0 2px rgba(0, 140, 255, 0.1);
          }
        `}
      </style>
    </div>
  );
}
