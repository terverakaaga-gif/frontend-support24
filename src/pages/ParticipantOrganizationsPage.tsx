import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Buildings3,
  Calendar,
  ClockCircle,
  Dollar,
  Magnifer,
  UsersGroupRounded,
  UsersGroupTwoRounded,
} from "@solar-icons/react";
import { organizationService } from "@/api/services/organizationService";
import { pageTitles } from "@/constants/pageTitles";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";
import GeneralHeader from "@/components/GeneralHeader";
import { SearchSupportWorkers } from "@/components/SearchSupportWorkers";

export default function ParticipantOrganizationsPage() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: organizationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["participant-organizations"],
    queryFn: async () => {
      const response = await organizationService.getOrganizations();
      return response;
    },
  });

  const organizations = organizationsData?.organizations || [];

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    workerSum + (worker.serviceAgreement?.baseHourlyRate || 0),
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
      (sum, org) =>
        sum +
        org.pendingInvites.filter((inv) => inv.status === "pending").length,
      0
    ),
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                Failed to load organizations
              </h3>
              <p className="text-gray-600 mb-6">
                There was an error loading your organizations. Please try again.
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-primary-600 hover:bg-primary-700"
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
      <div className="p-6 md:p-8">
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
          rightComponent={
            <>
              <Button
                variant="outline"
                className="mr-4 rounded-full"
                onClick={() => setSearchOpen(true)}
              >
                Invite Support Workers
              </Button>
              <SearchSupportWorkers
                open={searchOpen}
                onOpenChange={setSearchOpen}
              />
            </>
          }
          onLogout={logout}
        />

        {/* Stats Cards */}
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          <Card className="border-0 bg-white shadow-sm">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm text-gray-600 font-montserrat-semibold">
                  Total Organizations
                </p>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <Buildings3 className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg md:text-2xl font-montserrat-bold text-gray-900">
                  {stats.totalOrganizations}
                </p>
                <p className="text-[8px] md:text-xs font-montserrat-bold">
                  Created and Managed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm text-gray-600 font-montserrat-semibold">
                  Support Workers
                </p>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <UsersGroupRounded className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg md:text-2xl font-montserrat-bold text-gray-900">
                  {stats.totalWorkers}
                </p>
                <p className="text-[8px] md:text-xs font-montserrat-bold">
                  Active Teams
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm text-gray-600 font-montserrat-semibold">
                  Average Per Rate
                </p>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <Dollar className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg md:text-2xl font-montserrat-bold text-gray-900">
                  ${stats.averagePerRate.toFixed(2)}
                </p>
                <p className="text-[8px] md:text-xs font-montserrat-bold">
                  Per Hour
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm text-gray-600 font-montserrat-semibold">
                  Pending Invitations
                </p>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <ClockCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg md:text-2xl font-montserrat-bold text-gray-900">
                  {stats.pendingInvitations}
                </p>
                <p className="text-[8px] md:text-xs font-montserrat-bold">
                  Awaiting Responses
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Organizations List */}
        <div>
          <h2 className="text-lg md:text-xl font-montserrat-bold text-gray-900 mb-4">
            All Organizations ({filteredOrganizations.length})
          </h2>

          {filteredOrganizations.length === 0 ? (
            <Card className="border-0 bg-white shadow-sm">
              <CardContent className="p-12 text-center">
                <Buildings3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-montserrat-bold text-gray-900 mb-2">
                  No organizations found
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "You don't have any organizations yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
              {filteredOrganizations.map((org) => (
                <Card
                  key={org._id}
                  className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4 mb-5 md:mb-6">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                        <UsersGroupTwoRounded className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-montserrat-bold text-gray-900 mb-1">
                          {org.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {org.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-3.5 mb-5 md:mb-6 text-xs md:text-sm">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="text-gray-600 font-montserrat-semibold">
                          Created on
                        </span>
                        <span className="ml-auto text-gray-900 font-semibold">
                          {new Date(org.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <ClockCircle className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="text-gray-600 font-montserrat-semibold">
                          Last Updated
                        </span>
                        <span className="ml-auto text-gray-900 font-semibold">
                          {new Date(org.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-600 font-montserrat-bold text-xs">
                            #
                          </span>
                        </div>
                        <span className="text-gray-600 font-montserrat-semibold">
                          Organization ID
                        </span>
                        <span className="ml-auto text-gray-900 font-semibold text-xs truncate max-w-[140px] md:max-w-[200px]">
                          {org._id}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-fit flex place-self-end border-primary-600 text-primary-600 hover:bg-primary-50 hover:text-primary-700 font-semibold gap-2"
                      onClick={() =>
                        navigate(`/participant/organizations/${org._id}`)
                      }
                    >
                      View Details
                      <span className="text-lg">→</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
