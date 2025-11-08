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
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ISearchSupportWorkers } from "@/api/services/participantService";
import { useMyOrganizations, useSupportWorkers } from "@/hooks/useParticipant";
import { CheckCircle, CloseCircle, Magnifer } from "@solar-icons/react";
import { WaveLoader } from "./Loader";

interface SearchSupportWorkersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchSupportWorkers({
  open,
  onOpenChange,
}: SearchSupportWorkersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch support workers from API
  const {
    data: supportWorkersData,
    isLoading,
    isError,
    error,
  } = useSupportWorkers();

  const { data: organizations } = useMyOrganizations();

  // Filter workers based on search query
  const searchResults = useMemo(() => {
    if (!supportWorkersData?.workers) return [];

    if (!searchQuery.trim()) {
      return supportWorkersData.workers;
    }

    return supportWorkersData.workers.filter((worker) => {
      const fullName = `${worker.firstName} ${worker.lastName}`.toLowerCase();
      const query = searchQuery.toLowerCase();

      return (
        fullName.includes(query) ||
        worker.serviceAreas.some((area) =>
          area.toLowerCase().includes(query)
        ) ||
        worker.skills.some((skill) => {
          const skillName = typeof skill === "string" ? skill : skill.name;
          return skillName.toLowerCase().includes(query);
        }) ||
        worker.languages.some((language) =>
          language.toLowerCase().includes(query)
        )
      );
    });
  }, [supportWorkersData?.workers, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useMemo above, so no additional action is needed here
  };

  const handleViewProfile = (worker: ISearchSupportWorkers) => {
    navigate(`/participant/profile/${worker._id}`);
    onOpenChange(false); // Close the search dialog
  };

  const handleOpenInvite = (worker: ISearchSupportWorkers) => {
    console.debug("Navigating to invite page for worker:", worker._id);
    navigate(`/participant/invite/${worker._id}`);
    onOpenChange(false); // Close the search dialog
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

  // Loading state
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-primary/10">
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-primary/10">
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
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-primary/10">
        <DialogHeader className="border-b border-primary/10 pb-4">
          <DialogTitle className="text-xl font-montserrat-semibold text-primary">
            Find Support Workers
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Search for qualified support workers across Australia to add to your
            care network.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <form onSubmit={handleSearch} className="flex space-x-3">
            <div className="relative flex-1">
              <Magnifer className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/60" />
              <Input
                type="search"
                placeholder="Search by name, location, or skills..."
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
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 px-6"
            >
              Search
            </Button>
          </form>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Magnifer className="w-8 h-8 text-primary/60" />
              </div>
              <p className="text-muted-foreground text-lg">
                {searchQuery.trim()
                  ? "No support workers found matching your search."
                  : "No support workers available at the moment."}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery.trim()
                  ? "Try adjusting your search terms."
                  : "Please check back later."}
              </p>
            </div>
          ) : (
            searchResults.map((worker) => {
              const isInOrganization = isWorkerInOrganization(worker._id);
              const isPending =
                !isInOrganization && isWorkerPendingInvite(worker._id);

              console.debug("Worker status:", {
                workerId: worker._id,
                isInOrganization,
                isPending,
                workerName: getWorkerFullName(worker),
              });

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
                          <p className="text-sm text-muted-foreground mb-1">
                            {worker.serviceAreas.join(", ")}
                          </p>
                          <div className="flex items-center gap-3 text-sm mb-3">
                            <span className="font-montserrat-semibold text-primary">
                              ${worker.hourlyRate.baseRate}/hr
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              ⭐ {worker.ratings.average.toFixed(1)} (
                              {worker.ratings.count} reviews)
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

                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Languages:</strong>{" "}
                              {worker.languages.join(", ")}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {worker.skills &&
                              worker.skills.length > 0 &&
                              worker.skills.slice(0, 3).map((skill, index) => {
                                const skillName =
                                  typeof skill === "string"
                                    ? skill
                                    : skill.name;
                                const skillKey =
                                  typeof skill === "string"
                                    ? skill
                                    : skill._id || `skill-${index}`;
                                return (
                                  <span
                                    key={skillKey}
                                    className="text-xs px-2 py-1 rounded-full border bg-gray-100 text-gray-700 border-gray-200 inline-block font-montserrat-semibold"
                                  >
                                    {skillName}
                                  </span>
                                );
                              })}
                            {worker.skills.length > 3 && (
                              <span className="text-xs px-2 py-1 rounded-full border bg-gray-100 text-gray-700 border-gray-200 inline-block font-montserrat-semibold">
                                +{worker.skills.length - 3} more
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

                          {/* Show different button states based on worker status */}
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
            })
          )}
        </div>

        <div className="pt-4 border-t border-primary/10">
          <p className="text-sm text-muted-foreground text-center">
            Found {searchResults.length} support worker
            {searchResults.length !== 1 ? "s" : ""}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
