import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
	ArrowLeft,
	Calendar,
	Clock,
	MapPin,
	User,
	FileText,
	CheckCircle,
	AlertCircle,
	XCircle,
	Mail,
	Phone,
	Users,
	Repeat,
	AlertTriangle,
} from "lucide-react";
import shiftService from "@/api/services/shiftService";
import { Shift, ShiftStatus, ServiceType } from "@/entities/Shift";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Participant } from "@/types/user.types";

export default function ShiftDetails() {
	const { shiftId } = useParams<{ shiftId: string }>();
	const navigate = useNavigate();

	// Fetch shift details
	const {
		data: shift,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["support-worker-shift-details", shiftId],
		queryFn: () => shiftService.getShiftById(shiftId!),
		enabled: !!shiftId,
	});

	// Get status badge variant and icon
	const getStatusInfo = (status: string) => {
		switch (status) {
			case "confirmed":
				return {
					variant: "default" as const,
					icon: <CheckCircle className="w-4 h-4" />,
					className: "bg-blue-500 text-white",
				};
			case "pending":
				return {
					variant: "secondary" as const,
					icon: <AlertCircle className="w-4 h-4" />,
					className: "bg-yellow-100 text-yellow-700 border-yellow-200",
				};
			case "inProgress":
				return {
					variant: "default" as const,
					icon: <Clock className="w-4 h-4" />,
					className: "bg-blue-600 text-white",
				};
			case "completed":
				return {
					variant: "outline" as const,
					icon: <CheckCircle className="w-4 h-4" />,
					className: "bg-green-500 text-white",
				};
			case "cancelled":
				return {
					variant: "destructive" as const,
					icon: <XCircle className="w-4 h-4" />,
					className: "bg-red-500 text-white",
				};
			default:
				return {
					variant: "secondary" as const,
					icon: <AlertCircle className="w-4 h-4" />,
					className: "bg-gray-500 text-white",
				};
		}
	};

	// Format service type for display
	const formatServiceType = (serviceType: string) => {
		return serviceType
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase())
			.trim();
	};

	// Get shift duration
	const getShiftDuration = (startTime: string, endTime: string) => {
		const start = parseISO(startTime);
		const end = parseISO(endTime);
		const diffInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
		const hours = Math.floor(diffInMinutes / 60);
		const minutes = diffInMinutes % 60;

		if (hours === 0) return `${minutes} minutes`;
		if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
		return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minutes`;
	};

	// Get participant name and info
	const getParticipantInfo = (participant: Participant) => {
		if (
			participant &&
			typeof participant === "object" &&
			participant.firstName
		) {
			return {
				name: `${participant.firstName} ${participant.lastName}`,
				email: participant.email,
				phone: participant.phone,
				hasDetails: true,
			};
		}
		return {
			name: "Participant",
			email: null,
			phone: null,
			hasDetails: false,
		};
	};

	if (error) {
		return (
			<div className="container py-8">
				<Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Go Back
				</Button>
				<Card>
					<CardContent className="py-12">
						<div className="text-center">
							<XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
							<h2 className="text-2xl font-bold">
								Failed to load shift details
							</h2>
							<p className="text-muted-foreground mt-2">
								There was an error loading the shift details. Please try again.
							</p>
							<Button
								className="mt-6 bg-guardian hover:bg-guardian-dark"
								onClick={() => navigate("/support-worker/shifts")}
							>
								View All Shifts
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="container py-8">
				<div className="flex items-center gap-4 mb-6">
					<Skeleton className="w-20 h-10" />
				</div>
				<Skeleton className="h-8 w-48 mb-6" />
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="md:col-span-2">
						<Skeleton className="h-96 w-full" />
					</div>
					<div>
						<Skeleton className="h-64 w-full" />
					</div>
				</div>
			</div>
		);
	}

	if (!shift) {
		return (
			<div className="container py-8">
				<Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Go Back
				</Button>
				<Card>
					<CardContent className="py-12">
						<div className="text-center">
							<AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
							<h2 className="text-2xl font-bold">Shift Not Found</h2>
							<p className="text-muted-foreground mt-2">
								The shift you're looking for doesn't exist or has been removed.
							</p>
							<Button
								className="mt-6 bg-guardian hover:bg-guardian-dark"
								onClick={() => navigate("/support-worker/shifts")}
							>
								View All Shifts
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const statusInfo = getStatusInfo(shift.status);
	const participantInfo = getParticipantInfo(
		shift.participantId as unknown as Participant
	);
	const serviceTypeName = shift.serviceTypeId?.name || "Unknown Service";
	const isRecurring =
		shift.recurrence?.pattern && shift.recurrence.pattern !== "none";

	return (
		<div className="container py-8">
			<Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
				<ArrowLeft className="mr-2 h-4 w-4" />
				Go Back
			</Button>

			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">
							{formatServiceType(serviceTypeName)}
						</h1>
						{isRecurring && (
							<Badge variant="outline" className="gap-1">
								<Repeat className="w-3 h-3" />
								Recurring
							</Badge>
						)}
					</div>
					<p className="text-gray-600 font-mono">{shift.shiftId}</p>
				</div>
				<Badge className={cn("gap-2 px-3 py-1", statusInfo.className)}>
					{statusInfo.icon}
					{shift.status}
				</Badge>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Main Content */}
				<Card className="md:col-span-2 border-0 shadow-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="w-5 h-5 text-guardian" />
							Shift Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Date & Time */}
						<div className="flex items-start gap-4 pb-4 border-b">
							<div className="p-2 rounded-full bg-guardian/10">
								<Calendar className="h-5 w-5 text-guardian" />
							</div>
							<div className="flex-1">
								<h3 className="font-medium text-gray-900 mb-1">Date & Time</h3>
								<div className="space-y-1">
									<div className="text-lg font-semibold text-gray-900">
										{format(parseISO(shift.startTime), "EEEE, MMMM dd, yyyy")}
									</div>
									<div className="flex items-center gap-2 text-gray-600">
										<Clock className="h-4 w-4" />
										<span>
											{format(parseISO(shift.startTime), "h:mm a")} -{" "}
											{format(parseISO(shift.endTime), "h:mm a")}
										</span>
										<span className="text-sm text-gray-500">
											({getShiftDuration(shift.startTime, shift.endTime)})
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Location */}
						<div className="flex items-start gap-4 pb-4 border-b">
							<div className="p-2 rounded-full bg-guardian/10">
								<MapPin className="h-5 w-5 text-guardian" />
							</div>
							<div className="flex-1">
								<h3 className="font-medium text-gray-900 mb-1">Location</h3>
								<div className="text-gray-600">
									<p className="font-medium">
										{shift.locationType === "inPerson"
											? "In-Person"
											: "Virtual"}
									</p>
									{shift.address && <p className="text-sm">{shift.address}</p>}
								</div>
							</div>
						</div>

						{/* Special Instructions */}
						{shift.specialInstructions && (
							<div className="flex items-start gap-4 pb-4 border-b">
								<div className="p-2 rounded-full bg-orange-50">
									<AlertTriangle className="h-5 w-5 text-orange-600" />
								</div>
								<div className="flex-1">
									<h3 className="font-medium text-gray-900 mb-1">
										Special Instructions
									</h3>
									<div className="p-4 bg-orange-50 rounded-lg">
										<p className="text-orange-800">
											{shift.specialInstructions}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Additional Information */}
						<div className="flex items-start gap-4">
							<div className="p-2 rounded-full bg-guardian/10">
								<FileText className="h-5 w-5 text-guardian" />
							</div>
							<div className="flex-1">
								<h3 className="font-medium text-gray-900 mb-3">
									Additional Information
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<p className="text-sm font-medium text-gray-500 mb-1">
											Shift Type
										</p>
										<p className="text-gray-900">
											{shift.shiftType === "directBooking"
												? "Direct Booking"
												: "Open Request"}
										</p>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-500 mb-1">
											Supervision Required
										</p>
										<p className="text-gray-900">
											{shift.requiresSupervision ? "Yes" : "No"}
										</p>
									</div>
									{isRecurring && (
										<div className="md:col-span-2">
											<p className="text-sm font-medium text-gray-500 mb-1">
												Recurrence
											</p>
											<p className="text-gray-900 capitalize">
												{shift.recurrence.pattern}
												{shift.recurrence.occurrences &&
													` (${shift.recurrence.occurrences} occurrences)`}
											</p>
										</div>
									)}
								</div>
								<div className="mt-4">
									<Badge className="bg-guardian">
										{formatServiceType(serviceTypeName)}
									</Badge>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Participant Info */}
				<div className="space-y-6">
					<Card className="border-0 shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="w-5 h-5 text-guardian" />
								Participant
							</CardTitle>
						</CardHeader>
						<CardContent>
							{participantInfo.hasDetails ? (
								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 rounded-full bg-guardian/10 flex items-center justify-center">
											<User className="h-6 w-6 text-guardian" />
										</div>
										<div>
											<h3 className="font-medium text-gray-900">
												{participantInfo.name}
											</h3>
											<p className="text-sm text-gray-500">Participant</p>
										</div>
									</div>

									{(participantInfo.email || participantInfo.phone) && (
										<>
											<Separator />
											<div className="space-y-2">
												{participantInfo.email && (
													<div className="flex items-center gap-2 text-sm text-gray-600">
														<Mail className="w-4 h-4" />
														{participantInfo.email}
													</div>
												)}
												{participantInfo.phone && (
													<div className="flex items-center gap-2 text-sm text-gray-600">
														<Phone className="w-4 h-4" />
														{participantInfo.phone}
													</div>
												)}
											</div>
										</>
									)}

									<div className="pt-4 border-t">
										<Button className="w-full bg-guardian hover:bg-guardian-dark">
											Contact Participant
										</Button>
									</div>
								</div>
							) : (
								<div className="text-center py-8">
									<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
										<User className="w-8 h-8 text-gray-400" />
									</div>
									<p className="font-medium text-gray-500">
										Participant Details
									</p>
									<p className="text-sm text-gray-400">
										Contact support for more information
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Shift Timeline */}
					<Card className="border-0 shadow-sm">
						<CardHeader>
							<CardTitle>Timeline</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 rounded-full bg-blue-600"></div>
									<div>
										<p className="text-sm font-medium text-gray-900">Created</p>
										<p className="text-xs text-gray-500">
											{format(
												parseISO(shift.createdAt),
												"MMM dd, yyyy 'at' h:mm a"
											)}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 rounded-full bg-gray-300"></div>
									<div>
										<p className="text-sm font-medium text-gray-900">
											Last Updated
										</p>
										<p className="text-xs text-gray-500">
											{format(
												parseISO(shift.updatedAt),
												"MMM dd, yyyy 'at' h:mm a"
											)}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
