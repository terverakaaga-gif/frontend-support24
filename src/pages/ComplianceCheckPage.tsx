import GeneralHeader from "@/components/GeneralHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AltArrowRight, CheckCircle, ClockCircle, CloseCircle, Pen2 } from "@solar-icons/react";
import { useNavigate } from "react-router-dom";
import { useGetMyCompliance } from "@/hooks/useComplianceHooks";
import { ComplianceStatus, DOCUMENT_TYPE_LABELS } from "@/types/compliance.types";
import { format } from "date-fns";
import Loader from "@/components/Loader";
import {
  cn,
  DASHBOARD_PAGE_WRAPPER,
  DASHBOARD_CONTENT,
  CARD,
  FLEX_CENTER,
  HEADING_4,
  HEADING_5,
  TEXT_BODY,
  TEXT_BODY_SM,
  TEXT_MUTED,
  FLEX_COL_CENTER,
  FLEX_ROW_BETWEEN,
} from "@/lib/design-utils";
import {
  CONTAINER_PADDING,
  SPACING,
  HEADING_STYLES,
  TEXT_STYLES,
  BG_COLORS,
  SHADOW,
  TRANSITIONS,
} from "@/constants/design-system";

export default function ComplianceCheckPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  // React Query hook
  const { data: compliance, isLoading, error } = useGetMyCompliance();

  const getStatusConfig = (status: ComplianceStatus | undefined) => {
    switch (status) {
      case ComplianceStatus.APPROVED:
        return {
          label: "Active",
          color: "text-green-600",
          bgColor: "bg-green-500",
          icon: <CheckCircle className="h-3 w-3 text-white fill-current" />,
        };
      case ComplianceStatus.PENDING:
        return {
          label: "Pending Review",
          color: "text-yellow-600",
          bgColor: "bg-yellow-500",
          icon: <ClockCircle className="h-3 w-3 text-white" />,
        };
      case ComplianceStatus.REJECTED:
        return {
          label: "Rejected",
          color: "text-red-600",
          bgColor: "bg-red-500",
          icon: <CloseCircle className="h-3 w-3 text-white" />,
        };
      default:
        return {
          label: "Inactive",
          color: "text-gray-500",
          bgColor: "bg-gray-400",
          icon: null,
        };
    }
  };

  const statusConfig = getStatusConfig(compliance?.status);
  const isVerified = compliance?.status === ComplianceStatus.APPROVED;
  const canStartVerification = !compliance || compliance.status === ComplianceStatus.DRAFT || compliance.status === ComplianceStatus.REJECTED;

  // Get uploaded document names
  const qualifications = compliance?.documents?.map(doc => 
    DOCUMENT_TYPE_LABELS[doc.type] || doc.type
  ) || [];

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <div className={cn(DASHBOARD_PAGE_WRAPPER, FLEX_CENTER)}>
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load compliance status</p>
          <Button 
            variant="link"
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={DASHBOARD_PAGE_WRAPPER}>
      {/* Header */}
      <GeneralHeader
        title="Compliance Check"
        subtitle="Verify your documents and certifications to complete compliance status"
        onLogout={logout}
        user={user}
        onViewProfile={() => navigate("/support-worker/profile")}
      />

      {/* Main Content */}
      <div className={cn("max-w-2xl mx-auto", CONTAINER_PADDING.responsive)}>
        {/* Main Card */}
        <div className={cn(CARD, "relative overflow-hidden")}>
          {/* Watermark */}
          {!isVerified && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <img src="/logo.svg" alt="Verified" className="w-full" />
            </div>
          )}

          {isVerified && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none">
              <div className="text-primary-600 font-montserrat-bold text-8xl md:text-9xl tracking-wider transform rotate-[-15deg]">
                VERIFIED
              </div>
            </div>
          )}

          <div className={cn("relative z-10", CONTAINER_PADDING.cardLg)}>
            {/* Avatar Section */}
            <div className={cn(FLEX_COL_CENTER, "mb-6")}>
              <Avatar className="w-32 h-32">
                <AvatarImage src={user?.profileImage || ""} alt="Avatar Image" />
                <AvatarFallback>
                  {user?.firstName && user?.lastName
                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                    : "SW"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Rejection Notice */}
            {compliance?.status === ComplianceStatus.REJECTED && compliance.rejectionReasons && (
              <div className={cn("mb-6 p-4 border rounded-lg bg-red-50 border-red-200")}>
                <h4 className={cn(HEADING_5, "mb-2 text-red-800")}>
                  Your compliance was rejected
                </h4>
                <ul className={cn(TEXT_BODY_SM, "space-y-1 text-red-700")}>
                  {compliance.rejectionReasons.map((reason, idx) => (
                    <li key={idx}>• {reason}</li>
                  ))}
                </ul>
                {compliance.adminNotes && (
                  <p className={cn(TEXT_BODY_SM, "mt-2 italic text-red-600")}>
                    Note: {compliance.adminNotes}
                  </p>
                )}
              </div>
            )}

            {/* Pending Notice */}
            {compliance?.status === ComplianceStatus.PENDING && (
              <div className={cn("mb-6 p-4 border rounded-lg bg-yellow-50 border-yellow-200")}>
                <p className={cn(TEXT_BODY_SM, "text-yellow-800")}>
                  Your compliance documents are under review. We'll notify you once the review is complete.
                </p>
              </div>
            )}

            {/* Worker Information */}
            <section className="mb-8">
              <h3 className={cn(HEADING_5, "mb-4")}>
                Worker Information
              </h3>
              <div className={cn("space-y-3 p-4 rounded-lg", BG_COLORS.muted)}>
                <InfoRow
                  label="ID Number:"
                  value={compliance?._id?.slice(-8).toUpperCase() || "Not Available"}
                  valueClassName={compliance?._id ? "text-gray-900 font-montserrat-semibold" : "text-gray-400"}
                />
                <InfoRow label="Email:" value={user?.email || "N/A"} />
                <InfoRow label="Phone Number:" value={user?.phone || "N/A"} />

                {/* Status Row */}
                <div className={cn(FLEX_ROW_BETWEEN, "py-2 border-t border-gray-200 pt-3")}>
                  <span className={TEXT_MUTED}>Status:</span>
                  <div className="flex items-center gap-2">
                    {statusConfig.icon && (
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", statusConfig.bgColor)}>
                        {statusConfig.icon}
                      </div>
                    )}
                    <span className={cn("font-montserrat-semibold text-sm", statusConfig.color)}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                <InfoRow
                  label="Submitted Date:"
                  value={compliance?.submittedAt 
                    ? format(new Date(compliance.submittedAt), "d MMM, yyyy")
                    : "Not Submitted"}
                  valueClassName={compliance?.submittedAt ? "text-gray-900 font-montserrat-semibold" : "text-gray-400"}
                />
                <InfoRow
                  label="Review Date:"
                  value={compliance?.reviewedAt 
                    ? format(new Date(compliance.reviewedAt), "d MMM, yyyy")
                    : "Not Reviewed"}
                  valueClassName={compliance?.reviewedAt ? "text-gray-900 font-montserrat-semibold" : "text-gray-400"}
                />
              </div>
            </section>

            {/* Qualification and Certifications */}
            <section className="mb-8">
              <h3 className={cn(HEADING_5, "mb-4")}>
                Qualification and Certifications
              </h3>
              {qualifications.length === 0 ? (
                <p className={cn(TEXT_MUTED, "p-4 rounded-lg", BG_COLORS.muted)}>
                  No qualifications and certifications added yet
                </p>
              ) : (
                <ul className={cn("space-y-2 p-4 rounded-lg", BG_COLORS.muted)}>
                  {qualifications.map((qual, index) => (
                    <li
                      key={index}
                      className={cn("flex items-center gap-3", TEXT_BODY_SM)}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Signature Section - only for verified */}
            {isVerified && (
              <section className="mb-6 pb-6 border-b border-gray-200">
                <h3 className={cn(HEADING_5, "mb-4")}>
                  Signature
                </h3>
                <div className="h-16 flex items-center">
                  <svg
                    width="100"
                    height="40"
                    viewBox="0 0 100 40"
                    className="text-gray-800"
                  >
                    <path
                      d="M5 30 Q15 15 25 25 T40 20 Q45 10 55 25 T75 20 Q85 15 95 28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </section>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              {/* Edit Button - Only for Approved/Verified */}
              {isVerified && (
                <Button
                  onClick={() => navigate("/support-worker/compliance/edit")}
                  className={cn(
                    "w-full flex items-center justify-center gap-2",
                    "px-4 py-2.5 rounded-lg mb-6 md:mb-8",
                    "bg-primary-600 text-white font-montserrat-semibold",
                    "hover:bg-primary-700"
                  )}
                >
                  <Pen2 className="h-5 w-5" />
                  Update Information
                </Button>
              )}

              {/* Start Verification Link - For Draft/Rejected */}
              {canStartVerification && (
                <Button
                  variant="link"
                  onClick={() => navigate("/support-worker/compliance/verify")}
                  className={cn(
                    "flex items-center justify-center gap-2",
                    "text-primary-600 hover:text-primary-700 font-montserrat-semibold",
                    "py-2 mb-3"
                  )}
                >
                  {compliance?.status === ComplianceStatus.REJECTED ? "Resubmit Verification" : "Start Verification"}
                  <AltArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Footer graphics */}
          <div className="absolute bottom-0 left-0 w-full h-12">
            <img className="h-12" src="/new-res/compliance-footer-vector.svg" alt="Footer Graphic" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for info rows
function InfoRow({
  label,
  value,
  valueClassName = "text-gray-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className={`font-montserrat-semibold text-sm ${valueClassName}`}>{value}</span>
    </div>
  );
}
