import { useNavigate, useParams } from "react-router-dom";
import {
  MapPoint,
  Pen2,
  SuitcaseTag,
  DollarMinimalistic,
  Star,
  ClockCircle,
  CheckCircle,
  User,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useGetJobById } from "@/hooks/useJobHooks";
import { Spinner } from "@/components/Spinner";
import ErrorDisplay from "@/components/ErrorDisplay";
import Loader from "@/components/Loader";

export default function ProviderJobDetailsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobId } = useParams();

  // Fetch job data
  const { data: jobData, isLoading, error } = useGetJobById(jobId);
  
  const job = jobData?.job;

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) {
      return "bg-gray-100 text-gray-800";
    }
    
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (jobType: string) => {
    switch (jobType) {
      case "fullTime":
        return "bg-primary-100 text-primary-800";
      case "partTime":
        return "bg-purple-100 text-purple-800";
      case "casual":
        return "bg-orange-100 text-orange-800";
      case "contract":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityLabel = (jobType: string) => {
    switch (jobType) {
      case "fullTime":
        return "Full-time";
      case "partTime":
        return "Part-time";
      case "casual":
        return "Casual";
      case "contract":
        return "Contract";
      default:
        return jobType;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "closed":
        return "Closed";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  // Get competencies as array
  const getCompetencies = () => {
    if (!job?.requiredCompetencies) return [];
    
    const competencyMap: Record<string, string> = {
      rightToWorkInAustralia: "Right to Work in Australia",
      ndisWorkerScreeningCheck: "NDIS Worker Screening Check",
      wwcc: "Working with Children Check",
      policeCheck: "Police Check",
      firstAid: "First Aid Certified",
      cpr: "CPR Certified",
      ahpraRegistration: "AHPRA Registration",
      professionalIndemnityInsurance: "Professional Indemnity Insurance",
      covidVaccinationStatus: "COVID-19 Vaccination",
    };

    return Object.entries(job.requiredCompetencies)
      .filter(([_, value]) => value === true)
      .map(([key]) => competencyMap[key] || key);
  };

  if (isLoading) {
    return (
     <Loader />
    );
  }

  if (error || !job) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <ErrorDisplay
          message="Failed to load job details"
        />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <GeneralHeader
            stickyTop={false}
            showBackButton
            title={job.jobRole}
            subtitle=""
            user={user}
            onLogout={() => {}}
            onViewProfile={() => navigate("/provider/profile")}
          />
        </div>

        {/* Profile Image */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="w-full h-64 md:h-80 bg-gradient-to-r from-primary-100 to-purple-100 flex items-center justify-center">
            {job.postedBy?.profileImage ? (
              <img
                src={job.postedBy.profileImage}
                alt={`${job.postedBy?.firstName || ''} ${job.postedBy?.lastName || ''}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-gray-400">
                <User className="h-16 w-16 mx-auto mb-2" />
                <p className="text-sm">Profile Image</p>
              </div>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {job.postedBy?.firstName || 'Unknown'} {job.postedBy?.lastName || ''}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    job.status
                  )}`}
                >
                  {getStatusLabel(job.status)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(
                    job.jobType
                  )}`}
                >
                  {getAvailabilityLabel(job.jobType)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{job.jobRole}</p>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPoint className="h-4 w-4" />
                <span className="text-sm">{job.location}</span>
              </div>
              {((job as any).stateId || (job as any).regionId) && (
                <div className="flex items-center gap-2 text-gray-500 mt-1 text-xs">
                  {(job as any).stateId?.name && (
                    <span>{(job as any).stateId.name}</span>
                  )}
                  {(job as any).stateId?.name && (job as any).regionId?.name && (
                    <span>•</span>
                  )}
                  {(job as any).regionId?.name && (
                    <span>{(job as any).regionId.name}</span>
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={() => navigate(`/provider/jobs/${jobId}/edit`)}
              className="bg-primary hover:bg-primary/90"
            >
              <Pen2 className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <DollarMinimalistic className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold text-primary">
                ${job.price}
              </p>
              <p className="text-xs text-gray-500">per hour</p>
            </div>
            <div className="text-center">
              <SuitcaseTag className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {job.applicationCount}
              </p>
              <p className="text-xs text-gray-500">Applications</p>
            </div>
            <div className="text-center">
              <ClockCircle className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {getAvailabilityLabel(job.jobType)}
              </p>
              <p className="text-xs text-gray-500">Work Type</p>
            </div>
          </div>

          {/* Applicants Preview */}
          {job.applicationCount > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                  ></div>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                +{job.applicationCount} applications received
              </span>
            </div>
          )}

          {/* Job Description */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Job Description
            </h3>
            <div className="text-sm text-gray-600 space-y-4 whitespace-pre-line">
              {job.jobDescription}
            </div>
          </div>

          {/* Key Responsibilities */}
          {job.keyResponsibilities && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Key Responsibilities
              </h3>
              <div 
                className="prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: job.keyResponsibilities }}
              />
            </div>
          )}

          {/* Required Competencies */}
          {getCompetencies().length > 0 && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Required Competencies
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getCompetencies().map((competency, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{competency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Notes */}
          {job.additionalNote && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <p className="text-sm text-gray-600">{job.additionalNote}</p>
            </div>
          )}

          {/* Service Areas */}
          {(job as any).serviceAreaIds && (job as any).serviceAreaIds.length > 0 && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPoint className="h-5 w-5 text-primary" />
                Service Areas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {(job as any).serviceAreaIds.map((area: any) => (
                  <div
                    key={area._id}
                    className="p-3 rounded-lg border-2 border-primary bg-primary/5 text-center"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {area.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <Button
              onClick={() => navigate(`/provider/jobs/${jobId}/applicants`)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              View Applications ({job.applicationCount})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}