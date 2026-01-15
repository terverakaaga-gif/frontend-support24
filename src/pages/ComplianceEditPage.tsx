import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FileDropZone } from "@/components/ui/FileDropZone";
import { AltArrowLeft, CheckCircle, FileText } from "@solar-icons/react";
import { useGetMyCompliance, useUpdateComplianceAnswers } from "@/hooks/useComplianceHooks";
import {
  ComplianceDocumentType,
  DOCUMENT_TYPE_LABELS,
  COMPLIANCE_QUESTION_LABELS,
  IComplianceAnswers,
  ComplianceStatus,
} from "@/types/compliance.types";
import { DASHBOARD_PAGE_WRAPPER } from "@/lib/design-utils";
import {
  SPACING,
  CONTAINER_PADDING,
  HEADING_STYLES,
  TEXT_STYLES,
  BG_COLORS,
  GAP,
  RADIUS,
  SHADOW,
} from "@/constants/design-system";
import { cn } from "@/lib/design-utils";
import Loader from "@/components/Loader";

interface ComplianceQuestion {
  id: keyof IComplianceAnswers;
  question: string;
  answer: boolean;
}

// Map document types to their config
const requiredDocuments = [
  {
    id: "1",
    type: ComplianceDocumentType.FIRST_AID_CERTIFICATE,
    name: DOCUMENT_TYPE_LABELS[ComplianceDocumentType.FIRST_AID_CERTIFICATE],
    isMandatory: true,
  },
  {
    id: "2",
    type: ComplianceDocumentType.CPR_CERTIFICATE,
    name: DOCUMENT_TYPE_LABELS[ComplianceDocumentType.CPR_CERTIFICATE],
    isMandatory: true,
  },
  {
    id: "3",
    type: ComplianceDocumentType.POLICE_CHECK,
    name: DOCUMENT_TYPE_LABELS[ComplianceDocumentType.POLICE_CHECK],
    isMandatory: true,
  },
  {
    id: "4",
    type: ComplianceDocumentType.WWCC,
    name: DOCUMENT_TYPE_LABELS[ComplianceDocumentType.WWCC],
    isMandatory: true,
  },
  {
    id: "5",
    type: ComplianceDocumentType.RELEVANT_DOCUMENT,
    name: DOCUMENT_TYPE_LABELS[ComplianceDocumentType.RELEVANT_DOCUMENT],
    isMandatory: false,
  },
  {
    id: "6",
    type: ComplianceDocumentType.RELEVANT_INSURANCE,
    name: DOCUMENT_TYPE_LABELS[ComplianceDocumentType.RELEVANT_INSURANCE],
    isMandatory: false,
  },
];

// Initialize questions from compliance data
const initializeQuestions = (answers: IComplianceAnswers | undefined): ComplianceQuestion[] => {
  const questionIds: (keyof IComplianceAnswers)[] = [
    "ndisWorkerScreeningCheck",
    "ndisWorkerOrientationModule",
    "nationalPoliceCheck",
    "workingWithChildrenCheck",
    "firstAidCertification",
    "cprCertification",
    "covidVaccinationEvidence",
    "influenzaVaccinationEvidence",
    "relevantQualifications",
    "ndisCodeOfConductAgreement",
    "manualHandlingTraining",
    "medicationAdministrationTraining",
    "infectionControlTraining",
    "publicLiabilityInsurance",
  ];

  return questionIds.map((id) => ({
    id,
    question: COMPLIANCE_QUESTION_LABELS[id],
    answer: answers?.[id] ?? false,
  }));
};

type FormMode = "form" | "review";

