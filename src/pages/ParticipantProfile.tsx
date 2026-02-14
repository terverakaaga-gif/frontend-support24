import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, Phone, Letter, Pen2, ClockCircle, UserHeart
} from "@solar-icons/react";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import EditableAvatar from "@/components/EditableAvatar";
import { Participant } from "@/types/participant";
import { StatsCard } from "@/components/participant/profile/ProfileUtils";
import {
  cn,
  DASHBOARD_PAGE_WRAPPER,
  DASHBOARD_CONTENT,
  HEADING_1,
  TEXT_MUTED,
  FLEX_ROW_BETWEEN,
  FLEX_COL_CENTER,
  FLEX_CENTER,
  FLEX_ROW_CENTER,
} from "@/lib/design-utils";
import { 
  HEADING_STYLES, 
  TEXT_COLORS, 
  TEXT_SIZE,
  CONTAINER_PADDING,
  SPACING,
  BG_COLORS,
  FONT_WEIGHT,
  GAP
} from "@/constants/design-system";

// Tabs
import { SupportTab } from "@/components/participant/profile/tabs/SupportTab";
import { PersonalTab } from "@/components/participant/profile/tabs/PersonalTab";
import { LocationTab } from "@/components/participant/profile/tabs/LocationTab";
import { EmergencyTab } from "@/components/participant/profile/tabs/EmergencyTab";
import { CareTeamTab } from "@/components/participant/profile/tabs/CareTeamTab";
import { PreferencesTab } from "@/components/participant/profile/tabs/PreferencesTab";

export default function ParticipantProfile() {
  const navigate = useNavigate();
  const { data: profileData, isLoading, error, isError, refetch } = useProfile();
  const [activeTab, setActiveTab] = useState("support");

  if (isLoading) return <Loader type="pulse" />;
  if (isError || !profileData) {
    return <ErrorDisplay title="Failed to load profile" message={error?.message || "Unable to load profile data"} onRetry={refetch} showRetry={true} />;
  }

  const participant = profileData.user as unknown as Participant;

  const stats = {
    totalSessions: { total: 0, subtitle: "All time" }, // Can map from data if available
    upcomingSessions: { total: 0, subtitle: "Scheduled" },
    supportNeeds: { total: participant.supportNeeds?.length || 0, subtitle: "Active needs" },
  };

  const tabButtons = [
    { id: "support", label: "Support & NDIS" },
    { id: "personal", label: "Personal Info" },
    { id: "location", label: "Location" },
    { id: "emergency", label: "Emergency Contact" },
    { id: "care-team", label: "Care Team" },
    { id: "preferences", label: "Preferences" },
  ];

  return (
    <div className={DASHBOARD_PAGE_WRAPPER}>
      <div className={DASHBOARD_CONTENT}>
        {/* Header */}
        <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between", `mb-${SPACING.lg}`)}>
          <div>
            <h1 className={cn(HEADING_STYLES.h1)}>My Profile</h1>
            <p className={TEXT_COLORS.gray600}>Manage your personal information and care preferences</p>
          </div>
          <Button onClick={() => navigate("/participant/profile/edit")} className={cn("gap-2 shadow-lg hover:shadow-xl transition-all duration-300")}>
            <Pen2 className="w-5 h-5" /> Edit Profile
          </Button>
        </div>

        {/* Profile Card */}
        <Card className={cn("border-0 shadow-lg hover:shadow-xl transition-all duration-300", `mb-${SPACING.lg}`)}>
          <CardContent className={CONTAINER_PADDING.card}>
            <div className={cn("flex flex-col md:flex-row", `gap-${SPACING.lg}`, "items-start md:items-center")}>
              <div className={cn(FLEX_CENTER)}><EditableAvatar /></div>
              <div className={cn("flex-1", `space-y-${SPACING.md}`)}>
                <div>
                  <h2 className={cn(TEXT_SIZE["2xl"], FONT_WEIGHT.bold, TEXT_COLORS.gray900)}>{participant.firstName} {participant.lastName}</h2>
                  <Badge className={cn(`mt-${SPACING.md}`, BG_COLORS.primary, TEXT_COLORS.white, "hover:bg-primary/90 capitalize")}>{participant.role}</Badge>
                </div>
                <div className={cn("grid grid-cols-1 md:grid-cols-2", `gap-${SPACING.md}`)}>
                  <div className={cn(FLEX_ROW_CENTER, `gap-${SPACING.md}`, `p-${SPACING.md}`, "rounded-lg", BG_COLORS.gray50, "hover:bg-primary/5 transition-colors")}>
                    <div className={cn("w-10 h-10 rounded-full", BG_COLORS.primaryLight, FLEX_CENTER)}>
                      <Letter className={cn("w-5 h-5", TEXT_COLORS.primary)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(TEXT_SIZE.xs, TEXT_COLORS.gray600, FONT_WEIGHT.semibold)}>Email</p>
                      <p className={cn(TEXT_SIZE.sm, TEXT_COLORS.gray900, "truncate")}>{participant.email}</p>
                    </div>
                  </div>
                  {participant.phone && (
                    <div className={cn(FLEX_ROW_CENTER, `gap-${SPACING.md}`, `p-${SPACING.md}`, "rounded-lg", BG_COLORS.gray50, "hover:bg-primary/5 transition-colors")}>
                      <div className={cn("w-10 h-10 rounded-full", BG_COLORS.primaryLight, FLEX_CENTER)}>
                        <Phone className={cn("w-5 h-5", TEXT_COLORS.primary)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(TEXT_SIZE.xs, TEXT_COLORS.gray600, FONT_WEIGHT.semibold)}>Phone</p>
                        <p className={cn(TEXT_SIZE.sm, TEXT_COLORS.gray900)}>{participant.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard stats={stats.totalSessions} title="Total Sessions" subtitle={stats.totalSessions.subtitle} Icon={Calendar} />
          <StatsCard stats={stats.upcomingSessions} title="Upcoming Sessions" subtitle={stats.upcomingSessions.subtitle} Icon={ClockCircle} />
          <StatsCard stats={stats.supportNeeds} title="Support Needs" subtitle={stats.supportNeeds.subtitle} Icon={UserHeart} />
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabButtons.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-full h-6 text-xs font-montserrat-semibold whitespace-nowrap transition-all duration-200 hover:bg-primary-700",
                activeTab === tab.id ? "bg-primary text-white shadow-lg" : "bg-white text-gray-600 border border-gray-300 hover:bg-primary-700"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "support" && <SupportTab participant={participant} onEdit={() => navigate("/participant/profile/edit")} />}
        {activeTab === "personal" && <PersonalTab participant={participant} />}
        {activeTab === "location" && <LocationTab participant={participant} onEdit={() => navigate("/participant/profile/edit")} />}
        {activeTab === "emergency" && <EmergencyTab participant={participant} onEdit={() => navigate("/participant/profile/edit")} />}
        {activeTab === "care-team" && <CareTeamTab participant={participant} onEdit={() => navigate("/participant/profile/edit")} />}
        {activeTab === "preferences" && <PreferencesTab participant={participant} />}
      </div>
    </div>
  );
}