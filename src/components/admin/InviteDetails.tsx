/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Calendar,
	Clock,
	FileText,
	User,
	Building,
	DollarSign,
	Send,
	MessageCircle,
	CheckCircle,
	XCircle,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useGetInviteById } from "@/hooks/useInviteHooks";
import { InviteAcceptanceForm } from "./InviteAcceptanceForm";
import { InviteDeclineForm } from "./InviteDeclineForm";

// Helper function to generate an avatar placeholder
const getAvatarPlaceholder = (name: string): string => {
	if (!name) return "??";
	const parts = name.split(" ");
	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`;
	}
	return name.substring(0, 2).toUpperCase();
};

// Format currency
const formatCurrency = (amount: number) => {
	return `$${amount.toFixed(2)}`;
};

// Format date
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleString("en-AU", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export function InviteDetails() {
	const { inviteId } = useParams<{ inviteId: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("overview");
	const [isAcceptanceFormOpen, setIsAcceptanceFormOpen] = useState(false);
	const [isDeclineFormOpen, setIsDeclineFormOpen] = useState(false);

	// Fetch invite details using the hook
	const {
		data: inviteDetails,
		isLoading,
		error,
		refetch,
	} = useGetInviteById(inviteId || "");
	console.log('invite details: ', inviteDetails)

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleMakeAvailable = () => {
		toast({
			title: "Invitation Made Available",
			description: `Invitation is now available to ${inviteDetails?.workerName}`,
		});
		// Note: This action doesn't require API call based on original implementation
		// navigate(`/admin/invites/${inviteDetails.inviteId}/confirm?action=make-available`);
	};

	const handleAccept = () => {
		setIsAcceptanceFormOpen(true);
	};

	const handleAcceptanceSuccess = () => {
		toast({
			title: "Invitation Accepted",
			description: `Successfully accepted invitation for ${inviteDetails?.workerName}`,
		});

		// Navigate back to invite management page
		navigate("/admin/invites");
	};

	const handleDecline = () => {
		setIsDeclineFormOpen(true);
	};

	const handleDeclineSuccess = () => {
		toast({
			title: "Invitation Declined",
			description: `Successfully declined invitation for ${inviteDetails?.workerName}`,
		});

		// Navigate back to invite management page
		navigate("/admin/invites");
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!inviteDetails) {
		return (
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" onClick={handleGoBack}>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back
						</Button>
						<CardTitle>Invitation Not Found</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<p>
						The invitation you're looking for could not be found. It may have
						been deleted or the ID is incorrect.
					</p>
				</CardContent>
				<CardFooter>
					<Button onClick={() => navigate("/admin/invites")}>
						Return to Invitations
					</Button>
				</CardFooter>
			</Card>
		);
	}

	return (
		<div className="container mx-auto py-6 max-w-7xl">
			<div className="flex items-center mb-6">
				<Button
					variant="ghost"
					size="sm"
					onClick={handleGoBack}
					className="mr-4"
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Invitations
				</Button>
				<h1 className="text-2xl font-montserrat-bold">Invitation Details</h1>
				<Badge
					variant="outline"
					className="ml-4 bg-yellow-50 text-yellow-700 border-yellow-300"
				>
					Pending
				</Badge>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Main content - 2/3 width on desktop */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader className="pb-4">
							<CardTitle>Connection Request</CardTitle>
							<CardDescription>
								Details of the connection request between participant and
								support worker
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								<TabsList className="w-full grid grid-cols-3">
									<TabsTrigger value="overview">Overview</TabsTrigger>
									<TabsTrigger value="rates">Proposed Rates</TabsTrigger>
									<TabsTrigger value="notes">Notes</TabsTrigger>
								</TabsList>

								<TabsContent value="overview" className="pt-4">
									<div className="space-y-4">
										<div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
											<Calendar className="h-5 w-5 text-muted-foreground" />
											<div>
												<p className="text-sm font-montserrat-semibold">Invitation Date</p>
												<p className="text-sm text-muted-foreground">
													{formatDate(inviteDetails.inviteDate)}
												</p>
											</div>
										</div>

										<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
											<div className="flex flex-col gap-4">
												<div className="p-4 bg-muted/50 rounded-lg">
													<p className="text-sm font-montserrat-semibold mb-2">
														Organization
													</p>
													<div className="flex items-center gap-3">
														<Building className="h-5 w-5 text-muted-foreground" />
														<div>
															<p className="font-montserrat-semibold">
																{inviteDetails.organizationName}
															</p>
															<p className="text-xs text-muted-foreground">
																ID: {inviteDetails.organizationId}
															</p>
														</div>
													</div>
												</div>

												<div className="p-4 bg-muted/50 rounded-lg">
													<p className="text-sm font-montserrat-semibold mb-2">
														Base Hourly Rate
													</p>
													<div className="flex items-center gap-3">
														<DollarSign className="h-5 w-5 text-green-600" />
														<p className="text-lg font-montserrat-semibold text-green-600">
															{formatCurrency(
																inviteDetails.proposedRates.baseHourlyRate
															)}
														</p>
													</div>
												</div>
											</div>

											<div className="flex flex-col gap-4">
												<div className="p-4 bg-muted/50 rounded-lg">
													<p className="text-sm font-montserrat-semibold mb-2">
														Invite Status
													</p>
													<Badge
														variant="outline"
														className="bg-yellow-50 text-yellow-700 border-yellow-300"
													>
														Pending
													</Badge>
												</div>

												<div className="p-4 bg-muted/50 rounded-lg">
													<p className="text-sm font-montserrat-semibold mb-2">
														Invite ID
													</p>
													<p className="text-xs font-mono bg-muted p-1 rounded">
														{inviteDetails.inviteId}
													</p>
												</div>
											</div>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="rates" className="pt-4">
									<div className="space-y-4">
										<div className="p-4 bg-muted/50 rounded-lg">
											<div className="flex items-center justify-between mb-4">
												<h3 className="font-montserrat-semibold">Base Hourly Rate</h3>
												<p className="text-lg font-montserrat-semibold text-green-600">
													{formatCurrency(
														inviteDetails.proposedRates.baseHourlyRate
													)}
												</p>
											</div>
											<Separator className="my-4" />
											<h3 className="font-montserrat-semibold mb-4">Shift Rate Breakdown</h3>
											<div className="space-y-4">
												{inviteDetails.proposedRates.shiftRates.map((rate: any, index: number) => (
													<div
														key={rate._id || index}
														className="flex items-center justify-between p-3 border border-border rounded-md"
													>
														<div>
															<p className="font-montserrat-semibold">
																{rate.rateTimeBandId?.name || `Shift Rate ${index + 1}`}
															</p>
															{rate.rateTimeBandId?.startTime && rate.rateTimeBandId?.endTime && (
																<p className="text-xs text-muted-foreground">
																	{rate.rateTimeBandId.startTime} - {rate.rateTimeBandId.endTime}
																</p>
															)}
															{rate.rateTimeBandId?.code && (
																<p className="text-xs text-muted-foreground">
																	Code: {rate.rateTimeBandId.code}
																</p>
															)}
															{!rate.rateTimeBandId && (
																<p className="text-xs text-muted-foreground">
																	Custom rate (no time band specified)
																</p>
															)}
														</div>
														<p className="text-lg font-montserrat-semibold text-green-600">
															{formatCurrency(rate.hourlyRate)}
														</p>
													</div>
												))}
											</div>
											
											{/* Add distance travel rate if available */}
											{inviteDetails.proposedRates.distanceTravelRate && (
												<div className="mt-4 pt-4 border-t border-border">
													<div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
														<div>
															<p className="font-montserrat-semibold">Distance Travel Rate</p>
															<p className="text-xs text-muted-foreground">
																Additional rate for travel distance
															</p>
														</div>
														<p className="text-lg font-montserrat-semibold text-blue-600">
															{formatCurrency(inviteDetails.proposedRates.distanceTravelRate)} per km
														</p>
													</div>
												</div>
											)}
										</div>
									</div>
								</TabsContent>

								<TabsContent value="notes" className="pt-4">
									<div className="space-y-4">
										<div className="p-4 bg-muted/50 rounded-lg">
											<h3 className="font-montserrat-semibold mb-2">Participant Notes</h3>
											<div className="p-4 bg-white rounded-md">
												<p className="text-sm">{inviteDetails.notes}</p>
											</div>
										</div>

										<div className="p-4 bg-muted/50 rounded-lg">
											<h3 className="font-montserrat-semibold mb-2">Administrative Notes</h3>
											<div className="p-4 bg-white rounded-md">
												<p className="text-sm text-muted-foreground italic">
													No administrative notes added yet.
												</p>
											</div>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-4">
							<CardTitle>Actions</CardTitle>
							<CardDescription>
								Options for managing this invitation
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-3">
								<Button
									variant="outline"
									className="text-primary hover:text-primary-700 hover:bg-primary-100 border-primary-200"
									onClick={handleMakeAvailable}
								>
									<Send className="h-4 w-4 mr-2" />
									Make Available
								</Button>

								<Button
									variant="outline"
									className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
									onClick={handleAccept}
								>
									<CheckCircle className="h-4 w-4 mr-2" />
									Accept Invitation
								</Button>

								<Button
									variant="outline"
									className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
									onClick={handleDecline}
								>
									<XCircle className="h-4 w-4 mr-2" />
									Decline Invitation
								</Button>

								<Button
									variant="outline"
									onClick={() =>
										navigate(`/admin/chat/${inviteDetails.workerId}`)
									}
								>
									<MessageCircle className="h-4 w-4 mr-2" />
									Open Chat
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar - 1/3 width on desktop */}
				<div className="space-y-6">
					<Card>
						<CardHeader className="pb-4">
							<CardTitle>Participant</CardTitle>
							<CardDescription>
								Details of the participant requesting connection
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-4 mb-6">
								<Avatar className="h-16 w-16">
									<AvatarFallback className="text-lg">
										{getAvatarPlaceholder(inviteDetails.participantName)}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="text-lg font-montserrat-semibold">
										{inviteDetails.participantName}
									</h3>
									<p className="text-sm text-muted-foreground">
										{inviteDetails.organizationName}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										ID: {inviteDetails.participantId}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-3">
								<Button
									variant="outline"
									size="sm"
									className="w-full justify-start"
								>
									<User className="h-4 w-4 mr-2" />
									View Participant Profile
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="w-full justify-start"
								>
									<FileText className="h-4 w-4 mr-2" />
									View Participant History
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-4">
							<CardTitle>Support Worker</CardTitle>
							<CardDescription>
								Details of the support worker selected for connection
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-4 mb-6">
								<Avatar className="h-16 w-16">
									<AvatarFallback className="text-lg">
										{getAvatarPlaceholder(inviteDetails.workerName)}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="text-lg font-montserrat-semibold">
										{inviteDetails.workerName}
									</h3>
									<p className="text-sm text-muted-foreground">
										Support Worker
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										ID: {inviteDetails.workerId}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-3">
								<Button
									variant="outline"
									size="sm"
									className="w-full justify-start"
								>
									<User className="h-4 w-4 mr-2" />
									View Worker Profile
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="w-full justify-start"
								>
									<Clock className="h-4 w-4 mr-2" />
									View Availability
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="w-full justify-start"
									onClick={() =>
										navigate(`/admin/chat/${inviteDetails.workerId}`)
									}
								>
									<MessageCircle className="h-4 w-4 mr-2" />
									Open Chat
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Invite Acceptance Form Modal */}
			{inviteDetails && (
				<InviteAcceptanceForm
					invite={inviteDetails}
					isOpen={isAcceptanceFormOpen}
					onClose={() => setIsAcceptanceFormOpen(false)}
					onSuccess={handleAcceptanceSuccess}
				/>
			)}

			{/* Invite Decline Form Modal */}
			{inviteDetails && (
				<InviteDeclineForm
					invite={inviteDetails}
					isOpen={isDeclineFormOpen}
					onClose={() => setIsDeclineFormOpen(false)}
					onSuccess={handleDeclineSuccess}
				/>
			)}
		</div>
	);
}
