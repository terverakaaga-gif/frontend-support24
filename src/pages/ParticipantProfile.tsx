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
	Heart,
	MapPin,
	Phone,
	Mail,
	User,
	AlertCircle,
	Edit,
	FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
		country: "USA",
	},
	profileImage: "/placeholder.svg",
	bio: "I enjoy music, art therapy, and outdoor activities. I'm looking for consistent support to help with daily routines and community engagement.",
	supportNeeds: [
		"Personal care assistance",
		"Transportation to appointments",
		"Social activities",
		"Meal preparation",
	],
	emergencyContact: {
		name: "Robert Wilson",
		relationship: "Father",
		phone: "555-987-6543",
	},
	get fullName() {
		return `${this.firstName} ${this.lastName}`;
	},
};

// Just for demo purposes - in a real app these would come from a database
const upcomingAppointments = [
	{
		id: "1",
		date: "2025-04-10",
		time: "10:00 AM - 12:00 PM",
		supportWorker: "Sarah Johnson",
		service: "Physical Therapy",
	},
	{
		id: "2",
		date: "2025-04-12",
		time: "2:00 PM - 4:00 PM",
		supportWorker: "Michael Smith",
		service: "Social Support",
	},
];

const recentUpdates = [
	{
		id: "1",
		date: "2025-04-01",
		supportWorker: "Sarah Johnson",
		notes:
			"Excellent progress with physical exercises. Emma showed increased mobility and engagement.",
	},
	{
		id: "2",
		date: "2025-03-25",
		supportWorker: "Michael Smith",
		notes:
			"Successful community outing to the local art museum. Emma particularly enjoyed the interactive exhibits.",
	},
];

