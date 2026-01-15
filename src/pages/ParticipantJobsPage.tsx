import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AltArrowLeft,
  AltArrowRight,
  AddCircle,
  SuitcaseTag,
  Tuning2,
  MapPoint,
  CloseCircle,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { cn, PAGE_WRAPPER } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING, FLEX_LAYOUTS, GAP, GRID_LAYOUTS } from "@/constants/design-system";
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
import { PostCard, Post } from "@/components/provider/PostCard";
import {
  useStates,
  useRegions,
  useServiceAreasByRegion,
} from "@/hooks/useLocationHooks";
import { Badge } from "@/components/ui/badge";
import { useGetMyPostedJobs, useDeleteJob } from "@/hooks/useJobHooks";
import { Job } from "@/api/services/jobService";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";

// Helper function to map Job API response to Post interface
const mapJobToPost = (job: Job): Post => {
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

  return {
    type: "job",
    id: job._id,
    title: job.jobRole,
    workerName: `${job.postedBy.firstName} ${job.postedBy.lastName}`,
    skills: [],
    hourlyRate: job.price,
    availability: getAvailabilityLabel(job.jobType),
    location: job.location,
    applicants: job.applicationCount,
    status: getStatusLabel(job.status),
    image: job.postedBy.profileImage || null,
  };
};

type FilterType = "all" | "open" | "closed";
type AvailabilityType = "all" | "full-time" | "part-time" | "casual";

