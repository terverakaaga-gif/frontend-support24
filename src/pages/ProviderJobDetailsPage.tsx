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
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// Mock job/support worker data
const mockJob = {
  id: 1,
  title: "Support Worker Position",
  workerName: "Sarah Johnson",
  location: "Sydney, NSW 2000",
  hourlyRate: 35,
  availability: "Full-time",
  status: "Available",
  rating: 4.8,
  experience: "5 years",
  applicants: 8,
  image: null,
  bio: `Sarah is an experienced and compassionate support worker with over 5 years of dedicated service in the disability support sector. She is passionate about empowering individuals to live their best lives and achieve their personal goals.

With extensive experience in personal care, mobility assistance, and community participation, Sarah brings a professional yet warm approach to every client interaction. She is NDIS registered and holds all required certifications including First Aid, CPR, and Manual Handling.

Sarah is available for full-time work and is flexible with hours including evenings and weekends when needed. She has her own reliable vehicle and is willing to travel within the greater Sydney area.`,
  skills: [
    "Personal Care",
    "Mobility Assistance",
    "Meal Preparation",
    "Transport",
    "Medication Support",
    "Community Access",
  ],
  qualifications: [
    "Certificate III in Individual Support",
    "Certificate IV in Disability",
    "First Aid & CPR Certified",
    "Manual Handling Certified",
    "NDIS Worker Screening Check",
    "Working with Children Check",
  ],
  languages: ["English", "Mandarin"],
  serviceAreas: [
    "Sydney CBD",
    "Inner West",
    "Eastern Suburbs",
    "North Shore",
  ],
};

export default function ProviderJobDetailsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobId } = useParams();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case "full-time":
        return "bg-blue-100 text-blue-800";
      case "part-time":
        return "bg-purple-100 text-purple-800";
      case "casual":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <GeneralHeader
            stickyTop={false}
            showBackButton
            title={mockJob.workerName}
            subtitle=""
            user={user}
            onLogout={() => {}}
            onViewProfile={() => navigate("/provider/profile")}
          />
        </div>

        {/* Profile Image */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="w-full h-64 md:h-80 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <User className="h-16 w-16 mx-auto mb-2" />
              <p className="text-sm">Profile Image</p>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {mockJob.workerName}
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
              <p className="text-sm text-gray-600">{mockJob.title}</p>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPoint className="h-4 w-4" />
                <span className="text-sm">{mockJob.location}</span>
              </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <DollarMinimalistic className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold text-primary">
                ${mockJob.hourlyRate}
              </p>
              <p className="text-xs text-gray-500">per hour</p>
            </div>
            <div className="text-center">
              <Star className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
              <p className="text-lg font-semibold text-gray-900">
                {mockJob.rating}
              </p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
            <div className="text-center">
              <ClockCircle className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {mockJob.experience}
              </p>
              <p className="text-xs text-gray-500">Experience</p>
            </div>
            <div className="text-center">
              <SuitcaseTag className="h-6 w-6 mx-auto mb-1 text-gray-600" />
              <p className="text-lg font-semibold text-gray-900">
                {mockJob.applicants}
              </p>
              <p className="text-xs text-gray-500">Interested</p>
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
              +{mockJob.applicants} participants interested
            </span>
          </div>

          {/* Bio */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              About
            </h3>
            <div className="text-sm text-gray-600 space-y-4 whitespace-pre-line">
              {mockJob.bio}
            </div>
          </div>

          {/* Skills */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Skills & Services
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockJob.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Qualifications & Certifications
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockJob.qualifications.map((qual, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{qual}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Languages
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
              onClick={() => navigate(`/participant/provider/jobs/${jobId}/interested`)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              View Interested Participants ({mockJob.applicants})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}