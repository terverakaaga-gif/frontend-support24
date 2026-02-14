import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileDropZone, UploadedFile } from "@/components/ui/FileDropZone";
import { X, Check, ChevronLeft, Pen, ChevronDown, ChevronUp, FileText, Trash2 } from "lucide-react";
import { CheckCircle } from "@solar-icons/react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Add Personal Details" },
  { id: 2, label: "Upload Document" },
  { id: 3, label: "Answer Employer Question" },
  { id: 4, label: "Review & Submit" },
] as const;

export interface ApplyFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
}

export interface EmployerAnswers {
  rightToWork: string;
  yearsExperience: string;
  australianDriversLicense: string;
  ndisScreeningCheck: string;
  certificateIII: string;
  firstAidAccreditation: string;
}

const RIGHT_TO_WORK_OPTIONS = [
  "I am a citizen of Australia",
  "I am a permanent resident",
  "I have a valid work visa",
  "Other",
];

const YEARS_EXPERIENCE_OPTIONS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

const FIRST_AID_OPTIONS = [
  "Provide First Aid",
  "Provide CPR",
  "Asthma management",
  "Anaphylaxis management",
  "Epilepsy management",
  "Provide Advanced First Aid",
];

interface ApplyJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle?: string;
  companyName?: string;
  onSuccess?: () => void;
}

