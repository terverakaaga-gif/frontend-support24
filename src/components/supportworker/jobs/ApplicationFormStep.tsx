import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "@solar-icons/react";
import { FileDropZone, UploadedFile } from "@/components/ui/FileDropZone";
import { ApplicationFormData, DocumentStatus } from "@/types/job-application";

interface Props {
  formData: ApplicationFormData;
  onChange: (field: keyof ApplicationFormData, value: string) => void;
  attachments: UploadedFile[];
  onAttachmentsChange: (files: UploadedFile[]) => void;
  requiredDocuments: DocumentStatus[];
  onReview: () => void;
}

export const ApplicationFormStep = React.memo(({
  formData, onChange, attachments, onAttachmentsChange, requiredDocuments, onReview
}: Props) => {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="h-12 bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="h-12 bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phoneNumber}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            className="h-12 bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            className="h-12 bg-white"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Upload Attachments</Label>
        <FileDropZone
          files={attachments}
          onFilesChange={onAttachmentsChange}
          maxFiles={3}
          maxSizeMB={5}
          compact={true}
          subtitle="Maximum file: 3, File type: PNG + JPG + PDF, File limit: 5MB"
        />
      </div>

      <div className="space-y-2">
        <Label>Required Documents</Label>
        <div className="space-y-2">
          {requiredDocuments.map((doc, idx) => (
            <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${doc.uploaded ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-5 w-5 ${doc.uploaded ? "text-green-600" : "text-gray-400"}`} />
                <span className={`text-sm font-montserrat-medium ${doc.uploaded ? "text-green-700" : "text-gray-600"}`}>{doc.name}</span>
              </div>
              {doc.uploaded ? <span className="text-xs text-green-600 font-montserrat-bold">Uploaded</span> : <span className="text-xs text-gray-400">Required</span>}
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onReview} className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-montserrat-semibold mt-4">
        Review
      </Button>
    </div>
  );
});