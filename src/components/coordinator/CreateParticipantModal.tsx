import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CloseCircle, GalleryAdd, ArrowRight, ArrowLeft } from "@solar-icons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CreateParticipantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "personal" | "contact" | "budget" | "additional";

interface ParticipantFormData {
  // Step 1: Personal Details
  profilePhoto: File | null;
  profilePhotoUrl: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ndisNumber: string;
  planStartDate: string;
  planEndDate: string;
  address: string;

  // Step 2: Primary Contact Details
  contactFullName: string;
  relationship: string;
  phoneNumber: string;
  email: string;

  // Step 3: Budget Allocation
  categories: Array<{ category: string; budget: string }>;
  totalBudget: string;
  planManagerName: string;
  planManagerEmail: string;

  // Step 4: Additional Information
  preferencesRequirement: string;
  goals: string;
  validationNote: string;
}

export function CreateParticipantModal({
  open,
  onOpenChange,
}: CreateParticipantModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [formData, setFormData] = useState<ParticipantFormData>({
    profilePhoto: null,
    profilePhotoUrl: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    ndisNumber: "",
    planStartDate: "",
    planEndDate: "",
    address: "",
    contactFullName: "",
    relationship: "",
    phoneNumber: "",
    email: "",
    categories: [{ category: "", budget: "" }],
    totalBudget: "",
    planManagerName: "",
    planManagerEmail: "",
    preferencesRequirement: "",
    goals: "",
    validationNote: "",
  });

  const steps = [
    { id: "personal", label: "Participant Personal Details", step: 1 },
    { id: "contact", label: "Primary Contact Details", step: 2 },
    { id: "budget", label: "Budget Allocation by Category", step: 3 },
    { id: "additional", label: "Additional Information", step: 4 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const currentStepData = steps[currentStepIndex];

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setCurrentStep("personal");
      setFormData({
        profilePhoto: null,
        profilePhotoUrl: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        ndisNumber: "",
        planStartDate: "",
        planEndDate: "",
        address: "",
        contactFullName: "",
        relationship: "",
        phoneNumber: "",
        email: "",
        categories: [{ category: "", budget: "" }],
        totalBudget: "",
        planManagerName: "",
        planManagerEmail: "",
        preferencesRequirement: "",
        goals: "",
        validationNote: "",
      });
    }
  }, [open]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload PNG, JPG, or PDF.");
        return;
      }

      // Check file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB.");
        return;
      }

      updateFormData("profilePhoto", file);
      const url = URL.createObjectURL(file);
      updateFormData("profilePhotoUrl", url);
    }
  };

  const removeProfilePhoto = () => {
    if (formData.profilePhotoUrl) {
      URL.revokeObjectURL(formData.profilePhotoUrl);
    }
    updateFormData("profilePhoto", null);
    updateFormData("profilePhotoUrl", "");
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, { category: "", budget: "" }],
    }));
  };

  const updateCategory = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[index] = { ...newCategories[index], [field]: value };
      return { ...prev, categories: newCategories };
    });
  };

  const handleNext = () => {
    const stepOrder: Step[] = ["personal", "contact", "budget", "additional"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["personal", "contact", "budget", "additional"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleCreate = () => {
    console.log("Creating participant:", formData);
    toast.success("Participant created successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-montserrat-bold text-gray-900">
              Create New Participant
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <CloseCircle className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-6 py-6">
          {/* Step Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-montserrat-semibold text-gray-900">
              {currentStepData.label}
            </h3>
            <span className="text-sm font-montserrat-semibold text-primary-600">
              {currentStepData.step}/4
            </span>
          </div>

          {/* Step 1: Personal Details */}
          {currentStep === "personal" && (
            <div className="space-y-6">
              {/* Profile Photo Upload */}
              <div className="space-y-3">
                {!formData.profilePhotoUrl ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                    <div className="flex flex-col items-center gap-2">
                      <GalleryAdd className="h-10 w-10 text-primary-600" />
                      <div className="text-sm text-gray-600 font-montserrat">
                        Drop and drop participant profile photo or{" "}
                        <label className="text-primary-600 cursor-pointer hover:text-primary-700 font-montserrat-semibold">
                          Browse
                          <input
                            type="file"
                            className="hidden"
                            accept=".png,.jpg,.jpeg,.pdf"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 font-montserrat">
                        File type: PNG + JPG + PDF, File limit: 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={formData.profilePhotoUrl} />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {formData.firstName?.charAt(0)}
                        {formData.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={removeProfilePhoto}
                      className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <CloseCircle className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-montserrat-semibold text-gray-900">
                    First Name
                  </Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    placeholder="Sarah"
                    className="font-montserrat"
                  />
                  <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                      i
                    </span>
                    2-1000 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-montserrat-semibold text-gray-900">
                    Last Name
                  </Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    placeholder="Reves"
                    className="font-montserrat"
                  />
                  <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                      i
                    </span>
                    2-1000 characters
                  </p>
                </div>
              </div>

              {/* Date of Birth & NDIS Number */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-montserrat-semibold text-gray-900">
                    Date of Birth
                  </Label>
                  <Input
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                    placeholder="1/1/1990"
                    className="font-montserrat"
                  />
                  <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                      i
                    </span>
                    Required
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-montserrat-semibold text-gray-900">
                    NDIS Number
                  </Label>
                  <Input
                    value={formData.ndisNumber}
                    onChange={(e) => updateFormData("ndisNumber", e.target.value)}
                    placeholder="1234 0000"
                    className="font-montserrat"
                  />
                  <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                      i
                    </span>
                    Required
                  </p>
                </div>
              </div>

              {/* Plan Start Date & Plan End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-montserrat-semibold text-gray-900">
                    Plan Start Date
                  </Label>
                  <Input
                    type="text"
                    value={formData.planStartDate}
                    onChange={(e) => updateFormData("planStartDate", e.target.value)}
                    placeholder="1/1/1990"
                    className="font-montserrat"
                  />
                  <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                      i
                    </span>
                    Required
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-montserrat-semibold text-gray-900">
                    Plan End Date
                  </Label>
                  <Input
                    type="text"
                    value={formData.planEndDate}
                    onChange={(e) => updateFormData("planEndDate", e.target.value)}
                    placeholder="1/1/1990"
                    className="font-montserrat"
                  />
                  <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                      i
                    </span>
                    Required
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label className="text-sm font-montserrat-semibold text-gray-900">
                  Address
                </Label>
                <Input
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="1234 Main Street"
                  className="font-montserrat"
                />
                <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    i
                  </span>
                  Optional
                </p>
              </div>

              {/* Next Button */}
              <Button
                onClick={handleNext}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
              >
                Next
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Primary Contact Details */}
          {currentStep === "contact" && (
            <div className="space-y-6">
              {/* Full Name & Relationship */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-montserrat-semibold text-gray-900">
                    Full Name
                  </Label>
                  <Input
                    value={formData.contactFullName}
                    onChange={(e) => updateFormData("contactFullName", e.target.value)}
                    placeholder="Cassie Mike"
                    className="font-montserrat"
                  />
                  <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                      i
                    </span>
                    2-1000 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-montserrat-semibold text-gray-900">
                    Relationship
                  </Label>
                  <Input
                    value={formData.relationship}
                    onChange={(e) => updateFormData("relationship", e.target.value)}
                    placeholder="Sister"
                    className="font-montserrat"
                  />
                  <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                      i
                    </span>
                    Required
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label className="text-sm font-montserrat-semibold text-gray-900">
                  Phone Number
                </Label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                  placeholder="+61 00000"
                  className="font-montserrat"
                />
                <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    i
                  </span>
                  Required
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-sm font-montserrat-semibold text-gray-900">
                  Email
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="cassie@gmail.com"
                  className="font-montserrat"
                />
                <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    i
                  </span>
                  Required
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="font-montserrat-semibold border-primary-600 text-primary-600 hover:bg-primary-50"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
                >
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Budget Allocation */}
          {currentStep === "budget" && (
            <div className="space-y-6">
              {/* Categories */}
              {formData.categories.map((cat, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-montserrat-semibold text-gray-900">
                      Category
                    </Label>
                    <Input
                      value={cat.category}
                      onChange={(e) =>
                        updateCategory(index, "category", e.target.value)
                      }
                      placeholder="Core"
                      className="font-montserrat"
                    />
                    <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                      <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                        i
                      </span>
                      Required
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-montserrat-semibold text-gray-900">
                      Budget
                    </Label>
                    <Input
                      value={cat.budget}
                      onChange={(e) => updateCategory(index, "budget", e.target.value)}
                      placeholder="$40,000"
                      className="font-montserrat"
                    />
                    <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                      <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                        i
                      </span>
                      Required
                    </p>
                  </div>
                </div>
              ))}

              {/* Add Category Button */}
              <button
                onClick={addCategory}
                className="text-sm text-primary-600 hover:text-primary-700 font-montserrat-semibold flex items-center gap-1"
              >
                + Add Category
              </button>

              {/* Total Budget */}
              <div className="space-y-2">
                <Label className="text-sm font-montserrat-semibold text-gray-900">
                  Total Budget Match Plan Value
                </Label>
                <Input
                  value={formData.totalBudget}
                  onChange={(e) => updateFormData("totalBudget", e.target.value)}
                  placeholder="&70,00000"
                  className="font-montserrat"
                />
                <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    i
                  </span>
                  Required
                </p>
              </div>

              {/* Plan Manager Name */}
              <div className="space-y-2">
                <Label className="text-sm font-montserrat-semibold text-gray-900">
                  Plan Manager Name
                </Label>
                <Input
                  value={formData.planManagerName}
                  onChange={(e) => updateFormData("planManagerName", e.target.value)}
                  placeholder="Rose"
                  className="font-montserrat"
                />
                <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    i
                  </span>
                  Required
                </p>
              </div>

              {/* Plan Manager Email */}
              <div className="space-y-2">
                <Label className="text-sm font-montserrat-semibold text-gray-900">
                  Plan Manager Email
                </Label>
                <Input
                  type="email"
                  value={formData.planManagerEmail}
                  onChange={(e) => updateFormData("planManagerEmail", e.target.value)}
                  placeholder="rose@gmail.com"
                  className="font-montserrat"
                />
                <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    i
                  </span>
                  Required
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="font-montserrat-semibold border-primary-600 text-primary-600 hover:bg-primary-50"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
                >
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === "additional" && (
            <div className="space-y-6">
              {/* Preferences and Requirement */}
              <div className="space-y-2">
                <Label className="text-sm font-montserrat-semibold text-gray-900">
                  Preferences and Requirement
                </Label>
                <Textarea
                  value={formData.preferencesRequirement}
                  onChange={(e) =>
                    updateFormData("preferencesRequirement", e.target.value)
                  }
                  placeholder=""
                  className="font-montserrat min-h-[80px]"
                />
                <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    i
                  </span>
                  Required
                </p>
              </div>

              {/* Goals */}
              <div className="space-y-2">
                <Label className="text-sm font-montserrat-semibold text-gray-900">
                  Goals
                </Label>
                <Textarea
                  value={formData.goals}
                  onChange={(e) => updateFormData("goals", e.target.value)}
                  placeholder=""
                  className="font-montserrat min-h-[80px]"
                />
                <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    i
                  </span>
                  Required
                </p>
              </div>

              {/* Validation Note */}
              <div className="space-y-2">
                <Label className="text-sm font-montserrat-semibold text-gray-900">
                  Validation Note
                </Label>
                <Textarea
                  value={formData.validationNote}
                  onChange={(e) => updateFormData("validationNote", e.target.value)}
                  placeholder=""
                  className="font-montserrat min-h-[80px]"
                />
                <p className="text-xs text-gray-500 font-montserrat flex items-center gap-1">
                  <span className="inline-block h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                    i
                  </span>
                  Required
                </p>
              </div>

              {/* Create Button */}
              <Button
                onClick={handleCreate}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold"
              >
                Create
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