export default function ParticipantJobsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityType>("all");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Location filters
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedServiceAreaIds, setSelectedServiceAreaIds] = useState<
    string[]
  >([]);

  // Fetch my posted jobs
  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    error: jobsError,
  } = useGetMyPostedJobs({
    includeDeleted: false,
  });

  // Delete job mutation
  const deleteJobMutation = useDeleteJob();

  // Location hooks
  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const { data: regions = [], isLoading: isLoadingRegions } = useRegions(
    selectedStateId,
    !!selectedStateId
  );
  const { data: serviceAreas = [], isLoading: isLoadingServiceAreas } =
    useServiceAreasByRegion(selectedRegionId, !!selectedRegionId);

  // Handle state change
  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    setSelectedRegionId("");
    setSelectedServiceAreaIds([]);
    setCurrentPage(1);
  };

  // Handle region change
  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId);
    setSelectedServiceAreaIds([]);
    setCurrentPage(1);
  };

  // Handle service area toggle
  const handleServiceAreaToggle = (serviceAreaId: string) => {
    setSelectedServiceAreaIds((prev) =>
      prev.includes(serviceAreaId)
        ? prev.filter((id) => id !== serviceAreaId)
        : [...prev, serviceAreaId]
    );
    setCurrentPage(1);
  };

  // Clear all location filters
  const clearLocationFilters = () => {
    setSelectedStateId("");
    setSelectedRegionId("");
    setSelectedServiceAreaIds([]);
    setCurrentPage(1);
  };

  // Map API jobs to Post format and apply filters
  const filteredJobs = useMemo(() => {
    if (!jobsData?.jobs) return [];

    const mappedJobs = jobsData.jobs.map(mapJobToPost);

    return mappedJobs.filter((job) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ('workerName' in job && job.workerName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        currentFilter === "all" ||
        (currentFilter === "open" && job.status === "Open") ||
        (currentFilter === "closed" && job.status === "Closed");

      // Availability filter
      const matchesAvailability =
        availabilityFilter === "all" ||
        (job.type === "job" && job.availability?.toLowerCase() === availabilityFilter);

      // Location filters - would need to be implemented on backend
      // For now, we'll just return true
      const matchesLocation = true;

      return (
        matchesSearch && matchesStatus && matchesAvailability && matchesLocation
      );
    });
  }, [jobsData, searchQuery, currentFilter, availabilityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handleDelete = async (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await deleteJobMutation.mutateAsync(id as string);
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const hasActiveLocationFilters =
    selectedStateId || selectedRegionId || selectedServiceAreaIds.length > 0;

  if (isLoadingJobs) {
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
    <div className={PAGE_WRAPPER}>
      <GeneralHeader
        stickyTop={true}
        title="My Job Postings"
        subtitle="Create and manage your support worker requests"
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/participant/profile")}
        rightComponent={
          <div className={cn(FLEX_LAYOUTS.rowWrap, GAP.responsive)}>
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 md:w-64"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-primary text-white" : ""}
            >
              <Tuning2 className="h-5 w-5 mr-2" />
              Filters
              {hasActiveLocationFilters && (
                <Badge className="ml-2 bg-white text-primary h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  !
                </Badge>
              )}
            </Button>
            <Button
              onClick={() => navigate("/participant/jobs/create")}
              className="bg-primary hover:bg-primary-700"
            >
              <AddCircle className="h-5 w-5 mr-2" />
              Post Job
            </Button>
          </div>
        }
      />

      {/* Location Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPoint className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Location Filters</h3>
            </div>
            {hasActiveLocationFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearLocationFilters}
                className="text-gray-500 hover:text-red-600"
              >
                <CloseCircle className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* State Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                State
              </label>
              <Select
                value={selectedStateId}
                onValueChange={handleStateChange}
                disabled={isLoadingStates}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state._id} value={state._id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Region
              </label>
              <Select
                value={selectedRegionId}
                onValueChange={handleRegionChange}
                disabled={!selectedStateId || isLoadingRegions}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedStateId ? "All Regions" : "Select state first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region._id} value={region._id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service Areas */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Service Areas
              </label>
              {selectedRegionId && !isLoadingServiceAreas ? (
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                  {serviceAreas.map((area) => (
                    <Badge
                      key={area._id}
                      variant={
                        selectedServiceAreaIds.includes(area._id)
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer transition-all ${
                        selectedServiceAreaIds.includes(area._id)
                          ? "bg-primary text-white"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => handleServiceAreaToggle(area._id)}
                    >
                      {area.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="p-3 border rounded-lg bg-gray-50 text-sm text-gray-500">
                  {!selectedRegionId
                    ? "Select a region first"
                    : "Loading areas..."}
                </div>
              )}
            </div>
          </div>

          {/* Selected Filters Summary */}
          {hasActiveLocationFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Active filters:</p>
              <div className="flex flex-wrap gap-2">
                {selectedStateId && (
                  <Badge variant="secondary" className="gap-1">
                    {states.find((s) => s._id === selectedStateId)?.name}
                    <button onClick={() => handleStateChange("")}>
                      <CloseCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedRegionId && (
                  <Badge variant="secondary" className="gap-1">
                    {regions.find((r) => r._id === selectedRegionId)?.name}
                    <button onClick={() => handleRegionChange("")}>
                      <CloseCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedServiceAreaIds.map((areaId) => (
                  <Badge key={areaId} variant="secondary" className="gap-1">
                    {serviceAreas.find((a) => a._id === areaId)?.name}
                    <button onClick={() => handleServiceAreaToggle(areaId)}>
                      <CloseCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-8 md:mb-12 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {/* Status Filters */}
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "all"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setCurrentFilter("all");
                setCurrentPage(1);
              }}
            >
              All
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "open"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setCurrentFilter("open");
                setCurrentPage(1);
              }}
            >
              Open
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "closed"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setCurrentFilter("closed");
                setCurrentPage(1);
              }}
            >
              Closed
            </Button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Availability Type Filters */}
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                availabilityFilter === "all"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setAvailabilityFilter("all");
                setCurrentPage(1);
              }}
            >
              All Types
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                availabilityFilter === "full-time"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setAvailabilityFilter("full-time");
                setCurrentPage(1);
              }}
            >
              Full-time
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                availabilityFilter === "part-time"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setAvailabilityFilter("part-time");
                setCurrentPage(1);
              }}
            >
              Part-time
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                availabilityFilter === "casual"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setAvailabilityFilter("casual");
                setCurrentPage(1);
              }}
            >
              Casual
            </Button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className={cn(GRID_LAYOUTS.responsive, GAP.responsive)}>
          {currentJobs.map((job) => (
            <PostCard
              key={job.id}
              post={job}
              basePath="participant/jobs"
              onDelete={handleDelete}
            />
          ))}
        </div>

        {currentJobs.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            <SuitcaseTag className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="font-semibold">No job postings found</p>
            <p className="text-sm mt-1">
              Try adjusting your search or filters, or create a new job posting
            </p>
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