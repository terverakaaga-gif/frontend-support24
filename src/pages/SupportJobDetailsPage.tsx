import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AltArrowLeft, MapPoint } from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import SupportJobApplicationModal from "@/components/supportworker/SupportJobApplicationModal";

// Mock job details
interface JobDetails {
  id: number;
  title: string;
  providerName: string;
  providerImage: string | null;
  location: string;
  hourlyRate: number;
  isEarlyApplicant: boolean;
  aboutRole: string;
  tasks: string[];
  requirements: string[];
  additionalNotes: string;
  postedDate: string;
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
};

export default function SupportJobDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // In real app, fetch job details using id
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <GeneralHeader
        stickyTop={true}
        title="Jobs"
        subtitle="Browse and apply for available support worker opportunities"
        user={user}
        onLogout={() => {}}
        onViewProfile={() => navigate("/support-worker/profile")}
        rightComponent={
          <Button
            variant="ghost"
            onClick={() => navigate("/support-worker/jobs")}
            className="flex items-center gap-2"
          >
            <AltArrowLeft className="h-5 w-5" />
            Back to Jobs
          </Button>
        }
      />

      {/* Job Details Card */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center gap-3">
              {job.isEarlyApplicant && (
                <Badge className="bg-blue-100 text-primary hover:bg-blue-100 border border-primary">
                  Be an early applicant
                </Badge>
              )}
              <span className="font-semibold text-primary text-xs p-1 w-fit bg-primary-100 rounded-full">
                ${job.hourlyRate}
                <span className="text-gray-500 font-normal">/hr</span>
              </span>
            </div>
          </div>

          {/* About the Role */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              About the Role
            </h2>
            <p className="text-gray-600 leading-relaxed">{job.aboutRole}</p>
          </section>

          {/* Tasks */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Tasks</h2>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Requirement
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
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Location
            </h2>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPoint className="h-5 w-5" />
              <span>{job.location}</span>
            </div>
          </section>

          {/* Additional Notes */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Additional Notes
            </h2>
            <p className="text-gray-600">{job.additionalNotes}</p>
          </section>

          {/* Apply Button */}
          <Button
            onClick={handleApply}
            className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
          >
            Apply
          </Button>
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
