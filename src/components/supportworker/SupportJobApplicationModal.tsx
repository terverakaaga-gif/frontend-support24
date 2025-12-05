import { useState, useRef } from "react";
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
  CloseCircle,
  CloudUpload,
  TrashBinMinimalistic,
  CheckCircle,
  Pen,
  AltArrowDown,
  AltArrowUp,
  File,
} from "@solar-icons/react";
import { FileDropZone, UploadedFile } from "@/components/ui/FileDropZone";

interface ApplicationFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  attachments: File[];
}

interface SupportJobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => void;
  jobTitle: string;
}

type Step = "form" | "review" | "success";

export default function SupportJobApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  jobTitle,
}: SupportJobApplicationModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "John Doe Singh",
    email: "johndoe@gmail.com",
    phoneNumber: "+61 67635567",
    location: "123 Main Street, Anytown, AU",
    attachments: [],
  });
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [isPersonalDetailsOpen, setIsPersonalDetailsOpen] = useState(true);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredDocuments = [
    { name: "Resume", uploaded: formData.attachments. some((f) => f.name.toLowerCase().includes("resume")) },
    { name: "Cover Letter", uploaded: formData.attachments. some((f) => f.name.toLowerCase().includes("cover")) },
  ];

  const handleFileUpload = (files: FileList | null) => {
    if (! files) return;
    const newFiles = Array.from(files). slice(0, 3 - formData.attachments.length);
    setFormData((prev) => ({
      ...prev,
      attachments: [... prev.attachments, ...newFiles],
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments. filter((_, i) => i !== index),
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer. files);
  };

  const handleReview = () => {
    setStep("review");
  };

  const handleSubmit = () => {
    setStep("success");
    setTimeout(() => {
      onSubmit(formData);
      setStep("form");
    }, 2000);
  };

  const handleClose = () => {
    setStep("form");
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    return `${Math.round(bytes / 1024)} KB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Apply</DialogTitle>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          >
            <CloseCircle className="h-6 w-6" />
          </button>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-6 py-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ... prev, fullName: e.target.value }))
                }
                className="h-12"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData. email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="h-12"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phoneNumber: e.target. value }))
                }
                className="h-12"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ... prev, location: e.target.value }))
                }
                className="h-12"
              />
            </div>

            {/* Upload Attachments */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Upload Attachments</Label>
              <FileDropZone
                files={attachments}
                onFilesChange={setAttachments}
                maxFiles={3}
                maxSizeMB={5}
                compact={true}
                subtitle="Maximum file: 3, File type: PNG + JPG + PDF, File limit: 5MB"
              />
            </div>

            {/* Required Documents Checklist */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Required Documents</Label>
              {requiredDocuments. map((doc, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-5 w-5 ${
                        doc. uploaded ? "text-primary" : "text-gray-300"
                      }`}
                    />
                    <span className="text-sm text-gray-600">{doc.name}</span>
                  </div>
                  {doc.uploaded && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>

            {/* Review Button */}
            <Button
              onClick={handleReview}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
            >
              Review
            </Button>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4 py-4">
            {/* Personal Details Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setIsPersonalDetailsOpen(! isPersonalDetailsOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">Personal Details</span>
                  <Pen className="h-4 w-4 text-primary" />
                </div>
                {isPersonalDetailsOpen ? (
                  <AltArrowUp className="h-5 w-5" />
                ) : (
                  <AltArrowDown className="h-5 w-5" />
                )}
              </button>
              {isPersonalDetailsOpen && (
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Full Name</span>
                    <span className="font-medium">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email Address</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone Number</span>
                    <span className="font-medium">{formData.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium">{formData.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Uploaded Documents Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setIsDocumentsOpen(!isDocumentsOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">Uploaded Documents</span>
                  <Pen className="h-4 w-4 text-primary" />
                </div>
                {isDocumentsOpen ? (
                  <AltArrowUp className="h-5 w-5" />
                ) : (
                  <AltArrowDown className="h-5 w-5" />
                )}
              </button>
              {isDocumentsOpen && (
                <div className="p-4 space-y-3">
                  {formData.attachments.length > 0 ? (
                    formData.attachments. map((file, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-500">
                          {file. name. toLowerCase().includes("resume")
                            ? "Resume"
                            : file.name. toLowerCase().includes("cover")
                            ? "Cover Letter"
                            : "Document"}
                        </span>
                        <div className="flex items-center gap-2">
                          <File className="h-5 w-5 text-red-500" />
                          <div className="text-right">
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No documents uploaded</p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
            >
              Submit
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="py-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Application Submitted! 
            </h3>
            <p className="text-gray-500">
              Your application for {jobTitle} has been submitted successfully.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}