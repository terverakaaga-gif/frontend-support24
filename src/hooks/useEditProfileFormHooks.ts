import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { EUserRole, Participant, SupportWorker } from "@/types/user.types";
import { EditProfileFormData } from "@/types/edit-profile";
import { toast } from "sonner";
import authService from "@/api/services/authService";

export function useEditProfileForm() {
  const { data: profileData, isLoading, isError, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState<EditProfileFormData>({});
  const [originalData, setOriginalData] = useState<EditProfileFormData>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // State for adding new items
  const [newLanguage, setNewLanguage] = useState("");
  const [newExperience, setNewExperience] = useState({
    title: "",
    organization: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  
  // Resume file state
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const userRole = profileData?.user?.role;
  const isParticipant = userRole === EUserRole.PARTICIPANT;

  // Initialize form data from profile data
  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      setFormData(profileData as unknown as EditProfileFormData);
      setOriginalData(profileData as unknown as EditProfileFormData);
    }
  }, [profileData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  // Array Logic
  const addItem = (field: string, value: string) => {
    if (value.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()],
      }));
    }
  };

  const removeItem = (field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field]?.filter((_: any, i: number) => i !== index),
    }));
  };

  // Experience Logic
  const addExperience = () => {
    if (newExperience.title && newExperience.organization) {
      setFormData((prev: any) => ({
        ...prev,
        experience: [...(prev.experience || []), { ...newExperience }],
      }));
      setNewExperience({ title: "", organization: "", startDate: "", endDate: "", description: "" });
    }
  };

  const removeExperience = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      experience: prev.experience?.filter((_: any, i: number) => i !== index),
    }));
  };

  const saveCurrentStep = async () => {
    try {
      // If there's a new resume file, upload it first
      let resumeUrl = formData.resume;
      
      if (resumeFile) {
        toast.loading("Uploading resume...", { id: "resume-upload" });
        const uploadResponse = await authService.uploadResume(resumeFile);
        resumeUrl = uploadResponse.user;
        toast.success("Resume uploaded successfully", { id: "resume-upload" });
      }
      
      // Transform formData to match UpdateProfileData type
      const updateData = {
        ...formData,
        resume: resumeUrl,
        skills: formData.skills as any, // Cast skills to match ServiceType[]
      };
      
      await updateProfileMutation.mutateAsync(updateData);
      
      // Clear resume file after successful save
      if (resumeFile) {
        setResumeFile(null);
      }
      
      toast.success("Saved!");
      return true;
    } catch(e: any) {
      toast.error(e.response?.data?.message || "Failed to save");
      return false;
    }
  };

  return {
    formData,
    isParticipant,
    isLoading,
    isError,
    error,
    validationErrors,
    handleInputChange,
    handleNestedChange,
    addItem,
    removeItem,
    saveCurrentStep,
    setValidationErrors,
    isPending: updateProfileMutation.isPending,
    // Exports for dynamic lists
    newLanguage, 
    setNewLanguage,
    newExperience,
    setNewExperience,
    addExperience,
    removeExperience,
    // Resume state
    resumeFile,
    setResumeFile
  };
}