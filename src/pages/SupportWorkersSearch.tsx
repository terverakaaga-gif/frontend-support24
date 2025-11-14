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

    console.log('search response',searchResponse)
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="w-full">
        {/* Header */}
        <GeneralHeader
          showBackButton={true}
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
              {/* Search Bar */}
              <div className="mr-4">
                <div className="relative">
                  <Magnifer className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
                  <Input
                    type="search"
                    placeholder="Search by name, skills, or keywords..."
                    className="pl-10 pr-10 h-9 border-gray-400 focus:border-primary focus-visible:ring-primary/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/60 hover:text-primary transition-colors"
                    >
                      <CloseCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </>
          }
        />

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-4 md:p-6 mb-6">
          {/* Filters Grid */}
          <div className="flex flex-wrap items-center gap-4">
            {/* State Filter */}
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="h-6 border-gray-400 text-xs w-fit rounded-full">
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
              <SelectTrigger className="h-6 border-gray-400 text-xs w-fit rounded-full">
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
            {/* <Select
              value={selectedServiceArea}
              onValueChange={setSelectedServiceArea}
              disabled={!selectedState}
            >
              <SelectTrigger className="h-6 border-gray-400 text-xs w-fit rounded-full">
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
            </Select> */}

            {/* Max Distance Filter */}
            <Select value={maxDistance} onValueChange={setMaxDistance}>
              <SelectTrigger className="h-6 border-gray-400 text-xs w-fit rounded-full">
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
              <SelectTrigger className="h-6 border-gray-400 text-xs w-fit rounded-full">
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
              className="h-6 border-gray-400 text-xs w-32 rounded-full focus:border-primary px-3 placeholder:text-black placeholder:text-xs"
              value={maxHourlyRate}
              onChange={(e) => setMaxHourlyRate(e.target.value)}
            />

            {/* Verified Filter */}
            <Button
              variant={onlyVerified ? "default" : "outline"}
              className={`h-6 text-xs px-3 rounded-full ${
                onlyVerified
                  ? "bg-primary hover:bg-primary/90"
                  : "border-gray-400 text-primary hover:bg-primary/10"
              }`}
              onClick={() => setOnlyVerified(!onlyVerified)}
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified Only
            </Button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                className="h-6 text-xs px-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
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
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
            <p className="text-red-600 font-medium mb-2">
              Failed to load support workers
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error
                ? error.message
                : "Please try again later"}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : !searchResults || searchResults.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-12 text-center">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Magnifer className="w-10 h-10 text-primary/60" />
            </div>
            <h3 className="text-lg font-montserrat-semibold text-gray-900 mb-2">
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
                {searchResponse?.pagination?.total || searchResults.length}{" "}
                support worker
                {(searchResponse?.pagination?.total || searchResults.length) !==
                1
                  ? "s"
                  : ""}
                {hasLocationFilters && " in your area"}
              </p>
            </div>

            {/* Workers Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 ">
              {searchResults.map((worker) => {
                const isInOrganization = isWorkerInOrganization(worker._id);
                const isPending =
                  !isInOrganization && isWorkerPendingInvite(worker._id);

                return (
                  <Card
                    key={worker._id}
                    className="shadow-lg hover:shadow-xl flex flex-col items-center transition-all duration-200"
                  >
                    <CardHeader className="flex flex-col items-center justify-center gap-1">
                      <Avatar className="h-16 w-16 border-2 border-primary/10 flex-shrink-0">
                        <AvatarImage
                          src={worker.profileImage}
                          alt={`${worker.firstName} ${worker.lastName}`}
                        />
                        <AvatarFallback className="bg-primary text-white text-lg font-montserrat-semibold">
                          {getWorkerInitials(worker.firstName, worker.lastName)}
                        </AvatarFallback>
                      </Avatar>

                      <h3 className="font-montserrat-semibold text-sm text-gray-900 ">
                        {worker.firstName} {worker.lastName}
                      </h3>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-row items-center gap-1 text-xs flex-wrap">
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <Star className="h-4 w-4" />
                            <span>
                              {worker.ratings?.average?.toFixed(1) || "0.0"} (
                              {worker.ratings?.count || 0})
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-primary font-montserrat-semibold">
                            <DollarMinimalistic className="h-4 w-4" />
                            <span>${worker.hourlyRate?.baseRate || 0}/hr</span>
                          </div>
                          {worker.verificationStatus?.identityVerified && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <MapPoint className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {worker.serviceAreas?.[0] || "Australia"}
                              {worker.distance &&
                                ` • ${Number(worker.distance).toFixed(
                                  1
                                )}km away`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Skills */}
                    {worker.skills && worker.skills.length > 0 && (
                      <CardContent className="flex flex-wrap gap-1">
                        {worker.skills.slice(0, 2).map((skill, index) => {
                          const skillName =
                            typeof skill === "string" ? skill : skill.name;
                          const skillKey =
                            typeof skill === "string"
                              ? skill
                              : skill._id || `skill-${index}`;
                          return (
                            <Badge
                              key={skillKey}
                              variant="secondary"
                              className="text-xs bg-gray-100 text-gray-700 border-gray-200"
                            >
                              {skillName}
                            </Badge>
                          );
                        })}
                        {worker.skills.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            +{worker.skills.length - 2} more
                          </Badge>
                        )}
                      </CardContent>
                    )}

                    {/* Actions */}
                    <CardFooter className="flex gap-1 w-full px-4 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(worker._id)}
                        className="w-full border-primary hover:bg-primary-700 text-primary font-montserrat-semibold text-base py-6 rounded-xl"
                      >
                        View Profile
                      </Button>

                      {/* {isInOrganization ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="flex-1 bg-blue-50 border-blue-200 text-blue-700"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          In Network
                        </Button>
                      ) : isPending ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="flex-1 bg-yellow-50 border-yellow-200 text-yellow-700 h-9 rounded-full hover:cursor-not-allowed"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Pending
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleInvite(worker._id)}
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          Invite
                        </Button>
                      )} */}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
