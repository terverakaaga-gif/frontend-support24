import { useState, useMemo } from "react";
import { Search, X, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ISearchSupportWorkers } from "@/api/services/participantService";
import {
	useMyOrganizations,
	useSendInvitationToSupportWorkers,
	useSupportWorkers,
} from "@/hooks/useParticipant";
import { IInvitationRequest } from "@/entities/Invitation";

interface SearchSupportWorkersProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SearchSupportWorkers({
	open,
	onOpenChange,
}: SearchSupportWorkersProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [pendingInvites, setPendingInvites] = useState<Record<string, boolean>>(
		{}
	);
	const [alertOpen, setAlertOpen] = useState(false);
	const [currentInvite, setCurrentInvite] = useState<{
		id: string;
		name: string;
	} | null>(null);

	const navigate = useNavigate();

	// Fetch support workers from API
	const {
		data: supportWorkersData,
		isLoading,
		isError,
		error,
	} = useSupportWorkers();

	const { data: organizations } = useMyOrganizations();

	// Mutation for sending invitations
	// const sendInvitationMutation = useSendInvitationToSupportWorkers(
	// 	organizations[0]._id
	// );

	// Filter workers based on search query
	const searchResults = useMemo(() => {
		if (!supportWorkersData?.workers) return [];

		if (!searchQuery.trim()) {
			return supportWorkersData.workers;
		}

		return supportWorkersData.workers.filter((worker) => {
			const fullName = `${worker.firstName} ${worker.lastName}`.toLowerCase();
			const query = searchQuery.toLowerCase();

			return (
				fullName.includes(query) ||
				worker.serviceAreas.some((area) =>
					area.toLowerCase().includes(query)
				) ||
				worker.skills.some((skill) => skill.toLowerCase().includes(query)) ||
				worker.languages.some((language) =>
					language.toLowerCase().includes(query)
				)
			);
		});
	}, [supportWorkersData?.workers, searchQuery]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// Search is handled by the useMemo above
	};

	const sendInvite = async (workerId: string, workerName: string) => {
		try {
			// Create invitation data
			const inviteData: IInvitationRequest = {
				notes: `Hi ${workerName}`,
				proposedRates: {
					baseHourlyRate: 100,
					distanceTravelRate: 100,
					shiftRates: [{ hourlyRate: 100, rateTimeBandId: "" }],
				},
				workerId: workerId,
			};

			// Use the mutation to send the invitation
			// await sendInvitationMutation.mutateAsync(inviteData);

			// Update local state to show pending status
			setPendingInvites((prev) => ({ ...prev, [workerId]: true }));

			// Set current invite for alert dialog
			setCurrentInvite({ id: workerId, name: workerName });
			setAlertOpen(true);

			toast.success(`Invitation sent to ${workerName}!`);
		} catch (error) {
			console.error("Failed to send invitation:", error);
			toast.error("Failed to send invitation. Please try again.");
		}
	};

	const handleViewProfile = (workerId: string) => {
		onOpenChange(false); // Close the search dialog
		navigate(`/support-worker/profile/${workerId}`);
	};

	const getWorkerInitials = (worker: ISearchSupportWorkers) => {
		return `${worker.firstName.charAt(0)}${worker.lastName.charAt(
			0
		)}`.toUpperCase();
	};

	const getWorkerFullName = (worker: ISearchSupportWorkers) => {
		return `${worker.firstName} ${worker.lastName}`;
	};

	// const renderSkillBadge = (skill: string) => {
	// 	const skillMap: Record<string, { label: string; color: string }> = {
	// 		"personal-care": {
	// 			label: "Personal Care",
	// 			color: "bg-primary/10 text-primary border-primary/20",
	// 		},
	// 		transport: {
	// 			label: "Transport",
	// 			color: "bg-blue-50 text-blue-700 border-blue-200",
	// 		},
	// 		therapy: {
	// 			label: "Therapy",
	// 			color: "bg-purple-50 text-purple-700 border-purple-200",
	// 		},
	// 		"social-support": {
	// 			label: "Social Support",
	// 			color: "bg-green-50 text-green-700 border-green-200",
	// 		},
	// 		household: {
	// 			label: "Household",
	// 			color: "bg-amber-50 text-amber-700 border-amber-200",
	// 		},
	// 		communication: {
	// 			label: "Communication",
	// 			color: "bg-indigo-50 text-indigo-700 border-indigo-200",
	// 		},
	// 		"behavior-support": {
	// 			label: "Behavior Support",
	// 			color: "bg-red-50 text-red-700 border-red-200",
	// 		},
	// 		"medication-management": {
	// 			label: "Medication",
	// 			color: "bg-teal-50 text-teal-700 border-teal-200",
	// 		},
	// 		"meal-preparation": {
	// 			label: "Meal Prep",
	// 			color: "bg-orange-50 text-orange-700 border-orange-200",
	// 		},
	// 		"first-aid": {
	// 			label: "First Aid",
	// 			color: "bg-emerald-50 text-emerald-700 border-emerald-200",
	// 		},
	// 	};

	// 	const normalizedSkill =
	// 		skill !== "" ? skill.toLowerCase().replace(/\s+/g, "-") : "n/a";
	// 	const { label, color } = skillMap[normalizedSkill] || {
	// 		label: skill,
	// 		color: "bg-gray-50 text-gray-700 border-gray-200",
	// 	};

	// 	return (
	// 		<span
	// 			key={skill}
	// 			className={`text-xs px-2 py-1 rounded-full border ${color} inline-block mr-1 mb-1 font-medium`}
	// 		>
	// 			{label}
	// 		</span>
	// 	);
	// };

	// Loading state
	if (isLoading) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-primary/10">
					<DialogHeader className="border-b border-primary/10 pb-4">
						<DialogTitle className="text-xl font-semibold text-primary">
							Find Support Workers
						</DialogTitle>
					</DialogHeader>
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<span className="ml-2 text-primary">
							Loading support workers...
						</span>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	// Error state
	if (isError) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-primary/10">
					<DialogHeader className="border-b border-primary/10 pb-4">
						<DialogTitle className="text-xl font-semibold text-primary">
							Find Support Workers
						</DialogTitle>
					</DialogHeader>
					<div className="flex items-center justify-center py-12">
						<div className="text-center">
							<p className="text-red-600 font-medium">
								Failed to load support workers
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								{error instanceof Error
									? error.message
									: "Please try again later"}
							</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-primary/10">
					<DialogHeader className="border-b border-primary/10 pb-4">
						<DialogTitle className="text-xl font-semibold text-primary">
							Find Support Workers
						</DialogTitle>
						<DialogDescription className="text-muted-foreground">
							Search for qualified support workers across Australia to add to
							your care network.
						</DialogDescription>
					</DialogHeader>

					<div className="py-6">
						<form onSubmit={handleSearch} className="flex space-x-3">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/60" />
								<Input
									type="search"
									placeholder="Search by name, location, or skills..."
									className="pl-10 border-primary/20 focus:border-primary focus-visible:ring-primary/20"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
								{searchQuery && (
									<button
										type="button"
										onClick={() => setSearchQuery("")}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/60 hover:text-primary transition-colors"
									>
										<X className="h-4 w-4" />
									</button>
								)}
							</div>
							<Button
								type="submit"
								className="bg-primary hover:bg-primary/90 px-6"
							>
								Search
							</Button>
						</form>
					</div>

					<div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
						{searchResults.length === 0 ? (
							<div className="text-center py-12">
								<div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
									<Search className="w-8 h-8 text-primary/60" />
								</div>
								<p className="text-muted-foreground text-lg">
									{searchQuery.trim()
										? "No support workers found matching your search."
										: "No support workers available at the moment."}
								</p>
								<p className="text-sm text-muted-foreground mt-1">
									{searchQuery.trim()
										? "Try adjusting your search terms."
										: "Please check back later."}
								</p>
							</div>
						) : (
							searchResults.map((worker) => (
								<div
									key={worker._id}
									className="border border-primary/10 rounded-lg p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200 bg-white"
								>
									<div className="flex flex-col md:flex-row gap-4">
										<div className="flex-shrink-0">
											<Avatar className="h-16 w-16 border-2 border-primary/10">
												<AvatarFallback className="bg-primary text-white text-xl font-semibold">
													{getWorkerInitials(worker)}
												</AvatarFallback>
											</Avatar>
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
												<div className="flex-1">
													<h3 className="font-semibold text-lg text-gray-900">
														{getWorkerFullName(worker)}
													</h3>
													<p className="text-sm text-muted-foreground mb-1">
														{worker.serviceAreas.join(", ")}
													</p>
													<div className="flex items-center gap-3 text-sm mb-3">
														<span className="font-semibold text-primary">
															${worker.hourlyRate.baseRate}/hr
														</span>
														<span className="text-muted-foreground">•</span>
														<span className="text-muted-foreground">
															⭐ {worker.ratings.average.toFixed(1)} (
															{worker.ratings.count} reviews)
														</span>
														{worker.verificationStatus.identityVerified && (
															<>
																<span className="text-muted-foreground">•</span>
																<span className="text-green-600 text-xs font-medium">
																	✓ Verified
																</span>
															</>
														)}
													</div>

													<div className="mb-3">
														<p className="text-sm text-gray-600 mb-1">
															<strong>Languages:</strong>{" "}
															{worker.languages.join(", ")}
														</p>
													</div>

													<div className="flex flex-wrap gap-1">
														{worker.skills &&
															worker.skills.length > 0 &&
															worker.skills.slice(0, 3).map((skill) => null)}
														{worker.skills.length > 3 && (
															<span className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700 border-gray-200 inline-block font-medium">
																+{worker.skills.length - 3} more
															</span>
														)}
													</div>
												</div>

												<div className="flex gap-2 md:flex-col lg:flex-row md:items-end lg:items-center">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleViewProfile(worker._id)}
														className="border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40"
													>
														View Profile
													</Button>

													{/* Show different button states based on worker status */}
													{worker.isInUserOrganization ? (
														<Button
															size="sm"
															variant="outline"
															disabled
															className="bg-blue-50 border-blue-200 text-blue-700"
														>
															<Check size={16} className="mr-1" />
															In Network
														</Button>
													) : pendingInvites[worker._id] ? (
														<Button
															size="sm"
															variant="outline"
															disabled
															className="bg-green-50 border-green-200 text-green-700"
														>
															<Check size={16} className="mr-1" />
															Pending
														</Button>
													) : (
														<Button
															size="sm"
															onClick={() =>
																sendInvite(
																	worker._id,
																	getWorkerFullName(worker)
																)
															}
															// disabled={sendInvitationMutation.isPending}
															className="bg-primary hover:bg-primary/90"
														>
															{isLoading ? (
																<>
																	<Loader2 className="h-4 w-4 mr-1 animate-spin" />
																	Inviting...
																</>
															) : (
																"Invite"
															)}
														</Button>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* Alert Dialog for successful invite */}
			<AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
				<AlertDialogContent className="border-primary/10">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-primary">
							Invitation Sent
						</AlertDialogTitle>
						<AlertDialogDescription>
							{currentInvite && (
								<>
									Your invitation has been sent to{" "}
									<span className="font-medium text-primary">
										{currentInvite.name}
									</span>
									. You will be notified when they accept your request.
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction className="bg-primary hover:bg-primary/90">
							OK
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
