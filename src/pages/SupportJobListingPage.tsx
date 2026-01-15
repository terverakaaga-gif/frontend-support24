import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AltArrowLeft,
  AltArrowRight,
  Magnifer,
  SuitcaseTag,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";
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
  useGetJobs,
  useToggleSaveJob,
  useGetMyApplications,
} from "@/hooks/useJobHooks";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { formatDistanceToNow } from "date-fns";
import { JobPostingCard } from "@/components/supportworker/JobPostingCard";

type FilterType = "all" | "applied";

export default function SupportJobListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch jobs and applications
  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    error: jobsError,
  } = useGetJobs({ status: "active" });
  const { data: applicationsData, isLoading: isLoadingApplications } =
    useGetMyApplications();
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

  // Map API jobs to display format
  const jobs = useMemo(() => {
    if (!jobsData?.jobs) return [];

    return jobsData.jobs.map((job) => ({
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
      isEarlyApplicant: false, // Can be calculated based on application count
      isSaved: false, // Will be managed by toggleSave
      isApplied: appliedJobIds.has(job._id),
    }));
  }, [jobsData, appliedJobIds]);

  // Filter jobs based on search and filter type
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.providerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "applied" && job.isApplied);

      return matchesSearch && matchesFilter;
    });
  }, [jobs, searchQuery, currentFilter]);

  // Get applied count
  const appliedCount = jobs.filter((job) => job.isApplied).length;

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handleSaveJob = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    try {
      await toggleSaveMutation.mutateAsync(jobId);
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  };

  const handleApply = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    navigate(`/support-worker/jobs/${jobId}`);
  };

  const getStatusBadge = (job: (typeof jobs)[0]) => {
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

  if (isLoadingJobs || isLoadingApplications) {
    return <Loader />;
  }

  if (jobsError) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <ErrorDisplay message="Failed to load jobs" />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      <GeneralHeader
        stickyTop={true}
        title="Jobs"
        subtitle="Browse and apply for available support worker opportunities"
        user={user}
        onLogout={() => {}}
        onViewProfile={() => navigate("/support-worker/profile")}
        rightComponent={
          <div className="w-fit flex gap-2">
            <div className="relative">
              <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search jobs here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 md:w-72 pl-10"
              />
            </div>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="mb-8 md:mb-12 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            size="sm"
            className={`h-6 rounded-full text-sm font-montserrat-semibold ${
              currentFilter === "all"
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white text-black hover:text-white hover:bg-primary border border-gray-200"
            }`}
            onClick={() => {
              setCurrentFilter("all");
              setCurrentPage(1);
            }}
          >
            All Jobs
          </Button>
          <Button
            variant="default"
            size="sm"
            className={`h-6 rounded-full text-sm font-montserrat-semibold ${
              currentFilter === "applied"
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white text-black hover:text-white hover:bg-primary border border-gray-200"
            }`}
            onClick={() => {
              setCurrentFilter("applied");
              setCurrentPage(1);
            }}
          >
            Applied
            <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {appliedCount}
            </span>
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentJobs.map((job) => {
            const status = getStatusBadge(job);
            return (
              <JobPostingCard
                key={job.id}
                job={job}
                onSaveJob={handleSaveJob}
                onApply={handleApply}
                isActive={true}
                variant="compact"
              />
            );
          })}
        </div>

        {currentJobs.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            <SuitcaseTag className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="font-montserrat-semibold">No jobs found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
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
                disabled={currentPage === totalPages}
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
