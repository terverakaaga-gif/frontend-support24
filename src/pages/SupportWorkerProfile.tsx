import React, { useState, useEffect } from "react";
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
	Loader2,
	AlertCircle,
} from "lucide-react";
import EditableAvatar from "@/components/EditableAvatar";
import { cn } from "@/lib/utils";
import supportWorkerService from "@/api/services/supportWorkerService";
import { SupportWorker } from "@/types/user.types";
import { toast } from "@/hooks/use-toast";

export default function SupportWorkerProfile() {
	const { user } = useAuth();
	const [supportWorker, setSupportWorker] = useState<SupportWorker | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Load support worker profile on component mount
	useEffect(() => {
		loadProfile();
	}, []);

	const loadProfile = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const profile = await supportWorkerService.getProfile();
			setSupportWorker(profile);
		} catch (error) {
			console.error("Failed to load profile:", error);
			setError("Failed to load profile. Please try again.");
			toast({
				title: "Error",
				description: "Failed to load your profile. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const formatDate = (date: string | Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatDateRange = (
		startDate: string | Date,
		endDate?: string | Date
	) => {
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

	// Loading state
	if (isLoading) {
		return (
			<div className="container py-6">
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin mr-3" />
					<span className="text-lg">Loading your profile...</span>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !supportWorker) {
		return (
			<div className="container py-6">
				<Card className="max-w-md mx-auto">
					<CardContent className="pt-6">
						<div className="text-center">
							<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Unable to Load Profile
							</h3>
							<p className="text-gray-600 mb-4">
								{error || "There was a problem loading your profile."}
							</p>
							<Button
								onClick={loadProfile}
								className="bg-guardian hover:bg-guardian/90"
							>
								Try Again
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container py-6 space-y-6">
			{/* Header Section */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-guardian">
						My Support Worker Profile
					</h1>
					<p className="text-muted-foreground mt-2">
						Manage your professional profile and availability
					</p>
				</div>
				<Button className="bg-guardian hover:bg-guardian/90 shadow-md">
					<Edit className="mr-2 h-4 w-4" />
					Edit Profile
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Profile Summary Card */}
				<Card className="lg:col-span-1 border-guardian/10 transition-all duration-200 hover:shadow-lg">
					<CardHeader className="text-center pb-4">
						<div className="flex justify-center mb-6">
							<div className="relative">
								<EditableAvatar />
							</div>
						</div>
						<CardTitle className="text-2xl text-gray-900">
							{supportWorker.firstName} {supportWorker.lastName}
						</CardTitle>
						<CardDescription className="mt-2">
							<Badge className="bg-guardian text-white hover:bg-guardian/90 shadow-sm">
								Support Worker
							</Badge>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-4">
							<div className="flex items-center gap-3 p-2 rounded-lg hover:bg-guardian/5 transition-colors">
								<div className="w-8 h-8 rounded-lg bg-guardian/10 flex items-center justify-center">
									<Mail className="h-4 w-4 text-guardian" />
								</div>
								<span className="text-sm text-gray-700">
									{supportWorker.email}
								</span>
							</div>
							{supportWorker.phone && (
								<div className="flex items-center gap-3 p-2 rounded-lg hover:bg-guardian/5 transition-colors">
									<div className="w-8 h-8 rounded-lg bg-guardian/10 flex items-center justify-center">
										<Phone className="h-4 w-4 text-guardian" />
									</div>
									<span className="text-sm text-gray-700">
										{supportWorker.phone}
									</span>
								</div>
							)}
							{supportWorker.address && (
								<div className="flex items-start gap-3 p-2 rounded-lg hover:bg-guardian/5 transition-colors">
									<div className="w-8 h-8 rounded-lg bg-guardian/10 flex items-center justify-center mt-0.5">
										<MapPin className="h-4 w-4 text-guardian" />
									</div>
									<div className="text-sm text-gray-700">
										<div>{supportWorker.address.street}</div>
										<div>{`${supportWorker.address.city}, ${supportWorker.address.state} ${supportWorker.address.postalCode}`}</div>
										<div>{supportWorker.address.country}</div>
									</div>
								</div>
							)}
						</div>

						<Separator className="bg-guardian/10" />

						{/* Languages */}
						{supportWorker.languages && supportWorker.languages.length > 0 && (
							<div className="pt-2">
								<h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-guardian">
									<Languages className="h-4 w-4" />
									Languages
								</h3>
								<div className="flex flex-wrap gap-2">
									{supportWorker.languages.map((language, index) => (
										<Badge
											key={index}
											variant="outline"
											className="bg-guardian/10 text-guardian border-guardian/20 hover:bg-guardian/20 transition-colors"
										>
											{language}
										</Badge>
									))}
								</div>
							</div>
						)}

						{/* Hourly Rates */}
						{(supportWorker.hourlyRate ||
							supportWorker.weekendRate ||
							supportWorker.holidayRate ||
							supportWorker.overnightRate) && (
							<div className="pt-2">
								<h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-guardian">
									<DollarSign className="h-4 w-4" />
									Hourly Rates
								</h3>
								<div className="bg-guardian/5 rounded-lg p-3 space-y-2 text-sm">
									{supportWorker.hourlyRate && (
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">
												Base Rate:
											</span>
											<span className="text-gray-900 font-semibold">
												${supportWorker.hourlyRate}/hour
											</span>
										</div>
									)}
									{supportWorker.weekendRate && (
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">
												Weekend:
											</span>
											<span className="text-gray-900 font-semibold">
												${supportWorker.weekendRate}/hour
											</span>
										</div>
									)}
									{supportWorker.holidayRate && (
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">
												Holiday:
											</span>
											<span className="text-gray-900 font-semibold">
												${supportWorker.holidayRate}/hour
											</span>
										</div>
									)}
									{supportWorker.overnightRate && (
										<div className="flex justify-between">
											<span className="font-medium text-gray-600">
												Overnight:
											</span>
											<span className="text-gray-900 font-semibold">
												${supportWorker.overnightRate}/hour
											</span>
										</div>
									)}
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Main Content Area */}
				<div className="lg:col-span-2">
					{/* Content Tabs */}
					<Tabs defaultValue="about" className="w-full">
						<TabsList className="mb-6 bg-guardian/5 border border-guardian/10">
							<TabsTrigger
								value="about"
								className="data-[state=active]:bg-guardian data-[state=active]:text-white"
							>
								About & Skills
							</TabsTrigger>
							<TabsTrigger
								value="schedule"
								className="data-[state=active]:bg-guardian data-[state=active]:text-white"
							>
								Availability
							</TabsTrigger>
							<TabsTrigger
								value="shifts"
								className="data-[state=active]:bg-guardian data-[state=active]:text-white"
							>
								Upcoming Shifts
							</TabsTrigger>
							<TabsTrigger
								value="ratings"
								className="data-[state=active]:bg-guardian data-[state=active]:text-white"
							>
								Ratings & Reviews
							</TabsTrigger>
						</TabsList>

						{/* About & Skills Tab */}
						<TabsContent value="about">
							<Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
								<CardHeader className="border-b border-guardian/10">
									<CardTitle className="text-guardian">
										Professional Profile
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6 pt-6">
									{/* Bio */}
									<div>
										<h3 className="text-lg font-medium mb-3 text-gray-900">
											Bio
										</h3>
										{supportWorker.bio ? (
											<p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
												{supportWorker.bio}
											</p>
										) : (
											<div className="text-center py-8 bg-gray-50 rounded-lg">
												<p className="text-gray-500">No bio added yet</p>
												<Button variant="outline" size="sm" className="mt-2">
													Add Bio
												</Button>
											</div>
										)}
									</div>

									{/* Skills */}
									<div>
										<h3 className="text-lg font-medium mb-3 text-gray-900">
											Skills & Specializations
										</h3>
										{supportWorker.skills && supportWorker.skills.length > 0 ? (
											<div className="flex flex-wrap gap-2">
												{supportWorker.skills.map((skill, index) => (
													<Badge
														key={index}
														variant="outline"
														className="bg-guardian/10 text-guardian border-guardian/20 hover:bg-guardian/20 transition-colors"
													>
														{formatSkill(skill)}
													</Badge>
												))}
											</div>
										) : (
											<div className="text-center py-8 bg-gray-50 rounded-lg">
												<p className="text-gray-500">No skills added yet</p>
												<Button variant="outline" size="sm" className="mt-2">
													Add Skills
												</Button>
											</div>
										)}
									</div>

									{/* Experience */}
									<div>
										<h3 className="text-lg font-medium mb-4 flex items-center text-gray-900">
											<Briefcase className="mr-2 h-5 w-5 text-guardian" />
											Professional Experience
										</h3>
										{supportWorker.experience &&
										supportWorker.experience.length > 0 ? (
											<div className="space-y-4">
												{supportWorker.experience.map((exp, index) => (
													<div
														key={index}
														className="pl-4 border-l-4 border-guardian/30 bg-guardian/5 p-4 rounded-lg"
													>
														<h4 className="font-semibold text-gray-900">
															{exp.title}
														</h4>
														<div className="text-sm text-guardian font-medium mt-1">
															{exp.organization} •{" "}
															{formatDateRange(exp.startDate, exp.endDate)}
														</div>
														{exp.description && (
															<p className="text-sm text-gray-700 mt-2 leading-relaxed">
																{exp.description}
															</p>
														)}
													</div>
												))}
											</div>
										) : (
											<div className="text-center py-8 bg-gray-50 rounded-lg">
												<p className="text-gray-500">No experience added yet</p>
												<Button variant="outline" size="sm" className="mt-2">
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
							<Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
								<CardHeader className="border-b border-guardian/10">
									<CardTitle className="text-guardian">
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
											{supportWorker.availability?.weekdays ? (
												<div className="grid grid-cols-7 gap-3">
													{supportWorker.availability.weekdays.map(
														(day, index) => (
															<div
																key={index}
																className={cn(
																	"p-3 rounded-lg text-center border transition-colors",
																	day.available
																		? "bg-guardian/10 border-guardian/20 hover:bg-guardian/20"
																		: "bg-gray-50 border-gray-200"
																)}
															>
																<div className="font-medium text-gray-900">
																	{day.day.substring(0, 3)}
																</div>
																{day.available ? (
																	<div className="text-xs mt-2">
																		<CheckSquare className="h-4 w-4 mx-auto text-guardian mb-1" />
																		{day.slots?.map((slot, i) => (
																			<div
																				key={i}
																				className="text-guardian font-medium"
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
											) : (
												<div className="text-center py-8 bg-gray-50 rounded-lg">
													<p className="text-gray-500">No availability set</p>
													<Button variant="outline" size="sm" className="mt-2">
														Set Availability
													</Button>
												</div>
											)}
										</div>

										{/* Unavailable Dates */}
										{supportWorker.availability?.unavailableDates &&
											supportWorker.availability.unavailableDates.length >
												0 && (
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
							<Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
								<CardHeader className="border-b border-guardian/10">
									<CardTitle className="text-guardian">
										Upcoming Shifts
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-6">
									<div className="text-center py-12">
										<div className="mx-auto w-16 h-16 bg-guardian/10 rounded-full flex items-center justify-center mb-4">
											<Calendar className="w-6 h-6 text-guardian/60" />
										</div>
										<p className="text-muted-foreground text-lg">
											No upcoming shifts scheduled
										</p>
										<p className="text-sm text-muted-foreground mt-1">
											Check back later for new assignments
										</p>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Ratings & Reviews Tab */}
						<TabsContent value="ratings">
							<Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
								<CardHeader className="border-b border-guardian/10">
									<CardTitle className="text-guardian">
										Participant Feedback
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-6">
									<div className="text-center py-12">
										<div className="mx-auto w-16 h-16 bg-guardian/10 rounded-full flex items-center justify-center mb-4">
											<Star className="w-6 h-6 text-guardian/60" />
										</div>
										<p className="text-muted-foreground text-lg">
											No reviews available yet
										</p>
										<p className="text-sm text-muted-foreground mt-1">
											Complete more shifts to receive participant feedback
										</p>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
