import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ISearchSupportWorkers,
  WorkerSearchFilters,
} from "@/api/services/participantService";
import { useMyOrganizations, useSupportWorkers } from "@/hooks/useParticipant";
import { CheckCircle, CloseCircle, Magnifer, Filter, MapPoint } from "@solar-icons/react";
import { WaveLoader } from "./Loader";
import { SearchFilters } from "./SearchFilters";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { Spinner } from "./Spinner";

interface SearchSupportWorkersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchSupportWorkers({
  open,
  onOpenChange,
}: SearchSupportWorkersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<WorkerSearchFilters>({
    page: 1,
    limit: 20,
  });
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Update filters when search query changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      keyword: debouncedSearchQuery.trim() || undefined,
      page: 1, // Reset to first page when searching
    }));
  }, [debouncedSearchQuery]);

  // Fetch support workers with current filters
  const {
    data: supportWorkersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useSupportWorkers(filters);

  const { data: organizations } = useMyOrganizations();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useEffect above
  };

  const handleFiltersChange = (newFilters: WorkerSearchFilters) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
      limit: filters.limit, // Preserve limit
    });
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
    });
    setSearchQuery("");
  };

  const handleLoadMore = () => {
    if (supportWorkersData?.pagination.hasNextPage) {
      setFilters((prev) => ({
        ...prev,
        page: (prev.page || 1) + 1,
      }));
    }
  };

  const handleViewProfile = (worker: ISearchSupportWorkers) => {
    navigate(`/participant/profile/${worker._id}`);
    onOpenChange(false);
  };

  const handleOpenInvite = (worker: ISearchSupportWorkers) => {
    navigate(`/participant/invite/${worker._id}`);
    onOpenChange(false);
  };

  const getWorkerInitials = (worker: ISearchSupportWorkers) => {
    return `${worker.firstName.charAt(0)}${worker.lastName.charAt(
      0
    )}`.toUpperCase();
  };

  const getWorkerFullName = (worker: ISearchSupportWorkers) => {
    return `${worker.firstName} ${worker.lastName}`;
  };

  const isWorkerInOrganization = (workerId: string) => {
    return (
      organizations?.some((org) =>
        org.workers?.some((member) => member.workerId?._id === workerId)
      ) || false
    );
  };

  const isWorkerPendingInvite = (workerId: string) => {
    return (
      organizations?.some((org) =>
        org.pendingInvites?.some(
          (invite) =>
            invite.workerId?._id === workerId && invite.status === "pending"
        )
      ) || false
    );
  };

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.stateId || filters.regionId || filters.serviceAreaId || filters.matchParticipantLocation) count++;
    if (filters.skills && filters.skills.length > 0) count++;
    if (filters.languages && filters.languages.length > 0) count++;
    if (filters.minRating) count++;
    if (filters.maxHourlyRate && filters.maxHourlyRate < 100) count++;
    if (filters.onlyVerified) count++;
    return count;
  };

  const getLocationDisplayText = (): string => {
    if (filters.matchParticipantLocation) {
      return "Near me";
    }
    if (filters.stateId) {
      return "Custom location";
    }
    return "All locations";
  };

  // Loading state
  if (isLoading && !supportWorkersData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto border-primary/10">
          <DialogHeader className="border-b border-primary/10 pb-4">
            <DialogTitle className="text-xl font-montserrat-semibold text-primary">
              Find Support Workers
            </DialogTitle>
          </DialogHeader>
          <WaveLoader />
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (isError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto border-primary/10">
          <DialogHeader className="border-b border-primary/10 pb-4">
            <DialogTitle className="text-xl font-montserrat-semibold text-primary">
              Find Support Workers
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 font-montserrat-semibold">
                Failed to load support workers
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error
                  ? error.message
                  : "Please try again later"}
              </p>
              <Button onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const workers = supportWorkersData?.workers || [];
  const pagination = supportWorkersData?.pagination;
  const activeFilterCount = getActiveFilterCount();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-hidden border-primary/10">
        <DialogHeader className="border-b border-primary/10 pb-4">
          <DialogTitle className="text-xl font-montserrat-semibold text-primary">
            Find Support Workers
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Search for qualified support workers across Australia to add to your care network.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 h-full overflow-hidden">
          {/* Mobile Filter Sheet */}
          <div className="lg:hidden">
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Search Filters</SheetTitle>
                  <SheetDescription>
                    Find the perfect support worker for your needs
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <SearchFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onReset={handleResetFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 border-r border-gray-200 pr-6 overflow-y-auto">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search and Filter Controls */}
            <div className="space-y-4 pb-4 border-b border-gray-200">
              <form onSubmit={handleSearch} className="flex space-x-3">
                <div className="relative flex-1">
                  <Magnifer className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/60" />
                  <Input
                    type="search"
                    placeholder="Search by name, bio, or skills..."
                    className="pl-10 border-primary/20 focus:border-primary focus-visible:ring-primary/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/60 hover:text-primary transition-colors"
                    >
                      <CloseCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Mobile Filter Button */}
                <div className="lg:hidden">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFilters(true)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </form>

              {/* Active Filters Display */}
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>

                  {(filters.stateId || filters.regionId || filters.serviceAreaId || filters.matchParticipantLocation) && (
                    <Badge variant="outline" className="text-xs">
                      <MapPoint className="h-3 w-3 mr-1" />
                      {getLocationDisplayText()}
                    </Badge>
                  )}

                  {filters.skills && filters.skills.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Skills ({filters.skills.length})
                    </Badge>
                  )}

                  {filters.languages && filters.languages.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Languages ({filters.languages.length})
                    </Badge>
                  )}

                  {filters.minRating && (
                    <Badge variant="outline" className="text-xs">
                      {filters.minRating}+ stars
                    </Badge>
                  )}

                  {filters.maxHourlyRate && filters.maxHourlyRate < 100 && (
                    <Badge variant="outline" className="text-xs">
                      Under ${filters.maxHourlyRate}/hr
                    </Badge>
                  )}

                  {filters.onlyVerified && (
                    <Badge variant="outline" className="text-xs">
                      Verified only
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-xs h-6 px-2"
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* Results Summary */}
              {pagination && (
                <div className="text-sm text-gray-600">
                  Showing {workers.length} of {pagination.totalResults} support workers
                  {filters.keyword && ` for "${filters.keyword}"`}
                </div>
              )}
            </div>

            {/* Workers List */}
            <div className="flex-1 overflow-y-auto">
              {workers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Magnifer className="w-8 h-8 text-primary/60" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    {searchQuery.trim() || activeFilterCount > 0
                      ? "No support workers found matching your criteria."
                      : "No support workers available at the moment."}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery.trim() || activeFilterCount > 0
                      ? "Try adjusting your search terms or filters."
                      : "Please check back later."}
                  </p>
                  {(searchQuery.trim() || activeFilterCount > 0) && (
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
                      className="mt-4"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4 p-2">
                  {workers.map((worker) => {
                    const isInOrganization = isWorkerInOrganization(worker._id);
                    const isPending = !isInOrganization && isWorkerPendingInvite(worker._id);

                    return (
                      <div
                        key={worker._id}
                        className="border border-primary/10 rounded-lg p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200 bg-white"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-shrink-0">
                            <Avatar className="h-16 w-16 border-2 border-primary/10">
                              <AvatarFallback className="bg-primary text-white text-xl font-montserrat-semibold">
                                {getWorkerInitials(worker)}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                              <div className="flex-1">
                                <h3 className="font-montserrat-semibold text-lg text-gray-900">
                                  {getWorkerFullName(worker)}
                                </h3>

                                {/* Location Info */}
                                <div className="text-sm text-muted-foreground mb-1">
                                  {worker.serviceAreas.length > 0 ? (
                                    worker.serviceAreas.join(", ")
                                  ) : (
                                    worker.stateIds?.map(state => state.name).join(", ") || "Australia"
                                  )}
                                  {worker.distance && (
                                    <span className="ml-2 text-primary font-medium">
                                      • {worker.distance.toFixed(1)}km away
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 text-sm mb-3">
                                  <span className="font-montserrat-semibold text-primary">
                                    ${worker.hourlyRate.baseRate}/hr
                                  </span>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="text-muted-foreground">
                                    ⭐ {worker.ratings.average.toFixed(1)} ({worker.ratings.count} reviews)
                                  </span>
                                  {worker.verificationStatus.identityVerified && (
                                    <>
                                      <span className="text-muted-foreground">•</span>
                                      <span className="text-green-600 text-xs font-montserrat-semibold">
                                        ✓ Verified
                                      </span>
                                    </>
                                  )}
                                </div>

                                {/* Bio */}
                                {worker.bio && (
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {worker.bio}
                                  </p>
                                )}

                                <div className="mb-3">
                                  <p className="text-sm text-gray-600 mb-1">
                                    <strong>Languages:</strong> {worker.languages.join(", ")}
                                  </p>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {worker.skills?.slice(0, 3).map((skill) => (
                                    <span
                                      key={skill._id}
                                      className="text-xs px-2 py-1 rounded-full border bg-gray-100 text-gray-700 border-gray-200 inline-block font-montserrat-semibold"
                                    >
                                      {skill.name}
                                    </span>
                                  ))}
                                  {worker.skills && worker.skills.length > 3 && (
                                    <span className="text-xs px-2 py-1 rounded-full border bg-gray-100 text-gray-700 border-gray-200 inline-block font-montserrat-semibold">
                                      +{worker.skills.length - 3} moren eee
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2 md:flex-col lg:flex-row md:items-end lg:items-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewProfile(worker)}
                                  className="border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40"
                                >
                                  View Profile
                                </Button>

                                {isInOrganization ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled
                                    className="bg-primary-100 border-primary-200 text-primary-700"
                                  >
                                    <CheckCircle size={16} className="mr-1" />
                                    In Network
                                  </Button>
                                ) : isPending ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled
                                    className="bg-green-50 border-green-200 text-green-700"
                                  >
                                    <CheckCircle size={16} className="mr-1" />
                                    Pending
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => handleOpenInvite(worker)}
                                    className="bg-primary hover:bg-primary/90"
                                  >
                                    Invite
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Load More Button */}
                  {pagination?.hasNextPage && (
                    <div className="flex justify-center pt-4">
                      <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          `Load More (${pagination.totalResults - workers.length} remaining)`
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-primary/10">
          <p className="text-sm text-muted-foreground text-center">
            Found {pagination?.totalResults || 0} support workers
            {(pagination?.totalResults || 0) !== 1 ? "s" : ""}
            {filters.keyword && ` matching "${filters.keyword}"`}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
