
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Heart, MapPin, Phone, Mail, User, AlertCircle, Edit, FileText } from "lucide-react";

// This is a placeholder - in a real app we would fetch the participant data
// from an API or context based on authentication
const mockParticipant = {
  _id: "p1",
  email: "emma@example.com",
  firstName: "Emma",
  lastName: "Wilson",
  role: "participant" as const,
  status: "active" as const,
  phone: "555-123-4567",
  gender: "female" as const,
  dateOfBirth: new Date("1995-05-15"),
  address: {
    street: "123 Main St",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    country: "USA"
  },
  profileImage: "/placeholder.svg",
  bio: "I enjoy music, art therapy, and outdoor activities. I'm looking for consistent support to help with daily routines and community engagement.",
  supportNeeds: ["Personal care assistance", "Transportation to appointments", "Social activities", "Meal preparation"],
  emergencyContact: {
    name: "Robert Wilson",
    relationship: "Father",
    phone: "555-987-6543"
  },
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
};

// Just for demo purposes - in a real app these would come from a database
const upcomingAppointments = [
  {
    id: "1",
    date: "2025-04-10",
    time: "10:00 AM - 12:00 PM",
    supportWorker: "Sarah Johnson",
    service: "Physical Therapy"
  },
  {
    id: "2",
    date: "2025-04-12",
    time: "2:00 PM - 4:00 PM",
    supportWorker: "Michael Smith",
    service: "Social Support"
  }
];

const recentUpdates = [
  {
    id: "1",
    date: "2025-04-01",
    supportWorker: "Sarah Johnson",
    notes: "Excellent progress with physical exercises. Emma showed increased mobility and engagement."
  },
  {
    id: "2",
    date: "2025-03-25",
    supportWorker: "Michael Smith",
    notes: "Successful community outing to the local art museum. Emma particularly enjoyed the interactive exhibits."
  }
];

export default function ParticipantProfile() {
  const { user } = useAuth();
  // In a real application, we would use the authenticated user's ID to fetch the participant profile
  // For now, we'll use our mock data
  const participant = mockParticipant;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button className="bg-guardian hover:bg-guardian-dark">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={participant.profileImage} alt={participant.fullName} />
                <AvatarFallback className="text-2xl bg-guardian text-white">
                  {participant.firstName.charAt(0)}{participant.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{participant.fullName}</CardTitle>
            <CardDescription>
              <Badge className="mt-1 bg-guardian">{participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-guardian" />
                <span>{participant.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-guardian" />
                <span>{participant.phone}</span>
              </div>
              {participant.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-guardian mt-0.5" />
                  <div>
                    <div>{participant.address.street}</div>
                    <div>{`${participant.address.city}, ${participant.address.state} ${participant.address.postalCode}`}</div>
                    <div>{participant.address.country}</div>
                  </div>
                </div>
              )}
              <Separator />
              
              {/* Emergency Contact */}
              {participant.emergencyContact && (
                <div className="pt-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-guardian" />
                    Emergency Contact
                  </h3>
                  <div className="pl-6 space-y-1 text-sm">
                    <div><span className="font-medium">Name:</span> {participant.emergencyContact.name}</div>
                    <div><span className="font-medium">Relationship:</span> {participant.emergencyContact.relationship}</div>
                    <div><span className="font-medium">Phone:</span> {participant.emergencyContact.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio and Info Tabs */}
          <Tabs defaultValue="bio" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="bio">Bio & Support Needs</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="updates">Progress Updates</TabsTrigger>
            </TabsList>
            
            {/* Bio and Support Needs */}
            <TabsContent value="bio">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Bio</h3>
                    <p>{participant.bio}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Support Needs</h3>
                    <div className="flex flex-wrap gap-2">
                      {participant.supportNeeds.map((need, index) => (
                        <Badge key={index} variant="outline" className="bg-guardian/10 text-guardian border-guardian/20">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-md font-medium mb-2 flex items-center">
                        <User className="mr-2 h-4 w-4 text-guardian" />
                        Personal Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Date of Birth:</span> {participant.dateOfBirth ? formatDate(participant.dateOfBirth) : 'Not provided'}</div>
                        <div><span className="font-medium">Gender:</span> {participant.gender ? participant.gender.charAt(0).toUpperCase() + participant.gender.slice(1) : 'Not provided'}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map(appointment => (
                        <div key={appointment.id} className="flex items-start p-4 rounded-lg border">
                          <div className="p-2 rounded-full bg-guardian/10 mr-4">
                            <Calendar className="h-6 w-6 text-guardian" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{appointment.service}</h3>
                            <div className="text-sm text-muted-foreground flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(appointment.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              })}, {appointment.time}
                            </div>
                            <div className="text-sm mt-1">
                              <span className="font-medium">Support Worker:</span> {appointment.supportWorker}
                            </div>
                          </div>
                          <Button size="sm" className="bg-guardian hover:bg-guardian-dark mt-2">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No upcoming appointments
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Progress Updates Tab */}
            <TabsContent value="updates">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Progress Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentUpdates.length > 0 ? (
                    <div className="space-y-4">
                      {recentUpdates.map(update => (
                        <div key={update.id} className="p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-guardian" />
                            <span className="font-medium">{update.supportWorker}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(update.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <p className="text-sm">{update.notes}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No progress notes available
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
