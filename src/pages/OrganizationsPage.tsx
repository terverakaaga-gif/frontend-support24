import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Buildings3,
  Calendar,
  ClockCircle,
  Dollar,
  Letter,
  Magnifer,
  UsersGroupRounded,
  UsersGroupTwoRounded,
} from "@solar-icons/react";
import {
  organizationService,
  Organization,
} from "@/api/services/organizationService";
import { pageTitles } from "@/constants/pageTitles";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";
import { BUTTON_BASE, CARD, cn, DASHBOARD_CONTENT, DASHBOARD_STATS_GRID, DASHBOARD_STAT_ICON_CONTAINER, DASHBOARD_STAT_ICON, DASHBOARD_DETAIL_ICON_CONTAINER, DASHBOARD_DETAIL_ICON, ORG_ICON_CONTAINER_LG, ORG_ICON_LG, FLEX_COL, FLEX_ROW_BETWEEN, FLEX_ROW_CENTER, GRID_RESPONSIVE, HEADING_5, PAGE_WRAPPER, TEXT_MUTED, TEXT_SMALL, CARD_CONTENT } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING, FONT_FAMILY, FONT_WEIGHT, GAP, TEXT_STYLES } from "@/constants/design-system";
import GeneralHeader from "@/components/GeneralHeader";

