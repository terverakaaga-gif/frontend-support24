/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
	Target,
	Clock,
	Heart,
	Calendar,
	MessageSquare,
	User,
	ChevronRight,
	ChevronLeft,
	Star,
	CheckCircle,
	XCircle,
	FileText,
	Activity,
	TrendingUp,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { ChartSection } from "@/components/ChartSection";
import { NotificationsList } from "@/components/NotificationsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import ShiftManagement from "@/components/ShiftManagement";
import { ConnectionsList } from "@/components/participant/ConnectionsList";
import { cn } from "@/lib/utils";
import {
	useGetParticipantOverview,
	useGetParticipantServices,
} from "@/hooks/useAnalyticsHooks";
import type { ServiceTypeInfo } from "@/entities/types";
import Loader from "@/components/Loader";

// Service type labels for display (fallback mapping by code)
const SERVICE_TYPE_LABELS: Record<string, string> = {
	PERSONALCARE: "Personal Care",
	SOCIALSUP: "Social Support",
	TRANSPORT: "Transport",
	HOUSEHOLD: "Household Tasks",
	MEALPREP: "Meal Preparation",
	MEDICATIONSUP: "Medication Support",
	MOBILITYASSIST: "Mobility Assistance",
	THERAPYSUP: "Therapy Support",
	BEHAVESUP: "Behavior Support",
	COMMUNITYACCESS: "Community Access",
};

/**
 * Helper function to get service type display name
 * Handles both legacy string format and new ServiceTypeInfo object format
 * API returns serviceType as: { id: string, name: string, code: string }
 */
const getServiceTypeDisplayName = (serviceType: ServiceTypeInfo | string): string => {
	// If it's already a string (legacy format), return it
	if (typeof serviceType === 'string') {
		return SERVICE_TYPE_LABELS[serviceType] || serviceType;
	}
	
	// If it's an object with the proper structure
	if (serviceType && typeof serviceType === 'object') {
		// First try to use the name from the API
		if (serviceType.name) {
			return serviceType.name;
		}
		
		// Fallback to our mapping using the code
		if (serviceType.code && SERVICE_TYPE_LABELS[serviceType.code]) {
			return SERVICE_TYPE_LABELS[serviceType.code];
		}
		
		// Last resort: use the code itself
		if (serviceType.code) {
			return serviceType.code;
		}
	}
	
	return 'Unknown Service';
};

