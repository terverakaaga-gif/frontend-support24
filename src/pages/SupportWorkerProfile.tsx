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
} from "lucide-react";
import EditableAvatar from "@/components/EditableAvatar";
import { cn } from "@/lib/utils";
import { SupportWorker } from "@/types/user.types";
import Loader from "@/components/Loader";

export default function SupportWorkerProfile() {
	const navigate = useNavigate();
	const { data: profileData, isLoading, error, isError } = useProfile();

	if (isLoading) {
		return <Loader />;
	}

	if (isError || !profileData) {
		return (
			<div className="container py-6 space-y-6">
				<Card className="border-red-200 bg-red-50">
					<CardContent className="pt-6">
						<div className="text-center">
							<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
							<p className="text-red-700 mb-4">
								{error?.message || "Failed to load profile data"}
							</p>
							<Button
								onClick={() => window.location.reload()}
								variant="outline"
							>
								Try Again
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
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

	// Mock types
	type Shift = { title: string; date: string; time: string; status: string };
	type Review = {
		reviewerName: string;
		rating: number;
		date: string | Date;
		comment: string;
	};
	const upcomingShifts: Shift[] = [];
	const reviews: Review[] = [];

	return (
		<div className="container py-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-guardian">
						My Support Worker Profile
					</h1>
					<p className="text-muted-foreground mt-2">
						Manage your professional profile and availability
					</p>
				</div>
				<Button
					onClick={handleEditProfile}
					className="bg-guardian hover:bg-guardian/90 shadow-md"
				>
					<Edit className="mr-2 h-4 w-4" /> Edit Profile
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Profile Summary */}
				<Card className="lg:col-span-1 border-guardian/10 hover:shadow-lg">
					<CardHeader className="text-center pb-4">
						<div className="flex justify-center mb-6">
							<EditableAvatar />
						</div>
						<CardTitle className="text-2xl text-gray-900">
							{supportWorker.firstName} {supportWorker.lastName}
						</CardTitle>
						<CardDescription>
							<Badge className="bg-guardian text-white">Support Worker</Badge>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<Mail className="h-4 w-4 text-guardian" />
								<span>{supportWorker.email}</span>
							</div>
							{supportWorker.phone && (
								<div className="flex items-center gap-3">
									<Phone className="h-4 w-4 text-guardian" />
									<span>{supportWorker.phone}</span>
								</div>
							)}
						</div>
						<Separator />

						{/* Languages */}
						{supportWorker.languages?.length > 0 && (
							<div>
								<h3 className="font-semibold flex items-center gap-2">
									<Languages className="h-4 w-4" /> Languages
								</h3>
								<div className="flex flex-wrap gap-2 mt-2">
									{supportWorker.languages.map((lang, i) => (
										<Badge key={i} variant="outline" className="bg-guardian/10">
											{lang}
										</Badge>
									))}
								</div>
							</div>
						)}

						{/* Shift Rates */}
						{supportWorker.shiftRates?.length > 0 && (
							<div>
								<h3 className="font-semibold flex items-center gap-2">
									<DollarSign className="h-4 w-4" /> Shift Rates
								</h3>
								<div className="bg-guardian/5 rounded-lg p-3 mt-2 space-y-2">
									{supportWorker.shiftRates.map((rate, i) => (
										<div key={i} className="flex justify-between">
											<span>{rate.rateTimeBandId.name}</span>
											<span className="font-semibold">
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
					<Tabs defaultValue="about">
						<TabsList className="mb-6 bg-guardian/5">
							<TabsTrigger value="about">About & Skills</TabsTrigger>
							<TabsTrigger value="schedule">Availability</TabsTrigger>
							<TabsTrigger value="shifts">Upcoming Shifts</TabsTrigger>
							<TabsTrigger value="ratings">Ratings & Reviews</TabsTrigger>
						</TabsList>

						{/* About Tab */}
						<TabsContent value="about">
							<Card>
								<CardHeader>
									<CardTitle>Professional Profile</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Bio */}
									<div>
										<h3 className="font-medium mb-2">Bio</h3>
										{supportWorker.bio ? (
											<p className="bg-gray-50 p-3 rounded-lg">
												{supportWorker.bio}
											</p>
										) : (
											<p className="text-gray-500">No bio added yet</p>
										)}
									</div>

									{/* Skills */}
									<div>
										<h3 className="font-medium mb-2">Skills</h3>
										{supportWorker.skills?.length > 0 ? (
											<div className="flex flex-wrap gap-2">
												{supportWorker.skills.map((s, i) => (
													<Badge key={i} className="bg-guardian">
														{formatSkill(s.name)}
													</Badge>
												))}
											</div>
										) : (
											<p className="text-gray-500">No skills added yet</p>
										)}
									</div>

									{/* Experience */}
									<div>
										<h3 className="font-medium mb-2">Experience</h3>
										{supportWorker.experience?.length > 0 ? (
											<div className="space-y-4">
												{supportWorker.experience.map((exp, i) => (
													<div key={i} className="bg-gray-50 p-3 rounded-lg">
														<h4 className="font-semibold">
															{exp.title} at {exp.organization}
														</h4>
														<span className="text-sm text-gray-600">
															{formatDateRange(exp.startDate, exp.endDate)}
														</span>
														{exp.description && (
															<p className="mt-2">{exp.description}</p>
														)}
													</div>
												))}
											</div>
										) : (
											<p className="text-gray-500">No experience added yet</p>
										)}
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
									{supportWorker.availability?.weekdays?.length > 0 ? (
										<div className="space-y-4">
											{supportWorker.availability.weekdays.map((day, i) => (
												<div key={i}>
													<h4 className="font-semibold capitalize">
														{day.day}
													</h4>
													{day.slots?.length > 0 ? (
														<div className="flex flex-wrap gap-2 mt-2">
															{day.slots.map((slot, j) => (
																<Badge
																	key={j}
																	variant="outline"
																	className="bg-guardian/10"
																>
																	{slot.start} - {slot.end}
																</Badge>
															))}
														</div>
													) : (
														<p className="text-gray-500">Not available</p>
													)}
												</div>
											))}
										</div>
									) : (
										<p className="text-gray-500">No availability set yet</p>
									)}
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
											{upcomingShifts.map((shift, i) => (
												<div
													key={i}
													className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
												>
													<div>
														<h4 className="font-semibold">{shift.title}</h4>
														<span className="text-sm text-gray-600">
															{shift.date} | {shift.time}
														</span>
													</div>
													<Badge
														className={cn({
															"bg-blue-100 text-blue-800":
																shift.status === "Scheduled",
															"bg-yellow-100 text-yellow-800":
																shift.status === "Pending",
															"bg-green-100 text-green-800":
																shift.status === "Completed",
														})}
													>
														{shift.status}
													</Badge>
												</div>
											))}
										</div>
									) : (
										<p className="text-gray-500">
											No upcoming shifts scheduled
										</p>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Ratings & Reviews Tab */}
						<TabsContent value="ratings">
							<Card>
								<CardHeader>
									<CardTitle>Ratings & Reviews</CardTitle>
								</CardHeader>
								<CardContent>
									{reviews.length > 0 ? (
										<div className="space-y-6">
											{reviews.map((review, i) => (
												<div key={i} className="bg-gray-50 p-4 rounded-lg">
													<div className="flex items-center justify-between mb-2">
														<div className="font-semibold">
															{review.reviewerName}
														</div>
														<div>{renderRating(review.rating)}</div>
													</div>
													<span className="text-sm text-gray-600">
														{formatDate(review.date)}
													</span>
													<p className="mt-2">{review.comment}</p>
												</div>
											))}
										</div>
									) : (
										<p className="text-gray-500">No reviews received yet</p>
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
