import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CloseCircle } from "@solar-icons/react";
import { useJobApplication } from "@/hooks/useJobApplication"; // Custom hook
import { ApplicationFormStep } from "@/components/supportworker/jobs/ApplicationFormStep";
import { ApplicationReviewStep } from "@/components/supportworker/jobs/ApplicationReviewStep";
import { SuccessStep } from "@/components/supportworker/jobs/SuccessStep";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  jobId: string;
  jobTitle: string;
}

export default function SupportJobApplicationModal({ 
    isOpen, onClose, onSubmit, jobId, jobTitle 
}: Props) {
  
  const { 
      step, setStep, formData, handleInputChange, 
      attachments, setAttachments, isSubmitting, handleSubmit,
      requiredDocuments, resetForm 
  } = useJobApplication(jobId, onSubmit);

  const handleModalClose = () => {
      resetForm();
      onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] h-auto overflow-y-auto bg-gray-100 p-0 gap-0">
        
        {/* Header - Hidden on success to look cleaner */}
        {step !== "success" && (
            <div className="p-6 pb-4 border-b bg-white flex justify-between items-center sticky top-0 z-10">
                <DialogTitle className="text-xl font-bold">
                    {step === "review" ? "Review Application" : "Apply Now"}
                </DialogTitle>
                <button onClick={handleModalClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <CloseCircle className="h-6 w-6" />
                </button>
            </div>
        )}

        <div className="p-6">
            {step === "form" && (
                <ApplicationFormStep 
                    formData={formData}
                    onChange={handleInputChange}
                    attachments={attachments}
                    onAttachmentsChange={setAttachments}
                    requiredDocuments={requiredDocuments}
                    onReview={() => setStep("review")}
                />
            )}

            {step === "review" && (
                <ApplicationReviewStep 
                    formData={formData}
                    attachments={attachments}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            )}

            {step === "success" && (
                <SuccessStep jobTitle={jobTitle} />
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}