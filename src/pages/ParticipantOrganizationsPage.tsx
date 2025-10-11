import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { organizationService } from "@/api/services/organizationService";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";
import {
  Buildings3,
  ClockCircle,
  DangerCircle,
  Dollar,
  History2,
  Magnifer,
  UsersGroupRounded,
} from "@solar-icons/react";
import { Plus } from "lucide-react";
import { ParticipantOrganizationCard } from "@/components/ParticipantOrganizationCard";

export default function ParticipantOrganizationsPage() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const {
    data: organizations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["participant-organizations"],
    queryFn: async () =>
      (await organizationService.getOrganizations()).organizations,
  });

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      searchTerm === "" ||
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    totalOrganizations: organizations.length,
    totalWorkers: organizations.reduce(
      (sum, org) => sum + org.workers.length,
      0
    ),
    averagePerRate:
      organizations.length > 0
        ? Math.round(
            organizations.reduce(
              (sum, org) =>
                sum +
                org.workers.reduce(
                  (workerSum, worker) =>
                    workerSum + worker.serviceAgreement.baseHourlyRate,
                  0
                ),
              0
            ) /
              (organizations.reduce(
                (sum, org) => sum + org.workers.length,
                0
              ) || 1)
          )
        : 0,
    pendingInvitations: organizations.reduce(
      (sum, org) => sum + org.pendingInvites.length,
      0
    ),
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <DangerCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">
                Failed to load organizations
              </h3>
              <p className="text-gray-600 mb-6">
                There was an error loading your organizations. Please try again.
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-primary hover:bg-primary-700"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8 space-y-6">
        {/* Header */}
        <GeneralHeader
          title={pageTitles.participant["/participant/organizations"].title}
          subtitle={
            pageTitles.participant["/participant/organizations"].subtitle
          }
          user={user}
          onViewProfile={() => {
            navigate(
              Object.keys(pageTitles.participant).find(
                (key) =>
                  key !== "/participant/organizations" &&
                  pageTitles.participant[key] ===
                    pageTitles.participant["/participant/profile"]
              )
            );
          }}
          onLogout={logout}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 hover:shadow-sm transition-all bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex justify-between items-center">
                <span className="font-montserrat-semibold text-sm text-gray-1000">
                  Total
                </span>
                <div className="p-1 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Buildings3 className="w-8 h-8 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-montserrat-bold text-gray-900">
                {stats.totalOrganizations}
              </p>
              <p className="font-montserrat-semibold text-sm text-gray-600">Created and Managed</p>
            </CardContent>
          </Card>

          <Card className="border-0 hover:shadow-sm transition-all bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex justify-between items-center">
                <span className="font-montserrat-semibold text-sm text-gray-1000">
                  Workers
                </span>
                <div className="p-1 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <UsersGroupRounded className="w-8 h-8 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-montserrat-bold text-gray-900">
                {stats.totalWorkers}
              </p>
              <p className="font-montserrat-semibold text-sm text-gray-600">Active Team</p>
            </CardContent>
          </Card>

          <Card className="border-0 hover:shadow-sm transition-all bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex justify-between items-center">
                <span className="font-montserrat-semibold text-sm text-gray-1000">Rate</span>
                <div className="p-1 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Dollar className="w-8 h-8 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-montserrat-bold text-gray-900">
                ${stats.averagePerRate}
              </p>
              <p className="font-montserrat-semibold text-sm text-gray-600">Per Hour</p>
            </CardContent>
          </Card>

          <Card className="border-0 hover:shadow-sm transition-all bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex justify-between items-center">
                <span className="font-montserrat-bold text-xs text-gray-1000">Pending</span>
                <div className="p-1 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <History2 className="w-8 h-8 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-montserrat-bold text-gray-900">
                {stats.pendingInvitations}
              </p>
              <p className="font-montserrat-semibold text-sm text-gray-600">Awaiting Response</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 hover:shadow-sm transition-all bg-white">
          <CardContent className="p-4 md:p-6">
            <div className="relative">
              <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Organizations List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="border-0 hover:shadow-sm transition-all bg-white"
              >
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOrganizations.length === 0 ? (
          <Card className="border-0 hover:shadow-sm transition-all bg-white">
            <CardContent className="p-12 text-center">
              <Buildings3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-montserrat-semibold text-gray-900 mb-2">
                No organizations found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Create your first organization to start managing support workers"}
              </p>
              {!searchTerm && (
                <Button
                  className="bg-primary hover:bg-primary-700"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Organization
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrganizations.map((org) => (
              <ParticipantOrganizationCard
                key={org._id}
                organization={org}
                onViewDetails={() =>
                  navigate(`/participant/organizations/${org._id}`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