export default function ParticipantProfile() {
	const { user } = useAuth();
	// In a real application, we would use the authenticated user's ID to fetch the participant profile
	// For now, we'll use our mock data
	const participant = mockParticipant;

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="container py-6 space-y-6">
			{/* Header Section */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-[#008CFF]">
						My Profile
					</h1>
					<p className="text-muted-foreground mt-2">
						Manage your personal information and care preferences
					</p>
				</div>
				<Button className="bg-[#008CFF] hover:bg-[#008CFF]/90 shadow-md">
					<Edit className="mr-2 h-4 w-4" />
					Edit Profile
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Profile Summary Card */}
				<Card className="lg:col-span-1 border-[#008CFF]/10 transition-all duration-200 hover:shadow-lg">
					<CardHeader className="text-center pb-4">
						<div className="flex justify-center mb-6">
							<div className="relative">
								<Avatar className="h-24 w-24 border-4 border-[#008CFF]/10 shadow-lg">
									<AvatarImage
										src={participant.profileImage}
										alt={participant.fullName}
									/>
									<AvatarFallback className="text-2xl bg-[#008CFF] text-white font-semibold">
										{participant.firstName.charAt(0)}
										{participant.lastName.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
							</div>
						</div>
						<CardTitle className="text-2xl text-gray-900">
							{participant.fullName}
						</CardTitle>
						<CardDescription className="mt-2">
							<Badge className="bg-[#008CFF] text-white hover:bg-[#008CFF]/90 shadow-sm">
								{participant.role.charAt(0).toUpperCase() +
									participant.role.slice(1)}
							</Badge>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-4">
							<div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#008CFF]/5 transition-colors">
								<div className="w-8 h-8 rounded-lg bg-[#008CFF]/10 flex items-center justify-center">
									<Mail className="h-4 w-4 text-[#008CFF]" />
								</div>
								<span className="text-sm text-gray-700">
									{participant.email}
								</span>
							</div>
							<div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#008CFF]/5 transition-colors">
								<div className="w-8 h-8 rounded-lg bg-[#008CFF]/10 flex items-center justify-center">
									<Phone className="h-4 w-4 text-[#008CFF]" />
								</div>
								<span className="text-sm text-gray-700">
									{participant.phone}
								</span>
							</div>
							{participant.address && (
								<div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#008CFF]/5 transition-colors">
									<div className="w-8 h-8 rounded-lg bg-[#008CFF]/10 flex items-center justify-center mt-0.5">
										<MapPin className="h-4 w-4 text-[#008CFF]" />
									</div>
									<div className="text-sm text-gray-700">
										<div>{participant.address.street}</div>
										<div>{`${participant.address.city}, ${participant.address.state} ${participant.address.postalCode}`}</div>
										<div>{participant.address.country}</div>
									</div>
								</div>
							)}
						</div>

						<Separator className="bg-[#008CFF]/10" />

						{/* Emergency Contact */}
						{participant.emergencyContact && (
							<div className="pt-2">
								<h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-[#008CFF]">
									<AlertCircle className="h-4 w-4" />
									Emergency Contact
								</h3>
								<div className="bg-[#008CFF]/5 rounded-lg p-3 space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="font-medium text-gray-600">Name:</span>
										<span className="text-gray-900">
											{participant.emergencyContact.name}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="font-medium text-gray-600">
											Relationship:
										</span>
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
					{/* Bio and Info Tabs */}
					<Tabs defaultValue="bio" className="w-full">
						<TabsList className="mb-6 bg-[#008CFF]/5 border border-[#008CFF]/10">
							<TabsTrigger
								value="bio"
								className="data-[state=active]:bg-[#008CFF] data-[state=active]:text-white"
							>
								Bio & Support Needs
							</TabsTrigger>
							<TabsTrigger
								value="appointments"
								className="data-[state=active]:bg-[#008CFF] data-[state=active]:text-white"
							>
								Appointments
							</TabsTrigger>
							<TabsTrigger
								value="updates"
								className="data-[state=active]:bg-[#008CFF] data-[state=active]:text-white"
							>
								Progress Updates
							</TabsTrigger>
						</TabsList>

						{/* Bio and Support Needs */}
						<TabsContent value="bio">
							<Card className="border-[#008CFF]/10 transition-all duration-200 hover:shadow-lg">
								<CardHeader className="border-b border-[#008CFF]/10">
									<CardTitle className="text-[#008CFF]">About Me</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6 pt-6">
									<div>
										<h3 className="text-lg font-medium mb-3 text-gray-900">
											Bio
										</h3>
										<p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
											{participant.bio}
										</p>
									</div>

									<div>
										<h3 className="text-lg font-medium mb-3 text-gray-900">
											Support Needs
										</h3>
										<div className="flex flex-wrap gap-2">
											{participant.supportNeeds.map((need, index) => (
												<Badge
													key={index}
													variant="outline"
													className="bg-[#008CFF]/10 text-[#008CFF] border-[#008CFF]/20 hover:bg-[#008CFF]/20 transition-colors"
												>
													{need}
												</Badge>
											))}
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="bg-[#008CFF]/5 rounded-lg p-4">
											<h3 className="text-md font-medium mb-3 flex items-center text-[#008CFF]">
												<User className="mr-2 h-4 w-4" />
												Personal Information
											</h3>
											<div className="space-y-3 text-sm">
												<div className="flex justify-between">
													<span className="font-medium text-gray-600">
														Date of Birth:
													</span>
													<span className="text-gray-900">
														{participant.dateOfBirth
															? formatDate(participant.dateOfBirth)
															: "Not provided"}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="font-medium text-gray-600">
														Gender:
													</span>
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
							<Card className="border-[#008CFF]/10 transition-all duration-200 hover:shadow-lg">
								<CardHeader className="border-b border-[#008CFF]/10">
									<CardTitle className="text-[#008CFF]">
										Upcoming Appointments
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-6">
									{upcomingAppointments.length > 0 ? (
										<div className="space-y-4">
											{upcomingAppointments.map((appointment) => (
												<div
													key={appointment.id}
													className="flex items-start p-4 rounded-lg border border-[#008CFF]/10 hover:bg-[#008CFF]/5 transition-colors"
												>
													<div className="p-3 rounded-full bg-[#008CFF]/10 mr-4">
														<Calendar className="h-5 w-5 text-[#008CFF]" />
													</div>
													<div className="flex-1">
														<h3 className="font-medium text-gray-900">
															{appointment.service}
														</h3>
														<div className="text-sm text-muted-foreground flex items-center mt-2">
															<Clock className="h-4 w-4 mr-1" />
															{new Date(appointment.date).toLocaleDateString(
																"en-US",
																{
																	weekday: "long",
																	month: "long",
																	day: "numeric",
																}
															)}
															, {appointment.time}
														</div>
														<div className="text-sm mt-2">
															<span className="font-medium text-gray-600">
																Support Worker:
															</span>
															<span className="text-[#008CFF] ml-1">
																{appointment.supportWorker}
															</span>
														</div>
													</div>
													<Button
														size="sm"
														className="bg-[#008CFF] hover:bg-[#008CFF]/90 mt-2"
													>
														View Details
													</Button>
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-12">
											<div className="mx-auto w-16 h-16 bg-[#008CFF]/10 rounded-full flex items-center justify-center mb-4">
												<Calendar className="w-6 h-6 text-[#008CFF]/60" />
											</div>
											<p className="text-muted-foreground">
												No upcoming appointments
											</p>
											<p className="text-sm text-muted-foreground mt-1">
												Schedule your next session with a support worker
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Progress Updates Tab */}
						<TabsContent value="updates">
							<Card className="border-[#008CFF]/10 transition-all duration-200 hover:shadow-lg">
								<CardHeader className="border-b border-[#008CFF]/10">
									<CardTitle className="text-[#008CFF]">
										Recent Progress Notes
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-6">
									{recentUpdates.length > 0 ? (
										<div className="space-y-4">
											{recentUpdates.map((update) => (
												<div
													key={update.id}
													className="p-4 rounded-lg border border-[#008CFF]/10 hover:bg-[#008CFF]/5 transition-colors"
												>
													<div className="flex items-center gap-2 mb-3">
														<div className="w-8 h-8 rounded-lg bg-[#008CFF]/10 flex items-center justify-center">
															<FileText className="h-4 w-4 text-[#008CFF]" />
														</div>
														<span className="font-medium text-[#008CFF]">
															{update.supportWorker}
														</span>
														<span className="text-sm text-muted-foreground ml-auto">
															{new Date(update.date).toLocaleDateString(
																"en-US",
																{
																	year: "numeric",
																	month: "long",
																	day: "numeric",
																}
															)}
														</span>
													</div>
													<p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
														{update.notes}
													</p>
												</div>
											))}
										</div>
									) : (
										<div className="text-center py-12">
											<div className="mx-auto w-16 h-16 bg-[#008CFF]/10 rounded-full flex items-center justify-center mb-4">
												<FileText className="w-6 h-6 text-[#008CFF]/60" />
											</div>
											<p className="text-muted-foreground">
												No progress notes available
											</p>
											<p className="text-sm text-muted-foreground mt-1">
												Progress notes from your support workers will appear
												here
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
