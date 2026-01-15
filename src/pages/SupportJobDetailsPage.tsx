import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPoint, CheckCircle } from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import SupportJobApplicationModal from "@/components/supportworker/SupportJobApplicationModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JobPostingCard } from "@/components/supportworker/JobPostingCard";
import { useGetJobById, useToggleSaveJob } from "@/hooks/useJobHooks";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { formatDistanceToNow } from "date-fns";

export default function SupportJobDetailsPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { user, logout } = useAuth();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Fetch job details
  const { data: jobData, isLoading, error } = useGetJobById(jobId);
  const toggleSaveMutation = useToggleSaveJob();

  const handleApply = () => {
    setIsApplicationModalOpen(true);
  };

  const handleApplicationSubmit = () => {
    setIsApplicationModalOpen(false);
    navigate("/support-worker/jobs");
  };

  const handleSaveJob = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    try {
      await toggleSaveMutation.mutateAsync(jobId);
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !jobData) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <ErrorDisplay message="Failed to load job details" />
      </div>
    );
  }

  const job = jobData.job;
  const isSaved = jobData.isSaved;
  const hasApplied = jobData.hasApplied;

  // Map job to JobPostingCard format
  const jobForCard = {
    id: job._id,
    title: job.jobRole,
    providerName: `${job.postedBy.firstName} ${job.postedBy.lastName}`,
    providerImage: job.postedBy.profileImage || null,
    location: job.location,
    hourlyRate: job.price,
    postedDate: formatDistanceToNow(new Date(job.createdAt), {
      addSuffix: true,
    }),
    isSaved: isSaved,
    isApplied: hasApplied,
  };

  // Get competencies as array
  const getCompetencies = () => {
    const competencies = [];
    const competencyLabels: Record<string, string> = {
      rightToWorkInAustralia: "Right to Work in Australia",
      ndisWorkerScreeningCheck: "NDIS Worker Screening Check",
      wwcc: "Working with Children Check",
      policeCheck: "Police Check",
      firstAid: "First Aid",
      cpr: "CPR",
      ahpraRegistration: "AHPRA Registration",
      professionalIndemnityInsurance: "Professional Indemnity Insurance",
      covidVaccinationStatus: "COVID-19 Vaccination",
    };

    Object.entries(job.requiredCompetencies).forEach(([key, value]) => {
      if (value && competencyLabels[key]) {
        competencies.push(competencyLabels[key]);
      }
    });

    return competencies;
  };

  const competencies = getCompetencies();

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      <GeneralHeader
        showBackButton={true}
        stickyTop={true}
        title="Job Details"
        subtitle="View job details and apply"
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/support-worker/profile")}
      />

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Left Column - Job Card (Hidden on mobile) */}
        <div className="hidden lg:block lg:w-80 xl:w-96 flex-shrink-0">
          <div className="sticky top-24">
            <JobPostingCard
              job={jobForCard}
              onSaveJob={(e) => handleSaveJob(e, job._id)}
              onApply={() => setIsApplicationModalOpen(true)}
              isActive={true}
              variant="default"
            />
          </div>
        </div>

        {/* Right Column - Job Details */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
            {/* Header */}
            <div className="flex flex-col items-center justify-center gap-1 mb-6 border-b pb-6">
              {/* Avatar */}
              <Avatar className="w-24 h-24 mb-4 shadow-md border border-gray-300">
                <AvatarImage
                  src={job.postedBy.profileImage || undefined}
                  alt={`${job.postedBy.firstName} ${job.postedBy.lastName}`}
                />
                <AvatarFallback>
                  {job.postedBy.firstName.charAt(0)}
                  {job.postedBy.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-montserrat-semibold text-gray-900">
                {job.jobRole}
                <span className="font-montserrat-semibold text-primary text-xs p-1 ml-1 px-2 w-fit bg-primary-100 rounded-full">
                  ${job.price}
                  <span className="text-gray-500 font-normal">/hr</span>
                </span>
              </h1>
              <p className="text-sm text-gray-500">
                {job.postedBy.firstName} {job.postedBy.lastName}
              </p>
            </div>

            {/* About the Role */}
            <section className="mb-6">
              <h2 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                About the Role
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {job.jobDescription}
              </p>
            </section>

            {/* Key Responsibilities */}
            {job.keyResponsibilities && (
              <section className="mb-6">
                <h2 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                  Key Responsibilities
                </h2>
                <div
                  className="prose prose-sm max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: job.keyResponsibilities }}
                />
              </section>
            )}

            {/* Required Competencies */}
            {competencies.length > 0 && (
              <section className="mb-6">
                <h2 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                  Required Competencies
                </h2>
                <ul className="space-y-2">
                  {competencies.map((competency, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{competency}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Location */}
            <section className="mb-6">
              <h2 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                Location
              </h2>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPoint className="h-5 w-5" />
                <span>{job.location}</span>
              </div>
            </section>

            {/* Additional Notes */}
            {job.additionalNote && (
              <section className="mb-8">
                <h2 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                  Additional Notes
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {job.additionalNote}
                </p>
              </section>
            )}

            {/* Apply Button */}
            <Button
              onClick={handleApply}
              disabled={hasApplied}
              className="w-full bg-primary hover:bg-primary-700 text-white py-6 text-lg font-montserrat-semibold"
            >
              {hasApplied ? "Already Applied" : "Apply Now"}
            </Button>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <SupportJobApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        onSubmit={handleApplicationSubmit}
        jobId={job._id}
        jobTitle={job.jobRole}
      />
    </div>
  );
}
