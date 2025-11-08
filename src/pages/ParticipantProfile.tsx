import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPoint,
  Phone,
  Letter,
  User,
  Pen2,
  ClockCircle,
  DangerCircle,
  UserHeart,
  Home,
} from "@solar-icons/react";
import { Participant } from "@/types/user.types";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import EditableAvatar from "@/components/EditableAvatar";
import { cn } from "@/lib/utils";

// Stats Card Component
function StatsCard({
  stats,
  title,
  Icon,
  subtitle,
}: {
  stats: { total: number; subtitle: string };
  title: string;
  Icon: any;
  subtitle: string;
}) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-4 sm:p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs md:text-sm font-montserrat-bold text-gray-600">
              {title}
            </p>
            <p className="md:text-2xl text-3xl font-montserrat-bold text-gray-900 group-hover:text-primary transition-colors">
              {stats.total}
            </p>
            <p className="text-xs text-gray-600 font-montserrat-semibold">
              {subtitle}
            </p>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ParticipantProfile() {
  const navigate = useNavigate();
  const {
    data: profileData,
    isLoading,
    error,
    isError,
    refetch,
  } = useProfile();
  const [activeTab, setActiveTab] = useState("support");

  if (isLoading) {
    return <Loader type="pulse" />;
  }

  if (isError || !profileData) {
    return (
      <ErrorDisplay
        title="Failed to load profile"
        message={error?.message || "Unable to load profile data"}
        onRetry={refetch}
        showRetry={true}
      />
    );
  }

  const participant = profileData.user as Participant;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEditProfile = () => {
    navigate("/participant/profile/edit");
  };

  // Calculate stats from actual data
  const stats = {
    totalSessions: { total: 0, subtitle: "All time" },
    upcomingSessions: { total: 0, subtitle: "Scheduled" },
    supportNeeds: {
      total: participant.supportNeeds?.length || 0,
      subtitle: "Active needs",
    },
  };

  const tabButtons = [
    { id: "support", label: "Support Needs" },
    { id: "personal", label: "Personal Info" },
    { id: "address", label: "Address" },
    { id: "emergency", label: "Emergency Contact" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your personal information and care preferences
            </p>
          </div>
          <Button
            onClick={handleEditProfile}
            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Pen2 className="w-5 h-5" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Card with Avatar */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex justify-center">
                <EditableAvatar />
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-montserrat-bold text-gray-900">
                    {participant.firstName} {participant.lastName}
                  </h2>
                  <Badge className="mt-2 bg-primary text-white hover:bg-primary/90">
                    {participant.role.charAt(0).toUpperCase() +
                      participant.role.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Letter className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 font-montserrat-semibold">
                        Email
                      </p>
                      <p className="text-sm text-gray-900 truncate">
                        {participant.email}
                      </p>
                    </div>
                  </div>

                  {participant.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 font-montserrat-semibold">
                          Phone
                        </p>
                        <p className="text-sm text-gray-900">
                          {participant.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            stats={stats.totalSessions}
            title="Total Sessions"
            subtitle={stats.totalSessions.subtitle}
            Icon={Calendar}
          />
          <StatsCard
            stats={stats.upcomingSessions}
            title="Upcoming Sessions"
            subtitle={stats.upcomingSessions.subtitle}
            Icon={ClockCircle}
          />
          <StatsCard
            stats={stats.supportNeeds}
            title="Support Needs"
            subtitle={stats.supportNeeds.subtitle}
            Icon={UserHeart}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabButtons.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-montserrat-semibold whitespace-nowrap transition-all duration-200",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "support" && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UserHeart className="w-5 h-5 text-primary" />
                  Support Needs
                </h3>
                {participant.supportNeeds &&
                participant.supportNeeds.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {participant.supportNeeds.map((need, index) => (
                      <Badge
                        key={index}
                        className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-sm"
                      >
                        {need.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <UserHeart className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-3 font-montserrat-semibold">
                      No support needs specified
                    </p>
                    <Button
                      onClick={handleEditProfile}
                      variant="outline"
                      size="sm"
                    >
                      Add Support Needs
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "personal" && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-primary/5 transition-colors">
                    <p className="text-xs text-gray-600 font-montserrat-semibold mb-1">
                      Date of Birth
                    </p>
                    <p className="text-sm text-gray-900 font-montserrat-semibold">
                      {participant.dateOfBirth
                        ? formatDate(participant.dateOfBirth)
                        : "Not provided"}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-primary/5 transition-colors">
                    <p className="text-xs text-gray-600 font-montserrat-semibold mb-1">
                      Gender
                    </p>
                    <p className="text-sm text-gray-900 font-montserrat-semibold">
                      {participant.gender
                        ? participant.gender.charAt(0).toUpperCase() +
                          participant.gender.slice(1)
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "address" && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPoint className="w-5 h-5 text-primary" />
                Address
              </h3>

              {participant.address ? (
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="space-y-2 text-sm text-gray-900">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <Home className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-montserrat-semibold text-gray-900">
                          {participant.address.street}
                        </p>
                        <p className="text-gray-700">
                          {participant.address.city},{" "}
                          {participant.address.state}{" "}
                          {participant.address.postalCode}
                        </p>
                        <p className="text-gray-700">
                          {participant.address.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MapPoint className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-3 font-montserrat-semibold">
                    No address specified
                  </p>
                  <Button
                    onClick={handleEditProfile}
                    variant="outline"
                    size="sm"
                  >
                    Add Address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "emergency" && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
                <DangerCircle className="w-5 h-5 text-primary" />
                Emergency Contact
              </h3>

              {participant.emergencyContact ? (
                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-white border border-red-100">
                      <p className="text-xs text-red-600 font-montserrat-semibold mb-1">
                        Name
                      </p>
                      <p className="text-sm text-gray-900 font-montserrat-semibold">
                        {participant.emergencyContact.name}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-red-100">
                      <p className="text-xs text-red-600 font-montserrat-semibold mb-1">
                        Relationship
                      </p>
                      <p className="text-sm text-gray-900 font-montserrat-semibold">
                        {participant.emergencyContact.relationship}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white border border-red-100">
                      <p className="text-xs text-red-600 font-montserrat-semibold mb-1">
                        Phone
                      </p>
                      <p className="text-sm text-gray-900 font-montserrat-semibold">
                        {participant.emergencyContact.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <DangerCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-3 font-montserrat-semibold">
                    No emergency contact specified
                  </p>
                  <Button
                    onClick={handleEditProfile}
                    variant="outline"
                    size="sm"
                  >
                    Add Emergency Contact
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
