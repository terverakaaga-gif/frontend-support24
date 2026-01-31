import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Magnifer,
  MapPoint,
  Star,
  DollarMinimalistic,
  CloseCircle,
} from "@solar-icons/react";
import { useMyOrganizations } from "@/hooks/useParticipant";
import {
  useStates,
  useRegions,
  useServiceAreas,
  useSupportWorkersByLocation,
} from "@/hooks/useLocationHooks";
import { useSupportWorkers } from "@/hooks/useParticipant";
import Loader from "@/components/Loader";
import GeneralHeader from "@/components/GeneralHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import UnifiedWorkerCard from "@/components/UnifiedWorkerCard";

import {
  cn,
  FLEX_ROW_BETWEEN,
  FLEX_ROW_CENTER,
  FLEX_COL_CENTER,
  PAGE_WRAPPER,
  CARD_FOOTER,
  CARD_CONTENT,
  CARD_HEADER,
  CARD,
} from "@/lib/design-utils";
import {
  GAP,
  BUTTON_VARIANTS,
  BG_COLORS,
  CONTAINER_PADDING,
  GRID_LAYOUTS,
  GAP as GRID_GAP,
  SPACING,
  HEADING_STYLES,
  TEXT_STYLES,
  FONT_FAMILY,
  TEXT_COLORS,
  SHADOW,
  RADIUS,
  BORDER_STYLES,
  ICON_SIZES,
} from "@/constants/design-system";

