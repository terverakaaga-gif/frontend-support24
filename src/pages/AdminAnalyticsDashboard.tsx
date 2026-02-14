// src/pages/AdminAnalyticsDashboard.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { ExportButton } from "@/components/analytics/ExportButton";
import { ChartCard } from "@/components/analytics/ChartCard";
import { MetricsGrid } from "@/components/analytics/MetricsGrid";
import { DashboardSection } from "@/components/analytics/DashboardSection";
import { RealTimeMetrics } from "@/components/analytics/RealTimeMetrics";
import { DateRange, DateRangeType } from "@/entities/Analytics";
import { createDateRange } from "@/api/services/analyticsService";
import {
	useGetDashboardOverview,
	useGetUserAnalytics,
	useGetFinancialAnalytics,
	useGetPlatformSummary,
} from "@/hooks/useAnalyticsHooks";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/formatters";
import { Bell, BranchingPathsDown, Buildings2, Calendar, CheckCircle, ClockCircle, CourseUp, DiagramDown, Dollar, Layers, Repeat, UserCheck, UserPlus, UsersGroupRounded } from "@solar-icons/react";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING, SPACING, GAP, HEADING_STYLES, TEXT_STYLES, FLEX_LAYOUTS, GRID_LAYOUTS } from "@/constants/design-system";

