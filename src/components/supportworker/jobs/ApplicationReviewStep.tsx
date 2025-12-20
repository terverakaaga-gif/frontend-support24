import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pen, AltArrowDown, AltArrowUp, File } from "@solar-icons/react";
import { UploadedFile } from "@/components/ui/FileDropZone";
import { ApplicationFormData } from "@/types/job-application";
import { Spinner } from "@/components/Spinner";

interface Props {
  formData: ApplicationFormData;
  attachments: UploadedFile[];
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ApplicationReviewStep = React.memo(
  ({ formData, attachments, onSubmit, isSubmitting }: Props) => {
    const [sections, setSections] = useState({ personal: true, docs: true });

    const toggle = (key: "personal" | "docs") =>
      setSections((p) => ({ ...p, [key]: !p[key] }));
    const formatSize = (b: number) => `${Math.round(b / 1024)} KB`;

    return (
      <div className="space-y-4 py-4">
        {/* Personal Details Accordion */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggle("personal")}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2 font-montserrat-medium">
              Personal Details <Pen className="h-4 w-4 text-primary" />
            </div>
            {sections.personal ? (
              <AltArrowUp className="h-5 w-5" />
            ) : (
              <AltArrowDown className="h-5 w-5" />
            )}
          </button>
          {sections.personal && (
            <div className="p-4 space-y-3 bg-white">
              <ReviewRow label="Full Name" value={formData.fullName} />
              <ReviewRow label="Email Address" value={formData.email} />
              <ReviewRow label="Phone Number" value={formData.phoneNumber} />
              <ReviewRow label="Location" value={formData.location} />
            </div>
          )}
        </div>

        {/* Documents Accordion */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggle("docs")}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2 font-montserrat-medium">
              Uploaded Documents <Pen className="h-4 w-4 text-primary" />
            </div>
            {sections.docs ? (
              <AltArrowUp className="h-5 w-5" />
            ) : (
              <AltArrowDown className="h-5 w-5" />
            )}
          </button>
          {sections.docs && (
            <div className="p-4 space-y-3 bg-white">
              {attachments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-2">
                  No documents uploaded
                </p>
              ) : (
                attachments.map((att, i) => {
                  const name = att.file.name;
                  const type = name.toLowerCase().includes("resume")
                    ? "Resume"
                    : name.toLowerCase().includes("cover")
                    ? "Cover Letter"
                    : "Document";
                  const badgeColor =
                    type === "Resume"
                      ? "bg-blue-100 text-blue-700"
                      : type === "Cover Letter"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700";

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <File className="h-8 w-8 text-red-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-montserrat-medium">{name}</p>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-montserrat-bold ${badgeColor}`}
                          >
                            {type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {formatSize(att.file.size)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting || attachments.length === 0}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-montserrat-semibold mt-4"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2 mr-2">
              <Spinner /> <span>Submitting...</span>
            </div>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    );
  }
);

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-montserrat-medium text-gray-900">{value || "-"}</span>
  </div>
);
