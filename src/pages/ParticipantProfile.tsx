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
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and care preferences</p>
          </div>
          <Button onClick={() => navigate("/participant/profile/edit")} className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
            <Pen2 className="w-5 h-5" /> Edit Profile
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex justify-center"><EditableAvatar /></div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-montserrat-bold text-gray-900">{participant.firstName} {participant.lastName}</h2>
                  <Badge className="mt-2 bg-primary text-white hover:bg-primary/90 capitalize">{participant.role}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Letter className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 font-montserrat-semibold">Email</p>
                      <p className="text-sm text-gray-900 truncate">{participant.email}</p>
                    </div>
                  </div>
                  {participant.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 font-montserrat-semibold">Phone</p>
                        <p className="text-sm text-gray-900">{participant.phone}</p>
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