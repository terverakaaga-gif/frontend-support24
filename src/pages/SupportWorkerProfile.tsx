
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, Clock, MapPin, Phone, Mail, User, Edit, Briefcase,
  Languages, Star, DollarSign, CheckSquare, X, Calendar as CalendarIcon
} from "lucide-react";

// This is a placeholder - in a real app we would fetch the support worker data
// from an API or context based on authentication
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
    country: "USA"
  },
  profileImage: "/placeholder.svg",
  bio: "Dedicated physical therapist with 7+ years of experience working with participants of all ages. Specialized in mobility assistance and rehabilitation exercises.",
  skills: ["personal-care", "therapy", "social-support", "first-aid", "medication-management"] as const,
  experience: [
    {
      title: "Senior Physical Therapist",
      organization: "Portland Rehabilitation Center",
      startDate: new Date("2020-06-01"),
      description: "Provide specialized therapy services for adults with mobility challenges. Develop personalized care plans and conduct regular progress assessments."
    },
    {
      title: "Support Worker",
      organization: "Northwest Care Services",
      startDate: new Date("2016-04-15"),
      endDate: new Date("2020-05-30"),
      description: "Assisted participants with daily living activities, administered medication, and facilitated community engagement programs."
    }
  ],
  hourlyRate: {
    baseRate: 35,
    weekendRate: 45,
    holidayRate: 55,
    overnightRate: 40
  },
  availability: {
    weekdays: [
      { day: "Monday", available: true, slots: [{ start: "09:00", end: "17:00" }] },
      { day: "Tuesday", available: true, slots: [{ start: "09:00", end: "17:00" }] },
      { day: "Wednesday", available: true, slots: [{ start: "09:00", end: "17:00" }] },
      { day: "Thursday", available: true, slots: [{ start: "09:00", end: "17:00" }] },
      { day: "Friday", available: true, slots: [{ start: "09:00", end: "17:00" }] },
      { day: "Saturday", available: false },
      { day: "Sunday", available: false }
    ],
    unavailableDates: [new Date("2025-04-15"), new Date("2025-04-16")]
  },
  languages: ["English", "Spanish"],
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
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
    serviceCategory: "therapy"
  },
  {
    id: "2",
    date: "2025-04-12",
    timeStart: "2:00 PM",
    timeEnd: "4:00 PM",
    participant: "Robert Anderson",
    location: "Community Center",
    serviceCategory: "social-support"
  }
];

const ratings = [
  {
    id: "1",
    participant: "Emma Wilson",
    date: "2025-04-01",
    rating: 5,
    comment: "Sarah was extremely helpful and professional. She made my therapy session comfortable and effective."
  },
  {
    id: "2",
    participant: "Thomas Miller",
    date: "2025-03-25",
    rating: 4,
    comment: "Good support during our community outing. Sarah was attentive to my needs."
  }
];