export default function AdminAnalyticsDashboard() {
	// State for date range and comparison
	const [dateRange, setDateRange] = useState<DateRange>(
		createDateRange(DateRangeType.MONTH)
	);
	const [showComparison, setShowComparison] = useState<boolean>(true);
	const [activeTab, setActiveTab] = useState<string>("overview");

	// Fetch analytics data
	const { data: overviewData, isLoading: isLoadingOverview } =
		useGetDashboardOverview(
			dateRange,
			showComparison,
			activeTab === "overview"
		);

	const { data: userData, isLoading: isLoadingUsers } = useGetUserAnalytics(
		dateRange,
		activeTab === "users"
	);

	const { data: financialData, isLoading: isLoadingFinancial } =
		useGetFinancialAnalytics(dateRange, activeTab === "financial");

	const { data: platformData, isLoading: isLoadingPlatform } =
		useGetPlatformSummary(dateRange, activeTab === "platform");


	// Generate metrics for overview tab
	const generateOverviewMetrics = () => {
		if (!overviewData) return [];

		return [
			//   {
			//     id: 'total-users',
			//     title: 'Total Users',
			//     value: formatNumber(overviewData.userMetrics.totalUsers),
			//     icon: <Users className="h-4 w-4 text-guardian" />,
			//     change: {
			//       value: formatPercent(overviewData.userMetrics.growthRate.percentageChange),
			//       positive: overviewData.userMetrics.growthRate.trend === 'up'
			//     },
			//     comparisonData: overviewData.userMetrics.growthRate
			//   },
			{
				id: "total-users",
				title: "Total Users",
				value: formatNumber(overviewData?.userMetrics?.totalUsers),
				icon: <UsersGroupRounded className="h-4 w-4 text-guardian" />,
				change: {
					value: formatPercent(
						overviewData?.userMetrics?.growthRate?.percentageChange ?? 0
					),
					positive: overviewData?.userMetrics?.growthRate?.trend === "up",
				},
				comparisonData: overviewData?.userMetrics?.growthRate ?? {
					current: 0,
					previous: 0,
					percentageChange: 0,
					trend: "stable",
				},
			},
			{
				id: "active-organizations",
				title: "Active Organizations",
				value: formatNumber(
					overviewData?.platformActivity?.activeOrganizations ?? 0
				),
				icon: <Buildings2 className="h-4 w-4 text-guardian" />,
			},
			{
				id: "total-revenue",
				title: "Total Revenue",
				value: formatCurrency(
					overviewData?.financialSummary?.totalRevenue.current ?? 0
				),
				icon: <Dollar className="h-4 w-4 text-guardian" />,
				change: {
					value: formatPercent(
						overviewData?.financialSummary?.totalRevenue?.percentageChange
					),
					positive: overviewData?.financialSummary?.totalRevenue.trend === "up",
				},
				comparisonData: overviewData?.financialSummary?.totalRevenue,
			},
			{
				id: "pending-invites",
				title: "Pending Invitations",
				value: formatNumber(
					overviewData?.operationalMetrics?.pendingInvites ?? 0
				),
				icon: <Bell className="h-4 w-4 text-guardian" />,
			},
		];
	};

	// Generate metrics for user tab
	const generateUserMetrics = () => {
		if (!userData) return [];

		return [
			{
				id: "email-verified",
				title: "Email Verified",
				value: formatNumber(userData?.verificationStats?.emailVerified),
				icon: <CheckCircle className="h-4 w-4 text-guardian" />,
			},
			{
				id: "profile-complete",
				title: "Profile Complete",
				value: formatNumber(userData?.verificationStats?.profileComplete),
				icon: <UserCheck className="h-4 w-4 text-guardian" />,
			},
			{
				id: "monthly-active",
				title: "Monthly Active Users",
				value: formatNumber(userData?.retentionMetrics?.monthlyActiveUsers),
				icon: <DiagramDown className="h-4 w-4 text-guardian" />,
			},
			{
				id: "churn-rate",
				title: "Churn Rate",
				value: formatPercent(userData?.retentionMetrics?.churnRate),
				icon: <Repeat className="h-4 w-4 text-guardian" />,
				change: {
					value: userData?.retentionMetrics?.churnRate < 5 ? "Good" : "High",
					positive: userData?.retentionMetrics?.churnRate < 5,
				},
			},
		];
	};

	// Generate metrics for financial tab
	const generateFinancialMetrics = () => {
		if (!financialData) return [];

		return [
			{
				id: "total-revenue",
				title: "Total Revenue",
				value: formatCurrency(financialData?.revenue?.total),
				icon: <Dollar className="h-4 w-4 text-guardian" />,
			},
			{
				id: "processed-payments",
				title: "Processed Payments",
				value: formatNumber(financialData?.payments?.processed),
				icon: <CheckCircle className="h-4 w-4 text-guardian" />,
			},
			{
				id: "pending-payments",
				title: "Pending Payments",
				value: formatNumber(financialData?.payments?.pending),
				icon: <ClockCircle className="h-4 w-4 text-guardian" />,
			},
			{
				id: "monthly-projection",
				title: "Monthly Projection",
				value: formatCurrency(financialData?.projections?.monthlyProjected),
				icon: <CourseUp className="h-4 w-4 text-guardian" />,
				change: {
					value: formatPercent(financialData?.projections?.growthRate),
					positive: financialData?.projections?.growthRate > 0,
				},
			},
		];
	};

	// Generate metrics for platform tab
	const generatePlatformMetrics = () => {
		if (!platformData) return [];

		return [
			{
				id: "total-users",
				title: "Total Users",
				value: formatNumber(platformData?.userGrowth?.total),
				icon: <UsersGroupRounded className="h-4 w-4 text-guardian" />,
				change: {
					value: formatPercent(
						platformData?.userGrowth?.growthRate?.percentageChange
					),
					positive: platformData?.userGrowth?.growthRate?.trend === "up",
				},
				comparisonData: platformData?.userGrowth?.growthRate,
			},
			{
				id: "total-shifts",
				title: "Total Shifts",
				value: formatNumber(platformData?.shiftMetrics?.total),
				icon: <Calendar className="h-4 w-4 text-guardian" />,
			},
			{
				id: "completion-rate",
				title: "Completion Rate",
				value: formatPercent(platformData?.shiftMetrics?.completionRate),
				icon: <CheckCircle className="h-4 w-4 text-guardian" />,
			},
			{
				id: "average-shift-value",
				title: "Avg. Shift Value",
				value: formatCurrency(
					platformData?.financialMetrics?.averageShiftValue
				),
				icon: <Dollar className="h-4 w-4 text-guardian" />,
			},
		];
	};

	// Transform registration trends data for chart
	const getRegistrationTrendsChart = () => {
		if (!userData) return { data: [], dataKeys: ["count"], xAxisKey: "date" };

		return {
			data: userData.registrationTrends,
			dataKeys: ["value"],
			xAxisKey: "date",
		};
	};

	// Transform revenue trends data for chart
	const getRevenueTrendsChart = () => {
		if (!financialData)
			return { data: [], dataKeys: ["revenue"], xAxisKey: "date" };

		return {
			data: financialData?.revenue?.trend,
			dataKeys: ["value"],
			xAxisKey: "date",
		};
	};

	// Transform platform usage trends data for chart
	const getPlatformUsageChart = () => {
		if (!overviewData)
			return { data: [], dataKeys: ["users"], xAxisKey: "date" };

		return {
			data: overviewData?.platformActivity?.platformUsageTrend,
			dataKeys: ["value"],
			xAxisKey: "date",
		};
	};

	// Transform user distribution data for pie chart
	const getUserDistributionChart = () => {
		if (!userData) return { data: [], dataKeys: ["count"], xAxisKey: "state" };

		// Transform state distribution into array for pie chart
		// const stateData = Object.entries(userData?.userDistribution?.byState).map(([state, count]) => ({
		//   state,
		//   count,
		// }));

		const stateData = Object.entries(
			userData?.userDistribution?.byState ?? {}
		).map(([state, count]) => ({
			state,
			count,
		}));

		return {
			data: stateData,
			dataKeys: ["count"],
			xAxisKey: "state",
		};
	};

	// Transform service type revenue data for bar chart
	const getServiceRevenueChart = () => {
		if (!financialData)
			return { data: [], dataKeys: ["revenue"], xAxisKey: "service" };

		// Transform service type revenue into array for bar chart
		const serviceData = Object.entries(
			financialData?.revenue?.byServiceType ?? {}
		).map(([service, revenue]) => ({
			service,
			revenue,
		}));

		return {
			data: serviceData,
			dataKeys: ["revenue"],
			xAxisKey: "service",
		};
	};

	// Transform top organizations data for bar chart
	const getTopOrganizationsChart = () => {
		if (!financialData)
			return { data: [], dataKeys: ["revenue"], xAxisKey: "name" };

		return {
			data: financialData?.revenue?.byOrganization.slice(0, 5),
			dataKeys: ["revenue"],
			xAxisKey: "name",
		};
	};

	return (
		<div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive, "space-y-8")}>
			{/* Header Section */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-montserrat-bold tracking-tight">
						Analytics Dashboard
					</h1>
					<p className="text-muted-foreground">
						Comprehensive insights and performance metrics
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<DateRangePicker
						value={dateRange}
						onChange={setDateRange}
						showComparison={true}
						comparison={showComparison}
						onComparisonChange={setShowComparison}
					/>
					<ExportButton
						dateRange={dateRange}
						isLoading={
							isLoadingOverview ||
							isLoadingUsers ||
							isLoadingFinancial ||
							isLoadingPlatform
						}
					/>
				</div>
			</div>

			{/* Tabs Section */}
			<Tabs
				defaultValue="overview"
				value={activeTab}
				onValueChange={setActiveTab}
			>
				<TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="financial">Financial</TabsTrigger>
					<TabsTrigger value="platform">Platform</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6">
					<MetricsGrid
						metrics={generateOverviewMetrics()}
						showComparison={showComparison}
						columns={4}
					/>

					{/* {isLoadingOverview ? (
            <p>Loading...</p> // Or a loading skeleton
            ) : (
            <MetricsGrid
                metrics={generateOverviewMetrics()}
                showComparison={showComparison}
                columns={4}
            />
          )} */}

					<div className="grid gap-6 md:grid-cols-2">
						<ChartCard
							title="Platform Usage"
							type="area"
							data={getPlatformUsageChart().data}
							dataKeys={getPlatformUsageChart().dataKeys}
							xAxisKey={getPlatformUsageChart().xAxisKey}
							colors={["#2195F2"]}
							loading={isLoadingOverview}
							icon={<DiagramDown className="h-5 w-5 text-guardian" />}
							description="Daily active users on the platform"
						/>

						<RealTimeMetrics className="md:col-span-1" />
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<DashboardSection
							title="Operational Metrics"
							icon={<Layers className="h-5 w-5 text-guardian" />}
						>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-montserrat-semibold">
												Shift Completion Rate
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-montserrat-bold">
												{isLoadingOverview
													? "Loading..."
													: formatPercent(
															overviewData?.operationalMetrics
																?.shiftCompletionRate || 0
													  )}
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-montserrat-semibold">
												Avg Response Time
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-montserrat-bold">
												{isLoadingOverview
													? "Loading..."
													: `${
															overviewData?.operationalMetrics
																?.averageResponseTime || 0
													  } hrs`}
											</div>
										</CardContent>
									</Card>
								</div>

								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-montserrat-semibold">
											Cancellation Rate
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex items-center gap-2">
											<div className="text-2xl font-montserrat-bold">
												{isLoadingOverview
													? "Loading..."
													: formatPercent(
															overviewData?.operationalMetrics?.cancellationRate
																.current || 0
													  )}
											</div>
											{overviewData?.operationalMetrics?.cancellationRate && (
												<div
													className={`text-sm ${
														overviewData?.operationalMetrics?.cancellationRate
															?.trend === "down"
															? "text-emerald-600"
															: "text-red-500"
													}`}
												>
													{formatPercent(
														overviewData?.operationalMetrics?.cancellationRate
															?.percentageChange
													)}
													{overviewData?.operationalMetrics?.cancellationRate
														?.trend === "down"
														? " ↓"
														: " ↑"}
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</div>
						</DashboardSection>

						<DashboardSection
							title="Financial Summary"
							icon={<Dollar className="h-5 w-5 text-guardian" />}
						>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-montserrat-semibold">
												Pending Payments
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-montserrat-bold">
												{isLoadingOverview
													? "Loading..."
													: formatCurrency(
															overviewData?.financialSummary?.pendingPayments ||
																0
													  )}
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-montserrat-semibold">
												Processed Today
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-montserrat-bold">
												{isLoadingOverview
													? "Loading..."
													: formatCurrency(
															overviewData?.financialSummary?.processedToday ||
																0
													  )}
											</div>
										</CardContent>
									</Card>
								</div>

								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-montserrat-semibold">
											Average Shift Value
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-montserrat-bold">
											{isLoadingOverview
												? "Loading..."
												: formatCurrency(
														overviewData?.financialSummary?.averageShiftValue ||
															0
												  )}
										</div>
									</CardContent>
								</Card>
							</div>
						</DashboardSection>
					</div>
				</TabsContent>

				{/* Users Tab */}
				<TabsContent value="users" className="space-y-6">
					<MetricsGrid
						metrics={generateUserMetrics()}
						showComparison={showComparison}
						columns={4}
					/>

					<div className="grid gap-6 md:grid-cols-2">
						<ChartCard
							title="User Registrations"
							type="bar"
							data={getRegistrationTrendsChart().data}
							dataKeys={getRegistrationTrendsChart().dataKeys}
							xAxisKey={getRegistrationTrendsChart().xAxisKey}
							colors={["#2195F2"]}
							loading={isLoadingUsers}
							icon={<UserPlus className="h-5 w-5 text-guardian" />}
							description="New user registrations over time"
						/>

						<ChartCard
							title="User Distribution by State"
							type="pie"
							data={getUserDistributionChart().data}
							dataKeys={getUserDistributionChart().dataKeys}
							xAxisKey={getUserDistributionChart().xAxisKey}
							loading={isLoadingUsers}
							icon={<BranchingPathsDown className="h-5 w-5 text-guardian" />}
							description="Geographical distribution of users"
						/>
					</div>

					<DashboardSection
						title="Verification Statistics"
						icon={<CheckCircle className="h-5 w-5 text-guardian" />}
					>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-montserrat-semibold">
										Email Verified
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-montserrat-bold">
										{isLoadingUsers
											? "Loading..."
											: formatNumber(
													userData?.verificationStats?.emailVerified || 0
											  )}
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-montserrat-semibold">
										Profile Complete
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-montserrat-bold">
										{isLoadingUsers
											? "Loading..."
											: formatNumber(
													userData?.verificationStats?.profileComplete || 0
											  )}
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-montserrat-semibold">
										Documents Verified
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-montserrat-bold">
										{isLoadingUsers
											? "Loading..."
											: formatNumber(
													userData?.verificationStats?.documentsVerified || 0
											  )}
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-montserrat-semibold">
										Fully Onboarded
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-montserrat-bold">
										{isLoadingUsers
											? "Loading..."
											: formatNumber(
													userData?.verificationStats?.fullyOnboarded || 0
											  )}
									</div>
								</CardContent>
							</Card>
						</div>
					</DashboardSection>
				</TabsContent>

				{/* Financial Tab */}
				<TabsContent value="financial" className="space-y-6">
					<MetricsGrid
						metrics={generateFinancialMetrics()}
						showComparison={showComparison}
						columns={4}
					/>

					<div className="grid gap-6 md:grid-cols-2">
						<ChartCard
							title="Revenue Trends"
							type="line"
							data={getRevenueTrendsChart().data}
							dataKeys={getRevenueTrendsChart().dataKeys}
							xAxisKey={getRevenueTrendsChart().xAxisKey}
							colors={["#2195F2"]}
							loading={isLoadingFinancial}
							icon={<CourseUp className="h-5 w-5 text-guardian" />}
							description="Revenue trends over time"
						/>

						<ChartCard
							title="Top Organizations by Revenue"
							type="bar"
							data={getTopOrganizationsChart().data}
							dataKeys={getTopOrganizationsChart().dataKeys}
							xAxisKey={getTopOrganizationsChart().xAxisKey}
							colors={["#2195F2"]}
							loading={isLoadingFinancial}
							icon={<Buildings2 className="h-5 w-5 text-guardian" />}
							description="Highest revenue generating organizations"
						/>
					</div>

					<ChartCard
						title="Revenue by Service Type"
						type="bar"
						data={getServiceRevenueChart().data}
						dataKeys={getServiceRevenueChart().dataKeys}
						xAxisKey={getServiceRevenueChart().xAxisKey}
						colors={["#2195F2"]}
						loading={isLoadingFinancial}
						icon={<Layers className="h-5 w-5 text-guardian" />}
						description="Revenue breakdown by service type"
					/>

					<DashboardSection
						title="Financial Projections"
						icon={<CourseUp className="h-5 w-5 text-guardian" />}
					>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-montserrat-semibold">
										Monthly Projected
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-montserrat-bold">
										{isLoadingFinancial
											? "Loading..."
											: formatCurrency(
													financialData?.projections?.monthlyProjected || 0
											  )}
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-montserrat-semibold">
										Quarterly Projected
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-montserrat-bold">
										{isLoadingFinancial
											? "Loading..."
											: formatCurrency(
													financialData?.projections?.quarterlyProjected || 0
											  )}
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-montserrat-semibold">
										Growth Rate
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-montserrat-bold">
										{isLoadingFinancial
											? "Loading..."
											: formatPercent(
													financialData?.projections?.growthRate || 0
											  )}
									</div>
								</CardContent>
							</Card>
						</div>
					</DashboardSection>
				</TabsContent>

				{/* Platform Tab */}
				<TabsContent value="platform" className="space-y-6">
					<MetricsGrid
						metrics={generatePlatformMetrics()}
						showComparison={showComparison}
						columns={4}
					/>

					<RealTimeMetrics />

					<div className="grid gap-6 md:grid-cols-2">
						<DashboardSection
							title="Shift Metrics"
							icon={<Calendar className="h-5 w-5 text-guardian" />}
						>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-montserrat-semibold">
												Completed Shifts
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-montserrat-bold">
												{isLoadingPlatform
													? "Loading..."
													: formatNumber(
															platformData?.shiftMetrics?.byStatus?.completed ||
																0
													  )}
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-montserrat-semibold">
												Cancelled Shifts
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-montserrat-bold">
												{isLoadingPlatform
													? "Loading..."
													: formatNumber(
															platformData?.shiftMetrics?.byStatus?.cancelled ||
																0
													  )}
											</div>
										</CardContent>
									</Card>
								</div>

								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-montserrat-semibold">
											Completion Rate
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-montserrat-bold">
											{isLoadingPlatform
												? "Loading..."
												: formatPercent(
														platformData?.shiftMetrics?.completionRate || 0
												  )}
										</div>
									</CardContent>
								</Card>
							</div>
						</DashboardSection>

						<DashboardSection
							title="Organization Metrics"
							icon={<Buildings2 className="h-5 w-5 text-guardian" />}
						>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-montserrat-semibold">
												Total Organizations
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-montserrat-bold">
												{isLoadingPlatform
													? "Loading..."
													: formatNumber(
															platformData?.organizationMetrics?.total || 0
													  )}
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-montserrat-semibold">
												Active Organizations
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-montserrat-bold">
												{isLoadingPlatform
													? "Loading..."
													: formatNumber(
															platformData?.organizationMetrics?.active || 0
													  )}
											</div>
										</CardContent>
									</Card>
								</div>

								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-montserrat-semibold">
											Avg Workers per Org
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-montserrat-bold">
											{isLoadingPlatform
												? "Loading..."
												: platformData?.organizationMetrics?.averageWorkersPerOrg.toFixed(
														1
												  ) || "0.0"}
										</div>
									</CardContent>
								</Card>
							</div>
						</DashboardSection>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
