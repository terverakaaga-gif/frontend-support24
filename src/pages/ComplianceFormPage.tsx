import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FileDropZone, UploadedFile, useFileUpload } from "@/components/ui/FileDropZone";
import { AltArrowLeft, CheckCircle, FileText } from "@solar-icons/react";

interface RequiredDocument {
  id: string;
  name: string;
  isMandatory: boolean;
  isCompleted: boolean;
}

interface ComplianceQuestion {
  id: string;
  question: string;
  answer: boolean;
  expiryDate?: string;
}

const requiredDocuments: RequiredDocument[] = [
  { id: "1", name: "First Aid Certificate", isMandatory: true, isCompleted: false },
  { id: "2", name: "CPR Certificate", isMandatory: true, isCompleted: false },
  { id: "3", name: "Police Check", isMandatory: true, isCompleted: false },
  { id: "4", name: "Working with Children Check", isMandatory: true, isCompleted: false },
  { id: "5", name: "Relevant Document", isMandatory: false, isCompleted: false },
  { id: "6", name: "Relevant Insurance", isMandatory: false, isCompleted: false },
];

const initialQuestions: ComplianceQuestion[] = [
  { id: "ndis_screening", question: "Do you have NDIS Worker Screening Check?", answer: false },
  { id: "ndis_orientation", question: "Do you have NDIS Worker Orientation Module (Quality, Safety, and You)?", answer: false },
  { id: "national_police", question: "Do you have National Police Check?", answer: false },
  { id: "children_check", question: "Do you have Experience Working with Children Check?", answer: false },
  { id: "first_aid", question: "Do you have First Aid Certifications (HLTAID011)?", answer: false },
  { id: "cpr", question: "Do you have CPR Certifications (HLTAID009)?", answer: false },
  { id: "covid_vaccine", question: "Do you have COVID-19 Vaccination Evidence?", answer: false },
  { id: "flu_vaccine", question: "Do you have Influenza Vaccination Evidence?", answer: false },
  { id: "relevant_quals", question: "Do you have Relevant Qualifications (Certificate in individual, community or disability support service)?", answer: false },
  { id: "ndis_code", question: "Do you have NDIS Code of Conduct Agreement?", answer: false },
  { id: "manual_handling", question: "Do you have Manual Handling Training?", answer: false },
  { id: "medication", question: "Do you have Medication Administration Training?", answer: false },
  { id: "infection_control", question: "Do you have Infection Control Training?", answer: false },
  { id: "insurance", question: "Do you have Public Liability & Professional Indemnity Insurance?", answer: false },
];

type FormMode = "form" | "review";

export default function ComplianceFormPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form mode state
  const [mode, setMode] = useState<FormMode>("form");

  // Form data states
  const { files: uploadedFiles, setFiles: setUploadedFiles } = useFileUpload();
  const [documents, setDocuments] = useState<RequiredDocument[]>(requiredDocuments);
  const [questions, setQuestions] = useState<ComplianceQuestion[]>(initialQuestions);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = () => {
    // Validate that at least some mandatory documents are uploaded
    const mandatoryCompleted = documents
      .filter((d) => d.isMandatory)
      .every((d) => d.isCompleted);

    if (!mandatoryCompleted && uploadedFiles.length === 0) {
      toast.error("Please upload at least one document before reviewing.");
      return;
    }

    setMode("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToForm = () => {
    setMode("form");
    setAgreedToTerms(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      toast.error("Please agree to the Privacy Policy and Terms of Service");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Submit compliance data to API
      // await complianceService.submitCompliance({
      //   files: uploadedFiles,
      //   questions,
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Compliance documents submitted successfully!");
      navigate("/support-worker/compliance");
    } catch (error) {
      console.error("Failed to submit compliance:", error);
      toast.error("Failed to submit compliance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDisplayValue = (question: ComplianceQuestion): string => {
    if (question.answer) {
      if (question.expiryDate) {
        return question.expiryDate;
      }
      return "Yes";
    }
    return "No";
  };

  // Count answered questions
  const answeredCount = questions.filter((q) => q.answer).length;

  const handleQuestionToggle = useCallback((id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, answer: !q.answer } : q
      )
    );
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <GeneralHeader
        showBackButton={true}
        stickyTop={true}
        title={mode === "form" ? "Compliance Check" : "Review Submission"}
        subtitle={
          mode === "form"
            ? "Upload your documents and complete the verification"
            : "Review your information before submitting"
        }
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/support-worker/profile")}
      />

      {/* Main Content */}
      <div className="flex justify-center mt-6">
        <div className="w-full max-w-2xl bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
          {mode === "form" ? (
            // ============ FORM MODE ============
            <>
              <h2 className="text-xl font-montserrat-semibold text-primary mb-6">
                Compliance Check
              </h2>

              {/* File Upload Area */}
              <FileDropZone
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
                maxFiles={6}
                maxSizeMB={5}
                acceptedTypes={["image/png", "image/jpeg", "application/pdf"]}
                showProgress={true}
              />

              {/* Required Documents */}
              <section className="mb-8">
                <h3 className="text-base font-montserrat-semibold text-gray-900 mb-4">
                  Required Documents
                </h3>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle
                          className={`h-5 w-5 ${
                            doc.isCompleted ? "text-primary" : "text-gray-400"
                          }`}
                        />
                        <span className="text-gray-700">
                          {doc.name} ({doc.isMandatory ? "Mandatory" : "Optional"})
                        </span>
                      </div>
                      {doc.isCompleted && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Compliance Questions */}
              <section className="mb-8 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-montserrat-semibold text-gray-900">
                    Compliance Questions
                  </h3>
                  <span className="text-sm text-gray-500">
                    {answeredCount}/{questions.length} answered
                  </span>
                </div>
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-gray-700 pr-4 flex-1">{q.question}</span>
                    <Switch
                      checked={q.answer}
                      onCheckedChange={() => handleQuestionToggle(q.id)}
                    />
                  </div>
                ))}
              </section>

              {/* Review Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleReview}
                  className="bg-primary hover:bg-primary-700 text-white px-8 py-3"
                >
                  Review
                </Button>
              </div>
            </>
          ) : (
            // ============ REVIEW MODE ============
            <>
              {/* Back to Edit Button */}
              <button
                onClick={handleBackToForm}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <AltArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Edit</span>
              </button>

              <h2 className="text-xl font-montserrat-semibold text-primary mb-6">
                Review Your Submission
              </h2>

              {/* Uploaded Documents Review */}
              {uploadedFiles.length > 0 && (
                <section className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-base font-montserrat-semibold text-gray-900 mb-4">
                    Uploaded Documents ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">{file.size}</p>
                        </div>
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Questions Review */}
              <section className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-base font-montserrat-semibold text-gray-900 mb-4">
                  Compliance Responses
                </h3>
                <div className="space-y-3">
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-gray-700 pr-4 flex-1 text-sm">
                        {q.question}
                      </span>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={q.answer}
                          disabled
                          className="cursor-default opacity-70"
                        />
                        <span
                          className={`text-sm min-w-[50px] text-right font-medium ${
                            q.answer ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {getDisplayValue(q)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3 py-6">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                >
                  By submitting this form, you agree to our{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/terms-of-use"
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    Terms of Service
                  </a>
                  . You confirm that all information provided is accurate and complete.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleBackToForm}
                  className="flex-1 py-6 text-lg font-montserrat-semibold"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!agreedToTerms || isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary-700 text-white py-6 text-lg font-montserrat-semibold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}