export default function SearchSupportWorkersPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedServiceArea, setSelectedServiceArea] = useState<string>("");
  const [maxDistance, setMaxDistance] = useState<string>("50");
  const [minRating, setMinRating] = useState<string>("any");
  const [maxHourlyRate, setMaxHourlyRate] = useState<string>("");
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  // Fetch location data
  const { data: states, isLoading: statesLoading } = useStates();
  const { data: regions, isLoading: regionsLoading } = useRegions(
    selectedState,
    !!selectedState
  );
  const { data: serviceAreas, isLoading: serviceAreasLoading } =
    useServiceAreas(selectedState || undefined, selectedRegion || undefined);

  // Fetch organizations for status checking
  const { data: organizations } = useMyOrganizations();

  // Determine if location filters are active
  const hasLocationFilters = !!(
    selectedState ||
    selectedRegion ||
    selectedServiceArea
  );

  // Build filter objects for each search type
  const locationFilters = hasLocationFilters
    ? {
        stateId: selectedState || undefined,
        regionId: selectedRegion || undefined,
        serviceAreaId: selectedServiceArea || undefined,
        maxDistanceKm: maxDistance ? Number(maxDistance) : undefined,
        keyword: searchQuery || undefined,
        minRating:
          minRating && minRating !== "any" ? Number(minRating) : undefined,
        maxHourlyRate: maxHourlyRate ? Number(maxHourlyRate) : undefined,
        onlyVerified: onlyVerified || undefined,
      }
    : undefined;

  const originalFilters = !hasLocationFilters
    ? {
        keyword: searchQuery || undefined,
        minRating:
          minRating && minRating !== "any" ? Number(minRating) : undefined,
        maxHourlyRate: maxHourlyRate ? Number(maxHourlyRate) : undefined,
        onlyVerified: onlyVerified || undefined,
      }
    : undefined;

  // Use location-based search when location filters are present
  const {
    data: locationSearchResponse,
    isLoading: locationSearchLoading,
    isError: locationSearchError,
    error: locationError,
  } = useSupportWorkersByLocation(locationFilters || {}, {
    enabled: hasLocationFilters,
    queryKey: [],
  });

  // Use original search when no location filters
  const {
    data: originalSearchResponse,
    isLoading: originalSearchLoading,
    isError: originalSearchError,
    error: originalError,
  } = useSupportWorkers(originalFilters || {}, {
    enabled: !hasLocationFilters,
    queryKey: [],
  });

  // Use the appropriate response based on which search is active
  const searchResponse = hasLocationFilters
    ? locationSearchResponse
    : originalSearchResponse;

  const searchLoading = hasLocationFilters
    ? locationSearchLoading
    : originalSearchLoading;

  const isError = hasLocationFilters
    ? locationSearchError
    : originalSearchError;

  const error = hasLocationFilters ? locationError : originalError;

  const searchResults = searchResponse?.workers || [];

  // Reset dependent filters when parent changes
  useEffect(() => {
    if (selectedState) {
      setSelectedRegion("");
      setSelectedServiceArea("");
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedRegion) {
      setSelectedServiceArea("");
    }
  }, [selectedRegion]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedRegion("");
    setSelectedServiceArea("");
    setMaxDistance("50");
    setMinRating("any");
    setMaxHourlyRate("");
    setOnlyVerified(false);
  };

  const handleViewProfile = (workerId: string) => {
    navigate(`/participant/profile/${workerId}`);
  };

  const handleInvite = (workerId: string) => {
    navigate(`/participant/invite/${workerId}`);
  };

  const getWorkerInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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

  const hasActiveFilters = !!(
    searchQuery ||
    selectedState ||
    selectedRegion ||
    selectedServiceArea ||
    (minRating && minRating !== "any") ||
    maxHourlyRate ||
    onlyVerified
  );

  return (
    <div className={cn(PAGE_WRAPPER)}>
      <div className="w-full">
        {/* Header */}
        <GeneralHeader
          
          title="Find Support Workers"
          subtitle={
            hasLocationFilters
              ? "Searching by location"
              : "Browse all support workers"
          }
          user={user}
          onLogout={logout}
          onViewProfile={() => navigate(`/participant/profile/`)}
          rightComponent={
            <>
              {/* Desktop Search Bar */}
              <div className="hidden md:block mr-4">
                <div className="relative">
                  <Magnifer className={cn("absolute left-3 top-1/2 transform -translate-y-1/2", ICON_SIZES.md, TEXT_COLORS.gray400)} />
                  <Input
                    type="search"
                    placeholder="Search by name, skills, or keywords..."
                    className={cn(
                      "pl-10 pr-10 h-9",
                      BORDER_STYLES.default,
                      "focus:border-primary focus-visible:ring-primary/20",
                      "w-[300px] lg:w-[400px]"
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/60 hover:text-primary transition-colors"
                    >
                      <CloseCircle className={ICON_SIZES.md} />
                    </button>
                  )}
                </div>
              </div>
            </>
          }
        />

        {/* Mobile Search Bar (Visible only on small screens) */}
        <div className={cn("md:hidden mb-4")}>
          <div className="relative">
            <Magnifer className={cn("absolute left-3 top-1/2 transform -translate-y-1/2", ICON_SIZES.md, TEXT_COLORS.gray400)} />
            <Input
              type="search"
              placeholder="Search by name, skills..."
              className={cn(
                "pl-10 pr-10 h-10 w-full",
                 BORDER_STYLES.default,
                 "focus:border-primary focus-visible:ring-primary/20"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
             {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/60 hover:text-primary transition-colors"
              >
                <CloseCircle className={ICON_SIZES.md} />
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className={cn(BG_COLORS.white, RADIUS.lg, SHADOW.sm, BORDER_STYLES.subtle, `p-4 md:p-${SPACING.md} mb-${SPACING.lg}`)}>
          {/* Filters Grid */}
          <div className={cn("flex flex-wrap items-center", GAP.md)}>
            {/* State Filter */}
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className={cn("h-8 text-xs w-fit", RADIUS.full, BORDER_STYLES.default)}>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {statesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  states?.map((state) => (
                    <SelectItem key={state._id} value={state._id}>
                      {state.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Region Filter */}
            <Select
              value={selectedRegion}
              onValueChange={setSelectedRegion}
              disabled={!selectedState}
            >
              <SelectTrigger className={cn("h-8 text-xs w-fit", RADIUS.full, BORDER_STYLES.default)}>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {regionsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : regions && regions.length > 0 ? (
                  regions.map((region) => (
                    <SelectItem key={region._id} value={region._id}>
                      {region.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No regions available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Service Area Filter */}
            <Select
              value={selectedServiceArea}
              onValueChange={setSelectedServiceArea}
              disabled={!selectedState}
            >
              <SelectTrigger className={cn("h-8 text-xs w-fit", RADIUS.full, BORDER_STYLES.default)}>
                <SelectValue placeholder="Select Service Area" />
              </SelectTrigger>
              <SelectContent>
                {serviceAreasLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : serviceAreas && serviceAreas.length > 0 ? (
                  serviceAreas.map((area) => (
                    <SelectItem key={area._id} value={area._id}>
                      {area.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No service areas available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Max Distance Filter */}
            <Select value={maxDistance} onValueChange={setMaxDistance}>
              <SelectTrigger className={cn("h-8 text-xs w-fit", RADIUS.full, BORDER_STYLES.default)}>
                <SelectValue placeholder="Max Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Within 10 km</SelectItem>
                <SelectItem value="25">Within 25 km</SelectItem>
                <SelectItem value="50">Within 50 km</SelectItem>
                <SelectItem value="100">Within 100 km</SelectItem>
                <SelectItem value="200">Within 200 km</SelectItem>
              </SelectContent>
            </Select>

            {/* Min Rating Filter */}
            <Select value={minRating} onValueChange={setMinRating}>
              <SelectTrigger className={cn("h-8 text-xs w-fit", RADIUS.full, BORDER_STYLES.default)}>
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Rating</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
              </SelectContent>
            </Select>

            {/* Max Hourly Rate Filter */}
            <Input
              type="number"
              placeholder="Max Hourly Rate ($)"
              className={cn(
                "h-8 text-xs w-36",
                RADIUS.full,
                BORDER_STYLES.default,
                "focus:border-primary px-3 placeholder:text-gray-500"
              )}
              value={maxHourlyRate}
              onChange={(e) => setMaxHourlyRate(e.target.value)}
            />

            {/* Verified Filter */}
            <Button
              variant={onlyVerified ? "default" : "outline"}
              className={cn(
                "h-8 text-xs px-3",
                RADIUS.full,
                onlyVerified
                  ? "bg-primary hover:bg-primary/90"
                  : "border-gray-200 text-primary hover:bg-primary/10"
              )}
              onClick={() => setOnlyVerified(!onlyVerified)}
            >
              <CheckCircle className={cn("mr-1", ICON_SIZES.xs)} />
              Verified Only
            </Button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                className="h-8 text-xs px-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        {searchLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : isError ? (
          <div className={cn(BG_COLORS.white, RADIUS.lg, SHADOW.sm, "border border-red-200 p-8 text-center")}>
            <p className={cn("text-red-600 font-medium mb-2")}>
              Failed to load support workers
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error
                ? error.message
                : "Please try again later"}
            </p>
            <Button onClick={() => window.location.reload()} className={BUTTON_VARIANTS.primary}>Try Again</Button>
          </div>
        ) : !searchResults || searchResults.length === 0 ? (
          <div className={cn(BG_COLORS.white, RADIUS.lg, SHADOW.sm, BORDER_STYLES.subtle, "p-12 text-center")}>
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Magnifer className="w-10 h-10 text-primary/60" />
            </div>
            <h3 className={cn("text-lg", FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900, "mb-2")}>
              No support workers found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Found{" "}
                {searchResponse?.pagination?.totalResults || searchResults.length}{" "}
                support worker
                {(searchResponse?.pagination?.totalResults || searchResults.length) !==
                1
                  ? "s"
                  : ""}
                {hasLocationFilters && " in your area"}
              </p>
            </div>

            {/* Workers Grid */}
            <div className={cn("grid grid-cols-2 lg:grid-cols-5", GRID_GAP.sm, "md:gap-6")}>
              {searchResults.map((worker) => {
                const isInOrganization = isWorkerInOrganization(worker._id);
                const isPending =
                  !isInOrganization && isWorkerPendingInvite(worker._id);

                // Convert API response to unified type
                const unifiedWorker = {
                  _id: worker._id,
                  id: worker._id,
                  firstName: worker.firstName,
                  lastName: worker.lastName,
                  name: `${worker.firstName} ${worker.lastName}`,
                  email: worker.email,
                  phone: worker.phone,
                  profileImage: worker.profileImage,
                  role: 'Support Worker',
                  skills: worker.skills || [],
                  languages: worker.languages || [],
                  serviceAreas: worker.serviceAreas || [],
                  bio: worker.bio,
                  ratings: worker.ratings,
                  rating: worker.ratings?.average,
                  isVerified: worker.verificationStatus?.identityVerified,
                  verificationStatus: worker.verificationStatus,
                  location: worker.serviceAreas?.[0] || 'Australia',
                  distance: worker.distance,
                  hourlyRate: worker.hourlyRate,
                  isInUserOrganization: isInOrganization,
                };

                return (
                  <UnifiedWorkerCard
                    key={worker._id}
                    worker={unifiedWorker}
                    onViewProfile={handleViewProfile}
                    variant="participant"
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
