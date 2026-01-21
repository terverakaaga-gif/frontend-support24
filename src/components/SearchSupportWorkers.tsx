import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  WorkerSearchFilters,
  ISearchSupportWorkers,
} from "@/api/services/participantService";
import { useMyOrganizations, useSupportWorkers } from "@/hooks/useParticipant";
import { useProfile } from "@/hooks/useProfile";
import { useGetServiceTypes } from "@/hooks/useServiceTypeHooks";
import { Participant } from "@/types/user.types";
import {
  CheckCircle,
  CloseCircle,
  Magnifer,
  Filter,
  MapPoint,
  ClockCircle,
} from "@solar-icons/react";
import { WaveLoader } from "./Loader";
import { SearchFilters } from "./SearchFilters";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "./Spinner";

// Design System
import {
  cn,
  FLEX_ROW_BETWEEN,
  FLEX_ROW_CENTER,
  FLEX_COL,
} from "@/lib/design-utils";
import {
  BG_COLORS,
  TEXT_COLORS,
  GAP,
  BUTTON_VARIANTS,
  SPACING,
  RADIUS,
  HEADING_STYLES,
  FONT_FAMILY,
  TEXT_STYLES
} from "@/constants/design-system";

interface SearchSupportWorkersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchSupportWorkers({
  open,
  onOpenChange,
}: SearchSupportWorkersProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<WorkerSearchFilters>({
    page: 1,
    limit: 20,
  });

  // Data Hooks
  const { data: skills, isLoading: loadingSkills } = useGetServiceTypes();
  const { data: profileData } = useProfile();
  const { data: organizations } = useMyOrganizations();

  const participantProfile = profileData?.user as Participant | undefined;

  // Build search filters based on applied filters and participant location
  const searchFilters = useMemo(() => {
    const baseFilters = {
      ...appliedFilters,
      keyword: searchQuery || undefined,
    };

    // If "Match my location" is enabled, use participant's location
    if (appliedFilters.matchParticipantLocation && participantProfile) {
      return {
        ...baseFilters,
        stateId: participantProfile.stateId || undefined,
        regionId: participantProfile.regionId || undefined,
        serviceAreaId: participantProfile.serviceAreaId || undefined,
        matchParticipantLocation: undefined, // Remove the flag after applying
      };
    }

    return baseFilters;
  }, [appliedFilters, searchQuery, participantProfile]);

  // Single query using useSupportWorkers
  const {
    data: supportWorkersData,
    isLoading,
    isError,
    refetch,
  } = useSupportWorkers(searchFilters, {
    enabled: open,
  });

  const workers = supportWorkersData?.workers || [];

  // Handlers
  const handleApplyFilters = (newFilters: WorkerSearchFilters) => {
    setAppliedFilters((prev) => ({ 
      ...prev, 
      ...newFilters, 
      page: 1,
    }));
    setShowFilters(false); // Close mobile sheet
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger refetch by updating filters
    setAppliedFilters((prev) => ({ 
      ...prev, 
      page: 1 
    }));
  };

  const getWorkerStatus = (workerId: string) => {
    const inOrg = organizations?.some((org) =>
      org.workers?.some((m) => m.workerId?._id === workerId)
    );
    if (inOrg) return "network";
    const isPending = organizations?.some((org) =>
      org.pendingInvites?.some(
        (inv) => inv.workerId?._id === workerId && inv.status === "pending"
      )
    );
    if (isPending) return "pending";
    return "none";
  };

  const activeFilterCount = Object.keys(appliedFilters).filter(
    (k) =>
      k !== "page" &&
      k !== "limit" &&
      k !== "keyword" &&
      appliedFilters[k as keyof WorkerSearchFilters]
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[1000px] max-h-[90vh] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden", BG_COLORS.muted)}>
        {/* Header */}
        <DialogHeader className={cn("p-6 pb-4 bg-white border-b flex-none")}>
          <DialogTitle className={cn("text-xl", FONT_FAMILY.montserratBold, TEXT_COLORS.primary, FLEX_ROW_CENTER, GAP.sm)}>
            <Magnifer className="w-6 h-6" /> Find Support Workers
          </DialogTitle>
          <DialogDescription>
            Search for qualified support workers across Australia.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 bg-white border-r p-4 h-full overflow-hidden">
            <SearchFilters
              filters={appliedFilters}
              onApply={handleApplyFilters}
              onReset={() => {
                setAppliedFilters({ page: 1, limit: 20 });
                setSearchQuery("");
              }}
              skills={skills}
              isLoadingSkills={loadingSkills}
              className="h-full"
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Search Bar & Mobile Filter Trigger */}
            <div className="p-4 bg-white border-b flex gap-3 items-center flex-none">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </form>

              {/* Mobile Filter Sheet */}
              <div className="lg:hidden">
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Filter className="w-4 h-4" />
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-white text-xs flex items-center justify-center font-montserrat-bold">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] sm:w-[400px] p-0"
                  >
                    <div className="h-full p-4">
                      <SearchFilters
                        filters={appliedFilters}
                        onApply={handleApplyFilters}
                        onReset={() => {
                          setAppliedFilters({ page: 1, limit: 20 });
                          setSearchQuery("");
                        }}
                        skills={skills}
                        isLoadingSkills={loadingSkills}
                        className="h-full"
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className={cn("p-3 bg-primary-50 border-b flex items-center flex-wrap", GAP.sm)}>
                <span className="text-xs font-montserrat-semibold text-gray-700">Active Filters:</span>
                {appliedFilters.skills && appliedFilters.skills.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {appliedFilters.skills.length} skill{appliedFilters.skills.length > 1 ? 's' : ''}
                  </Badge>
                )}
                {appliedFilters.minRating && (
                  <Badge variant="secondary" className="text-xs">
                    {appliedFilters.minRating}+ stars
                  </Badge>
                )}
                {appliedFilters.maxHourlyRate && (
                  <Badge variant="secondary" className="text-xs">
                    Max ${appliedFilters.maxHourlyRate}/hr
                  </Badge>
                )}
                {appliedFilters.onlyVerified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified only
                  </Badge>
                )}
                {(appliedFilters.stateId || appliedFilters.regionId || appliedFilters.serviceAreaId) && (
                  <Badge variant="secondary" className="text-xs">
                    Location filter
                  </Badge>
                )}
                {appliedFilters.matchParticipantLocation && (
                  <Badge variant="secondary" className="text-xs">
                    <MapPoint className="w-3 h-3 mr-1" />
                    My location
                  </Badge>
                )}
              </div>
            )}

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <WaveLoader />
                </div>
              ) : isError ? (
                <div className="text-center py-10 text-red-500">
                  <p>Failed to load workers.</p>
                  <Button variant="link" onClick={() => refetch()}>
                    Try Again
                  </Button>
                </div>
              ) : workers.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <Magnifer className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="mb-2">No support workers found.</p>
                  {activeFilterCount > 0 && (
                    <p className="text-sm mb-3">Try adjusting your filters</p>
                  )}
                  <Button
                    variant="link"
                    onClick={() => {
                      setAppliedFilters({ page: 1, limit: 20 });
                      setSearchQuery("");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className={cn("grid grid-cols-1", GAP.lg)}>
                  {workers.map((worker: ISearchSupportWorkers) => {
                    const status = getWorkerStatus(worker._id);
                    return (
                      <div
                        key={worker._id}
                        className={cn("bg-white border-2 border-gray-100 hover:border-primary-50 hover:shadow-xl transition-all duration-300 overflow-hidden", RADIUS.xl)}
                      >
                        {/* Header Section with Gradient Background */}
                        <div className="p-6 border-b">
                          <div className={cn(FLEX_COL, "sm:flex-row", GAP.lg)}>
                            {/* Avatar and Status */}
                            <div className="relative flex-shrink-0">
                              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-white shadow-lg">
                                <AvatarImage 
                                  src={worker.profileImage} 
                                  alt={`${worker.firstName} ${worker.lastName}`}
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-700 text-white text-2xl font-montserrat-bold">
                                  {worker.firstName[0]}
                                  {worker.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              {worker.verificationStatus?.identityVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white shadow-md">
                                  <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Worker Info */}
                            <div className="flex-1 min-w-0">
                              <div className={cn(FLEX_COL, "sm:flex-row sm:items-start sm:justify-between", GAP.sm)}>
                                <div className="flex-1">
                                  <h3 className={cn("text-2xl", FONT_FAMILY.montserratBold, "text-gray-900 mb-1")}>
                                    {worker.firstName} {worker.lastName}
                                  </h3>
                                  
                                  {/* Rating and Verification Badges */}
                                  <div className={cn("flex flex-wrap items-center mb-3", GAP.sm)}>
                                    <div className={cn("flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1", RADIUS.lg)}>
                                      <span className="text-amber-500 text-lg">★</span>
                                      <span className="font-montserrat-bold text-amber-700">
                                        {worker.ratings?.average.toFixed(1) || "New"}
                                      </span>
                                      {worker.ratings?.count > 0 && (
                                        <span className="text-xs text-amber-600">
                                          ({worker.ratings.count} reviews)
                                        </span>
                                      )}
                                    </div>
                                    
                                    {worker.verificationStatus?.identityVerified && (
                                      <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                    
                                    {worker.verificationStatus?.ndisWorkerScreeningVerified && (
                                      <Badge variant="outline" className="border-primary-300 bg-primary-50 text-primary-700">
                                        Background Checked
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Location Info */}
                                  <div className={cn("flex flex-wrap items-center gap-3 text-sm text-gray-600")}>
                                    <div className="flex items-center gap-1.5">
                                      <MapPoint className="w-4 h-4 text-primary" />
                                      <span className="font-medium">
                                        {worker.serviceAreas?.length > 0 
                                          ? worker.serviceAreas.slice(0, 2).join(", ")
                                          : worker.stateIds?.map(s => s.name).join(", ") || "Australia"}
                                      </span>
                                    </div>
                                    {worker.distance !== undefined && (
                                      <Badge variant="secondary" className="bg-primary/10 text-primary font-montserrat-semibold">
                                        {worker.distance.toFixed(1)}km away
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Pricing Card */}
                                <div className={cn("bg-white border-2 border-primary/20 p-4 text-center shadow-sm min-w-[70px]", RADIUS.xl)}>
                                  <div className={cn(TEXT_STYLES.caption, "text-primary", FONT_FAMILY.montserratSemibold, "mb-1")}>Hourly Rate</div>
                                  <div className="text-xl font-montserrat-bold text-primary">
                                    ${worker.hourlyRate?.baseRate}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">per hour</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className={cn("p-6", GAP.lg, "space-y-5")}>
                          {/* Bio */}
                          {worker.bio && (
                            <div>
                              <h4 className="text-sm font-montserrat-semibold text-gray-500 uppercase tracking-wide mb-2">
                                About
                              </h4>
                              <p className="text-gray-700 leading-relaxed line-clamp-3">
                                {worker.bio}
                              </p>
                            </div>
                          )}

                          {/* Skills & Services */}
                          {worker.skills && worker.skills.length > 0 && (
                            <div>
                              <h4 className="text-sm font-montserrat-semibold text-gray-500 uppercase tracking-wide mb-3">
                                Skills & Services
                              </h4>
                              <div className={cn("flex flex-wrap", GAP.sm)}>
                                {worker.skills.map((skill: any) => (
                                  <Badge
                                    key={skill._id}
                                    variant="outline"
                                    className="px-3 py-1.5 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 text-primary font-medium hover:bg-primary/20 transition-colors"
                                  >
                                    {skill.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Languages */}
                          {worker.languages && worker.languages.length > 0 && (
                            <div>
                              <h4 className="text-sm font-montserrat-semibold text-gray-500 uppercase tracking-wide mb-3">
                                Languages
                              </h4>
                              <div className={cn("flex flex-wrap", GAP.sm)}>
                                {worker.languages.map((lang: string, idx: number) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 font-medium"
                                  >
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Service Areas - if multiple */}
                          {worker.serviceAreas && worker.serviceAreas.length > 2 && (
                            <div>
                              <h4 className="text-sm font-montserrat-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Service Areas
                              </h4>
                              <p className="text-sm text-gray-600">
                                {worker.serviceAreas.join(" • ")}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Footer with Actions */}
                        <div className={cn("px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between")}>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {status === "network" && (
                              <Badge className="bg-primary text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                In Your Network
                              </Badge>
                            )}
                            {status === "pending" && (
                              <Badge variant="outline" className="border-orange-300 bg-orange-50 text-orange-700">
                                <ClockCircle className="w-3 h-3 mr-1" />
                                Invitation Pending
                              </Badge>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              className="flex-1 sm:flex-none border-primary/30 text-primary hover:bg-primary/5 font-montserrat-semibold"
                              onClick={() => {
                                navigate(`/participant/profile/${worker._id}`);
                                onOpenChange(false);
                              }}
                            >
                              View Full Profile
                            </Button>
                            
                            {status === "none" && (
                              <Button
                                className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-montserrat-semibold shadow-md hover:shadow-lg transition-all"
                                onClick={() => {
                                  navigate(`/participant/invite/${worker._id}`);
                                  onOpenChange(false);
                                }}
                              >
                                Send Invitation
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination Load More */}
              {supportWorkersData?.pagination?.hasNextPage && (
                <div className="py-4 flex justify-center">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setAppliedFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) + 1,
                      }))
                    }
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner /> : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
