import { useCallback, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DangerCircle, Buildings3, CloseCircle } from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getWorkerDisplayName } from "@/lib/utils";
import { useGetOrganizationDetails, useRemoveWorkerFromOrganization } from "@/hooks/useOrganizationHooks";
import { Worker } from "@/types/organization.types";

// Imported Refactored Components
import { WorkerDetails } from "@/components/organization/WorkerDetails";
import { ActiveWorkersList, PendingInvitesList } from "@/components/organization/Lists";

export default function ParticipantOrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"workers" | "invites">("workers");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showWorkerDetails, setShowWorkerDetails] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [workerToRemove, setWorkerToRemove] = useState<string | null>(null);

  const {
    data: organization,
    isLoading,
    error,
    refetch,
  } = useGetOrganizationDetails(id!);

  const removeWorkerMutation = useRemoveWorkerFromOrganization();

  // Memoize derived data to avoid recalculation on every render
  const activeWorkers = useMemo(() => organization?.workers || [], [organization]);
  
  const pendingInvites = useMemo(() => 
    organization?.pendingInvites
      .filter((inv) => inv.status === "pending")
      .map((inv) => ({
        ...inv,
        serviceAgreement: inv.serviceAgreement || null,
        notes: inv.notes || "",
        workerId: typeof inv.workerId === 'string' ? inv.workerId : {
          ...inv.workerId,
          phone: inv.workerId.phone || ""
        }
      })) || [], 
    [organization]
  );

  // useCallback for stable event handlers
  const handleRemoveWorkerClick = useCallback(
    (workerId: string) => {
      setWorkerToRemove(workerId);
      setShowRemoveConfirmation(true);
    },
    []
  );

  const confirmRemoveWorker = useCallback(
    () => {
      if (!workerToRemove) return;
      
      removeWorkerMutation.mutate({ organizationId: id!, workerId: workerToRemove }, {
        onSuccess: () => {
            setShowWorkerDetails(false);
            setSelectedWorker(null);
            setShowRemoveConfirmation(false);
            setWorkerToRemove(null);
        }
      });
    },
    [id, workerToRemove, removeWorkerMutation]
  );

  const cancelRemoveWorker = useCallback(() => {
    setShowRemoveConfirmation(false);
    setWorkerToRemove(null);
  }, []);

  const handleWorkerSelect = useCallback((worker: Worker) => {
    setSelectedWorker(worker);
    // Only open dialog on mobile (will be handled by conditional rendering)
    if (window.innerWidth < 1024) {
      setShowWorkerDetails(true);
    }
  }, []);

  // -- Render States --

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <DangerCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">Failed to load organization</h3>
              <Button onClick={() => refetch()} className="bg-primary-600 hover:bg-primary-600">Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (<Skeleton key={i} className="h-32" />))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Buildings3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">Organization not found</h3>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full p-4 md:p-8">
        <GeneralHeader
          showBackButton
          title={pageTitles.participant["/participant/organizations"].title}
          subtitle={pageTitles.participant["/participant/organizations"].subtitle}
          user={user}
          onViewProfile={() => {
            // ... (keep navigation logic)
            navigate("/participant/profile");
          }}
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
            <h2 className="text-sm md:text-lg font-montserrat-bold text-gray-900 mb-3 md:mb-4">
              {activeTab === "workers"
                ? `Active Workers (${activeWorkers.length})`
                : `Pending Invites (${pendingInvites.length})`}
            </h2>

            {activeTab === "workers" ? (
              <ActiveWorkersList workers={activeWorkers} onSelect={handleWorkerSelect} />
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
                    <h3 className="font-montserrat-bold text-gray-900 text-sm md:text-base">
                      {getWorkerDisplayName(selectedWorker.workerId)}
                    </h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedWorker(null)}>
                      <CloseCircle className="w-5 h-5 text-gray-400" />
                    </Button>
                  </div>
                  <WorkerDetails 
                    worker={selectedWorker}
                    canRemove={user?.role === "participant"}
                    isRemoving={removeWorkerMutation.isPending}
                    onRemove={handleRemoveWorkerClick}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Worker Details Modal - Mobile */}
      {showWorkerDetails && selectedWorker && (
        <Dialog open={showWorkerDetails} onOpenChange={setShowWorkerDetails}>
          <DialogContent className="lg:hidden max-w-full w-[90vw] mx-auto h-[90vh] p-0 rounded-t-2xl">
            <DialogHeader className="p-3 md:p-4 border-b">
              <DialogTitle className="font-montserrat-bold text-gray-900 text-sm md:text-base">
                {getWorkerDisplayName(selectedWorker.workerId)}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto h-full">
              <WorkerDetails 
                worker={selectedWorker}
                canRemove={user?.role === "participant"}
                isRemoving={removeWorkerMutation.isPending}
                onRemove={handleRemoveWorkerClick}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Remove Worker Confirmation Dialog */}
      {showRemoveConfirmation && (
        <Dialog open={showRemoveConfirmation} onOpenChange={setShowRemoveConfirmation}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-montserrat-bold text-gray-900">Confirm Worker Removal</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm md:text-base text-gray-600">
                Are you sure you want to remove this worker from your organization? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={cancelRemoveWorker}
                disabled={removeWorkerMutation.isPending}
                className="font-montserrat-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRemoveWorker}
                disabled={removeWorkerMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white font-montserrat-semibold"
              >
                {removeWorkerMutation.isPending ? "Removing..." : "Yes, Remove"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}