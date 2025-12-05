import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPoint } from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import SupportJobApplicationModal from "@/components/supportworker/SupportJobApplicationModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JobPostingCard, JobPosting } from "@/components/supportworker/JobPostingCard";

// Extended job details interface
interface JobDetails extends JobPosting {
  isEarlyApplicant: boolean;
  aboutRole: string;
  tasks: string[];
  requirements: string[];
  additionalNotes: string;
}

const mockJobDetails: JobDetails = {
  id: 1,
  title: "Support Worker",
  providerName: "Care Plus Services",
  providerImage: null,
  location: "Albion Park, AU",
  hourlyRate: 50,
  isEarlyApplicant: true,
  aboutRole:
    "We are looking for a compassionate and reliable support worker to assist an elderly client with daily living activities and provide companionship. The ideal candidate should have a caring attitude, good communication skills, and experience working with seniors or individuals requiring personal support.",
  tasks: [
    "Assist with personal care such as bathing, dressing, and grooming.",
    "Prepare and serve meals according to dietary needs.",
    "Help with light household chores and laundry.",
    "Accompany the client to appointments or short walks.",
    "Monitor and report any changes in health or behavior.",
    "Offer emotional support and companionship throughout the day.",
  ],
  requirements: [
    "Minimum 1-2 years of caregiving or support work experience.",
    "Basic first aid or caregiving certification preferred.",
    "Must be patient, trustworthy, and empathetic.",
    "Reside within or near location",
  ],
  additionalNotes: "Must be an early applicant",
  postedDate: "19th Nov, 2025",
  isSaved: false,
  isApplied: false,
};

export default function SupportJobDetailsPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { user, logout } = useAuth();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // In real app, fetch job details using jobId
  const job = mockJobDetails;

  const handleApply = () => {
    setIsApplicationModalOpen(true);
  };

  const handleApplicationSubmit = (applicationData: any) => {
    console.log("Application submitted:", applicationData);
    setIsApplicationModalOpen(false);
    // Show success message or redirect
    navigate("/support-worker/jobs");
  };

  const handleSaveJob = (e: React.MouseEvent, jobId: number) => {
    e.stopPropagation();
    // Toggle save job status logic here
    console.log("Toggled save for job ID:", jobId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
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
              job={job}
              onSaveJob={handleSaveJob}
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
                  src={job.providerImage || undefined}
                  alt={job.providerName}
                />
                <AvatarFallback>
                  {job.providerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-montserrat-semibold text-gray-900">
                {job.title}
              </h1>
              <p className="text-sm text-gray-500">{job.providerName}</p>
              <div className="flex items-center gap-3 mt-2">
                {job.isEarlyApplicant && (
                  <Badge className="bg-primary-100 text-primary hover:bg-primary-50 border border-primary">
                    Be an early applicant
                  </Badge>
                )}
                <span className="font-montserrat-semibold text-primary text-xs p-1 px-2 w-fit bg-primary-100 rounded-full">
                  ${job.hourlyRate}
                  <span className="text-gray-500 font-normal">/hr</span>
                </span>
              </div>
            </div>

            {/* About the Role */}
            <section className="mb-6">
              <h2 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                About the Role
              </h2>
              <p className="text-gray-600 leading-relaxed">{job.aboutRole}</p>
            </section>

            {/* Tasks */}
            <section className="mb-6">
              <h2 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                Tasks
              </h2>
              <ul className="space-y-2">
                {job.tasks.map((task, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Requirements */}
            <section className="mb-6">
              <h2 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                Requirements
              </h2>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="w-2 h-2 bg-gray-800 rounded-full mt-2 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

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
            {job.additionalNotes && (
              <section className="mb-8">
                <h2 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                  Additional Notes
                </h2>
                <p className="text-gray-600">{job.additionalNotes}</p>
              </section>
            )}

            {/* Apply Button */}
            <Button
              onClick={handleApply}
              disabled={job.isApplied}
              className="w-full bg-primary hover:bg-primary-700 text-white py-6 text-lg font-montserrat-semibold"
            >
              {job.isApplied ? "Already Applied" : "Apply Now"}
            </Button>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <SupportJobApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        onSubmit={handleApplicationSubmit}
        jobTitle={job.title}
      />
    </div>
  );
}
