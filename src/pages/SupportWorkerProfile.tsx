import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  Mail,
  Edit,
  Languages,
  Star,
  DollarSign,
  AlertCircle,
  Calendar,
  Clock,
  User,
  FileText,
} from "lucide-react";
import EditableAvatar from "@/components/EditableAvatar";
import { cn } from "@/lib/utils";
import { SupportWorker } from "@/types/user.types";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { ArrowLeft } from "@solar-icons/react";

export default function SupportWorkerProfile() {
  const navigate = useNavigate();
  const { data: profileData, isLoading, error, isError, refetch } = useProfile();

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

  const formatSkill = (skill: string) => {
    return skill
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Mock data - replace with actual API calls
  const upcomingShifts: any[] = [];
  const reviews: any[] = [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
			{/* Custom back button */}
			<Button
				onClick={() => navigate(-1)}
				variant="outline"
				className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
			>
				<ArrowLeft size={24} />
				Back
			</Button>
          <div>
            <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
              My Support Worker Profile
            </h1>
            <p className="text-gray-600">
              Manage your professional profile and availability
            </p>
          </div>
          <Button
            onClick={handleEditProfile}
            className="bg-primary hover:bg-primary-700 text-white shadow-md flex items-center gap-2"
          >
            <Edit size={24} />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1 border-gray-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-6">
                <EditableAvatar />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                {supportWorker.firstName} {supportWorker.lastName}
              </CardTitle>
              <CardDescription className="mt-2">
                <Badge className="bg-primary text-white hover:bg-primary/90 shadow-sm">
                  Support Worker
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-gray-700">{supportWorker.email}</span>
                </div>
                {supportWorker.phone && (
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-gray-700">{supportWorker.phone}</span>
                  </div>
                )}
              </div>

              <Separator className="bg-gray-200" />

              {/* Languages */}
              {supportWorker.languages?.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-sm font-montserrat-semibold flex items-center gap-2 mb-3 text-primary">
                    <Languages size={24} />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {supportWorker.languages.map((lang, i) => (
                      <Badge key={i} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Shift Rates */}
              {supportWorker.shiftRates?.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-sm font-montserrat-semibold flex items-center gap-2 mb-3 text-primary">
                    <DollarSign size={24} />
                    Shift Rates
                  </h3>
                  <div className="bg-primary/5 rounded-lg p-3 space-y-2">
                    {supportWorker.shiftRates.map((rate, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{rate.rateTimeBandId.name}</span>
                        <span className="font-montserrat-semibold text-gray-900">
                          ${rate.hourlyRate}/hr
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-6 bg-primary-100/50 border border-primary-100 rounded-full font-montserrat-semibold p-1">
                <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:rounded-full">
                  About & Skills
                </TabsTrigger>
                <TabsTrigger value="schedule" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:rounded-full">
                  Availability
                </TabsTrigger>
                <TabsTrigger value="shifts" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:rounded-full">
                  Upcoming Shifts
                </TabsTrigger>
                <TabsTrigger value="ratings" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:rounded-full">
                  Ratings & Reviews
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about">
                <Card className="border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-primary">Professional Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-gray-900">Bio</h3>
                      {supportWorker.bio ? (
                        <p className="text-gray-700 leading-relaxed bg-gray-100 p-4 rounded-lg border border-gray-200">
                          {supportWorker.bio}
                        </p>
                      ) : (
                        <div className="text-center py-8 bg-gray-100 rounded-lg border border-gray-200">
                          <p className="text-gray-1000 mb-2">No bio added yet</p>
                          <Button onClick={handleEditProfile} variant="outline" size="sm">
                            Add Bio
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-gray-900">Skills</h3>
                      {supportWorker.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {supportWorker.skills.map((s, i) => (
                            <Badge key={i} className="bg-primary text-white hover:bg-primary/90">
                              {formatSkill(s.name)}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-100 rounded-lg border border-gray-200">
                          <p className="text-gray-1000 mb-2">No skills added yet</p>
                          <Button onClick={handleEditProfile} variant="outline" size="sm">
                            Add Skills
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Experience */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-gray-900">Experience</h3>
                      {supportWorker.experience?.length > 0 ? (
                        <div className="space-y-4">
                          {supportWorker.experience.map((exp, i) => (
                            <div key={i} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                              <h4 className="font-montserrat-semibold text-gray-900">
                                {exp.title} at {exp.organization}
                              </h4>
                              <span className="text-sm text-gray-600">
                                {formatDateRange(exp.startDate, exp.endDate)}
                              </span>
                              {exp.description && (
                                <p className="mt-2 text-gray-700">{exp.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-100 rounded-lg border border-gray-200">
                          <p className="text-gray-1000 mb-2">No experience added yet</p>
                          <Button onClick={handleEditProfile} variant="outline" size="sm">
                            Add Experience
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Availability Tab */}
              <TabsContent value="schedule">
                <Card className="border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-primary">My Availability</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {supportWorker.availability?.weekdays?.length > 0 ? (
                      <div className="space-y-4">
                        {supportWorker.availability.weekdays.map((day, i) => (
                          <div key={i} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-montserrat-semibold capitalize text-gray-900 mb-3">
                              {day.day}
                            </h4>
                            {day.slots?.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {day.slots.map((slot, j) => (
                                  <Badge
                                    key={j}
                                    variant="outline"
                                    className="bg-primary/10 text-primary border-primary/20"
                                  >
                                    {slot.start} - {slot.end}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-1000">Not available</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-100 rounded-lg border border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <Calendar className="w-6 h-6 text-primary/60" />
                        </div>
                        <p className="text-gray-1000">No availability set yet</p>
                        <p className="text-sm text-gray-1000 mt-1">
                          Set your availability to start receiving shift requests
                        </p>
                        <Button onClick={handleEditProfile} variant="outline" size="sm" className="mt-4">
                          Set Availability
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Upcoming Shifts Tab */}
              <TabsContent value="shifts">
                <Card className="border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-primary">Upcoming Shifts</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {upcomingShifts.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingShifts.map((shift, i) => (
                          <div
                            key={i}
                            className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <div className="p-3 rounded-full bg-primary/10 mr-4">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{shift.title}</h4>
                              <div className="text-sm text-gray-600 flex items-center mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                {shift.date} | {shift.time}
                              </div>
                            </div>
                            <Badge
                              className={cn({
                                "bg-primary-100 text-primary-800": shift.status === "Scheduled",
                                "bg-yellow-100 text-yellow-800": shift.status === "Pending",
                                "bg-green-100 text-green-800": shift.status === "Completed",
                              })}
                            >
                              {shift.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-100 rounded-lg border border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <Clock className="w-6 h-6 text-primary/60" />
                        </div>
                        <p className="text-gray-1000">No upcoming shifts scheduled</p>
                        <p className="text-sm text-gray-1000 mt-1">
                          Your upcoming shifts will appear here
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Ratings & Reviews Tab */}
              <TabsContent value="ratings">
                <Card className="border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-primary">Ratings & Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review, i) => (
                          <div key={i} className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-montserrat-semibold text-gray-900">
                                {review.reviewerName}
                              </div>
                              <div>{renderRating(review.rating)}</div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {formatDate(review.date)}
                            </span>
                            <p className="mt-2 text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-100 rounded-lg border border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <Star className="w-6 h-6 text-primary/60" />
                        </div>
                        <p className="text-gray-1000">No reviews received yet</p>
                        <p className="text-sm text-gray-1000 mt-1">
                          Reviews from participants will appear here
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
    </div>
  );
}