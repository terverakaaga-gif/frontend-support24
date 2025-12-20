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
import ErrorDisplay from "@/components/ErrorDisplay";
import Loader from "@/components/Loader";

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
        return "Available";
      case "closed":
        return "Unavailable";
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
    skills: [], // Skills can be extracted from jobDescription if needed
    hourlyRate: job.price,
    availability: getAvailabilityLabel(job.jobType),
    location: job.location,
    applicants: job.applicationCount,
    status: getStatusLabel(job.status),
    image: job.postedBy.profileImage || null,
  };
};

type FilterType = "all" | "available" | "unavailable";
type AvailabilityType = "all" | "full-time" | "part-time" | "casual";

export default function ProviderJobsPage() {
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
        (job.type === 'job' && job.workerName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        currentFilter === "all" ||
        (currentFilter === "available" && job.status === "Available") ||
        (currentFilter === "unavailable" && job.status === "Unavailable");

      // Availability filter
      const matchesAvailability =
        availabilityFilter === "all" ||
        (job.type === 'job' && job.availability?.toLowerCase() === availabilityFilter);

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
    if (window.confirm("Are you sure you want to delete this job listing?")) {
      try {
        await deleteJobMutation.mutateAsync(String(id));
      } catch (error) {
        console.error("Failed to delete job:", error);
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
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <ErrorDisplay message="Failed to load jobs" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <GeneralHeader
        stickyTop={true}
        title="Job Listings"
        subtitle="Browse and manage your job postings"
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/provider/profile")}
        rightComponent={
          <div className="w-full md:w-fit flex flex-col md:flex-row gap-2">
            <Input
              placeholder="Search by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-36 lg:w-64"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 md:flex-none ${
                  showFilters ? "bg-primary text-white" : ""
                }`}
              >
                <Tuning2 className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Filters</span>
                {hasActiveLocationFilters && (
                  <Badge className="ml-2 bg-white text-primary h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    !
                  </Badge>
                )}
              </Button>
              <Button
                onClick={() => navigate("/provider/jobs/create")}
                className="flex-1 md:flex-none bg-primary hover:bg-primary-700"
              >
                <AddCircle className="h-5 w-5 md:mr-2" />
                <span className="hidden sm:inline">Create Jobs</span>
              </Button>
            </div>
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
                currentFilter === "available"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setCurrentFilter("available");
                setCurrentPage(1);
              }}
            >
              Available
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "unavailable"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setCurrentFilter("unavailable");
                setCurrentPage(1);
              }}
            >
              Unavailable
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentJobs.map((job) => (
            <PostCard
              key={job.id}
              post={job}
              basePath={
                document.location.pathname.includes("/provider")
                  ? "provider/jobs"
                  : "participant/provider/jobs"
              }
              onDelete={handleDelete}
            />
          ))}
        </div>

        {currentJobs.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            <SuitcaseTag className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="font-semibold">No support workers found</p>
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
