import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Edit,
  Briefcase,
  Languages,
  Star,
  DollarSign,
  CheckSquare,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import EditableAvatar from "@/components/EditableAvatar";
import { cn } from "@/lib/utils";

const mockSupportWorker = {
  _id: "sw1",
  email: "sarah.johnson@example.com",
  firstName: "Sarah",
  lastName: "Johnson",
  role: "support-worker" as const,
  status: "active" as const,
  phone: "555-987-6543",
  gender: "female" as const,
  dateOfBirth: new Date("1990-03-20"),
  address: {
    street: "456 Oak Avenue",
    city: "Portland",
    state: "OR",
    postalCode: "97201",
    country: "USA",
  },
  profileImage: "/placeholder.svg",
  bio: "Dedicated physical therapist with 7+ years of experience working with participants of all ages. Specialized in mobility assistance and rehabilitation exercises.",
  skills: [
    "personal-care",
    "therapy",
    "social-support",
    "first-aid",
    "medication-management",
  ] as const,
  experience: [
    {
      title: "Senior Physical Therapist",
      organization: "Portland Rehabilitation Center",
      startDate: new Date("2020-06-01"),
      description:
        "Provide specialized therapy services for adults with mobility challenges. Develop personalized care plans and conduct regular progress assessments.",
    },
    {
      title: "Support Worker",
      organization: "Northwest Care Services",
      startDate: new Date("2016-04-15"),
      endDate: new Date("2020-05-30"),
      description:
        "Assisted participants with daily living activities, administered medication, and facilitated community engagement programs.",
    },
  ],
  hourlyRate: {
    baseRate: 35,
    weekendRate: 45,
    holidayRate: 55,
    overnightRate: 40,
  },
  availability: {
    weekdays: [
      {
        day: "Monday",
        available: true,
        slots: [{ start: "09:00", end: "17:00" }],
      },
      {
        day: "Tuesday",
        available: true,
        slots: [{ start: "09:00", end: "17:00" }],
      },
      {
        day: "Wednesday",
        available: true,
        slots: [{ start: "09:00", end: "17:00" }],
      },
      {
        day: "Thursday",
        available: true,
        slots: [{ start: "09:00", end: "17:00" }],
      },
      {
        day: "Friday",
        available: true,
        slots: [{ start: "09:00", end: "17:00" }],
      },
      { day: "Saturday", available: false },
      { day: "Sunday", available: false },
    ],
    unavailableDates: [new Date("2025-04-15"), new Date("2025-04-16")],
  },
  languages: ["English", "Spanish"],
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
};

// Just for demo purposes - in a real app these would come from a database
const upcomingShifts = [
  {
    id: "1",
    date: "2025-04-10",
    timeStart: "10:00 AM",
    timeEnd: "12:00 PM",
    participant: "Emma Wilson",
    location: "Home Visit",
    serviceCategory: "therapy",
  },
  {
    id: "2",
    date: "2025-04-12",
    timeStart: "2:00 PM",
    timeEnd: "4:00 PM",
    participant: "Robert Anderson",
    location: "Community Center",
    serviceCategory: "social-support",
  },
];

const ratings = [
  {
    id: "1",
    participant: "Emma Wilson",
    date: "2025-04-01",
    rating: 5,
    comment:
      "Sarah was extremely helpful and professional. She made my therapy session comfortable and effective.",
  },
  {
    id: "2",
    participant: "Thomas Miller",
    date: "2025-03-25",
    rating: 4,
    comment:
      "Good support during our community outing. Sarah was attentive to my needs.",
  },
];

