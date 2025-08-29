import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
	Calendar as CalendarIcon,
	List,
	Search,
	Filter,
	User,
	Clock,
	MapPin,
	CheckCircle,
	AlertCircle,
	XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import shiftService from "@/api/services/shiftService";
import { Shift, ShiftStatus, ServiceType } from "@/entities/Shift";
import { format, parseISO, isToday, isTomorrow, isThisWeek } from "date-fns";
import { cn } from "@/lib/utils";

type ShiftView = "list" | "calendar";

export default function ShiftsPage() {
	const navigate = useNavigate();
	const [currentView, setCurrentView] = useState<ShiftView>("list");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();

	// Fetch shifts data
	const {
		data: shifts = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["support-worker-shifts"],
		queryFn: () => shiftService.getShifts(),
	});

	// Filter shifts based on search query
	const filteredShifts = shifts.filter((shift) => {
		const searchTerm = searchQuery.toLowerCase();
		if (!searchTerm) return true;

		return (
			shift.shiftId.toLowerCase().includes(searchTerm) ||
			(typeof shift.workerId === "object" &&
				`${shift.workerId.firstName} ${shift.workerId.lastName}`
					.toLowerCase()
					.includes(searchTerm)) ||
			(typeof shift.participantId === "object" &&
				`${shift.participantId.firstName} ${shift.participantId.lastName}`
					.toLowerCase()
					.includes(searchTerm)) ||
			(shift.address && shift.address.toLowerCase().includes(searchTerm)) ||
			formatServiceType(shift.serviceType).toLowerCase().includes(searchTerm)
		);
	});

	// Filter shifts for selected date in calendar view
	const shiftsOnSelectedDate = selectedDate
		? filteredShifts.filter((shift) => {
				const shiftDate = parseISO(shift.startTime);
				return (
					shiftDate.getDate() === selectedDate.getDate() &&
					shiftDate.getMonth() === selectedDate.getMonth() &&
					shiftDate.getFullYear() === selectedDate.getFullYear()
				);
		  })
		: filteredShifts;

	// Get dates with shifts for calendar highlighting
	const shiftDates = filteredShifts.map((shift) => parseISO(shift.startTime));

	// Handle date selection in calendar
	const handleDateSelect = (date: Date | undefined) => {
		setSelectedDate(date);
	};

	// Handle view shift details
	const handleViewShiftDetails = (shiftId: string) => {
		navigate(`/support-worker/shifts/${shiftId}`);
	};

	// Format service type for display
	const formatServiceType = (serviceType?: ServiceType) => {
		if (!serviceType) return "Unknown";
		return serviceType
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase())
			.trim();
	};

	// Get status badge info
	const getStatusInfo = (status: ShiftStatus) => {
		switch (status) {
			case ShiftStatus.CONFIRMED:
				return {
					variant: "default" as const,
					icon: <CheckCircle className="w-3 h-3" />,
					className: "bg-blue-100 text-blue-700 border-blue-200",
				};
			case ShiftStatus.PENDING:
				return {
					variant: "outline" as const,
					icon: <AlertCircle className="w-3 h-3" />,
					className: "bg-yellow-100 text-yellow-700 border-yellow-200",
				};
			case ShiftStatus.IN_PROGRESS:
				return {
					variant: "default" as const,
					icon: <Clock className="w-3 h-3" />,
					className: "bg-[#008CFF] text-white",
				};
			case ShiftStatus.COMPLETED:
				return {
					variant: "outline" as const,
					icon: <CheckCircle className="w-3 h-3" />,
					className: "bg-green-100 text-green-700 border-green-200",
				};
			case ShiftStatus.CANCELLED:
				return {
					variant: "outline" as const,
					icon: <XCircle className="w-3 h-3" />,
					className: "bg-red-100 text-red-700 border-red-200",
				};
			default:
				return {
					variant: "outline" as const,
					icon: <AlertCircle className="w-3 h-3" />,
					className: "bg-gray-100 text-gray-700 border-gray-200",
				};
		}
	};

	// Format shift date for display
	const formatShiftDate = (dateString: string) => {
		const date = parseISO(dateString);
		if (isToday(date)) return "Today";
		if (isTomorrow(date)) return "Tomorrow";
		if (isThisWeek(date)) return format(date, "EEEE");
		return format(date, "MMM dd, yyyy");
	};

	// Get participant name
	const getParticipantName = (
		participantId: string | { firstName: string; lastName: string }
	) => {
		if (typeof participantId === "object" && participantId?.firstName) {
			return `${participantId.firstName} ${participantId.lastName}`;
		}
		return "Participant";
	};

	// Render shift card
	const renderShiftCard = (shift: Shift) => {
		const statusInfo = getStatusInfo(shift.status);

		return (
			<div
				key={shift._id}
				className="flex items-center justify-between p-4 border border-[#008CFF]/10 rounded-lg hover:bg-[#008CFF]/5 transition-colors"
			>
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-[#008CFF]/10 flex items-center justify-center">
						<User className="h-5 w-5 text-[#008CFF]" />
					</div>
					<div>
						<h3 className="font-semibold text-gray-900">
							{getParticipantName(shift.participantId)}
						</h3>
						<p className="text-sm text-gray-600 mb-1">
							{formatServiceType(shift.serviceType)}
						</p>
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<CalendarIcon className="h-3 w-3" />
								<span>{formatShiftDate(shift.startTime)}</span>
							</div>
							<div className="flex items-center gap-1">
								<Clock className="h-3 w-3" />
								<span>
									{format(parseISO(shift.startTime), "h:mm a")} -{" "}
									{format(parseISO(shift.endTime), "h:mm a")}
								</span>
							</div>
							<div className="flex items-center gap-1">
								<MapPin className="h-3 w-3" />
								<span>{shift.address || "Location TBD"}</span>
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<Badge
						variant={statusInfo.variant}
						className={cn("font-medium gap-1", statusInfo.className)}
					>
						{statusInfo.icon}
						{shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
					</Badge>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleViewShiftDetails(shift._id)}
						className="border-[#008CFF]/20 text-[#008CFF] hover:bg-[#008CFF]/10"
					>
						View Details
					</Button>
				</div>
			</div>
		);
	};

	if (error) {
		return (
			<div className="container py-8">
				<div className="text-center py-12">
					<XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Failed to load shifts
					</h3>
					<p className="text-gray-600 mb-4">
						There was an error loading your shifts. Please try again.
					</p>
					<Button onClick={() => refetch()}>Try Again</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-8 space-y-6">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-[#008CFF]">
						Shifts
					</h1>
					<p className="text-muted-foreground mt-2">
						Manage your schedule and view upcoming assignments
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
					<div className="relative flex-1 md:flex-none md:w-60">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#008CFF]/60" />
						<Input
							placeholder="Search shifts..."
							className="pl-10 border-[#008CFF]/20 focus:border-[#008CFF] focus-visible:ring-[#008CFF]/20"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button
						variant="outline"
						size="sm"
						className="border-[#008CFF]/20 hover:bg-[#008CFF]/10 hover:border-[#008CFF]/40"
					>
						<Filter className="h-4 w-4 mr-2 text-[#008CFF]" />
						<span className="text-[#008CFF]">Filter</span>
					</Button>
					<div className="flex items-center rounded-lg border border-[#008CFF]/20 overflow-hidden bg-white shadow-sm">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setCurrentView("list")}
							className={cn(
								"rounded-none border-0",
								currentView === "list"
									? "bg-[#008CFF] text-white hover:bg-[#008CFF]/90"
									: "text-[#008CFF] hover:bg-[#008CFF]/10"
							)}
						>
							<List className="h-4 w-4 mr-2" />
							List
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setCurrentView("calendar")}
							className={cn(
								"rounded-none border-0",
								currentView === "calendar"
									? "bg-[#008CFF] text-white hover:bg-[#008CFF]/90"
									: "text-[#008CFF] hover:bg-[#008CFF]/10"
							)}
						>
							<CalendarIcon className="h-4 w-4 mr-2" />
							Calendar
						</Button>
					</div>
				</div>
			</div>

			{/* List View */}
			{currentView === "list" && (
				<Card className="border-[#008CFF]/10 transition-all duration-200 hover:shadow-lg">
					<CardHeader className="border-b border-[#008CFF]/10">
						<CardTitle className="text-[#008CFF]">Your Assignments</CardTitle>
					</CardHeader>
					<CardContent className="pt-6">
						{isLoading ? (
							<div className="space-y-4">
								{[...Array(3)].map((_, i) => (
									<div key={i} className="flex items-center gap-4 p-4">
										<Skeleton className="w-12 h-12 rounded-full" />
										<div className="flex-1 space-y-2">
											<Skeleton className="h-4 w-48" />
											<Skeleton className="h-3 w-64" />
										</div>
										<Skeleton className="h-6 w-20" />
									</div>
								))}
							</div>
						) : filteredShifts.length === 0 ? (
							<div className="text-center py-12">
								<div className="mx-auto w-16 h-16 bg-[#008CFF]/10 rounded-full flex items-center justify-center mb-4">
									<CalendarIcon className="w-6 h-6 text-[#008CFF]/60" />
								</div>
								<p className="text-muted-foreground text-lg">No shifts found</p>
								<p className="text-sm text-muted-foreground mt-1">
									Try adjusting your search or check back later for new
									assignments
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{filteredShifts.map((shift) => renderShiftCard(shift))}
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Calendar View */}
			{currentView === "calendar" && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="col-span-1">
						<Card className="border-[#008CFF]/10 transition-all duration-200 hover:shadow-lg">
							<CardHeader className="border-b border-[#008CFF]/10">
								<CardTitle className="text-[#008CFF]">Select Date</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								<Calendar
									mode="single"
									selected={selectedDate}
									onSelect={handleDateSelect}
									className="border border-[#008CFF]/20 rounded-lg pointer-events-auto w-full"
									modifiers={{
										hasShift: (date) =>
											shiftDates.some(
												(shiftDate) =>
													shiftDate.getDate() === date.getDate() &&
													shiftDate.getMonth() === date.getMonth() &&
													shiftDate.getFullYear() === date.getFullYear()
											),
									}}
									modifiersStyles={{
										hasShift: {
											fontWeight: "bold",
											backgroundColor: "rgba(30, 59, 147, 0.1)",
											color: "#008CFF",
											borderRadius: "50%",
										},
									}}
								/>
							</CardContent>
						</Card>
					</div>

					<div className="col-span-1 lg:col-span-2">
						<Card className="border-[#008CFF]/10 transition-all duration-200 hover:shadow-lg">
							<CardHeader className="border-b border-[#008CFF]/10">
								<CardTitle className="text-[#008CFF]">
									{selectedDate
										? format(selectedDate, "EEEE, MMMM d, yyyy")
										: "All Shifts"}
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								{isLoading ? (
									<div className="space-y-4">
										{[...Array(2)].map((_, i) => (
											<div key={i} className="flex items-center gap-4 p-4">
												<Skeleton className="w-12 h-12 rounded-full" />
												<div className="flex-1 space-y-2">
													<Skeleton className="h-4 w-48" />
													<Skeleton className="h-3 w-64" />
												</div>
												<Skeleton className="h-6 w-20" />
											</div>
										))}
									</div>
								) : shiftsOnSelectedDate.length === 0 ? (
									<div className="text-center py-12">
										<div className="mx-auto w-16 h-16 bg-[#008CFF]/10 rounded-full flex items-center justify-center mb-4">
											<CalendarIcon className="w-6 h-6 text-[#008CFF]/60" />
										</div>
										<p className="text-muted-foreground text-lg">
											{selectedDate
												? "No shifts scheduled for this date"
												: "Select a date to view scheduled shifts"}
										</p>
										<p className="text-sm text-muted-foreground mt-1">
											{selectedDate
												? "Check other dates or contact your coordinator"
												: "Click on a date in the calendar to see your assignments"}
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{shiftsOnSelectedDate.map((shift) =>
											renderShiftCard(shift)
										)}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			)}
		</div>
	);
}
