import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isToday, isPast } from "date-fns";
import { useGetShiftById } from "@/hooks/useShiftHooks";
import { UserSummary } from "@/entities/types";
import { Recurrence, ShiftStatus } from "@/entities/Shift";
import { AltArrowLeft, Buildings2, Calendar, ClockCircle, History3, Letter, MapPoint, Phone, Refresh, Repeat, SirenRounded, Suitcase, UserCircle, UsersGroupRounded } from "@solar-icons/react";

// Format time for display
const formatTime = (dateString: string) => {
	return format(new Date(dateString), "h:mm a");
};

// Format date for display
const formatDate = (dateString: string) => {
	return format(new Date(dateString), "MMM d, yyyy");
};

// Format date with day for display
const formatDateWithDay = (dateString: string) => {
	return format(new Date(dateString), "EEEE, MMMM d, yyyy");
};

// Format full datetime for display
const formatDateTime = (dateString: string) => {
	return format(new Date(dateString), "PPpp");
};

// Get full name
const getFullName = (user: UserSummary) => {
	return `${user.firstName} ${user.lastName}`;
};

// Format duration
const formatDuration = (startTime: string, endTime: string) => {
	const start = new Date(startTime);
	const end = new Date(endTime);
	const diffMs = end.getTime() - start.getTime();
	const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
	const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));

	if (diffHrs === 0) {
		return `${diffMins} minutes`;
	} else if (diffMins === 0) {
		return diffHrs === 1 ? "1 hour" : `${diffHrs} hours`;
	} else {
		return diffHrs === 1
			? `1 hour ${diffMins} minutes`
			: `${diffHrs} hours ${diffMins} minutes`;
	}
};

// Get status badge component with appropriate styling
const getStatusBadge = (status: string) => {
	const statusMap: Record<string, { className: string; label: string }> = {
		[ShiftStatus.OPEN]: {
			className: "bg-primary-100 text-primary-800 border-primary-200",
			label: "Open",
		},
		[ShiftStatus.PENDING]: {
			className: "bg-yellow-100 text-yellow-800 border-yellow-200",
			label: "Pending",
		},
		[ShiftStatus.CONFIRMED]: {
			className: "bg-green-100 text-green-800 border-green-200",
			label: "Confirmed",
		},
		[ShiftStatus.IN_PROGRESS]: {
			className: "bg-primary-100 text-primary-800 border-primary-200",
			label: "In Progress",
		},
		[ShiftStatus.COMPLETED]: {
			className: "bg-purple-100 text-purple-800 border-purple-200",
			label: "Completed",
		},
		[ShiftStatus.CANCELLED]: {
			className: "bg-gray-100 text-gray-800 border-gray-200",
			label: "Cancelled",
		},
		[ShiftStatus.NO_SHOW]: {
			className: "bg-red-100 text-red-800 border-red-200",
			label: "No Show",
		},
		[ShiftStatus.DECLINED]: {
			className: "bg-red-100 text-red-800 border-red-200",
			label: "Declined",
		},
	};

	const { className, label } = statusMap[status] || {
		className: "bg-gray-100 text-gray-800 border-gray-200",
		label: status,
	};

	return (
		<Badge variant="outline" className={className}>
			{label}
		</Badge>
	);
};

