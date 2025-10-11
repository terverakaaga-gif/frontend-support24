import React from "react";
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
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  AlertCircle,
  Edit,
  FileText,
} from "lucide-react";
import { Participant } from "@/types/user.types";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import EditableAvatar from "@/components/EditableAvatar";

export default function ParticipantProfile() {
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

  // Mock data - replace with actual API calls
  const upcomingAppointments: any[] = [];
  const recentUpdates: any[] = [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">
              Manage your personal information and care preferences
            </p>
          </div>
          <Button
            onClick={handleEditProfile}
            className="bg-primary hover:bg-primary-700 text-white shadow-md flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
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
                {participant.firstName} {participant.lastName}
              </CardTitle>
              <CardDescription className="mt-2">
                <Badge className="bg-primary text-white hover:bg-primary/90 shadow-sm">
                  {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-gray-700">{participant.email}</span>
                </div>
                {participant.phone && (
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-gray-700">{participant.phone}</span>
                  </div>
                )}
                {participant.address && (
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm text-gray-700">
                      <div>{participant.address.street}</div>
                      <div>{`${participant.address.city}, ${participant.address.state} ${participant.address.postalCode}`}</div>
                      <div>{participant.address.country}</div>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="bg-gray-200" />

              {/* Emergency Contact */}
              {participant.emergencyContact && (
                <div className="pt-2">
                  <h3 className="text-sm font-montserrat-semibold flex items-center gap-2 mb-3 text-primary">
                    <AlertCircle className="h-4 w-4" />
                    Emergency Contact
                  </h3>
                  <div className="bg-primary/5 rounded-lg p-3 space-y-2 text-sm border border-primary/10">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="text-gray-900">
                        {participant.emergencyContact.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Relationship:</span>
                      <span className="text-gray-900">
                        {participant.emergencyContact.relationship}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span className="text-gray-900">
                        {participant.emergencyContact.phone}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="bio" className="w-full">
              <TabsList className="mb-6 bg-primary/5 border border-primary/10">
                <TabsTrigger value="bio" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Bio & Support Needs
                </TabsTrigger>
                <TabsTrigger value="appointments" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="updates" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Progress Updates
                </TabsTrigger>
              </TabsList>

              {/* Bio and Support Needs */}
              <TabsContent value="bio">
                <Card className="border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-primary">About Me</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* Support Needs */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-gray-900">Support Needs</h3>
                      {participant.supportNeeds && participant.supportNeeds.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {participant.supportNeeds.map((need, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                            >
                              {need.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-100 rounded-lg border border-gray-200">
                          <p className="text-gray-1000 mb-2">No support needs specified</p>
                          <Button onClick={handleEditProfile} variant="outline" size="sm">
                            Add Support Needs
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                        <h3 className="text-md font-medium mb-3 flex items-center text-primary">
                          <User className="mr-2 h-4 w-4" />
                          Personal Information
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Date of Birth:</span>
                            <span className="text-gray-900">
                              {participant.dateOfBirth
                                ? formatDate(participant.dateOfBirth)
                                : "Not provided"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Gender:</span>
                            <span className="text-gray-900">
                              {participant.gender
                                ? participant.gender.charAt(0).toUpperCase() +
                                  participant.gender.slice(1)
                                : "Not provided"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appointments Tab */}
              <TabsContent value="appointments">
                <Card className="border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-primary">Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {upcomingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-start p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <div className="p-3 rounded-full bg-primary/10 mr-4">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{appointment.service}</h3>
                              <div className="text-sm text-gray-600 flex items-center mt-2">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(appointment.date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                })}
                                , {appointment.time}
                              </div>
                              <div className="text-sm mt-2">
                                <span className="font-medium text-gray-600">Support Worker:</span>
                                <span className="text-primary ml-1">{appointment.supportWorker}</span>
                              </div>
                            </div>
                            <Button size="sm" className="bg-primary hover:bg-primary-700 mt-2">
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-100 rounded-lg border border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <Calendar className="w-6 h-6 text-primary/60" />
                        </div>
                        <p className="text-gray-1000">No upcoming appointments</p>
                        <p className="text-sm text-gray-1000 mt-1">
                          Schedule your next session with a support worker
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Progress Updates Tab */}
              <TabsContent value="updates">
                <Card className="border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-primary">Recent Progress Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {recentUpdates.length > 0 ? (
                      <div className="space-y-4">
                        {recentUpdates.map((update) => (
                          <div
                            key={update.id}
                            className="p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium text-primary">{update.supportWorker}</span>
                              <span className="text-sm text-gray-600 ml-auto">
                                {new Date(update.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed bg-gray-100 p-3 rounded-lg border border-gray-200">
                              {update.notes}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-100 rounded-lg border border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <FileText className="w-6 h-6 text-primary/60" />
                        </div>
                        <p className="text-gray-1000">No progress notes available</p>
                        <p className="text-sm text-gray-1000 mt-1">
                          Progress notes from your support workers will appear here
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