import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Phone,
  Letter,
  Pen2,
  ClockCircle,
  Star,
  DollarMinimalistic,
  Translation,
  CaseRoundMinimalistic,
  CalendarMark,
  User,
  Dollar,
  MapPoint,
} from "@solar-icons/react";
import { SupportWorker } from "@/types/user.types";
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

export default function SupportWorkerProfile() {
  const navigate = useNavigate();
  const {
    data: profileData,
    isLoading,
    error,
    isError,
    refetch,
  } = useProfile();
  const [activeTab, setActiveTab] = useState("about");

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

  const supportWorker = profileData.user as SupportWorker;

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "Date not specified";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatDateRange = (
    startDate?: string | Date | null,
    endDate?: string | Date | null
  ) => {
    if (!startDate) return "No date specified";
    const start = formatDate(startDate);
    return endDate ? `${start} - ${formatDate(endDate)}` : `${start} - Present`;
  };

  const handleEditProfile = () => {
    navigate("/support-worker/profile/edit");
  };

  const formatSkill = (skill: string) => {
    return skill
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn("w-4 h-4", {
              "text-yellow-400": i < rating,
              "text-gray-300": i >= rating,
            })}
          />
        ))}
      </div>
    );
  };

  // Calculate stats from actual data
  const stats = {
    totalShifts: { total: 0, subtitle: "All time" },
    upcomingShifts: { total: 0, subtitle: "Scheduled" },
    totalSkills: {
      total: supportWorker.skills?.length || 0,
      subtitle: "Professional skills",
    },
  };

  // Mock data - replace with actual API calls
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
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your professional profile and availability
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
                    {supportWorker.firstName} {supportWorker.lastName}
                  </h2>
                  <Badge className="mt-2 bg-primary text-white hover:bg-primary/90">
                    Support Worker
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
                        {supportWorker.email}
                      </p>
                    </div>
                  </div>

                  {supportWorker.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 font-montserrat-semibold">
                          Phone
                        </p>
                        <p className="text-sm text-gray-900">
                          {supportWorker.phone}
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
            stats={stats.totalShifts}
            title="Total Shifts"
            subtitle={stats.totalShifts.subtitle}
            Icon={Calendar}
          />
          <StatsCard
            stats={stats.upcomingShifts}
            title="Upcoming Shifts"
            subtitle={stats.upcomingShifts.subtitle}
            Icon={ClockCircle}
          />
          <StatsCard
            stats={stats.totalSkills}
            title="Professional Skills"
            subtitle={stats.totalSkills.subtitle}
            Icon={CaseRoundMinimalistic}
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
        {activeTab === "about" && (
          <div className="space-y-6">
            {/* Bio */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                    Bio
                  </h3>
                  {supportWorker.bio ? (
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {supportWorker.bio}
                    </p>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-3 font-montserrat-semibold">
                        No bio added yet
                      </p>
                      <Button
                        onClick={handleEditProfile}
                        variant="outline"
                        size="sm"
                      >
                        Add Bio
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                    Skills
                  </h3>
                  {supportWorker.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {supportWorker.skills.map((s, i) => (
                        <Badge
                          key={i}
                          className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-sm"
                        >
                          {formatSkill(s.name)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <CaseRoundMinimalistic className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-3 font-montserrat-semibold">
                        No skills added yet
                      </p>
                      <Button
                        onClick={handleEditProfile}
                        variant="outline"
                        size="sm"
                      >
                        Add Skills
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Languages & Shift Rates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Languages */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Translation className="w-5 h-5 text-primary" />
                    Languages
                  </h3>
                  {supportWorker.languages?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {supportWorker.languages.map((lang, i) => (
                        <Badge
                          key={i}
                          className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-sm"
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Translation className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-sm mb-2 font-montserrat-semibold">
                        No languages specified
                      </p>
                      <Button
                        onClick={handleEditProfile}
                        variant="outline"
                        size="sm"
                      >
                        Add Languages
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shift Rates */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarMinimalistic className="w-5 h-5 text-primary" />
                    Shift Rates
                  </h3>
                  {supportWorker.shiftRates?.length > 0 ? (
                    <div className="space-y-2">
                      {supportWorker.shiftRates.map((rate, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-200"
                        >
                          <span className="text-sm text-gray-600 font-montserrat-semibold">
                            {rate.rateTimeBandId.name}
                          </span>
                          <span className="text-sm font-montserrat-bold text-gray-900">
                            ${rate.hourlyRate}/hr
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Dollar className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-sm mb-2 font-montserrat-semibold">
                        No rates specified
                      </p>
                      <Button
                        onClick={handleEditProfile}
                        variant="outline"
                        size="sm"
                      >
                        Add Rates
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Experience */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                    Experience
                  </h3>
                  {supportWorker.experience?.length > 0 ? (
                    <div className="space-y-4">
                      {supportWorker.experience.map((exp, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                        >
                          <h4 className="font-montserrat-bold text-gray-900 mb-1">
                            {exp.title} at {exp.organization}
                          </h4>
                          <span className="text-xs text-gray-600 font-montserrat-semibold">
                            {formatDateRange(exp.startDate, exp.endDate)}
                          </span>
                          {exp.description && (
                            <p className="mt-2 text-sm text-gray-700">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <CaseRoundMinimalistic className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-3 font-montserrat-semibold">
                        No experience added yet
                      </p>
                      <Button
                        onClick={handleEditProfile}
                        variant="outline"
                        size="sm"
                      >
                        Add Experience
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "professional" && (
          <div className="space-y-6">
            {/* Qualifications */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CaseRoundMinimalistic className="w-5 h-5 text-primary" />
                  Qualifications
                </h3>
                {supportWorker.qualifications?.length > 0 ? (
                  <div className="space-y-3">
                    {supportWorker.qualifications.map((qual, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-gray-50 border border-gray-200"
                      >
                        <h4 className="font-montserrat-semibold text-gray-900">
                          {qual.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Issued by: {qual.issuer}
                        </p>
                        <p className="text-xs text-gray-500">
                          Issued: {formatDate(qual.issueDate)}
                          {qual.expiryDate &&
                            ` | Expires: ${formatDate(qual.expiryDate)}`}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600 mb-2 font-montserrat-semibold">
                      No qualifications added
                    </p>
                    <Button onClick={handleEditProfile} variant="outline" size="sm">
                      Add Qualifications
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4">
                  Verification Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(supportWorker.verificationStatus || {}).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200"
                      >
                        <span className="text-sm font-montserrat-semibold capitalize">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .toLowerCase()}
                        </span>
                        <Badge
                          className={
                            value
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {value ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Service Areas */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPoint className="w-5 h-5 text-primary" />
                  Service Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-xs text-gray-600 font-montserrat-semibold mb-1">
                        Travel Radius
                      </p>
                      <p className="text-sm text-gray-900">
                        {supportWorker.travelRadiusKm || 0} km
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-xs text-gray-600 font-montserrat-semibold mb-1">
                        Service Areas
                      </p>
                      <p className="text-sm text-gray-900">
                        {supportWorker.serviceAreaIds?.length || 0} areas
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "schedule" && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarMark className="w-5 h-5 text-primary" />
                My Availability
              </h3>
              {supportWorker.availability?.weekdays?.length > 0 ? (
                <div className="space-y-4">
                  {supportWorker.availability.weekdays.map((day, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <h4 className="font-montserrat-bold capitalize text-gray-900 mb-3">
                        {day.day}
                      </h4>
                      {day.slots?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {day.slots.map((slot, j) => (
                            <Badge
                              key={j}
                              className="bg-primary-100 text-primary border-0 hover:bg-primary-200 transition-colors px-4 py-2 text-sm"
                            >
                              {slot.start} - {slot.end}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">Not available</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarMark className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2 font-montserrat-semibold">
                    No availability set yet
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    Set your availability to start receiving shift requests
                  </p>
                  <Button
                    onClick={handleEditProfile}
                    variant="outline"
                    size="sm"
                  >
                    Set Availability
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "shifts" && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
                <ClockCircle className="w-5 h-5 text-primary" />
                Upcoming Shifts
              </h3>
              {upcomingShifts.length > 0 ? (
                <div className="space-y-4">
                  {upcomingShifts.map((shift, i) => (
                    <div
                      key={i}
                      className="flex items-center p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-primary/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                        <ClockCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-montserrat-semibold text-gray-900">
                          {shift.title}
                        </h4>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {shift.date} | {shift.time}
                        </div>
                      </div>
                      <Badge
                        className={cn({
                          "bg-primary-100 text-primary":
                            shift.status === "Scheduled",
                          "bg-yellow-100 text-yellow-600":
                            shift.status === "Pending",
                          "bg-green-100 text-green-600":
                            shift.status === "Completed",
                        })}
                      >
                        {shift.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ClockCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2 font-montserrat-semibold">
                    No upcoming shifts scheduled
                  </p>
                  <p className="text-sm text-gray-500">
                    Your upcoming shifts will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "ratings" && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-montserrat-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Ratings & Reviews
              </h3>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-montserrat-bold text-gray-900">
                          {review.reviewerName}
                        </div>
                        <div>{renderRating(review.rating)}</div>
                      </div>
                      <span className="text-xs text-gray-600 font-montserrat-semibold">
                        {formatDate(review.date)}
                      </span>
                      <p className="mt-2 text-sm text-gray-700">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2 font-montserrat-semibold">
                    No reviews received yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Reviews from participants will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
