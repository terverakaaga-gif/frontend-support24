import GeneralHeader from "@/components/GeneralHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { AltArrowRight, CheckCircle, ClockCircle, CloseCircle } from "@solar-icons/react";
import { useNavigate } from "react-router-dom";
import { useGetMyCompliance } from "@/hooks/useComplianceHooks";
import { ComplianceStatus, DOCUMENT_TYPE_LABELS } from "@/types/compliance.types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/Loader";

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 space-y-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load compliance status</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-8">
      {/* Header */}
      <GeneralHeader
        title="Compliance Check"
        subtitle="Verify your documents and certifications to complete compliance status"
        onLogout={logout}
        user={user}
        onViewProfile={() => navigate("/support-worker/profile")}
      />

      {/* Main Content */}
      <div className="max-w-md font-montserrat-bold mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative pb-12">
          {/* Watermark */}
          {!isVerified && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <img src="/logo.svg" alt="Verified" className="w-full" />
            </div>
          )}

          {isVerified && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none">
              <div className="text-primary-600 font-bold text-8xl md:text-9xl tracking-wider transform rotate-[-15deg]">
                VERIFIED
              </div>
            </div>
          )}

          <div className="relative z-10 p-6 md:p-8">
            {/* Avatar Section */}
            <div className="flex items-center justify-center mb-6 relative">
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
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-semibold text-red-800 mb-2">
                  Your compliance was rejected
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {compliance.rejectionReasons.map((reason, idx) => (
                    <li key={idx}>• {reason}</li>
                  ))}
                </ul>
                {compliance.adminNotes && (
                  <p className="text-sm text-red-600 mt-2 italic">
                    Note: {compliance.adminNotes}
                  </p>
                )}
              </div>
            )}

            {/* Pending Notice */}
            {compliance?.status === ComplianceStatus.PENDING && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Your compliance documents are under review. We'll notify you once the review is complete.
                </p>
              </div>
            )}

            {/* Worker Information */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Worker Information
              </h3>
              <div className="space-y-3">
                <InfoRow
                  label="ID Number:"
                  value={compliance?._id?.slice(-8).toUpperCase() || "Not Available"}
                  valueClassName={compliance?._id ? "text-gray-900" : "text-gray-400"}
                />
                <InfoRow label="Email:" value={user?.email || "N/A"} />
                <InfoRow label="Phone Number:" value={user?.phone || "N/A"} />

                {/* Status Row */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Status:</span>
                  <div className="flex items-center gap-2">
                    {statusConfig.icon && (
                      <div className={`w-5 h-5 ${statusConfig.bgColor} rounded-full flex items-center justify-center`}>
                        {statusConfig.icon}
                      </div>
                    )}
                    <span className={`font-semibold text-sm ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                <InfoRow
                  label="Submitted Date:"
                  value={compliance?.submittedAt 
                    ? format(new Date(compliance.submittedAt), "d MMM, yyyy")
                    : "Not Submitted"}
                  valueClassName={compliance?.submittedAt ? "text-gray-900" : "text-gray-400"}
                />
                <InfoRow
                  label="Review Date:"
                  value={compliance?.reviewedAt 
                    ? format(new Date(compliance.reviewedAt), "d MMM, yyyy")
                    : "Not Reviewed"}
                  valueClassName={compliance?.reviewedAt ? "text-gray-900" : "text-gray-400"}
                />
              </div>
            </section>

            {/* Qualification and Certifications */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Qualification and Certifications
              </h3>
              {qualifications.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No qualifications and certifications added yet
                </p>
              ) : (
                <ul className="space-y-3">
                  {qualifications.map((qual, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-gray-700 text-sm"
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
              <section className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
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

            {/* Start Verification Link */}
            {canStartVerification && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => navigate("/support-worker/compliance/verify")}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm"
                >
                  {compliance?.status === ComplianceStatus.REJECTED ? "Resubmit Verification" : "Start Verification"}
                  <AltArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* Footer graphics */}
          <div className="absolute bottom-0 left-0 w-full h-12rounded-b-2xl">
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
      <span className={`font-semibold text-sm ${valueClassName}`}>{value}</span>
    </div>
  );
}
