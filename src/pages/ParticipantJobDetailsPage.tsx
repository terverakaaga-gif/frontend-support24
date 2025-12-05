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

// Mock job posting data
const mockJob = {
  id: 1,
  title: "Personal Care Support Needed",
  description: `We are looking for a compassionate and experienced support worker to assist with daily personal care activities. The ideal candidate will be patient, reliable, and have excellent communication skills.

Key responsibilities include:
- Assisting with personal hygiene and grooming
- Meal preparation and feeding assistance
- Mobility support and transfers
- Accompanying to medical appointments
- Light household tasks

The position requires someone who is respectful of personal boundaries, maintains confidentiality, and can work independently while following care plans. Experience with similar care needs is preferred but not essential for the right candidate.

We offer flexible hours and a supportive environment. The successful applicant will become part of our care team and have opportunities for ongoing work.`,
  location: "Sydney, NSW 2000",
  hourlyRate: 35,
  availability: "Full-time",
  status: "Open",
  experienceRequired: "2+ years",
  applicants: 12,
  postedDate: "2025-11-15",
  closingDate: "2025-12-15",
  requiredSkills: [
    "Personal Care",
    "Mobility Assistance",
    "Meal Preparation",
    "Transport",
    "Medication Support",
  ],
  requiredQualifications: [
    "Certificate III in Individual Support",
    "First Aid & CPR Certified",
    "NDIS Worker Screening Check",
    "Working with Children Check",
  ],
  preferredQualifications: [
    "Certificate IV in Disability",
    "Manual Handling Certified",
    "Driver's License",
    "Own Vehicle",
  ],
  languages: ["English"],
  serviceAreas: [
    "Sydney CBD",
    "Inner West",
    "Eastern Suburbs",
  ],
};

export default function ParticipantJobDetailsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { jobId } = useParams();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case "full-time":
        return "bg-primary-100 text-primary-800";
      case "part-time":
        return "bg-purple-100 text-purple-800";
      case "casual":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
                  {mockJob.title}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    mockJob.status
                  )}`}
                >
                  {mockJob.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(
                    mockJob.availability
                  )}`}
                >
                  {mockJob.availability}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPoint className="h-4 w-4" />
                <span className="text-sm">{mockJob.location}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>Posted: {formatDate(mockJob.postedDate)}</span>
                <span>•</span>
                <span>Closes: {formatDate(mockJob.closingDate)}</span>
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
                ${mockJob.hourlyRate}
              </p>
              <p className="text-xs text-gray-500">per hour</p>
            </div>
            <div className="text-center">
              <ClockCircle className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {mockJob.experienceRequired}
              </p>
              <p className="text-xs text-gray-500">Experience</p>
            </div>
            <div className="text-center">
              <UsersGroupRounded className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {mockJob.applicants}
              </p>
              <p className="text-xs text-gray-500">Applicants</p>
            </div>
            <div className="text-center">
              <SuitcaseTag className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {mockJob.availability}
              </p>
              <p className="text-xs text-gray-500">Type</p>
            </div>
          </div>

          {/* Applicants Preview */}
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
              +{mockJob.applicants} support workers have applied
            </span>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Document className="h-5 w-5 text-primary" />
              Job Description
            </h3>
            <div className="text-sm text-gray-600 space-y-4 whitespace-pre-line">
              {mockJob.description}
            </div>
          </div>

          {/* Required Skills */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Required Skills & Services
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockJob.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Required Qualifications */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Required Qualifications
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockJob.requiredQualifications.map((qual, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{qual}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preferred Qualifications */}
          {mockJob.preferredQualifications.length > 0 && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-500" />
                Preferred Qualifications (Nice to Have)
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockJob.preferredQualifications.map((qual, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Required Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockJob.languages.map((lang, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Service Areas
            </h3>
            <ul className="space-y-3">
              {mockJob.serviceAreas.map((area, index) => (
                <li key={index} className="flex items-start gap-3">
                  <MapPoint className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <Button
              onClick={() => navigate(`/participant/jobs/${jobId}/applicants`)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              View Applicants ({mockJob.applicants})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}