// Get large status badge
const getLargeStatusBadge = (status: string) => {
	const statusMap: Record<
		string,
		{ className: string; label: string; icon: JSX.Element }
	> = {
		[ShiftStatus.OPEN]: {
			className: "bg-primary-100 text-primary-800 border-primary-200",
			label: "Open",
			icon: <Calendar className="h-4 w-4 mr-2" />,
		},
		[ShiftStatus.PENDING]: {
			className: "bg-yellow-100 text-yellow-800 border-yellow-200",
			label: "Pending",
			icon: <ClockCircle className="h-4 w-4 mr-2" />,
		},
		[ShiftStatus.CONFIRMED]: {
			className: "bg-green-100 text-green-800 border-green-200",
			label: "Confirmed",
			icon: <Calendar className="h-4 w-4 mr-2" />,
		},
		[ShiftStatus.IN_PROGRESS]: {
			className: "bg-primary-100 text-primary-800 border-primary-200",
			label: "In Progress",
			icon: <ClockCircle className="h-4 w-4 mr-2" />,
		},
		[ShiftStatus.COMPLETED]: {
			className: "bg-purple-100 text-purple-800 border-purple-200",
			label: "Completed",
			icon: <Calendar className="h-4 w-4 mr-2" />,
		},
		[ShiftStatus.CANCELLED]: {
			className: "bg-gray-100 text-gray-800 border-gray-200",
			label: "Cancelled",
			icon: <SirenRounded className="h-4 w-4 mr-2" />,
		},
		[ShiftStatus.NO_SHOW]: {
			className: "bg-red-100 text-red-800 border-red-200",
			label: "No Show",
			icon: <SirenRounded className="h-4 w-4 mr-2" />,
		},
		[ShiftStatus.DECLINED]: {
			className: "bg-red-100 text-red-800 border-red-200",
			label: "Declined",
			icon: <SirenRounded className="h-4 w-4 mr-2" />,
		},
	};

	const { className, label, icon } = statusMap[status] || {
		className: "bg-gray-100 text-gray-800 border-gray-200",
		label: status,
		icon: <Calendar className="h-4 w-4 mr-2" />,
	};

	return (
		<Badge
			variant="outline"
			className={`${className} text-sm py-1 px-3 flex items-center`}
		>
			{icon}
			{label}
		</Badge>
	);
};

// Get service type badge
const getServiceTypeBadge = (serviceType: string) => {
	// Capitalize and format service type
	const formattedType = serviceType
		.replace(/([A-Z])/g, " $1") // Add space before capital letters
		.replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

	const serviceTypeMap: Record<
		string,
		{ icon: JSX.Element; className: string }
	> = {
		personalCare: {
			icon: <UserCircle className="h-4 w-4 mr-2" />,
			className: "bg-primary-100 text-primary-700 border-primary-200",
		},
		mealPreparation: {
			icon: <Suitcase className="h-4 w-4 mr-2" />,
			className: "bg-green-50 text-green-700 border-green-200",
		},
		socialSupport: {
			icon: <UsersGroupRounded className="h-4 w-4 mr-2" />,
			className: "bg-purple-50 text-purple-700 border-purple-200",
		},
		therapySupport: {
			icon: <UserCircle className="h-4 w-4 mr-2" />,
			className: "bg-indigo-50 text-indigo-700 border-indigo-200",
		},
		mobilityAssistance: {
			icon: <UsersGroupRounded className="h-4 w-4 mr-2" />,
			className: "bg-orange-50 text-orange-700 border-orange-200",
		},
	};

	const typeInfo = serviceTypeMap[serviceType] || {
		icon: <Suitcase className="h-4 w-4 mr-2" />,
		className: "bg-gray-100 text-gray-700 border-gray-200",
	};

	return (
		<Badge
			variant="outline"
			className={`${typeInfo.className} text-sm py-1 px-3 flex items-center`}
		>
			{typeInfo.icon}
			{formattedType}
		</Badge>
	);
};

// Get recurrence badge
const getRecurrenceBadge = (recurrence?: Recurrence | null) => {
	if (!recurrence || recurrence.pattern === "none") return null;

	return (
		<Badge
			variant="outline"
			className="bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center text-xs"
		>
			<Repeat className="h-4 w-4 mr-2" />
			{recurrence.pattern.charAt(0).toUpperCase() + recurrence.pattern.slice(1)}
			{recurrence.occurrences ? ` (${recurrence.occurrences}x)` : ""}
		</Badge>
	);
};

// Get time status badge (upcoming, today, past)
const getTimeStatusBadge = (dateTimeString: string) => {
	const dateTime = new Date(dateTimeString);

	if (isToday(dateTime)) {
		return (
			<Badge
				variant="outline"
				className="bg-green-50 text-green-700 border-green-200"
			>
				Today
			</Badge>
		);
	} else if (isPast(dateTime)) {
		return (
			<Badge
				variant="outline"
				className="bg-gray-100 text-gray-700 border-gray-200"
			>
				Past
			</Badge>
		);
	} else {
		return (
			<Badge
				variant="outline"
				className="bg-primary-100 text-primary-700 border-primary-200"
			>
				Upcoming
			</Badge>
		);
	}
};