export default function SupportWorkerOrganizationsPage() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const {
    data: organizationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["support-worker-organizations"],
    queryFn: async () => {
      const response = await organizationService.getOrganizations();
      return response;
    },
  });

  const organizations: Organization[] = organizationsData?.organizations || [];

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalOrganizations: organizations.length,
    supportWorkers: organizations.reduce(
      (sum, org) => sum + org.workers.length,
      0
    ),
    averageRate:
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
      <div className={cn(PAGE_WRAPPER, BG_COLORS.gray100,)}>
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
    <div className={cn(PAGE_WRAPPER, BG_COLORS.gray100,)}>
      <div className={cn(DASHBOARD_CONTENT)}>
        {/* Header */}
        <GeneralHeader
          title={
            pageTitles.supportWorker["/support-worker/organizations"].title
          }
          subtitle={
            pageTitles.supportWorker["/support-worker/organizations"].subtitle
          }
          user={user}
          onViewProfile={() => {
            navigate(
              Object.keys(pageTitles.supportWorker).find(
                (key) =>
                  key !== "/support-worker/organizations" &&
                  pageTitles.supportWorker[key] ===
                    pageTitles.supportWorker["/support-worker/profile"]
              )
            );
          }}
          onLogout={logout}
        />

        {/* Stats Cards */}
        <div className={cn(DASHBOARD_STATS_GRID,)}>
          <Card className={cn(CARD)}>
            <CardContent className={cn(CARD_CONTENT)}>
              <div className={cn(FLEX_ROW_BETWEEN)}>
                <p className={cn(TEXT_STYLES.label,)}>
                  Total Organizations
                </p>
                <div className={cn(DASHBOARD_STAT_ICON_CONTAINER)}>
                  <Buildings3 className={cn(DASHBOARD_STAT_ICON)} />
                </div>
              </div>
              <div className={cn(FLEX_COL, "space-y-0.5")}>
                <p className={cn(TEXT_STYLES.title, )}>
                  {stats.totalOrganizations}
                </p>
                <p className={cn(TEXT_STYLES.tiny, FONT_FAMILY.montserratSemibold)}>Created and Managed</p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(CARD)}>
            <CardContent className={cn(CARD_CONTENT)}>
              <div className={cn(FLEX_ROW_BETWEEN)}>
                <p className={cn(TEXT_STYLES.label)}>
                  Support Workers
                </p>
                <div className={cn(DASHBOARD_STAT_ICON_CONTAINER)}>
                  <UsersGroupRounded className={cn(DASHBOARD_STAT_ICON)} />
                </div>
              </div>
              <div className={cn(FLEX_COL, "space-y-0.5")}>
                <p className={cn(TEXT_STYLES.title)}>{stats.supportWorkers}</p>
                <p className={cn(TEXT_STYLES.tiny, FONT_FAMILY.montserratSemibold)}>Active Teams</p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(CARD)}>
            <CardContent className={cn(CARD_CONTENT)}>
              <div className={cn(FLEX_ROW_BETWEEN)}>
                <p className={cn(TEXT_STYLES.label)}>
                  Average Per Rate
                </p>
                <div className={cn(DASHBOARD_STAT_ICON_CONTAINER)}>
                  <Dollar className={cn(DASHBOARD_STAT_ICON)} />
                </div>
              </div>
              <div className={cn(FLEX_COL, "space-y-0.5")}>
                <p className={cn(TEXT_STYLES.title)}>${stats.averageRate.toFixed(2)}</p>
                <p className={cn(TEXT_STYLES.tiny, FONT_FAMILY.montserratSemibold)}>Per Hour</p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(CARD)}>
            <CardContent className={cn(CARD_CONTENT)}>
              <div className={cn(FLEX_ROW_BETWEEN)}>
                <p className={cn(TEXT_STYLES.label)}>
                  Pending Invitations
                </p>
                <div className={cn(DASHBOARD_STAT_ICON_CONTAINER)}>
                  <ClockCircle className={cn(DASHBOARD_STAT_ICON)} />
                </div>
              </div>
              <div className={cn(FLEX_COL, "space-y-0.5")}>
                <p className={cn(TEXT_STYLES.title)}>{stats.pendingInvitations}</p>
                <p className={cn(TEXT_STYLES.tiny, FONT_FAMILY.montserratSemibold)}>Awaiting Responses</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organizations List */}
        <div>
          <h2 className={cn(HEADING_5, "font-montserrat-bold text-gray-900 mb-4")}>
            All Organizations ({filteredOrganizations.length})
          </h2>

          {filteredOrganizations.length === 0 ? (
            <Card className={cn(CARD)}>
              <CardContent className={cn("p-12 text-center")}>
                <Buildings3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className={cn(HEADING_5, "font-montserrat-bold text-gray-900 mb-2")}>
                  No organizations found
                </h3>
                <p className={cn(TEXT_MUTED)}>
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "You don't have any organization connections yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={cn(GRID_RESPONSIVE, GAP.responsive)}>
              {filteredOrganizations.map((org) => (
                <Card
                  key={org._id}
                  className={cn(CARD, "hover:shadow-md transition-shadow")}
                >
                  <CardContent className="p-5 md:p-6">
                    <div className={cn(FLEX_ROW_CENTER, "items-start", GAP.lg, "md:" + GAP.xl, "mb-5 md:mb-6")}>
                      <div className={cn(ORG_ICON_CONTAINER_LG)}>
                        <UsersGroupTwoRounded className={cn(ORG_ICON_LG)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn("text-base md:text-lg font-montserrat-bold text-gray-900 mb-1")}>
                          {org.name}
                        </h3>
                        <p className={cn(TEXT_MUTED, "text-sm")}>
                          {org.description}
                        </p>
                      </div>
                    </div>

                    <div className={cn(FLEX_COL, "space-y-3 md:space-y-3.5 mb-5 md:mb-6 text-xs md:text-sm")}>
                      <div className={cn(FLEX_ROW_CENTER, "text-sm", GAP.lg)}>
                        <div className={cn(DASHBOARD_DETAIL_ICON_CONTAINER)}>
                          <Calendar className={cn(DASHBOARD_DETAIL_ICON)} />
                        </div>
                        <span className={cn(TEXT_MUTED, "font-montserrat-semibold")}>
                          Created on
                        </span>
                        <span className="ml-auto text-gray-900 font-montserrat-semibold">
                          {new Date(org.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className={cn(FLEX_ROW_CENTER, "text-sm", GAP.lg)}>
                        <div className={cn(DASHBOARD_DETAIL_ICON_CONTAINER)}>
                          <ClockCircle className={cn(DASHBOARD_DETAIL_ICON)} />
                        </div>
                        <span className={cn(TEXT_MUTED, "font-montserrat-semibold")}>
                          Last Updated
                        </span>
                        <span className="ml-auto text-gray-900 font-montserrat-semibold">
                          {new Date(org.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className={cn(FLEX_ROW_CENTER, "text-sm", GAP.lg)}>
                        <div className={cn(DASHBOARD_DETAIL_ICON_CONTAINER)}>
                          <span className="text-primary-600 font-montserrat-bold text-xs">#</span>
                        </div>
                        <span className={cn(TEXT_MUTED, "font-montserrat-semibold")}>
                          Organization ID
                        </span>
                        <span className="ml-auto text-gray-900 font-montserrat-semibold text-xs truncate max-w-[140px] md:max-w-[200px]">
                          {org._id}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className={cn(BUTTON_BASE, "w-fit flex place-self-end border-primary-600 text-primary-600 hover:bg-primary-50 hover:text-primary-700 font-montserrat-semibold gap-2")}
                      onClick={() =>
                        navigate(`/support-worker/organizations/${org._id}`)
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