export function ApplyJobModal({
  open,
  onOpenChange,
  jobTitle = "Support Worker",
  companyName = "Stream Healthcare",
  onSuccess,
}: ApplyJobModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ApplyFormData>({
    fullName: "John Doe Singh",
    email: "johndoe@gmail.com",
    phoneNumber: "+61 67635567",
    location: "123 Main Street, Anytown, AU",
  });
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [employerAnswers, setEmployerAnswers] = useState<EmployerAnswers>({
    rightToWork: "",
    yearsExperience: "",
    australianDriversLicense: "",
    ndisScreeningCheck: "",
    certificateIII: "",
    firstAidAccreditation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSections, setReviewSections] = useState({
    personal: true,
    documents: true,
    questions: true,
  });

  const requiredDocumentsStatus = useMemo(() => {
    const hasResume = attachments.some((f) =>
      f.name.toLowerCase().includes("resume")
    );
    const hasCover = attachments.some((f) =>
      f.name.toLowerCase().includes("cover")
    );
    return [
      { name: "Resume", uploaded: hasResume },
      { name: "Cover Letter", uploaded: hasCover },
    ];
  }, [attachments]);

  const updateForm = (field: keyof ApplyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateEmployerAnswer = (field: keyof EmployerAnswers, value: string) => {
    setEmployerAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setStep(1);
      setAttachments([]);
      setEmployerAnswers({
        rightToWork: "",
        yearsExperience: "",
        australianDriversLicense: "",
        ndisScreeningCheck: "",
        certificateIII: "",
        firstAidAccreditation: "",
      });
    }
    onOpenChange(open);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    onSuccess?.();
    handleClose(false);
  };

  const toggleReviewSection = (key: keyof typeof reviewSections) => {
    setReviewSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const removeFile = (id: string) => {
    setAttachments((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0 sm:rounded-lg">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-montserrat-bold text-gray-900">
              Apply
            </DialogTitle>
            <button
              onClick={() => handleClose(false)}
              className="rounded-full p-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Stepper */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-0">
            {STEPS.map((s, index) => {
              const isActive = step === s.id;
              const isComplete = step > s.id;
              const isLast = index === STEPS.length - 1;
              return (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-montserrat-semibold",
                        isComplete &&
                          "bg-primary border-primary text-white",
                        isActive &&
                          !isComplete &&
                          "border-primary text-primary bg-white",
                        !isActive &&
                          !isComplete &&
                          "border-gray-300 text-gray-400 bg-white"
                      )}
                    >
                      {isComplete ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        s.id
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-montserrat-medium mt-1 max-w-[72px] text-center leading-tight",
                        isActive || isComplete
                          ? "text-primary"
                          : "text-gray-400"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "w-8 h-0.5 mx-0.5 mt-[-20px]",
                        isComplete ? "bg-primary" : "bg-gray-200"
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="px-6 pb-6 pt-4">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-montserrat-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateForm("fullName", e.target.value)}
                  className="h-12 border-gray-200 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-montserrat-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  className="h-12 border-gray-200 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-montserrat-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phoneNumber}
                  onChange={(e) => updateForm("phoneNumber", e.target.value)}
                  className="h-12 border-gray-200 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="font-montserrat-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                  className="h-12 border-gray-200 bg-white"
                />
              </div>
              <Button
                onClick={() => setStep(2)}
                className="w-full h-12 bg-primary hover:bg-primary-700 text-white font-montserrat-semibold text-base mt-4"
              >
                Next
              </Button>
            </div>
          )}

          {/* Step 2: Upload Document */}
          {step === 2 && (
            <div className="space-y-4">
              <FileDropZone
                files={attachments}
                onFilesChange={setAttachments}
                maxFiles={3}
                maxSizeMB={5}
                acceptedTypes={[
                  "image/png",
                  "image/jpeg",
                  "application/pdf",
                ]}
                title="Drop and drop your file or"
                browseText="Browse"
                subtitle="Maximum file: 3, File type: PNG + JPG + PDF, File limit: 5MB"
                showFileList={false}
                dropZoneClassName="border-primary rounded-xl bg-primary/5"
              />
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
                    >
                      <FileText className="h-8 w-8 text-red-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-montserrat-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                        {file.progress < 100 && (
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {file.progress}%
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm font-montserrat-semibold text-gray-900">
                  Required Documents
                </p>
                <div className="space-y-2">
                  {requiredDocumentsStatus.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle
                          className={cn(
                            "h-5 w-5",
                            doc.uploaded ? "text-primary" : "text-gray-400"
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-montserrat-medium",
                            doc.uploaded ? "text-gray-900" : "text-gray-600"
                          )}
                        >
                          {doc.name}
                        </span>
                      </div>
                      {doc.uploaded && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 border-primary text-primary font-montserrat-semibold"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 h-12 bg-primary hover:bg-primary-700 text-white font-montserrat-semibold"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Employer Questions */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="font-montserrat-medium">
                  Which of the following best describes your right to work in
                  Australia?
                </Label>
                <Select
                  value={employerAnswers.rightToWork}
                  onValueChange={(v) => updateEmployerAnswer("rightToWork", v)}
                >
                  <SelectTrigger className="h-12 border-gray-200 bg-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {RIGHT_TO_WORK_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-montserrat-medium">
                  How many years of experience do you have as a support worker?
                </Label>
                <Select
                  value={employerAnswers.yearsExperience}
                  onValueChange={(v) =>
                    updateEmployerAnswer("yearsExperience", v)
                  }
                >
                  <SelectTrigger className="h-12 border-gray-200 bg-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-montserrat-medium">
                  Do you have an Australian Driver&apos;s License?
                </Label>
                <RadioGroup
                  value={employerAnswers.australianDriversLicense}
                  onValueChange={(v) =>
                    updateEmployerAnswer("australianDriversLicense", v)
                  }
                  className="flex gap-4"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="Yes" />
                    <span className="text-sm font-montserrat-medium">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="No" />
                    <span className="text-sm font-montserrat-medium">No</span>
                  </label>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="font-montserrat-medium">
                  Do you have a current NDIS Screening Check?
                </Label>
                <RadioGroup
                  value={employerAnswers.ndisScreeningCheck}
                  onValueChange={(v) =>
                    updateEmployerAnswer("ndisScreeningCheck", v)
                  }
                  className="flex gap-4"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="Yes" />
                    <span className="text-sm font-montserrat-medium">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="No" />
                    <span className="text-sm font-montserrat-medium">No</span>
                  </label>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="font-montserrat-medium">
                  Do you have a certificate in III in Individual Support?
                </Label>
                <RadioGroup
                  value={employerAnswers.certificateIII}
                  onValueChange={(v) =>
                    updateEmployerAnswer("certificateIII", v)
                  }
                  className="flex gap-4"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="Yes" />
                    <span className="text-sm font-montserrat-medium">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="No" />
                    <span className="text-sm font-montserrat-medium">No</span>
                  </label>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="font-montserrat-medium">
                  Which of the following First Aid accreditation do you
                  currently hold?
                </Label>
                <RadioGroup
                  value={employerAnswers.firstAidAccreditation}
                  onValueChange={(v) =>
                    updateEmployerAnswer("firstAidAccreditation", v)
                  }
                  className="grid gap-2"
                >
                  {FIRST_AID_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <RadioGroupItem value={opt} />
                      <span className="text-sm font-montserrat-medium">
                        {opt}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 h-12 border-primary text-primary font-montserrat-semibold"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="flex-1 h-12 bg-primary hover:bg-primary-700 text-white font-montserrat-semibold"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Personal Details */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleReviewSection("personal")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 font-montserrat-semibold text-gray-900">
                    Personal Details
                    <Pen className="h-4 w-4 text-primary" />
                  </div>
                  {reviewSections.personal ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {reviewSections.personal && (
                  <div className="p-4 space-y-2 bg-white border-t border-gray-200">
                    <ReviewRow label="Full Name" value={formData.fullName} />
                    <ReviewRow label="Email Address" value={formData.email} />
                    <ReviewRow
                      label="Phone Number"
                      value={formData.phoneNumber}
                    />
                    <ReviewRow label="Location" value={formData.location} />
                  </div>
                )}
              </div>

              {/* Uploaded Documents */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleReviewSection("documents")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 font-montserrat-semibold text-gray-900">
                    Uploaded Documents
                    <Pen className="h-4 w-4 text-primary" />
                  </div>
                  {reviewSections.documents ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {reviewSections.documents && (
                  <div className="p-4 space-y-3 bg-white border-t border-gray-200">
                    {attachments.length === 0 ? (
                      <p className="text-sm text-gray-500">No documents uploaded</p>
                    ) : (
                      attachments.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-3"
                        >
                          <FileText className="h-8 w-8 text-red-500 shrink-0" />
                          <div>
                            <p className="text-sm font-montserrat-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Employer Questions */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleReviewSection("questions")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 font-montserrat-semibold text-gray-900">
                    Employer Questions
                    <Pen className="h-4 w-4 text-primary" />
                  </div>
                  {reviewSections.questions ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {reviewSections.questions && (
                  <div className="p-4 space-y-3 bg-white border-t border-gray-200 text-sm">
                    <ReviewRow
                      label="Which of the following best describes your right to work in Australia?"
                      value={employerAnswers.rightToWork || "-"}
                    />
                    <ReviewRow
                      label="How many years of experience do you have as a support worker?"
                      value={employerAnswers.yearsExperience || "-"}
                    />
                    <ReviewRow
                      label="Do you have an Australian Driver's License?"
                      value={employerAnswers.australianDriversLicense || "-"}
                    />
                    <ReviewRow
                      label="Do you have a current NDIS Screening Check?"
                      value={employerAnswers.ndisScreeningCheck || "-"}
                    />
                    <ReviewRow
                      label="Do you have a certificate in III in Individual Support?"
                      value={employerAnswers.certificateIII || "-"}
                    />
                    <ReviewRow
                      label="Which of the following First Aid accreditation do you currently hold?"
                      value={employerAnswers.firstAidAccreditation || "-"}
                    />
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-12 bg-primary hover:bg-primary-700 text-white font-montserrat-semibold text-base mt-4"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-montserrat-medium text-gray-900">{value || "-"}</span>
    </div>
  );
}