export default function ComplianceEditPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Fetch current compliance
  const { data: compliance, isLoading } = useGetMyCompliance();

  // Form mode state
  const [mode, setMode] = useState<FormMode>("form");

  // Form data states
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [questions, setQuestions] = useState<ComplianceQuestion[]>([]);

  // React Query mutation
  const updateAnswers = useUpdateComplianceAnswers();

  // Initialize questions when compliance data loads
  const [isInitialized, setIsInitialized] = useState(false);
  if (!isInitialized && compliance?.complianceAnswers) {
    setQuestions(initializeQuestions(compliance.complianceAnswers));
    setIsInitialized(true);
  }

  // Check if user can edit (only if status is APPROVED)
  const canEdit = compliance?.status === ComplianceStatus.APPROVED;

  if (!canEdit && !isLoading) {
    return (
      <div className={DASHBOARD_PAGE_WRAPPER}>
        <GeneralHeader
          title="Compliance Edit"
          subtitle="Update your compliance information"
          onLogout={logout}
          user={user}
          onViewProfile={() => navigate("/support-worker/profile")}
        />
        <div className={cn("max-w-2xl mx-auto", CONTAINER_PADDING.responsive)}>
          <div className={cn("p-${SPACING.xl} text-center bg-white rounded-xl", SHADOW.sm)}>
            <p className={cn(TEXT_STYLES.body, "mb-${SPACING.md}")}>
              You can only update your compliance information when your status is Approved.
            </p>
            <button
              onClick={() => navigate("/support-worker/compliance")}
              className={cn(
                "flex items-center justify-center gap-2 mx-auto",
                "px-4 py-2 rounded-lg",
                "text-primary-600 hover:text-primary-700 font-montserrat-semibold",
                "transition-colors"
              )}
            >
              <AltArrowLeft className="h-4 w-4" />
              Back to Compliance Check
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleReview = () => {
    setMode("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToForm = () => {
    setMode("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    // Build answers object from questions
    const answers: Partial<IComplianceAnswers> = questions.reduce((acc, q) => {
      acc[q.id] = q.answer;
      return acc;
    }, {} as Partial<IComplianceAnswers>);

    updateAnswers.mutate(answers, {
      onSuccess: () => {
        navigate("/support-worker/compliance");
      },
    });
  };

  const handleQuestionToggle = useCallback((id: keyof IComplianceAnswers) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer: !q.answer } : q))
    );
  }, []);

  const answeredCount = questions.filter((q) => q.answer).length;

  if (isLoading) {
    return <Loader />;
  }

  if (mode === "review") {
    return (
      <div className={DASHBOARD_PAGE_WRAPPER}>
        <GeneralHeader
          title="Review Your Answers"
          subtitle="Please review your compliance answers before submitting"
          onLogout={logout}
          user={user}
          onViewProfile={() => navigate("/support-worker/profile")}
        />

        <div className={cn("max-w-3xl mx-auto", CONTAINER_PADDING.responsive)}>
          {/* Back Button */}
          <button
            onClick={handleBackToForm}
            className={cn(
              "flex items-center gap-2 mb-${SPACING.lg}",
              "text-primary-600 hover:text-primary-700 font-montserrat-semibold",
              "transition-colors"
            )}
          >
            <AltArrowLeft className="h-5 w-5" />
            Back to Form
          </button>

          {/* Review Card */}
          <div className={cn("bg-white rounded-xl p-${SPACING.lg}", SHADOW.md)}>
            <div className={cn(`mb-${SPACING.lg}`)}>
              <h2 className={cn(HEADING_STYLES.h3, `mb-${SPACING.md}`)}>
                Compliance Answers Review
              </h2>
              <p className={TEXT_STYLES.body}>
                You have answered {answeredCount} out of {questions.length} questions
              </p>
            </div>

            {/* Questions Review */}
            <div className={`space-y-${SPACING.base} mb-${SPACING.xl}`}>
              {questions.map((q) => (
                <div
                  key={q.id}
                  className={cn(
                    `p-${SPACING.base} rounded-lg border`,
                    "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={cn(TEXT_STYLES.body, "font-montserrat-medium")}>
                        {q.question}
                      </p>
                    </div>
                    <div className={cn("ml-4 px-3 py-1 rounded-full text-sm font-semibold", 
                      q.answer ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700")}>
                      {q.answer ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className={cn(`flex gap-${SPACING.base}`)}>
              <button
                onClick={handleBackToForm}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg border",
                  "font-montserrat-semibold transition-colors",
                  "border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                Edit Answers
              </button>
              <button
                onClick={handleSubmit}
                disabled={updateAnswers.isPending}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg",
                  "bg-primary-600 text-white font-montserrat-semibold",
                  "hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-colors"
                )}
              >
                {updateAnswers.isPending ? "Updating..." : "Update Answers"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={DASHBOARD_PAGE_WRAPPER}>
      <GeneralHeader
        title="Update Compliance"
        subtitle="Update your compliance answers and documents"
        onLogout={logout}
        user={user}
        onViewProfile={() => navigate("/support-worker/profile")}
      />

      <div className={cn("max-w-3xl mx-auto", CONTAINER_PADDING.responsive)}>
        {/* Questions Section */}
        <div className={cn("bg-white rounded-xl mb-${SPACING.xl}", SHADOW.md)}>
          <div className={CONTAINER_PADDING.cardLg}>
            <div className={cn(`mb-${SPACING.lg}`)}>
              <h2 className={cn(HEADING_STYLES.h3, `mb-${SPACING.sm}`)}>
                Compliance Questions
              </h2>
              <p className={TEXT_STYLES.bodySecondary}>
                Update your answers to the following questions
              </p>
            </div>

            {/* Questions Grid */}
            <div className={`space-y-${SPACING.base}`}>
              {questions.map((q) => (
                <div
                  key={q.id}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border",
                    "hover:bg-gray-50 transition-colors",
                    "border-gray-200 bg-white"
                  )}
                >
                  <Checkbox
                    id={q.id}
                    checked={q.answer}
                    onCheckedChange={() => handleQuestionToggle(q.id)}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor={q.id}
                    className={cn(TEXT_STYLES.body, "cursor-pointer flex-1 font-montserrat-medium")}
                  >
                    {q.question}
                  </label>
                  {q.answer && (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className={cn(`mt-${SPACING.lg} p-${SPACING.base} rounded-lg`, BG_COLORS.muted)}>
              <p className={cn(TEXT_STYLES.body, "font-montserrat-semibold")}>
                Progress: {answeredCount} of {questions.length} questions answered
              </p>
              <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Updated Documents Section */}
        {compliance?.documents && compliance.documents.length > 0 && (
          <div className={cn("bg-white rounded-xl mb-${SPACING.xl}", SHADOW.md)}>
            <div className={CONTAINER_PADDING.cardLg}>
              <h2 className={cn(HEADING_STYLES.h3, `mb-${SPACING.md}`)}>
                Your Uploaded Documents
              </h2>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-${SPACING.base}`}>
                {compliance.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border",
                      "hover:bg-primary-50 hover:border-primary-200 transition-colors",
                      "border-gray-200 bg-gray-50 group"
                    )}
                  >
                    <FileText className="h-5 w-5 text-primary-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <p className={cn(TEXT_STYLES.body, "font-montserrat-medium truncate")}>
                        {DOCUMENT_TYPE_LABELS[doc.type] || doc.type}
                      </p>
                      <p className={cn(TEXT_STYLES.tiny, "truncate")}>
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <FileText className="h-4 w-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Update Documents Section */}
        <div className={cn("bg-white rounded-xl mb-${SPACING.xl}", SHADOW.md)}>
          <div className={CONTAINER_PADDING.cardLg}>
            <h2 className={cn(HEADING_STYLES.h3, `mb-${SPACING.base}`)}>
              Update Documents (Optional)
            </h2>
            <p className={cn(TEXT_STYLES.bodySecondary, `mb-${SPACING.md}`)}>
              You can upload new or replacement documents here
            </p>
            <FileDropZone 
              files={uploadedFiles} 
              onFilesChange={setUploadedFiles}
              title="Upload Updated Documents"
              subtitle="Replace documents or add new ones"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className={cn(`flex gap-${SPACING.base} mb-${SPACING.xl}`)}>
          <button
            onClick={() => navigate("/support-worker/compliance")}
            className={cn(
              "flex-1 px-4 py-3 rounded-lg border",
              "font-montserrat-semibold transition-colors",
              "border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleReview}
            className={cn(
              "flex-1 px-4 py-3 rounded-lg",
              "bg-primary-600 text-white font-montserrat-semibold",
              "hover:bg-primary-700 transition-colors"
            )}
          >
            Review Changes
          </button>
        </div>
      </div>
    </div>
  );
}
