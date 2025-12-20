import { useNavigate, useParams } from "react-router-dom";
import {
  MapPoint,
  Pen2,
  SuitcaseTag,
  DollarMinimalistic,
  ClockCircle,
  CheckCircle,
  UsersGroupRounded,
  Document,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useGetJobById } from "@/hooks/useJobHooks";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function ParticipantJobDetailsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
        return "Open";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <ErrorDisplay message="Failed to load job details" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <GeneralHeader
            stickyTop={false}
            showBackButton
            title="Job Details"
            subtitle=""
            user={user}
            onLogout={logout}
            onViewProfile={() => navigate("/participant/profile")}
          />
        </div>

        {/* Job Header Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">
                  {job.jobRole}
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
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPoint className="h-4 w-4" />
                <span className="text-sm">{job.location}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>Posted: {formatDate(job.createdAt)}</span>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/participant/jobs/${jobId}/edit`)}
              className="bg-primary hover:bg-primary/90"
            >
              <Pen2 className="h-4 w-4 mr-2" />
              Edit Job
            </Button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <DollarMinimalistic className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold text-primary">
                ${job.price}
              </p>
              <p className="text-xs text-gray-500">per hour</p>
            </div>
            <div className="text-center">
              <ClockCircle className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {Object.values(job.requiredCompetencies).map(v => v ? 1 : 0).reduce((a, b) => a + b, 0)}
              </p>
              <p className="text-xs text-gray-500">Competencies Checks</p>
            </div>
            <div className="text-center">
              <UsersGroupRounded className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {job.applicationCount}
              </p>
              <p className="text-xs text-gray-500">Applicants</p>
            </div>
            <div className="text-center">
              <SuitcaseTag className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900 truncate">
                {job.jobRole}
              </p>
              <p className="text-xs text-gray-500">Position</p>
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
                +{job.applicationCount} support workers have applied
              </span>
            </div>
          )}

          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Document className="h-5 w-5 text-primary" />
              Job Description
            </h3>
            <div className="text-sm text-gray-600 space-y-4 whitespace-pre-line">
              {job.jobDescription}
            </div>
          </div>

          {/* Required Competencies */}
          {getCompetencies().length > 0 && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Required Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {getCompetencies().map((comp, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-full flex items-center gap-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

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

          {/* Additional Notes */}
          {job.additionalNote && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <p className="text-sm text-gray-600">{job.additionalNote}</p>
            </div>
          )}

          {/* Location */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPoint className="h-5 w-5 text-primary" />
              Location
            </h3>
            <p className="text-sm text-gray-600">{job.location}</p>
          </div>

          {/* Action Button */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <Button
              onClick={() => navigate(`/participant/jobs/${jobId}/applicants`)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              View Applicants ({job.applicationCount})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}