export function ShiftDetailView() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("details");

	const { data: shift, isLoading, error } = useGetShiftById(id);

	const handleGoBack = () => {
		navigate("/admin/shifts");
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<Refresh className="h-8 w-8 animate-spin mx-auto mb-4" />
					<p>Loading shift details...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<Card className="max-w-4xl mx-auto mt-8">
				<CardHeader>
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleGoBack}
							className="mr-4"
						>
							<AltArrowLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
						<CardTitle>Error Loading Shift</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-red-600">
						There was an error loading the shift details. Please try again.
					</p>
				</CardContent>
				<CardFooter>
					<Button onClick={handleGoBack}>Return to Shifts</Button>
				</CardFooter>
			</Card>
		);
	}

	// Not found state
	if (!shift) {
		return (
			<Card className="max-w-4xl mx-auto mt-8">
				<CardHeader>
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleGoBack}
							className="mr-4"
						>
							<AltArrowLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
						<CardTitle>Shift Not Found</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<p>The shift you're looking for could not be found.</p>
				</CardContent>
				<CardFooter>
					<Button onClick={handleGoBack}>Return to Shifts</Button>
				</CardFooter>
			</Card>
		);
	}

	return (
		<div className="container mx-auto py-6 max-w-6xl">
			<div className="flex items-center mb-6">
				<Button
					variant="ghost"
					size="sm"
					onClick={handleGoBack}
					className="mr-4"
				>
					<AltArrowLeft className="h-4 w-4 mr-2" />
					Back to Shifts
				</Button>
				<h1 className="text-2xl font-montserrat-bold">Shift Details</h1>
				<div className="ml-auto flex items-center gap-2">
					{getTimeStatusBadge(shift.startTime)}
					{getLargeStatusBadge(shift.status)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Main content - 2/3 width on desktop */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader className="pb-4">
							<div className="flex flex-col gap-1">
								<div className="flex items-center justify-between">
									<CardTitle>Shift {shift.shiftId}</CardTitle>
									{getRecurrenceBadge(shift.recurrence) && (
										<div>{getRecurrenceBadge(shift.recurrence)}</div>
									)}
								</div>
								<CardDescription className="flex items-center">
									<Buildings2 className="h-4 w-4 mr-2" />
									{typeof shift.organizationId === "object"
										? shift.organizationId.name
										: shift.organizationId}
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent>
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								<TabsList className="w-full grid grid-cols-3">
									<TabsTrigger value="details">Details</TabsTrigger>
									<TabsTrigger value="instructions">Instructions</TabsTrigger>
									<TabsTrigger value="history">History</TabsTrigger>
								</TabsList>

								<TabsContent value="details" className="pt-4">
									<div className="space-y-6">
										{/* Service and Location Info */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-4">
												<h3 className="text-sm font-montserrat-semibold text-muted-foreground">
													Service Information
												</h3>
												<div className="bg-muted/30 p-4 rounded-lg space-y-4">
													<div>
														<p className="text-sm font-montserrat-semibold mb-1">
															Service Type
														</p>
														{getServiceTypeBadge(shift.serviceTypeId.name)}
													</div>

													<div>
														<p className="text-sm font-montserrat-semibold mb-1">
															Shift Type
														</p>
														<p className="text-sm">
															{shift.shiftType
																.replace(/([A-Z])/g, " $1")
																.replace(/^./, (str) => str.toUpperCase())}
														</p>
													</div>

													<div>
														<p className="text-sm font-montserrat-semibold mb-1">
															Worker Assignment
														</p>
														<p className="text-sm">
															{shift.isMultiWorkerShift
																? "Multi-worker shift"
																: "Single worker shift"}
														</p>
													</div>

													<div>
														<p className="text-sm font-montserrat-semibold mb-1">
															Requires Supervision
														</p>
														<p className="text-sm">
															{shift.requiresSupervision ? "Yes" : "No"}
														</p>
													</div>
												</div>
											</div>

											<div className="space-y-4">
												<h3 className="text-sm font-montserrat-semibold text-muted-foreground">
													Location Information
												</h3>
												<div className="bg-muted/30 p-4 rounded-lg space-y-4">
													<div>
														<p className="text-sm font-montserrat-semibold mb-1">
															Location Type
														</p>
														<p className="text-sm">
															{shift.locationType
																.replace(/([A-Z])/g, " $1")
																.replace(/^./, (str) => str.toUpperCase())}
														</p>
													</div>

													<div>
														<p className="text-sm font-montserrat-semibold mb-1">Address</p>
														<div className="flex items-start gap-2">
															<MapPoint className="h-4 w-4 text-muted-foreground mt-0.5" />
															<p className="text-sm">{shift.address}</p>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/* Multi-worker assignments */}
										{shift.isMultiWorkerShift &&
											shift.workerAssignments &&
											shift.workerAssignments.length > 0 && (
												<div className="space-y-4">
													<h3 className="text-sm font-montserrat-semibold text-muted-foreground">
														Worker Assignments
													</h3>
													<div className="bg-muted/30 p-4 rounded-lg space-y-4">
														{shift.workerAssignments.map(
															(assignment, index) => (
																<div
																	key={assignment._id}
																	className="flex items-center justify-between p-3 bg-white rounded-md border"
																>
																	<div className="flex items-center gap-3">
																		<Avatar className="h-8 w-8">
																			{assignment.workerId.profileImage ? (
																				<AvatarImage
																					src={assignment.workerId.profileImage}
																					alt={getFullName(assignment.workerId)}
																				/>
																			) : null}
																			<AvatarFallback>
																				{assignment.workerId.firstName.charAt(
																					0
																				)}
																				{assignment.workerId.lastName.charAt(0)}
																			</AvatarFallback>
																		</Avatar>
																		<div>
																			<p className="text-sm font-montserrat-semibold">
																				{getFullName(assignment.workerId)}
																			</p>
																			<p className="text-xs text-muted-foreground">
																				{assignment.workerId.email}
																			</p>
																		</div>
																	</div>
																	<div className="text-right">
																		{getStatusBadge(assignment.status)}
																		{assignment.declineReason && (
																			<p className="text-xs text-red-600 mt-1">
																				Declined: {assignment.declineReason}
																			</p>
																		)}
																	</div>
																</div>
															)
														)}
													</div>
												</div>
											)}

										{/* Date and Time */}
										<div className="space-y-4">
											<h3 className="text-sm font-montserrat-semibold text-muted-foreground">
												Date and Time
											</h3>
											<div className="bg-muted/30 p-4 rounded-lg">
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div>
														<p className="text-sm font-montserrat-semibold mb-1">Date</p>
														<div className="flex items-center gap-2">
															<Calendar className="h-4 w-4 text-muted-foreground" />
															<p className="text-sm">
																{formatDateWithDay(shift.startTime)}
															</p>
														</div>
													</div>

													<div>
														<p className="text-sm font-montserrat-semibold mb-1">Time</p>
														<div className="flex items-center gap-2">
															<ClockCircle className="h-4 w-4 text-muted-foreground" />
															<p className="text-sm">
																{formatTime(shift.startTime)} -{" "}
																{formatTime(shift.endTime)}
															</p>
														</div>
													</div>

													<div>
														<p className="text-sm font-montserrat-semibold mb-1">Duration</p>
														<div className="flex items-center gap-2">
															<History3 className="h-4 w-4 text-muted-foreground" />
															<p className="text-sm">
																{formatDuration(shift.startTime, shift.endTime)}
															</p>
														</div>
													</div>

													{shift.recurrence.pattern !== "none" && (
														<div>
															<p className="text-sm font-montserrat-semibold mb-1">
																Recurrence
															</p>
															<div className="flex items-center gap-2">
																<Repeat className="h-4 w-4 text-muted-foreground" />
																<p className="text-sm capitalize">
																	{shift.recurrence.pattern}
																	{shift.recurrence.occurrences
																		? ` (${shift.recurrence.occurrences} occurrences)`
																		: ""}
																	{shift.recurrence.parentShiftId && (
																		<span className="text-muted-foreground">
																			{" "}
																			• Parent: {shift.recurrence.parentShiftId}
																		</span>
																	)}
																</p>
															</div>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="instructions" className="pt-4">
									<div className="space-y-6">
										<div className="bg-muted/30 p-4 rounded-lg">
											<h3 className="text-sm font-montserrat-semibold mb-2">
												Special Instructions
											</h3>
											{shift.specialInstructions ? (
												<p className="text-sm whitespace-pre-wrap">
													{shift.specialInstructions}
												</p>
											) : (
												<p className="text-sm text-muted-foreground italic">
													No special instructions provided.
												</p>
											)}
										</div>

										<div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
											<h3 className="text-sm font-montserrat-semibold text-yellow-800 mb-2">
												Notes for Support Worker
											</h3>
											<p className="text-sm text-yellow-700">
												Please ensure you arrive on time and bring all necessary
												items mentioned in the special instructions. If you need
												to reschedule or cancel, please do so at least 24 hours
												in advance.
											</p>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="history" className="pt-4">
									<div className="space-y-4">
										<div className="bg-muted/30 p-4 rounded-lg">
											<h3 className="text-sm font-montserrat-semibold mb-4">
												Shift History
											</h3>
											<div className="space-y-4">
												<div className="flex items-start gap-3">
													<div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
														<Calendar className="h-4 w-4 text-primary-700" />
													</div>
													<div>
														<p className="text-sm font-montserrat-semibold">Shift Created</p>
														<p className="text-xs text-muted-foreground">
															{formatDateTime(shift.createdAt)}
														</p>
													</div>
												</div>

												{shift.status !== "open" && (
													<div className="flex items-start gap-3">
														<div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
															<ClockCircle className="h-4 w-4 text-yellow-700" />
														</div>
														<div>
															<p className="text-sm font-montserrat-semibold">
																Status Updated to "
																{shift.status.charAt(0).toUpperCase() +
																	shift.status.slice(1)}
																"
															</p>
															<p className="text-xs text-muted-foreground">
																{formatDateTime(shift.updatedAt)}
															</p>
														</div>
													</div>
												)}

												{(shift.status === "completed" ||
													shift.status === "noShow") && (
													<div className="flex items-start gap-3">
														<div
															className={`h-8 w-8 rounded-full ${
																shift.status === "completed"
																	? "bg-green-100"
																	: "bg-red-100"
															} flex items-center justify-center flex-shrink-0`}
														>
															{shift.status === "completed" ? (
																<Calendar className="h-4 w-4 text-green-700" />
															) : (
																<SirenRounded className="h-4 w-4 text-red-700" />
															)}
														</div>
														<div>
															<p className="text-sm font-montserrat-semibold">
																Shift{" "}
																{shift.status === "completed"
																	? "Completed"
																	: "Marked as No-Show"}
															</p>
															<p className="text-xs text-muted-foreground">
																{formatDateTime(shift.updatedAt)}
															</p>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>

					{/* <Card>
            <CardHeader className="pb-4">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Participant
                </Button>
                
                {!shift.isMultiWorkerShift && shift.workerId && (
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Support Worker
                  </Button>
                )}
                
                {shift.isMultiWorkerShift && (
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message All Workers
                  </Button>
                )}
                
                {shift.recurrence.pattern !== "none" && (
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Series
                  </Button>
                )}
              </div>
            </CardContent>
          </Card> */}
				</div>

				{/* Sidebar - 1/3 width on desktop */}
				<div className="space-y-6">
					{/* Participant Card */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Participant</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-4 mb-4">
								<Avatar className="h-12 w-12">
									<AvatarFallback>
										{typeof (shift as any).participantId === "object"
											? (shift as any).participantId.firstName.charAt(0)
											: "P"}
										{typeof (shift as any).participantId === "object"
											? (shift as any).participantId.lastName.charAt(0)
											: "U"}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-montserrat-semibold">
										{typeof (shift as any).participantId === "object"
											? getFullName((shift as any).participantId)
											: (shift as any).participantId}
									</h3>
									<p className="text-sm text-muted-foreground">
										{typeof shift.organizationId === "object"
											? shift.organizationId.name
											: shift.organizationId}
									</p>
								</div>
							</div>

							<ul className="space-y-3">
								<li className="flex items-center gap-3">
									<Letter className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">
										{typeof (shift as any).participantId === "object"
											? (shift as any).participantId.email
											: "N/A"}
									</span>
								</li>

								<li className="flex items-center gap-3">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">
										{typeof (shift as any).participantId === "object"
											? (shift as any).participantId.phone
											: "N/A"}
									</span>
								</li>
							</ul>

							<div className="mt-4">
								<Button variant="outline" className="w-full">
									<UserCircle className="h-4 w-4 mr-2" />
									View Participant Profile
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Support Worker Card - Single Worker */}
					{!shift.isMultiWorkerShift && shift.workerId && (
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Support Worker</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-4 mb-4">
									<Avatar className="h-12 w-12">
										{typeof shift.workerId === "object" &&
										shift.workerId.profileImage ? (
											<AvatarImage
												src={shift.workerId.profileImage}
												alt={getFullName(shift.workerId)}
											/>
										) : null}
										<AvatarFallback>
											{typeof shift.workerId === "object"
												? shift.workerId.firstName.charAt(0)
												: "S"}
											{typeof shift.workerId === "object"
												? shift.workerId.lastName.charAt(0)
												: "W"}
										</AvatarFallback>
									</Avatar>
									<div>
										<h3 className="font-montserrat-semibold">
											{typeof shift.workerId === "object"
												? getFullName(shift.workerId)
												: shift.workerId}
										</h3>
										<p className="text-sm text-muted-foreground">
											Support Worker
										</p>
									</div>
								</div>

								<ul className="space-y-3">
									<li className="flex items-center gap-3">
										<Letter className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">
											{typeof shift.workerId === "object"
												? shift.workerId.email
												: "N/A"}
										</span>
									</li>

									<li className="flex items-center gap-3">
										<Phone className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">
											{typeof shift.workerId === "object"
												? shift.workerId.phone
												: "N/A"}
										</span>
									</li>
								</ul>

								<div className="mt-4 space-y-2">
									<Button variant="outline" className="w-full">
										<UserCircle className="h-4 w-4 mr-2" />
										View Worker Profile
									</Button>

									<Button variant="outline" className="w-full">
										<Calendar className="h-4 w-4 mr-2" />
										View Worker Schedule
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Multi-Worker Summary Card */}
					{shift.isMultiWorkerShift && (
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Support Workers</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-4 mb-4">
									<div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
										<UsersGroupRounded className="h-6 w-6 text-primary" />
									</div>
									<div>
										<h3 className="font-montserrat-semibold">Multi-worker shift</h3>
										<p className="text-sm text-muted-foreground">
											{shift.workerAssignments?.length || 0} workers assigned
										</p>
									</div>
								</div>

								{shift.workerAssignments &&
									shift.workerAssignments.length > 0 && (
										<div className="space-y-3">
											{shift.workerAssignments.slice(0, 3).map((assignment) => (
												<div
													key={assignment._id}
													className="flex items-center justify-between"
												>
													<div className="flex items-center gap-2">
														<Avatar className="h-6 w-6">
															{assignment.workerId.profileImage ? (
																<AvatarImage
																	src={assignment.workerId.profileImage}
																	alt={getFullName(assignment.workerId)}
																/>
															) : null}
															<AvatarFallback className="text-xs">
																{assignment.workerId.firstName.charAt(0)}
																{assignment.workerId.lastName.charAt(0)}
															</AvatarFallback>
														</Avatar>
														<span className="text-sm">
															{getFullName(assignment.workerId)}
														</span>
													</div>
													<div className="text-xs">
														{getStatusBadge(assignment.status)}
													</div>
												</div>
											))}

											{shift.workerAssignments.length > 3 && (
												<p className="text-xs text-muted-foreground text-center pt-2">
													+{shift.workerAssignments.length - 3} more workers
												</p>
											)}
										</div>
									)}

								<div className="mt-4">
									<Button variant="outline" className="w-full">
										<UsersGroupRounded className="h-4 w-4 mr-2" />
										View All Workers
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{/* No Worker Assigned Card */}
					{!shift.isMultiWorkerShift && !shift.workerId && (
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-base">Support Worker</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center py-6">
									<SirenRounded className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
									<p className="text-sm text-muted-foreground mb-4">
										No support worker assigned to this shift yet.
									</p>
									<Button variant="outline" className="w-full">
										<UserCircle className="h-4 w-4 mr-2" />
										Assign Worker
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{/* System Info Card */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">System Information</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3 text-sm">
								<li className="flex justify-between">
									<span className="text-muted-foreground">Shift ID:</span>
									<span className="font-mono">{shift.shiftId}</span>
								</li>

								<li className="flex justify-between">
									<span className="text-muted-foreground">Created:</span>
									<span>{formatDate(shift.createdAt)}</span>
								</li>

								<li className="flex justify-between">
									<span className="text-muted-foreground">Last Updated:</span>
									<span>{formatDate(shift.updatedAt)}</span>
								</li>

								<li className="flex justify-between">
									<span className="text-muted-foreground">Database ID:</span>
									<span className="font-mono truncate max-w-[180px]">
										{shift._id}
									</span>
								</li>

								{shift.recurrence.parentShiftId && (
									<li className="flex justify-between">
										<span className="text-muted-foreground">Parent Shift:</span>
										<span className="font-mono truncate max-w-[180px]">
											{shift.recurrence.parentShiftId}
										</span>
									</li>
								)}
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