// Shift Management Component
const ShiftManagementComponent = ({
	upcomingShifts,
}: {
	upcomingShifts: any[];
}) => {
	return (
		<Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
			<CardHeader className="pb-2">
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-medium text-guardian">
						Upcoming Shifts
					</CardTitle>
					<Button
						variant="link"
						className="text-sm p-0 text-guardian hover:text-guardian/80"
					>
						View Calendar
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{upcomingShifts.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<Calendar className="mx-auto h-12 w-12 mb-4 text-guardian/30" />
						<p>No upcoming shifts scheduled</p>
						<Button className="mt-4 bg-guardian hover:bg-guardian/90">
							Schedule a Shift
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						{upcomingShifts.map((shift, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-4 rounded-lg border border-guardian/10 hover:bg-guardian/5 transition-colors"
							>
								<div className="flex items-center gap-4">
									<Avatar className="border-2 border-guardian/10">
										<AvatarFallback className="bg-guardian/10 text-guardian font-medium">
											{shift.workerName ? shift.workerName[0] : "W"}
										</AvatarFallback>
									</Avatar>
									<div>
										<h4 className="font-medium text-gray-900">
											{shift.workerName || "Worker"}
										</h4>
										<p className="text-sm text-muted-foreground">
											{new Date(shift.startTime).toLocaleDateString()} •{" "}
											{new Date(shift.startTime).toLocaleTimeString()} -{" "}
											{new Date(shift.endTime).toLocaleTimeString()}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Badge variant="default" className="bg-guardian text-white">
										<CheckCircle className="w-3 h-3 mr-1" />
										Confirmed
									</Badge>
									<Button
										variant="ghost"
										size="icon"
										className="hover:bg-guardian/10"
									>
										<ChevronRight className="h-4 w-4 text-guardian" />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default function ParticipantDashboard() {
	const { user } = useAuth();

	// Fetch analytics data
	const {
		data: overviewData,
		isLoading: overviewLoading,
		error: overviewError,
	} = useGetParticipantOverview("month", true);
	const {
		data: serviceData,
		isLoading: serviceLoading,
		error: serviceError,
	} = useGetParticipantServices("month");

	console.log("Overview Data:", overviewData);
	console.log("Service Data:", serviceData);

	// Format data for charts
	const spendingTrendData = overviewData?.financialSummary?.spendingTrend || [];
	const serviceTrendData = serviceData?.servicetrends || [];

	if (overviewLoading || serviceLoading) {
		return <Loader />;
	}

	if (overviewError || serviceError) {
		return (
			<div className="container py-6 space-y-8">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<XCircle className="mx-auto h-12 w-12 text-red-500" />
						<p className="mt-4 text-muted-foreground">
							Failed to load dashboard data
						</p>
						<Button
							className="mt-4 bg-guardian hover:bg-guardian/90"
							onClick={() => window.location.reload()}
						>
							Try Again
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-6 space-y-8">
			{/* Header Section */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-guardian">
						Participant Dashboard
					</h1>
					<p className="text-muted-foreground mt-2">
						Welcome back, {user?.firstName}! Here's your care overview.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						className="flex items-center gap-2 border-guardian/20 hover:bg-guardian/10 hover:border-guardian/40"
					>
						<MessageSquare className="h-4 w-4 text-guardian" />
						<span className="text-guardian">Message Support</span>
					</Button>
					<Button className="flex items-center gap-2 bg-guardian hover:bg-guardian/90">
						<Calendar className="h-4 w-4" />
						Schedule
					</Button>
				</div>
			</div>

			{/* Stats Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<StatCard
					title="Active Workers"
					value={overviewData?.careOverview?.activeWorkers?.toString() || "0"}
					icon={<Users size={24} className="text-guardian" />}
					additionalText="Supporting your care"
					className="border-guardian/10 hover:shadow-lg transition-shadow"
				/>
				<StatCard
					title="Care Hours This Month"
					value={`${overviewData?.careOverview?.totalCareHours?.current || 0}h`}
					icon={<Clock size={24} className="text-guardian" />}
					change={{
						value: `${
							overviewData?.careOverview?.totalCareHours?.percentageChange || 0
						}% from last month`,
						positive:
							overviewData?.careOverview?.totalCareHours?.trend === "up",
					}}
					className="border-guardian/10 hover:shadow-lg transition-shadow"
				/>
				<StatCard
					title="Monthly Expenses"
					value={`$${
						overviewData?.financialSummary?.currentMonthExpenses?.toFixed(2) ||
						"0.00"
					}`}
					icon={<Heart size={24} className="text-guardian" />}
					additionalText={`${
						overviewData?.financialSummary?.budgetUtilization || 0
					}% of budget used`}
					className="border-guardian/10 hover:shadow-lg transition-shadow"
				/>
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ChartSection
					title="Monthly Spending Trend"
					data={spendingTrendData}
					type="line"
					dataKey="value"
					xAxisKey="label"
					className="border-guardian/10"
				/>
				<ChartSection
					title="Service Activity Trend"
					data={serviceTrendData}
					type="bar"
					dataKey="value"
					xAxisKey="label"
					className="border-guardian/10"
				/>
			</div>

			{/* Service Distribution */}
			{serviceData?.serviceDistribution &&
				serviceData.serviceDistribution.length > 0 && (
					<Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
						<CardHeader>
							<CardTitle className="text-lg font-medium text-guardian">
								Service Distribution This Month
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{serviceData.serviceDistribution.map((service, index) => (
									<div
										key={index}
										className="p-4 rounded-lg border border-guardian/10"
									>
										<div className="flex justify-between items-center mb-2">
											<h4 className="font-medium text-gray-900">
												{getServiceTypeDisplayName(service.serviceType)}
											</h4>
											<Badge
												variant="secondary"
												className="bg-guardian/10 text-guardian"
											>
												{service.percentage}%
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											{service.hours} hours
										</p>
										<Progress value={service.percentage} className="mt-2 h-2" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

			{/* Shift Management */}
			<ShiftManagementComponent
				upcomingShifts={overviewData?.careOverview?.upcomingShifts || []}
			/>

			{/* Top Support Workers */}
			{overviewData?.workerMetrics?.topWorkers &&
				overviewData.workerMetrics.topWorkers.length > 0 && (
					<Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
						<CardHeader>
							<CardTitle className="text-lg font-medium text-guardian">
								Your Support Workers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{overviewData.workerMetrics.topWorkers.map((worker, index) => (
									<div
										key={worker.workerId}
										className="flex items-start justify-between p-4 rounded-lg border border-guardian/10 hover:bg-guardian/5 transition-colors"
									>
										<div className="flex items-start gap-4">
											<Avatar className="h-12 w-12 border-2 border-guardian/10">
												<AvatarFallback className="bg-guardian/10 text-guardian font-medium">
													{worker.name[0]}
												</AvatarFallback>
											</Avatar>
											<div>
												<h4 className="font-medium text-gray-900">
													{worker.name}
												</h4>
												<div className="flex items-center gap-1 mt-1">
													<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
													<span className="text-sm font-medium text-guardian">
														{worker.rating > 0
															? worker.rating.toFixed(1)
															: "New"}
													</span>
												</div>
												<p className="text-sm text-muted-foreground mt-1">
													{worker.hours} hours this month
												</p>
											</div>
										</div>
										<div className="text-right">
											<Button
												className="bg-guardian hover:bg-guardian/90"
												size="sm"
											>
												Message
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

			{/* Notifications */}
			<Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg font-medium text-guardian">
						Recent Notifications
					</CardTitle>
				</CardHeader>
				<CardContent>
					<NotificationsList notifications={[]} />
				</CardContent>
			</Card>

			{/* Connections List */}
			<Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg font-medium text-guardian">
						My Connections
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ConnectionsList />
				</CardContent>
			</Card>
		</div>
	);
}
