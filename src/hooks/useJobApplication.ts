import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useApplyForJob } from "@/hooks/useJobHooks";
import { UploadedFile } from "@/components/ui/FileDropZone";
import { ApplicationFormData, ApplicationStep } from "@/types/job-application";

export function useJobApplication(jobId: string, onSubmitSuccess: () => void) {
  const { user } = useAuth();
  const applyForJobMutation = useApplyForJob();

  const [step, setStep] = useState<ApplicationStep>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    resume: undefined,
  });

  // Initialize with user data
  useEffect(() => {
    if (user) {
      const location =
        typeof user.address === "string"
          ? user.address
          : user.address
          ? `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.country} ${user.address.postalCode}`.trim()
          : "";

      setFormData({
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email || "",
        phoneNumber: user.phone || "",
        location,
        resume: undefined,
      });
    }
  }, [user]);

  const requiredDocuments = [
    {
      name: "Resume",
      uploaded: attachments.some(
        (f) =>
          f.file.name.toLowerCase().includes("resume") ||
          f.file.name.toLowerCase().includes("cv")
      ),
    },
    {
      name: "Cover Letter",
      uploaded: attachments.some((f) =>
        f.file.name.toLowerCase().includes("cover")
      ),
    },
  ];

  const handleSubmit = async () => {
      setIsSubmitting(true);
    try {
        const resumeFile = attachments.find(
          (f) =>
            f.file.name.length > 0
        );
  
        if (!resumeFile) {
          toast.error("Please upload a file");
          setIsSubmitting(false);
          return;
        }
  
        // Prepare FormData
        toast.loading("Submitting application...", { id: "application-process" });
        const data = new FormData();
        data.append("fullName", formData.fullName);
        data.append("email", formData.email);
        data.append("phone", formData.phoneNumber);
        data.append("location", formData.location);
  
        // Append resume as File object
        data.append("resume", resumeFile.file);
  
        // Submit Application
        await applyForJobMutation.mutateAsync({ jobId, formData: data });
  
        toast.success("Application submitted successfully!", {
          id: "application-process",
        });
        setStep("success");
  
        // Cleanup after delay
        setTimeout(() => {
          onSubmitSuccess();
          setStep("form");
          setAttachments([]);
          setIsSubmitting(false);
        }, 2000);

      // Validation: Resume is mandatory
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to submit application",
        { id: "application-process" }
      );
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof ApplicationFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    step,
    setStep,
    formData,
    handleInputChange,
    attachments,
    setAttachments,
    isSubmitting,
    handleSubmit,
    requiredDocuments,
    resetForm: () => {
      setStep("form");
      setAttachments([]);
    },
  };
}
