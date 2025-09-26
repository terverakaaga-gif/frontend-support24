/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Clock,
	Users,
	DollarSign,
	Star,
	MessageSquare,
	Calendar,
	Download,
	FileCheck,
	FileWarning,
	Inbox,
	CheckCircle,
	MapPin,
	Activity,
	XCircle,
	TrendingUp,
	Target,
	Search,
	Bell,
	Eye,
	X,
	ChevronRight,
	BarChart3,
	AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { ChartSection } from "@/components/ChartSection";
import { NotificationsList } from "@/components/NotificationsList";
import { ParticipantInvitations } from "@/components/supportworker/ParticipantInvitations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ProfileSetupAlert } from "@/components/ProfileSetupAlert";
import { useAuth } from "@/contexts/AuthContext";
import { SupportWorker } from "@/types/user.types";
import { cn } from "@/lib/utils";
import {
	useGetSupportWorkerOverview,
	useGetSupportWorkerFinancial,
	useGetSupportWorkerSchedule,
	useGetSupportWorkerPerformance,
} from "@/hooks/useAnalyticsHooks";
import Loader from "@/components/Loader";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ComposedChart,
} from "recharts";

// Service type labels for display
const SERVICE_TYPE_LABELS: Record<string, string> = {
	personalCare: "Personal Care",
	socialSupport: "Social Support",
	transport: "Transport",
	householdTasks: "Household Tasks",
	mealPreparation: "Meal Preparation",
	medicationSupport: "Medication Support",
	mobilityAssistance: "Mobility Assistance",
	therapySupport: "Therapy Support",
	behaviorSupport: "Behavior Support",
	communityAccess: "Community Access",
};

