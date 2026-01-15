import { useCallback, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DangerCircle, Buildings3, CloseCircle } from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getWorkerDisplayName } from "@/lib/utils";
import { useGetOrganizationDetails, useRemoveWorkerFromOrganization } from "@/hooks/useOrganizationHooks";
import { Worker } from "@/types/organization.types";

// Imported Refactored Components
import { WorkerDetails } from "@/components/organization/WorkerDetails";
import { ActiveWorkersList, PendingInvitesList } from "@/components/organization/Lists";

import {
  cn,
  FLEX_ROW_BETWEEN,
  FLEX_ROW_CENTER,
} from "@/lib/design-utils";
import {
  GAP,
  BUTTON_VARIANTS,
  BG_COLORS,
  CONTAINER_PADDING,
  GRID_LAYOUTS,
  SPACING,
  HEADING_STYLES,
  TEXT_STYLES,
  FONT_FAMILY,
  TEXT_COLORS,
  SHADOW,
  RADIUS,
  BORDER_STYLES,
} from "@/constants/design-system";

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
  const activeWorkers = useMemo(() => organization?.workers.filter((worker) => worker && worker._id && worker.workerId) || [], [organization]);
  
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
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <div className="max-w-md mx-auto mt-20">
          <Card className={cn(BORDER_STYLES.none, SHADOW.lg)}>
            <CardContent className="p-8 text-center">
              <DangerCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className={cn(HEADING_STYLES.h3, "mb-2")}>Failed to load organization</h3>
              <Button onClick={() => refetch()} className={BUTTON_VARIANTS.primary}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <div className={cn("max-w-7xl mx-auto", `space-y-${SPACING.lg}`)}>
          <Skeleton className="h-12 w-64" />
          <div className={cn(GRID_LAYOUTS.threeCol, GAP.md)}>
            {[...Array(3)].map((_, i) => (<Skeleton key={i} className="h-32" />))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <div className="max-w-md mx-auto mt-20">
          <Card className={cn(BORDER_STYLES.none, SHADOW.lg)}>
            <CardContent className="p-8 text-center">
              <Buildings3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={cn(HEADING_STYLES.h3, "mb-2")}>Organization not found</h3>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      <div className="w-full p-4 md:p-8">
        <GeneralHeader
          showBackButton
          title={pageTitles.participant["/participant/organizations"].title}
          subtitle={pageTitles.participant["/participant/organizations"].subtitle}
          user={user}
          onViewProfile={() => {
            navigate("/participant/profile");
          }}
          onLogout={logout}
        />

        {/* Organization Info Card */}
        <Card className={cn(BORDER_STYLES.none, SHADOW.lg, `mb-${SPACING.xl}`)}>
          <CardContent className="p-6">
            <div className={cn("flex items-start", GAP.lg)}>
              <div className={cn("w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0")}>
                <Buildings3 className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className={cn(HEADING_STYLES.h2, "mb-2")}>{organization.name}</h2>
                {organization.description && (
                  <p className={cn(TEXT_STYLES.body, TEXT_COLORS.gray600, "mb-4")}>{organization.description}</p>
                )}
                <div className={cn(GRID_LAYOUTS.responsive, GAP.md, "mt-4")}>
                  <div className={cn(BG_COLORS.gray50, "p-3", RADIUS.lg)}>
                    <p className={cn(TEXT_STYLES.small, TEXT_COLORS.gray600, "mb-1")}>Active Workers</p>
                    <p className={cn(HEADING_STYLES.h2, TEXT_COLORS.primary)}>{activeWorkers.length}</p>
                  </div>
                  <div className={cn(BG_COLORS.gray50, "p-3", RADIUS.lg)}>
                    <p className={cn(TEXT_STYLES.small, TEXT_COLORS.gray600, "mb-1")}>Pending Invites</p>
                    <p className={cn(HEADING_STYLES.h2, "text-orange-600")}>{pendingInvites.length}</p>
                  </div>
                  <div className={cn(BG_COLORS.gray50, "p-3", RADIUS.lg)}>
                    <p className={cn(TEXT_STYLES.small, TEXT_COLORS.gray600, "mb-1")}>Created</p>
                    <p className={cn(TEXT_STYLES.body, FONT_FAMILY.montserratSemibold, TEXT_COLORS.gray900)}>
                      {format(parseISO(organization.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className={cn(FLEX_ROW_CENTER, GAP.sm, `mb-${SPACING.lg}`)}>
          {(["workers", "invites"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                RADIUS.full,
                FONT_FAMILY.montserratSemibold,
                "px-3 py-1 text-xs transition-all",
                activeTab === tab
                  ? "bg-primary text-white hover:bg-primary"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              )}
            >
              {tab === "workers" ? "Active Workers" : "Pending Invites"}
            </button>
          ))}
        </div>

        {/* Content Layout */}
        <div className={cn(GRID_LAYOUTS.threeCol, "gap-4 md:gap-6")}>
          <div className="lg:col-span-2">
            <h2 className={cn("text-sm md:text-lg", FONT_FAMILY.montserratBold, TEXT_COLORS.gray900, `mb-${SPACING.md}`)}>
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
              <Card className={cn(BORDER_STYLES.none, SHADOW.sm, "sticky top-6")}>
                <CardContent className="p-0">
                  <div className={cn("p-3 md:p-4 border-b", FLEX_ROW_BETWEEN)}>
                    <h3 className={cn(FONT_FAMILY.montserratBold, TEXT_COLORS.gray900, "text-sm md:text-base")}>
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
          <DialogContent className={cn("lg:hidden max-w-full w-[90vw] mx-auto h-[90vh] p-0", `rounded-t-${RADIUS["2xl"]}`)}>
            <DialogHeader className="p-3 md:p-4 border-b">
              <DialogTitle className={cn(FONT_FAMILY.montserratBold, TEXT_COLORS.gray900, "text-sm md:text-base")}>
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
              <DialogTitle className={cn(FONT_FAMILY.montserratBold, TEXT_COLORS.gray900)}>Confirm Worker Removal</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className={cn(TEXT_STYLES.body, TEXT_COLORS.gray600)}>
                Are you sure you want to remove this worker from your organization? This action cannot be undone.
              </p>
            </div>
            <div className={cn("flex justify-end", GAP.sm)}>
              <Button
                variant="outline"
                onClick={cancelRemoveWorker}
                disabled={removeWorkerMutation.isPending}
                className={cn(FONT_FAMILY.montserratSemibold)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRemoveWorker}
                disabled={removeWorkerMutation.isPending}
                className={cn("bg-red-600 hover:bg-red-700 text-white", FONT_FAMILY.montserratSemibold)}
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