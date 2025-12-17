import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DangerCircle, Buildings3 } from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { useAuth } from "@/contexts/AuthContext";
import { get } from "@/api/apiClient";
import { Organization } from "@/types/organization.types";

// Refactored Components
import { PendingInvitesList } from "@/components/organization/SupportWorkerLists";

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

  // Memoize pending invites
  const pendingInvites = useMemo(() => 
    organization?.pendingInvites.filter((inv) => inv.status === "pending") || [], 
    [organization]
  );

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
        onViewProfile={() => navigate("/support-worker/profile")}
        onLogout={logout}
      />

      {/* Organization Info Card */}
      <Card className="border-0 shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Buildings3 className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-montserrat-bold text-gray-900 mb-2">{organization.name}</h2>
              {organization.description && (
                <p className="text-gray-600 mb-4">{organization.description}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total Workers</p>
                  <p className="text-2xl font-montserrat-bold text-primary">{organization.workers?.length || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Pending Invites</p>
                  <p className="text-2xl font-montserrat-bold text-orange-600">{pendingInvites.length}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Created</p>
                  <p className="text-sm font-montserrat-semibold text-gray-900">
                    {format(parseISO(organization.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invites Section */}
      <div>
        <h2 className="text-base md:text-lg font-montserrat-bold text-gray-900 mb-3 md:mb-4">
          Pending Invites ({pendingInvites.length})
        </h2>
        <PendingInvitesList invites={pendingInvites} />
      </div>
    </div>
  );
}