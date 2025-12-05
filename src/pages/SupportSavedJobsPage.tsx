import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AltArrowLeft,
  AltArrowRight,
  BookmarkCircle,
  MapPoint,
  Magnifer,
  SuitcaseTag,
  DollarMinimalistic,
  ClockCircle,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface SavedJob {
  id: number;
  title: string;
  providerName: string;
  providerImage: string | null;
  location: string;
  hourlyRate: number;
  description: string;
  postedDate: string;
  savedDate: string;
  isEarlyApplicant: boolean;
  isApplied: boolean;
}

const mockSavedJobs: SavedJob[] = [
  {
    id: 1,
    title: "Support Worker",
    providerName: "Care Plus Services",
    providerImage: null,
    location: "Albion Park, AU",
    hourlyRate: 50,
    description: "I am looking for a compassionate and reliable support worker...",
    postedDate: "19th Nov, 2025",
    savedDate: "20th Nov, 2025",
    isEarlyApplicant: true,
    isApplied: false,
  },
  {
    id: 2,
    title: "Disability Support Worker",
    providerName: "Horizon Care",
    providerImage: null,
    location: "Sydney, NSW",
    hourlyRate: 45,
    description: "Seeking an experienced disability support worker for our client...",
    postedDate: "18th Nov, 2025",
    savedDate: "19th Nov, 2025",
    isEarlyApplicant: false,
    isApplied: false,
  },
  {
    id: 3,
    title: "Personal Care Assistant",
    providerName: "Unity Support",
    providerImage: null,
    location: "Melbourne, VIC",
    hourlyRate: 42,
    description: "Looking for a dedicated personal care assistant to provide daily support...",
    postedDate: "17th Nov, 2025",
    savedDate: "18th Nov, 2025",
    isEarlyApplicant: true,
    isApplied: true,
  },
];

export default function SupportSavedJobsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(mockSavedJobs);

  // Filter saved jobs based on search
  const filteredJobs = savedJobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.providerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handleUnsaveJob = (e: React.MouseEvent, jobId: number) => {
    e.stopPropagation();
    setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleApply = (e: React.MouseEvent, jobId: number) => {
    e.stopPropagation();
    navigate(`/support-worker/jobs/${jobId}`);
  };

  const getStatusBadge = (job: SavedJob) => {
    if (job.isApplied) {
      return { text: "Applied", class: "bg-green-100 text-green-800" };
    }
    if (job.isEarlyApplicant) {
      return { text: "Early Applicant", class: "bg-primary-100 text-primary-800" };
    }
    return { text: "Open", class: "bg-primary/10 text-primary" };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <GeneralHeader
        stickyTop={true}
        title="Saved Jobs"
        subtitle="View and manage your saved job opportunities"
        user={user}
        onLogout={() => {}}
        onViewProfile={() => navigate("/support-worker/profile")}
        rightComponent={
          <div className="w-fit flex gap-2">
            <div className="relative">
              <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search saved jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 md:w-72 pl-10"
              />
            </div>
          </div>
        }
      />

      {/* Saved Jobs Count */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <BookmarkCircle className="h-5 w-5 text-primary" />
          <span className="text-gray-600 font-medium">
            {savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Saved Jobs Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentJobs.map((job) => {
            const status = getStatusBadge(job);
            return (
              <div
                key={job.id}
                onClick={() => navigate(`/support-worker/jobs/${job.id}`)}
                className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col relative"
              >
                <div className="flex-1">
                  {/* Image Placeholder with Status Badge and Unsave Button */}
                  <div className="relative w-full h-36 md:h-28 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    {job.providerImage ? (
                      <img
                        src={job.providerImage}
                        alt={job.providerName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <SuitcaseTag className="h-8 w-8 text-gray-400" />
                    )}

                    {/* Status Badge - Bottom Left */}
                    <span
                      className={`absolute bottom-1 left-1 px-2 py-0.5 rounded-full text-xs font-semibold ${status.class}`}
                    >
                      {status.text}
                    </span>

                    {/* Unsave Button - Top Right */}
                    <button
                      onClick={(e) => handleUnsaveJob(e, job.id)}
                      className="absolute top-1 right-1 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                      title="Remove from saved"
                    >
                      <BookmarkCircle className="h-4 w-4 text-primary" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                    {job.title}
                  </h3>

                  {/* Provider Name */}
                  <p className="text-xs text-gray-500 mb-2">{job.providerName}</p>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <MapPoint className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>

                  {/* Hourly Rate */}
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <DollarMinimalistic className="h-3 w-3 flex-shrink-0" />
                    <span className="font-semibold text-primary text-xs p-1 w-fit bg-primary-100 rounded-full">
                      ${job.hourlyRate}/hr
                    </span>
                  </div>

                  {/* Saved Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <ClockCircle className="h-3 w-3 flex-shrink-0" />
                    <span>Saved {job.savedDate}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
                      {job.providerName.charAt(0)}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="font-montserrat-semibold"
                    onClick={(e) => handleApply(e, job.id)}
                  >
                    {job.isApplied ? "View" : "Apply"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {currentJobs.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            <SuitcaseTag className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="font-semibold">No saved jobs</p>
            <p className="text-sm mt-1">
              Jobs you save will appear here for easy access
            </p>
            <Button
              onClick={() => navigate("/support-worker/jobs")}
              className="mt-4 bg-primary hover:bg-primary/90"
            >
              Browse Jobs
            </Button>
          </div>
        )}

        {/* Pagination */}
        {currentJobs.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Showing</span>
              <Select
                value={entriesPerPage}
                onValueChange={(value) => {
                  setEntriesPerPage(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
              <span>entries</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 h-9 w-9"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <AltArrowLeft className="h-4 w-4" />
              </Button>
              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 ${
                    currentPage === page
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 h-9 w-9"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <AltArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}