// Performance Chart Component using real data and Recharts
function PerformanceChart({ overviewData, performanceData, scheduleData }: any) {
	// Transform real performance data for the chart
	const chartData = useMemo(() => {
		if (!performanceData?.monthlyTrends) {
			return [];
		}
		
		return performanceData.monthlyTrends.map((trend: any) => ({
			month: new Date(trend.month).toLocaleDateString('en-US', { month: 'short' }),
			completion: trend.completionRate || 0,
			onTime: trend.onTimeRate || 0,
			availability: trend.availabilityUtilization || 0,
		}));
	}, [performanceData]);

	return (
		<Card className="border-guardian/10">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-medium text-guardian">Performance Overview</CardTitle>
					<div className="flex items-center gap-4">
						<Button variant="outline" size="sm" className="border-guardian/20">
							<Calendar className="h-4 w-4 mr-2" />
							Pick Date
						</Button>
						<Select defaultValue="current">
							<SelectTrigger className="w-32 border-guardian/20">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="current">Current Month</SelectItem>
								<SelectItem value="last">Last Month</SelectItem>
								<SelectItem value="quarter">This Quarter</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* Performance Metric Display */}
					<div>
						<div className="flex justify-between items-center mb-4">
							<span className="text-4xl font-bold text-guardian">
								{overviewData?.performanceMetrics?.completionRate || 0}%
							</span>
							<span className="text-green-600 text-sm flex items-center font-medium">
								<TrendingUp className="w-4 h-4 mr-1" />
								{overviewData?.workSummary?.hoursWorked?.percentageChange || 0}%
							</span>
						</div>
						
						{/* Performance Stats Grid */}
						<div className="grid grid-cols-3 gap-4 text-sm mb-6">
							<div>
								<div className="text-muted-foreground mb-1">Completion Rate</div>
								<div className="font-semibold text-lg">
									{overviewData?.performanceMetrics?.completionRate || 0}%
								</div>
							</div>
							<div>
								<div className="text-muted-foreground mb-1">On-Time Rate</div>
								<div className="font-semibold text-lg">
									{overviewData?.performanceMetrics?.onTimeRate || 0}%
								</div>
							</div>
							<div>
								<div className="text-muted-foreground mb-1">Availability Utilization</div>
								<div className="font-semibold text-lg">
									{performanceData?.availabilityComparison?.utilizationPercentage?.toFixed(1) || 0.0}%
								</div>
							</div>
						</div>

						{/* Recharts Chart */}
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<ComposedChart
									data={chartData}
									margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
								>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" />
									<XAxis
										dataKey="month"
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#64748b", fontSize: 12 }}
									/>
									<YAxis
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#64748b", fontSize: 12 }}
									/>
									<Tooltip
										contentStyle={{
											background: "white",
											borderRadius: "8px",
											border: "none",
											boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
											padding: "8px 12px",
										}}
										labelStyle={{
											color: "#1e3b93",
											fontWeight: 600,
											marginBottom: 4,
										}}
									/>
									<Bar
										dataKey="completion"
										fill="#1e3b93"
										radius={[4, 4, 0, 0]}
										maxBarSize={40}
									/>
									<Line
										type="monotone"
										dataKey="onTime"
										stroke="#fbbf24"
										strokeWidth={3}
										dot={{ r: 4, fill: "#fbbf24" }}
										activeDot={{ r: 6, fill: "#fbbf24" }}
									/>
								</ComposedChart>
							</ResponsiveContainer>
						</div>
						
						{/* Chart Legend */}
						<div className="flex justify-center gap-6 mt-4 text-sm">
							<div className="flex items-center">
								<div className="w-4 h-3 bg-guardian rounded mr-2"></div>
								<span className="text-muted-foreground">Completion Rate</span>
							</div>
							<div className="flex items-center">
								<div className="w-4 h-1 bg-yellow-400 rounded mr-2"></div>
								<span className="text-muted-foreground">On-Time Trend</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default function SupportWorkerDashboard() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredShifts, setFilteredShifts] = useState<any[]>([]);

	// Listen for search events from the header
	useEffect(() => {
		const handleSearchEvent = (event: CustomEvent) => {
			setSearchQuery(event.detail.query);
		};

		window.addEventListener('dashboardSearch', handleSearchEvent as EventListener);
		return () => {
			window.removeEventListener('dashboardSearch', handleSearchEvent as EventListener);
		};
	}, []);

	// Fetch analytics data
	const {
		data: overviewData,
		isLoading: overviewLoading,
		error: overviewError,
	} = useGetSupportWorkerOverview("month", true);
	const {
		data: financialData,
		isLoading: financialLoading,
		error: financialError,
	} = useGetSupportWorkerFinancial("month");
	const {
		data: scheduleData,
		isLoading: scheduleLoading,
		error: scheduleError,
	} = useGetSupportWorkerSchedule("month");
	const {
		data: performanceData,
		isLoading: performanceLoading,
		error: performanceError,
	} = useGetSupportWorkerPerformance("month");

	// Filter shifts based on search query
	useEffect(() => {
		if (!overviewData?.workSummary?.upcomingShifts) {
			setFilteredShifts([]);
			return;
		}

		const filtered = overviewData.workSummary.upcomingShifts.filter((shift: any) => {
			const searchTerm = searchQuery.toLowerCase();
			return (
				shift.participantName?.toLowerCase().includes(searchTerm) ||
				SERVICE_TYPE_LABELS[shift.serviceType]?.toLowerCase().includes(searchTerm) ||
				shift.serviceType?.toLowerCase().includes(searchTerm) ||
				shift.address?.toLowerCase().includes(searchTerm)
			);
		});
		setFilteredShifts(filtered);
	}, [searchQuery, overviewData]);

	// Format data for charts
	const earningsTrendData = financialData?.earnings?.trend || [];
	const weeklyHoursData = scheduleData?.weeklyHours || [];
	const shiftsByServiceType = scheduleData?.shiftDistribution?.byServiceType || {};

	// Function to handle view shift details
	const handleViewShiftDetails = (shiftId: string) => {
		navigate(`/support-worker/shifts/${shiftId}`);
	};

	if (overviewLoading || financialLoading || scheduleLoading || performanceLoading) {
		return <Loader />;
	}

	if (overviewError || financialError || scheduleError || performanceError) {
		return (
			<div className="container py-6 space-y-8">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<XCircle className="mx-auto h-12 w-12 text-red-500" />
						<p className="mt-4 text-muted-foreground">
							Failed to load dashboard data
						</p>
						<Button
							className="mt-4 bg-[#1e3b93] hover:bg-[#1e3b93]/90"
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
			{/* Show alert if support worker hasn't completed onboarding */}
			{user &&
				user.role === "supportWorker" &&
				(user as SupportWorker).verificationStatus?.onboardingComplete && (
					<ProfileSetupAlert userName={user.firstName.split(" ")[0]} />
				)}
				{/* Stats Row - Updated Design */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<StatCard
						title="Hours Worked"
						value={`${overviewData?.workSummary?.hoursWorked?.current || 0}h`}
						icon={<Clock size={20} />}
						change={{
							value: "From last Month",
							positive: overviewData?.workSummary?.hoursWorked?.trend === "up",
						}}
						className="border-guardian/10 hover:shadow-lg transition-shadow"
					/>
					<StatCard
						title="Active Clients"
						value={overviewData?.workSummary?.activeClients?.toString() || "0"}
						icon={<Users size={20} />}
						additionalText="Currently Supporting"
						className="border-guardian/10 hover:shadow-lg transition-shadow"
					/>
					<StatCard
						title="Earnings"
						value={`$${overviewData?.workSummary?.earnings?.current?.toFixed(2) || "0.00"}`}
						icon={<DollarSign size={20} />}
						change={{
							value: "From last Month",
							positive: overviewData?.workSummary?.earnings?.trend === "up",
						}}
						className="border-guardian/10 hover:shadow-lg transition-shadow"
					/>
					<StatCard
						title="Performance Ratings"
						value={
							overviewData?.performanceMetrics?.averageRating > 0
								? `${overviewData.performanceMetrics.averageRating.toFixed(1)}`
								: "1.5"
						}
						icon={<Star size={20} />}
						additionalText={`${overviewData?.performanceMetrics?.onTimeRate || 95}% on time rate`}
						className="border-guardian/10 hover:shadow-lg transition-shadow"
					/>
				</div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column - Performance and Invitations */}
					<div className="lg:col-span-2 space-y-6">
						{/* Performance Chart */}
						<PerformanceChart 
							overviewData={overviewData} 
							performanceData={performanceData}
						/>

						{/* All Invitations Table */}
						<Card className="border-guardian/10">
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle className="text-lg font-medium text-guardian">All Invitations</CardTitle>
									<Button variant="link" className="text-guardian hover:text-guardian/80">
										View all →
									</Button>
								</div>
							</CardHeader>
							<CardContent className="p-0">
								<ParticipantInvitations />
								
								{/* Pagination */}
								<div className="flex justify-between items-center p-4 border-t border-guardian/10">
									<div className="text-sm text-muted-foreground">
										Showing 5 entries
									</div>
									<div className="flex items-center space-x-1">
										<Button variant="outline" size="sm" className="border-guardian/20">‹</Button>
										<Button size="sm" className="bg-guardian hover:bg-guardian/90">1</Button>
										<Button variant="outline" size="sm" className="border-guardian/20">2</Button>
										<Button variant="outline" size="sm" className="border-guardian/20">3</Button>
										<Button variant="outline" size="sm" className="border-guardian/20">4</Button>
										<Button variant="outline" size="sm" className="border-guardian/20">5</Button>
										<Button variant="outline" size="sm" className="border-guardian/20">›</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Upcoming Shifts */}
					<div className="space-y-6">
						<Card className="border-guardian/10 transition-all duration-200 hover:shadow-lg">
							<CardHeader className="pb-4 border-b border-guardian/10">
								<div className="flex justify-between items-center">
									<CardTitle className="text-lg font-medium text-guardian">
										Upcoming Shifts
									</CardTitle>
									<Button
										variant="link"
										className="text-sm p-0 text-guardian hover:text-guardian/80"
									>
										View all →
									</Button>
								</div>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="space-y-4">
									{overviewData?.workSummary?.upcomingShifts &&
									overviewData.workSummary.upcomingShifts.length > 0 ? (
										<div className="space-y-4">
											{overviewData.workSummary.upcomingShifts
												.slice(0, 3)
												.map((shift: any, index: number) => (
													<div
														key={index}
														className="p-4 rounded-lg border border-guardian/10 transition-all duration-200 hover:shadow-md hover:border-guardian/20"
													>
														<div className="flex justify-between items-start mb-3">
															<div>
																<h4 className="font-semibold text-gray-900 mb-1">
																	{SERVICE_TYPE_LABELS[shift.serviceType] || "Behavior Support"}
																</h4>
																<Badge 
																	variant="secondary" 
																	className="bg-blue-100 text-blue-800"
																>
																	{shift.status || "Upcoming"}
																</Badge>
															</div>
															<div className="flex items-center space-x-2">
																<Avatar className="h-6 w-6">
																	<AvatarFallback className="bg-gray-300 text-xs">
																		{shift.participantName?.split(' ').map(n => n[0]).join('') || 'JT'}
																	</AvatarFallback>
																</Avatar>
																<Avatar className="h-6 w-6 -ml-2">
																	<AvatarFallback className="bg-gray-400 text-xs">
																		A
																	</AvatarFallback>
																</Avatar>
																<Button 
																	size="sm" 
																	className="bg-guardian hover:bg-guardian/90 ml-2"
																	onClick={() => handleViewShiftDetails(shift._id)}
																>
																	<ChevronRight className="h-4 w-4" />
																</Button>
															</div>
														</div>
														
														<div className="space-y-2 text-sm text-muted-foreground">
															<div className="flex items-center">
																<Calendar className="h-4 w-4 mr-2" />
																<span>
																	Date: {new Date(shift.startTime).toLocaleDateString()} | 
																	Time: {new Date(shift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
																	{new Date(shift.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
																</span>
															</div>
															<div className="flex items-center">
																<Users className="h-4 w-4 mr-2" />
																<span>{shift.participantName || "Jossy T"}</span>
															</div>
															<div className="flex items-center">
																<MapPin className="h-4 w-4 mr-2" />
																<span>{shift.address || "123 Main St, Anytown, Ca 12345"}</span>
															</div>
														</div>
													</div>
												))}
										</div>
									) : (
										<div className="text-center py-8 text-muted-foreground">
											<Calendar className="mx-auto h-12 w-12 mb-4 text-guardian/30" />
											<p>No upcoming shifts scheduled</p>
											<Button
												className="mt-4 bg-guardian hover:bg-guardian/90"
												onClick={() => navigate("/support-worker/shifts")}
											>
												View Schedule
											</Button>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Additional Analytics - Hidden for cleaner design but keeping existing functionality */}
				<div className="hidden">
					{/* Analytics Charts */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<ChartSection
							title="Monthly Earnings Trend"
							data={earningsTrendData}
							type="line"
							dataKey="value"
							xAxisKey="label"
							className="border-guardian/10"
						/>
						<ChartSection
							title="Weekly Hours Worked"
							data={weeklyHoursData}
							type="bar"
							dataKey="value"
							xAxisKey="label"
							className="border-guardian/10"
						/>
					</div>

					{/* Service Distribution */}
					{Object.keys(shiftsByServiceType).length > 0 && (
						<Card className="border-guardian/10">
							<CardHeader>
								<CardTitle className="text-lg font-medium text-guardian">
									Service Type Distribution This Month
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{Object.entries(shiftsByServiceType).map(([serviceType, count]) => (
										<div key={serviceType} className="p-4 rounded-lg border border-guardian/10">
											<div className="flex justify-between items-center mb-2">
												<h4 className="font-medium text-gray-900">
													{SERVICE_TYPE_LABELS[serviceType] || serviceType}
												</h4>
												<Badge variant="secondary" className="bg-guardian/10 text-guardian">
													{count} shifts
												</Badge>
											</div>
											<Progress
												value={(count / Math.max(...Object.values(shiftsByServiceType))) * 100}
												className="mt-2 h-2"
											/>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		
	);
}