export default function SupportWorkerProfile() {
  const { user } = useAuth();
  // In a real application, we would use the authenticated user's ID to fetch the support worker profile
  // For now, we'll use our mock data
  const supportWorker = mockSupportWorker;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateRange = (startDate: Date, endDate?: Date) => {
    const start = formatDate(startDate);
    return endDate ? `${start} - ${formatDate(endDate)}` : `${start} - Present`;
  };

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn("w-4 h-4", {
              "fill-yellow-400 text-yellow-400": i < rating,
              "text-gray-300": i >= rating,
            })}
          />
        ))}
      </div>
    );
  };

  // Format skills for display
  const formatSkill = (skill: string) => {
    return skill
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3b93]">
            My Support Worker Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your professional profile and availability
          </p>
        </div>
        <Button className="bg-[#1e3b93] hover:bg-[#1e3b93]/90 shadow-md">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1 border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <EditableAvatar />
                {/* <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div> */}
              </div>
            </div>
            <CardTitle className="text-2xl text-gray-900">{`${user?.firstName} ${user?.lastName}`}</CardTitle>
            <CardDescription className="mt-2">
              <Badge className="bg-[#1e3b93] text-white hover:bg-[#1e3b93]/90 shadow-sm">
                Support Worker
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1e3b93]/5 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#1e3b93]/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-[#1e3b93]" />
                </div>
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1e3b93]/5 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#1e3b93]/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-[#1e3b93]" />
                </div>
                <span className="text-sm text-gray-700">{user?.phone}</span>
              </div>
              {supportWorker.address && (
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#1e3b93]/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#1e3b93]/10 flex items-center justify-center mt-0.5">
                    <MapPin className="h-4 w-4 text-[#1e3b93]" />
                  </div>
                  <div className="text-sm text-gray-700">
                    <div>{supportWorker.address.street}</div>
                    <div>{`${supportWorker.address.city}, ${supportWorker.address.state} ${supportWorker.address.postalCode}`}</div>
                    <div>{supportWorker.address.country}</div>
                  </div>
                </div>
              )}
            </div>

            <Separator className="bg-[#1e3b93]/10" />

            {/* Languages */}
            <div className="pt-2">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-[#1e3b93]">
                <Languages className="h-4 w-4" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {supportWorker.languages.map((language, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-[#1e3b93]/10 text-[#1e3b93] border-[#1e3b93]/20 hover:bg-[#1e3b93]/20 transition-colors"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Hourly Rates */}
            <div className="pt-2">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-[#1e3b93]">
                <DollarSign className="h-4 w-4" />
                Hourly Rates
              </h3>
              <div className="bg-[#1e3b93]/5 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Base Rate:</span>
                  <span className="text-gray-900 font-semibold">
                    ${supportWorker.hourlyRate.baseRate}/hour
                  </span>
                </div>
                {supportWorker.hourlyRate.weekendRate && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Weekend:</span>
                    <span className="text-gray-900 font-semibold">
                      ${supportWorker.hourlyRate.weekendRate}/hour
                    </span>
                  </div>
                )}
                {supportWorker.hourlyRate.holidayRate && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Holiday:</span>
                    <span className="text-gray-900 font-semibold">
                      ${supportWorker.hourlyRate.holidayRate}/hour
                    </span>
                  </div>
                )}
                {supportWorker.hourlyRate.overnightRate && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Overnight:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      ${supportWorker.hourlyRate.overnightRate}/hour
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Content Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="mb-6 bg-[#1e3b93]/5 border border-[#1e3b93]/10">
              <TabsTrigger
                value="about"
                className="data-[state=active]:bg-[#1e3b93] data-[state=active]:text-white"
              >
                About & Skills
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="data-[state=active]:bg-[#1e3b93] data-[state=active]:text-white"
              >
                Availability
              </TabsTrigger>
              <TabsTrigger
                value="shifts"
                className="data-[state=active]:bg-[#1e3b93] data-[state=active]:text-white"
              >
                Upcoming Shifts
              </TabsTrigger>
              <TabsTrigger
                value="ratings"
                className="data-[state=active]:bg-[#1e3b93] data-[state=active]:text-white"
              >
                Ratings & Reviews
              </TabsTrigger>
            </TabsList>

            {/* About & Skills Tab */}
            <TabsContent value="about">
              <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
                <CardHeader className="border-b border-[#1e3b93]/10">
                  <CardTitle className="text-[#1e3b93]">
                    Professional Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-900">
                      Bio
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {supportWorker.bio}
                    </p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-900">
                      Skills & Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {supportWorker.skills?.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-[#1e3b93]/10 text-[#1e3b93] border-[#1e3b93]/20 hover:bg-[#1e3b93]/20 transition-colors"
                        >
                          {formatSkill(skill)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center text-gray-900">
                      <Briefcase className="mr-2 h-5 w-5 text-[#1e3b93]" />
                      Professional Experience
                    </h3>
                    <div className="space-y-4">
                      {supportWorker.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="pl-4 border-l-4 border-[#1e3b93]/30 bg-[#1e3b93]/5 p-4 rounded-lg"
                        >
                          <h4 className="font-semibold text-gray-900">
                            {exp.title}
                          </h4>
                          <div className="text-sm text-[#1e3b93] font-medium mt-1">
                            {exp.organization} •{" "}
                            {formatDateRange(exp.startDate, exp.endDate)}
                          </div>
                          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="schedule">
              <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
                <CardHeader className="border-b border-[#1e3b93]/10">
                  <CardTitle className="text-[#1e3b93]">
                    My Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Weekly Schedule */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-gray-900">
                        Weekly Schedule
                      </h3>
                      <div className="grid grid-cols-7 gap-3">
                        {supportWorker.availability.weekdays.map(
                          (day, index) => (
                            <div
                              key={index}
                              className={cn(
                                "p-3 rounded-lg text-center border transition-colors",
                                day.available
                                  ? "bg-[#1e3b93]/10 border-[#1e3b93]/20 hover:bg-[#1e3b93]/20"
                                  : "bg-gray-50 border-gray-200"
                              )}
                            >
                              <div className="font-medium text-gray-900">
                                {day.day.substring(0, 3)}
                              </div>
                              {day.available ? (
                                <div className="text-xs mt-2">
                                  <CheckSquare className="h-4 w-4 mx-auto text-[#1e3b93] mb-1" />
                                  {day.slots?.map((slot, i) => (
                                    <div
                                      key={i}
                                      className="text-[#1e3b93] font-medium"
                                    >
                                      {slot.start} - {slot.end}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-xs mt-2 text-gray-500">
                                  <X className="h-4 w-4 mx-auto mb-1" />
                                  Unavailable
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Unavailable Dates */}
                    {supportWorker.availability.unavailableDates.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-gray-900">
                          Upcoming Time Off
                        </h3>
                        <div className="space-y-3">
                          {supportWorker.availability.unavailableDates.map(
                            (date, index) => (
                              <div
                                key={index}
                                className="flex items-center p-3 rounded-lg border border-red-200 bg-red-50"
                              >
                                <CalendarIcon className="h-5 w-5 mr-3 text-red-500" />
                                <span className="text-red-700 font-medium">
                                  {formatDate(date)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Upcoming Shifts Tab */}
            <TabsContent value="shifts">
              <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
                <CardHeader className="border-b border-[#1e3b93]/10">
                  <CardTitle className="text-[#1e3b93]">
                    Upcoming Shifts
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {upcomingShifts.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingShifts.map((shift) => (
                        <div
                          key={shift.id}
                          className="flex items-start p-4 rounded-lg border border-[#1e3b93]/10 hover:bg-[#1e3b93]/5 transition-colors"
                        >
                          <div className="p-3 rounded-full bg-[#1e3b93]/10 mr-4">
                            <Calendar className="h-5 w-5 text-[#1e3b93]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {shift.serviceCategory
                                  .split("-")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(" ")}
                              </h3>
                              <Badge
                                variant="outline"
                                className="bg-[#1e3b93]/10 text-[#1e3b93] border-[#1e3b93]/20"
                              >
                                Scheduled
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center mb-2">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(shift.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                              , {shift.timeStart} - {shift.timeEnd}
                            </div>
                            <div className="text-sm mb-2">
                              <span className="font-medium text-gray-600">
                                Participant:
                              </span>
                              <span className="text-[#1e3b93] ml-1">
                                {shift.participant}
                              </span>
                            </div>
                            <div className="text-sm flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              {shift.location}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-[#1e3b93] hover:bg-[#1e3b93]/90 ml-2"
                          >
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-16 h-16 bg-[#1e3b93]/10 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-6 h-6 text-[#1e3b93]/60" />
                      </div>
                      <p className="text-muted-foreground text-lg">
                        No upcoming shifts scheduled
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check back later for new assignments
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ratings & Reviews Tab */}
            <TabsContent value="ratings">
              <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
                <CardHeader className="border-b border-[#1e3b93]/10">
                  <CardTitle className="text-[#1e3b93]">
                    Participant Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {ratings.length > 0 ? (
                    <div className="space-y-4">
                      {ratings.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 rounded-lg border border-[#1e3b93]/10 hover:bg-[#1e3b93]/5 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-medium text-gray-900">
                                {review.participant}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              {renderRating(review.rating)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-16 h-16 bg-[#1e3b93]/10 rounded-full flex items-center justify-center mb-4">
                        <Star className="w-6 h-6 text-[#1e3b93]/60" />
                      </div>
                      <p className="text-muted-foreground text-lg">
                        No reviews available yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete more shifts to receive participant feedback
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
