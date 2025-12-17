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
      console.log('=== Profile Data Received ===', profileData);
      
      // Extract user data from the nested structure
      const userData = profileData.user || profileData;
      console.log('=== User Data ===', userData);
      
      // Transform the data to match form expectations
      const transformedData: any = { ...userData };
      
      // Transform supportNeeds from objects to array of IDs
      if (transformedData.supportNeeds && Array.isArray(transformedData.supportNeeds)) {
        console.log('Original supportNeeds:', transformedData.supportNeeds);
        transformedData.supportNeeds = transformedData.supportNeeds.map((item: any) => 
          typeof item === 'object' ? item._id : item
        );
        console.log('Transformed supportNeeds:', transformedData.supportNeeds);
      }
      
      // Transform skills from objects to array of IDs
      if (transformedData.skills && Array.isArray(transformedData.skills)) {
        console.log('Original skills:', transformedData.skills);
        transformedData.skills = transformedData.skills.map((item: any) => 
          typeof item === 'object' ? item._id : item
        );
        console.log('Transformed skills:', transformedData.skills);
      }
      
      // Transform shiftRates to extract just the ID from rateTimeBandId
      if (transformedData.shiftRates && Array.isArray(transformedData.shiftRates)) {
        console.log('Original shiftRates:', transformedData.shiftRates);
        transformedData.shiftRates = transformedData.shiftRates.map((rate: any) => ({
          rateTimeBandId: typeof rate.rateTimeBandId === 'object' ? rate.rateTimeBandId._id : rate.rateTimeBandId,
          hourlyRate: rate.hourlyRate
        }));
        console.log('Transformed shiftRates:', transformedData.shiftRates);
      }
      
      console.log('=== Final Transformed Data ===', transformedData);
      setFormData(transformedData as EditProfileFormData);
      setOriginalData(transformedData as EditProfileFormData);
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

  // Array Logic - supports both value-based (languages) and ID-based (supportNeeds, skills) arrays
  const addItem = (field: string, value: string) => {
    if (value && value.trim && value.trim()) {
      setFormData((prev: any) => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()],
      }));
    } else if (value) {
      // For ID-based arrays (supportNeeds, skills)
      setFormData((prev: any) => ({
        ...prev,
        [field]: [...(prev[field] || []), value],
      }));
    }
  };

  const removeItem = (field: string, indexOrId: number | string) => {
    setFormData((prev: any) => {
      const currentArray = prev[field] || [];
      
      // If indexOrId is a number, treat as index
      if (typeof indexOrId === 'number') {
        return {
          ...prev,
          [field]: currentArray.filter((_: any, i: number) => i !== indexOrId),
        };
      }
      
      // If indexOrId is a string, treat as ID to remove
      return {
        ...prev,
        [field]: currentArray.filter((item: any) => item !== indexOrId),
      };
    });
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