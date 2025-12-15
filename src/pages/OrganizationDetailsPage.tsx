import { useCallback, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DangerCircle, Buildings3, CloseCircle } from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { get } from "@/api/apiClient";
import { Organization, Worker } from "@/types/organization.types";
import { getWorkerDisplayName, getWorkerEmail } from "@/lib/support-worker-organization";

// Refactored Components
import { SupportWorkerDetails } from "@/components/organization/SupportWorkerDetails";
import { ActiveSupportWorkersList, PendingInvitesList } from "@/components/organization/SupportWorkerLists";
import { useGetSupportWorkerById } from "@/hooks/useSupportWorkerHooks";

// API Service (Inline or move to file)
const organizationDetailService = {
  getOrganization: async (id: string): Promise<Organization> => {
    const response = await get<{ organizations: Organization[] }>("/organizations");
    const organization = response.organizations.find((org) => org._id === id);
    if (!organization) {
      throw new Error("Organization not found");
    }
    return organization;
  },
};

export default function SupportWorkerOrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"workers" | "invites">("workers");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showWorkerDetails, setShowWorkerDetails] = useState(false);

  const {
    data: organization,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["organization-details", id],
    queryFn: () => organizationDetailService.getOrganization(id!),
    enabled: !!id,
  });

  // Memoize active workers derived from data
  const activeWorkers = useMemo(() => organization?.workers || [], [organization]);
  // get actual selected worker info by it ID
  const {data: selectedWorkerDetails} = useGetSupportWorkerById(selectedWorker?.workerId as string || "");
  
  // Memoize filtered workers based on search term
  // Optimization: Lowercase search term once
  const filteredWorkers = useMemo(() => {
    if (!searchTerm) return activeWorkers;
    const lowerTerm = searchTerm.toLowerCase();
    
    return activeWorkers.filter((worker) => {
      const name = getWorkerDisplayName(worker.workerId).toLowerCase();
      const email = getWorkerEmail(worker.workerId).toLowerCase();
      return name.includes(lowerTerm) || email.includes(lowerTerm);
    });
  }, [activeWorkers, searchTerm]);

  // Memoize pending invites
  const pendingInvites = useMemo(() => 
    organization?.pendingInvites.filter((inv) => inv.status === "pending") || [], 
    [organization]
  );

  // Handlers
  const handleWorkerSelect = useCallback((worker: Worker) => {
    setSelectedWorker(worker);
    // Only open dialog on mobile (will be handled by conditional rendering)
    if (window.innerWidth < 1024) {
      setShowWorkerDetails(true);
    }
  }, []);

  const handleProfileNavigation = useCallback(() => {
    const profilePath = Object.keys(pageTitles.supportWorker).find(
      (key) => key !== "/support-worker/organizations" &&
      pageTitles.supportWorker[key] === pageTitles.supportWorker["/support-worker/profile"]
    );
    if (profilePath) navigate(profilePath);
  }, [navigate]);

  // -- Render States --

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <DangerCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">Failed to load organization</h3>
            <p className="text-gray-600 mb-6">There was an error loading the organization details.</p>
            <Button onClick={() => refetch()} className="bg-primary-600 hover:bg-primary-600">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (<Skeleton key={i} className="h-32" />))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Buildings3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">Organization not found</h3>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <GeneralHeader
        showBackButton
        title={pageTitles.supportWorker["/support-worker/organizations"].title}
        subtitle={pageTitles.supportWorker["/support-worker/organizations"].subtitle}
        user={user}
        onViewProfile={handleProfileNavigation}
        onLogout={logout}
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-4 md:mb-6">
        {(["workers", "invites"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full font-montserrat-semibold px-3 py-1 text-xs transition-all ${
              activeTab === tab
                ? "bg-primary text-white hover:bg-primary"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab === "workers" ? "Active Workers" : "Pending Invites"}
          </button>
        ))}
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-base md:text-lg font-montserrat-bold text-gray-900 mb-3 md:mb-4">
            {activeTab === "workers"
              ? `Active Workers (${filteredWorkers.length})`
              : `Pending Invites (${pendingInvites.length})`}
          </h2>

          {activeTab === "workers" ? (
            <ActiveSupportWorkersList 
              workers={filteredWorkers} 
              onSelect={handleWorkerSelect}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          ) : (
            <PendingInvitesList invites={pendingInvites} />
          )}
        </div>

        {/* Worker Details Sidebar - Desktop */}
        {selectedWorker && (
          <div className="hidden lg:block">
            <Card className="border-0 shadow-sm sticky top-6">
              <CardContent className="p-0">
                <div className="p-3 md:p-4 border-b flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedWorker(null)}>
                    <CloseCircle className="w-5 h-5 text-gray-400" />
                  </Button>
                </div>
                <SupportWorkerDetails worker={selectedWorkerDetails} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Worker Details Modal - Mobile */}
      {showWorkerDetails && selectedWorker && (
        <Dialog open={showWorkerDetails} onOpenChange={setShowWorkerDetails}>
          <DialogContent className="lg:hidden max-w-full w-[90vw] mx-auto h-[90vh] p-0 rounded-t-2xl">
            <div className="overflow-y-auto h-full">
               <SupportWorkerDetails worker={selectedWorkerDetails} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}