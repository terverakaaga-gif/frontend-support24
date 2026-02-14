import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGetJobById, useCreateJob, useUpdateJob } from "@/hooks/useJobHooks";
import { JobFormData, INITIAL_FORM_DATA } from "@/types/job";

export function useJobForm() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const isEditMode = !!jobId;

  // API Hooks
  const { data: existingJobData, isLoading: isLoadingJob, error: jobError } = useGetJobById(jobId);
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();

  // Form State
  const [formData, setFormData] = useState<JobFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});
  const [addressInputValue, setAddressInputValue] = useState("");

  // Load Data for Edit Mode
  useEffect(() => {
    if (isEditMode && existingJobData) {
      // Extract the job from JobWithSaveStatus
      const existingJob = existingJobData.job;
      
      setFormData({
        jobRole: existingJob.jobRole || "",
        location: existingJob.location || "",
        price: String(existingJob.price || ""),
        jobType: existingJob.jobType || "fullTime",
        status: existingJob.status || "draft",
        jobDescription: existingJob.jobDescription || "",
        keyResponsibilities: existingJob.keyResponsibilities || "",
        requiredCompetencies: existingJob.requiredCompetencies || {},
        additionalNote: existingJob.additionalNote || "",
        stateId: (existingJob as any).stateId || "",
        regionId: (existingJob as any).regionId || "",
        serviceAreaIds: (existingJob as any).serviceAreaIds || [],
      });
      setAddressInputValue(existingJob.location || "");
    }
  }, [isEditMode, existingJobData]);

  // Handlers
  const handleChange = (field: keyof JobFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleCompetencyToggle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredCompetencies: {
        ...prev.requiredCompetencies,
        [id]: !prev.requiredCompetencies[id as keyof typeof prev.requiredCompetencies],
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};
    if (!formData.jobRole.trim()) newErrors.jobRole = "Job role is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.price.trim() || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Valid hourly rate is required";
    }
    if (!formData.jobType) newErrors.jobType = "Job type is required";
    if (!formData.jobDescription.trim()) newErrors.jobDescription = "Description is required";
    if (!formData.stateId) newErrors.stateId = "State is required";
    if (!formData.regionId) newErrors.regionId = "Region is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload: any = {
      ...formData,
      price: parseFloat(formData.price),
      // Clean up undefined fields if necessary
      keyResponsibilities: formData.keyResponsibilities || undefined,
      additionalNote: formData.additionalNote || undefined,
    };

    try {
      if (isEditMode && jobId) {
        await updateJobMutation.mutateAsync({ jobId, data: payload });
        toast.success("Job updated successfully!");
      } else {
        await createJobMutation.mutateAsync(payload);
        toast.success("Job created successfully!");
      }
      // Return to previous page
      navigate(-1);
    } catch (error) {
      console.error("Job submission failed:", error);
      toast.error("Failed to save job listing.");
    }
  };

  return {
    isEditMode,
    isLoading: isLoadingJob && isEditMode,
    isSubmitting: createJobMutation.isPending || updateJobMutation.isPending,
    error: jobError,
    formData,
    errors,
    addressInputValue,
    setAddressInputValue,
    handleChange,
    handleCompetencyToggle,
    handleSubmit,
  };
}