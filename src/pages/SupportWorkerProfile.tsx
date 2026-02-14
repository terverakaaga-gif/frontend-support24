import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, Phone, Letter, Pen2, ClockCircle, CaseRoundMinimalistic
} from "@solar-icons/react";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import EditableAvatar from "@/components/EditableAvatar";
import { SupportWorker } from "@/types/support-worker";
import { StatsCard, EmptyState, StarRating, formatDate } from "@/components/supportworker/profile/ProfileUtils";
import { cn, DASHBOARD_PAGE_WRAPPER, DASHBOARD_CONTENT } from "@/lib/design-utils";

// Tabs
import { AboutTab } from "@/components/supportworker/profile/tabs/AboutTab";
import { ProfessionalTab } from "@/components/supportworker/profile/tabs/ProfessionalTab";
import { AvailabilityTab } from "@/components/supportworker/profile/tabs/AvailabilityTab";

export default function SupportWorkerProfile() {
  const navigate = useNavigate();
  const { data: profileData, isLoading, error, isError, refetch } = useProfile();
  const [activeTab, setActiveTab] = useState("about");

  if (isLoading) return <Loader type="pulse" />;
  if (isError || !profileData) {
    return <ErrorDisplay title="Failed to load profile" message={error?.message || "Unable to load profile data"} onRetry={refetch} showRetry={true} />;
  }

  const supportWorker = profileData.user as unknown as SupportWorker;

  const stats = {
    totalShifts: { total: 0 },
    upcomingShifts: { total: 0 },
    totalSkills: { total: supportWorker.skills?.length || 0 },
  };

  // Mocks for now, can be replaced with real data later
  const upcomingShifts: any[] = [];
  const reviews: any[] = [];

  const tabButtons = [
    { id: "about", label: "About & Skills" },
    { id: "professional", label: "Professional Details" },
    { id: "schedule", label: "Availability" },
    { id: "shifts", label: "Upcoming Shifts" },
    { id: "ratings", label: "Ratings & Reviews" },
  ];

  return (
    <div className={DASHBOARD_PAGE_WRAPPER}>
      <div className={DASHBOARD_CONTENT}>
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your professional profile and availability</p>
          </div>
          <Button onClick={() => navigate("/support-worker/profile/edit")} className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
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
                  <h2 className="text-2xl font-montserrat-bold text-gray-900">
                    {supportWorker.firstName} {supportWorker.lastName}
                  </h2>
                  <Badge className="mt-2 bg-primary text-white hover:bg-primary/90">Support Worker</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Letter className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-montserrat-semibold">Email</p>
                      <p className="text-sm text-gray-900 truncate">{supportWorker.email}</p>
                    </div>
                  </div>
                  {supportWorker.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-montserrat-semibold">Phone</p>
                        <p className="text-sm text-gray-900">{supportWorker.phone}</p>
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
          <StatsCard stats={stats.totalShifts} title="Total Shifts" subtitle="All time" Icon={Calendar} />
          <StatsCard stats={stats.upcomingShifts} title="Upcoming Shifts" subtitle="Scheduled" Icon={ClockCircle} />
          <StatsCard stats={stats.totalSkills} title="Professional Skills" subtitle="Professional skills" Icon={CaseRoundMinimalistic} />
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabButtons.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-xs h-6 font-montserrat-semibold whitespace-nowrap transition-all duration-200",
                activeTab === tab.id ? "bg-primary text-white shadow-lg hover:bg-primary" : "bg-white text-gray-600 border border-gray-300 hover:bg-primary/10"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "about" && <AboutTab worker={supportWorker} onEdit={() => navigate("/support-worker/profile/edit")} />}
        {activeTab === "professional" && <ProfessionalTab worker={supportWorker} onEdit={() => navigate("/support-worker/profile/edit")} />}
        {activeTab === "schedule" && <AvailabilityTab worker={supportWorker} onEdit={() => navigate("/support-worker/profile/edit")} />}
        
        {/* Placeholder for Shifts Tab */}
        {activeTab === "shifts" && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <EmptyState 
                icon={ClockCircle} 
                title="No upcoming shifts scheduled" 
                subtitle="Your upcoming shifts will appear here"
                actionLabel="" // No action needed for empty shifts usually
                onAction={() => {}} 
              />
            </CardContent>
          </Card>
        )}

        {/* Placeholder for Ratings Tab */}
        {activeTab === "ratings" && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
               <EmptyState 
                icon={StarRating} // Using Star icon implicitly via EmptyState logic if adjusted, or pass StarIcon
                title="No reviews received yet" 
                subtitle="Reviews from participants will appear here"
                actionLabel="" 
                onAction={() => {}} 
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}