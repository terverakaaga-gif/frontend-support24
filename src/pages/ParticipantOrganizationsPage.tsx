import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
    cn, 
    DASHBOARD_PAGE_WRAPPER,
    DASHBOARD_CONTENT,
    DASHBOARD_STAT_CARD,
    FLEX_ROW_BETWEEN,
    FLEX_ROW_CENTER,
  } from "@/lib/design-utils";
  import { 
    BG_COLORS, 
    BUTTON_VARIANTS,
    CONTAINER_PADDING,
    GRID_LAYOUTS,
    GAP,
    SPACING,
    HEADING_STYLES,
    TEXT_STYLES,
    FONT_FAMILY,
    TEXT_COLORS,
    SHADOW,
    RADIUS,
    BORDER_STYLES
} from "@/constants/design-system";
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
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className={cn(HEADING_STYLES.h3, "mb-2")}>
                Failed to load organizations
              </h3>
              <p className={cn(TEXT_STYLES.body, "mb-6")}>
                There was an error loading your organizations. Please try again.
              </p>
              <Button
                onClick={() => refetch()}
                className={BUTTON_VARIANTS.primary}
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
    <div className={DASHBOARD_PAGE_WRAPPER}>
      <div className={DASHBOARD_CONTENT}>
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
                className={cn()}
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
        <div className={cn(GRID_LAYOUTS.cols4, GAP.md, `mb-${SPACING.xl}`)}>
          <Card className={DASHBOARD_STAT_CARD}>
            <CardContent className={CONTAINER_PADDING.cardSm}>
              <div className={cn(FLEX_ROW_BETWEEN, "truncate")}>
                <p className={cn(TEXT_STYLES.label, "text-gray-600")}>
                  Total Organizations
                </p>
                <div className={cn(`p-${SPACING.sm}`, RADIUS.full, "bg-primary-300/20")}>
                  <Buildings3 className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className={cn("text-lg md:text-2xl", FONT_FAMILY.montserratBold, "text-gray-900")}>
                  {stats.totalOrganizations}
                </p>
                <p className={cn("text-[8px] md:text-xs", FONT_FAMILY.montserratBold)}>
                  Created and Managed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={DASHBOARD_STAT_CARD}>
            <CardContent className={CONTAINER_PADDING.cardSm}>
              <div className={cn(FLEX_ROW_BETWEEN, "truncate")}>
                <p className={cn(TEXT_STYLES.label, "text-gray-600")}>
                  Support Workers
                </p>
                <div className={cn(`p-${SPACING.sm}`, RADIUS.full, "bg-primary-300/20")}>
                  <UsersGroupRounded className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className={cn("text-lg md:text-2xl", FONT_FAMILY.montserratBold, "text-gray-900")}>
                  {stats.totalWorkers}
                </p>
                <p className={cn("text-[8px] md:text-xs", FONT_FAMILY.montserratBold)}>
                  Active Teams
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={DASHBOARD_STAT_CARD}>
            <CardContent className={CONTAINER_PADDING.cardSm}>
              <div className={cn(FLEX_ROW_BETWEEN, "truncate")}>
                <p className={cn(TEXT_STYLES.label, "text-gray-600")}>
                  Average Per Rate
                </p>
                <div className={cn(`p-${SPACING.sm}`, RADIUS.full, "bg-primary-300/20")}>
                  <Dollar className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className={cn("text-lg md:text-2xl", FONT_FAMILY.montserratBold, "text-gray-900")}>
                  ${stats.averagePerRate.toFixed(2)}
                </p>
                <p className={cn("text-[8px] md:text-xs", FONT_FAMILY.montserratBold)}>
                  Per Hour
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={DASHBOARD_STAT_CARD}>
            <CardContent className={CONTAINER_PADDING.cardSm}>
              <div className={cn(FLEX_ROW_BETWEEN, "truncate")}>
                <p className={cn(TEXT_STYLES.label, "text-gray-600")}>
                  Pending Invitations
                </p>
                <div className={cn(`p-${SPACING.sm}`, RADIUS.full, "bg-primary-300/20")}>
                  <ClockCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className={cn("text-lg md:text-2xl", FONT_FAMILY.montserratBold, "text-gray-900")}>
                  {stats.pendingInvitations}
                </p>
                <p className={cn("text-[8px] md:text-xs", FONT_FAMILY.montserratBold)}>
                  Awaiting Responses
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className={`mb-${SPACING.lg}`}>
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
          <h2 className={cn(HEADING_STYLES.h4, `mb-${SPACING.base}`)}>
            All Organizations ({filteredOrganizations.length})
          </h2>

          {filteredOrganizations.length === 0 ? (
            <Card className={cn(BORDER_STYLES.none, SHADOW.sm)}>
              <CardContent className="p-12 text-center">
                <Buildings3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className={cn(HEADING_STYLES.h3, "mb-2")}>
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
            <div className={cn(GRID_LAYOUTS.cols2, GAP.md)}>
              {filteredOrganizations.map((org) => (
                <Card
                  key={org._id}
                  className={cn(BORDER_STYLES.none, SHADOW.sm, "hover:shadow-md transition-shadow")}
                >
                  <CardContent className={CONTAINER_PADDING.card}>
                    <div className={cn(FLEX_ROW_CENTER, GAP.base, "items-start mb-5 md:mb-6")}>
                      <div className={cn("w-12 h-12 md:w-14 md:h-14", RADIUS.full, "bg-primary-600", FLEX_ROW_CENTER, "justify-center flex-shrink-0")}>
                        <UsersGroupTwoRounded className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn("text-base md:text-lg", FONT_FAMILY.montserratBold, "text-gray-900 mb-1")}>
                          {org.name}
                        </h3>
                        <p className={cn(TEXT_STYLES.small, "text-gray-600")}>
                          {org.description}
                        </p>
                      </div>
                    </div>

                    <div className={cn("space-y-3 md:space-y-3.5 mb-5 md:mb-6 text-xs md:text-sm")}>
                      <div className={cn(FLEX_ROW_CENTER, GAP.base, TEXT_STYLES.small)}>
                        <div className={cn("w-8 h-8", RADIUS.full, BG_COLORS.primaryLight, FLEX_ROW_CENTER, "justify-center flex-shrink-0")}>
                          <Calendar className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className={cn(FONT_FAMILY.montserratSemibold, "text-gray-600")}>
                          Created on
                        </span>
                        <span className={cn(FONT_FAMILY.montserratSemibold, "ml-auto text-gray-900")}>
                          {new Date(org.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className={cn(FLEX_ROW_CENTER, GAP.base, TEXT_STYLES.small)}>
                        <div className={cn("w-8 h-8", RADIUS.full, BG_COLORS.primaryLight, FLEX_ROW_CENTER, "justify-center flex-shrink-0")}>
                          <ClockCircle className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className={cn(FONT_FAMILY.montserratSemibold, "text-gray-600")}>
                          Last Updated
                        </span>
                        <span className={cn(FONT_FAMILY.montserratSemibold, "ml-auto text-gray-900")}>
                          {new Date(org.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className={cn(FLEX_ROW_CENTER, GAP.base, TEXT_STYLES.small)}>
                        <div className={cn("w-8 h-8", RADIUS.full, BG_COLORS.primaryLight, FLEX_ROW_CENTER, "justify-center flex-shrink-0")}>
                          <span className={cn(FONT_FAMILY.montserratBold, "text-primary-600 text-xs")}>
                            #
                          </span>
                        </div>
                        <span className={cn(FONT_FAMILY.montserratSemibold, "text-gray-600")}>
                          Organization ID
                        </span>
                        <span className={cn(FONT_FAMILY.montserratSemibold, "ml-auto text-gray-900 text-xs truncate max-w-[140px] md:max-w-[200px]")}>
                          {org._id}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className={cn(
                          "w-fit flex place-self-end border-primary-600 text-primary-600 hover:bg-primary-50 hover:text-primary-700",
                          FONT_FAMILY.montserratSemibold,
                          GAP.sm
                      )}
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
