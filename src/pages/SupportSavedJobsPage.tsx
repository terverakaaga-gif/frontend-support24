import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AltArrowLeft,
  AltArrowRight,
  BookmarkCircle,
  Magnifer,
  SuitcaseTag,
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
import {
  useGetMySavedJobs,
  useToggleSaveJob,
  useGetMyApplications,
} from "@/hooks/useJobHooks";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { formatDistanceToNow } from "date-fns";
import { JobPostingCard } from "@/components/supportworker/JobPostingCard";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";

export default function SupportSavedJobsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch saved jobs and applications
  const {
    data: savedJobsData,
    isLoading: isLoadingSavedJobs,
    error: savedJobsError,
  } = useGetMySavedJobs();
  const { data: applicationsData } = useGetMyApplications();
  const toggleSaveMutation = useToggleSaveJob();

  // Get applied job IDs
  const appliedJobIds = useMemo(() => {
    if (!applicationsData?.applications) return new Set<string>();
    return new Set(
      applicationsData.applications.map((app) =>
        typeof app.jobId === "string" ? app.jobId : app.jobId._id
      )
    );
  }, [applicationsData]);

  // Map saved jobs to display format
  const savedJobs = useMemo(() => {
    if (!savedJobsData?.savedJobs) return [];

    return savedJobsData.savedJobs.map((savedJob) => {
      const job = savedJob.jobId;
      return {
        id: job._id,
        title: job.jobRole,
        providerName: `${job.postedBy.firstName} ${job.postedBy.lastName}`,
        providerImage: job.postedBy.profileImage || null,
        location: job.location,
        hourlyRate: job.price,
        description: job.jobDescription,
        postedDate: formatDistanceToNow(new Date(job.createdAt), {
          addSuffix: true,
        }),
        savedDate: formatDistanceToNow(new Date(savedJob.savedAt), {
          addSuffix: true,
        }),
        isEarlyApplicant: false,
        isApplied: appliedJobIds.has(job._id),
      };
    });
  }, [savedJobsData, appliedJobIds]);

  // Filter saved jobs based on search
  const filteredJobs = useMemo(() => {
    return savedJobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.providerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [savedJobs, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handleUnsaveJob = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    try {
      await toggleSaveMutation.mutateAsync(jobId);
    } catch (error) {
      console.error("Failed to unsave job:", error);
    }
  };

  const handleApply = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    navigate(`/support-worker/jobs/${jobId}`);
  };

  const getStatusBadge = (job: (typeof savedJobs)[0]) => {
    if (job.isApplied) {
      return { text: "Applied", class: "bg-green-100 text-green-800" };
    }
    if (job.isEarlyApplicant) {
      return {
        text: "Early Applicant",
        class: "bg-primary-100 text-primary-800",
      };
    }
    return { text: "Open", class: "bg-primary/10 text-primary" };
  };

  if (isLoadingSavedJobs) {
    return <Loader />;
  }

  if (savedJobsError) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <ErrorDisplay message="Failed to load saved jobs" />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentJobs.map((job) => {
            const status = getStatusBadge(job);
            return (
              <JobPostingCard
                key={job.id}
                job={{ ...job, isSaved: true }}
                onSaveJob={(e) => handleUnsaveJob(e, job.id)}
                onApply={(e) => handleApply(e, job.id)}
                isActive={true}
                variant="compact"
              />
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