export default function SupportWorkerProfile() {
  const { user } = useAuth();
  // In a real application, we would use the authenticated user's ID to fetch the support worker profile
  // For now, we'll use our mock data
  const supportWorker = mockSupportWorker;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
          <div key={i} className="text-yellow-400">
            {i < rating ? "★" : "☆"}
          </div>
        ))}
      </div>
    );
  };

  // Format skills for display
  const formatSkill = (skill: string) => {
    return skill.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Support Worker Profile</h1>
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
                <AvatarImage src={supportWorker.profileImage} alt={supportWorker.fullName} />
                <AvatarFallback className="text-2xl bg-guardian text-white">
                  {supportWorker.firstName.charAt(0)}{supportWorker.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{supportWorker.fullName}</CardTitle>
            <CardDescription>
              <Badge className="mt-1 bg-guardian">Support Worker</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-guardian" />
                <span>{supportWorker.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-guardian" />
                <span>{supportWorker.phone}</span>
              </div>
              {supportWorker.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-guardian mt-0.5" />
                  <div>
                    <div>{supportWorker.address.street}</div>
                    <div>{`${supportWorker.address.city}, ${supportWorker.address.state} ${supportWorker.address.postalCode}`}</div>
                    <div>{supportWorker.address.country}</div>
                  </div>
                </div>
              )}
              <Separator />
              
              {/* Languages */}
              <div className="pt-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <Languages className="h-4 w-4 text-guardian" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {supportWorker.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="bg-guardian/10 text-guardian border-guardian/20">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Hourly Rates */}
              <div className="pt-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-guardian" />
                  Hourly Rates
                </h3>
                <div className="pl-6 space-y-1 text-sm">
                  <div><span className="font-medium">Base Rate:</span> ${supportWorker.hourlyRate.baseRate}/hour</div>
                  {supportWorker.hourlyRate.weekendRate && (
                    <div><span className="font-medium">Weekend:</span> ${supportWorker.hourlyRate.weekendRate}/hour</div>
                  )}
                  {supportWorker.hourlyRate.holidayRate && (
                    <div><span className="font-medium">Holiday:</span> ${supportWorker.hourlyRate.holidayRate}/hour</div>
                  )}
                  {supportWorker.hourlyRate.overnightRate && (
                    <div><span className="font-medium">Overnight:</span> ${supportWorker.hourlyRate.overnightRate}/hour</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About & Skills</TabsTrigger>
              <TabsTrigger value="schedule">Availability</TabsTrigger>
              <TabsTrigger value="shifts">Upcoming Shifts</TabsTrigger>
              <TabsTrigger value="ratings">Ratings & Reviews</TabsTrigger>
            </TabsList>
            
            {/* About & Skills Tab */}
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Bio</h3>
                    <p>{supportWorker.bio}</p>
                  </div>
                  
                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Skills & Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {supportWorker.skills?.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-guardian/10 text-guardian border-guardian/20">
                          {formatSkill(skill)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Experience */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Briefcase className="mr-2 h-5 w-5 text-guardian" />
                      Professional Experience
                    </h3>
                    <div className="space-y-4">
                      {supportWorker.experience.map((exp, index) => (
                        <div key={index} className="pl-2 border-l-2 border-guardian">
                          <h4 className="font-medium">{exp.title}</h4>
                          <div className="text-sm text-muted-foreground">
                            {exp.organization} • {formatDateRange(exp.startDate, exp.endDate)}
                          </div>
                          <p className="text-sm mt-1">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Availability Tab */}
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>My Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Weekly Schedule */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Weekly Schedule</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {supportWorker.availability.weekdays.map((day, index) => (
                          <div key={index} className={`p-3 rounded-lg text-center border ${day.available ? 'bg-guardian/10 border-guardian/20' : 'bg-gray-100 border-gray-200'}`}>
                            <div className="font-medium">{day.day.substring(0, 3)}</div>
                            {day.available ? (
                              <div className="text-xs mt-1">
                                <CheckSquare className="h-4 w-4 mx-auto text-guardian mb-1" />
                                {day.slots?.map((slot, i) => (
                                  <div key={i}>{slot.start} - {slot.end}</div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs mt-1 text-gray-500">
                                <X className="h-4 w-4 mx-auto mb-1" />
                                Unavailable
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Unavailable Dates */}
                    {supportWorker.availability.unavailableDates.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">Upcoming Time Off</h3>
                        <div className="space-y-2">
                          {supportWorker.availability.unavailableDates.map((date, index) => (
                            <div key={index} className="flex items-center p-2 rounded-lg border border-gray-200">
                              <CalendarIcon className="h-5 w-5 mr-3 text-red-500" />
                              <span>
                                {formatDate(date)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Upcoming Shifts Tab */}
            <TabsContent value="shifts">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Shifts</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingShifts.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingShifts.map(shift => (
                        <div key={shift.id} className="flex items-start p-4 rounded-lg border">
                          <div className="p-2 rounded-full bg-guardian/10 mr-4">
                            <Calendar className="h-6 w-6 text-guardian" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">
                                {shift.serviceCategory.split('-').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </h3>
                              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                Scheduled
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(shift.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              })}, {shift.timeStart} - {shift.timeEnd}
                            </div>
                            <div className="text-sm mt-1">
                              <span className="font-medium">Participant:</span> {shift.participant}
                            </div>
                            <div className="text-sm flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              {shift.location}
                            </div>
                          </div>
                          <Button size="sm" className="bg-guardian hover:bg-guardian-dark ml-2">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No upcoming shifts scheduled
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Ratings & Reviews Tab */}
            <TabsContent value="ratings">
              <Card>
                <CardHeader>
                  <CardTitle>Participant Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  {ratings.length > 0 ? (
                    <div className="space-y-4">
                      {ratings.map(review => (
                        <div key={review.id} className="p-4 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{review.participant}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                            <div className="flex items-center">
                              {renderRating(review.rating)}
                            </div>
                          </div>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No reviews available yet
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
