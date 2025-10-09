/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	MessageCircle,
	ChevronDown,
	Filter,
	Search,
	RefreshCw,
	Info,
	Send,
	Calendar,
	DollarSign,
	Users,
	Clock,
	Building,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useGetFlattenedInvites } from "@/hooks/useInviteHooks";
import { FlattenedInvite } from "@/entities/Invitation";

// Helper function to generate an avatar placeholder
const getAvatarPlaceholder = (name: string): string => {
	const parts = name.split(" ");
	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`;
	}
	return name.substring(0, 2).toUpperCase();
};

// Format currency
const formatCurrency = (amount: number) => {
	return `$${amount}`;
};

export function InviteManagement() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string | null>(null);

	const navigate = useNavigate();

	// Fetch data using the hook
	const {
		data: flattenedInvites = [],
		isLoading,
		error,
		refetch,
	} = useGetFlattenedInvites();

	// Filter invitations based on search query and status filter
	const filteredInvitations = flattenedInvites.filter((invite) => {
		const searchLower = searchQuery.toLowerCase();
		const matchesSearch =
			invite.participantName.toLowerCase().includes(searchLower) ||
			invite.workerName.toLowerCase().includes(searchLower) ||
			invite.organizationName.toLowerCase().includes(searchLower);

		const matchesStatus = statusFilter ? invite.status === statusFilter : true;

		return matchesSearch && matchesStatus;
	});

	const handleMakeInvitationAvailable = (inviteId: string) => {
		// Just update the UI state to reflect action was taken
		toast({
			title: "Invitation Made Available",
			description: `Invitation is now available to the support worker`,
		});
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "pending":
				return (
					<Badge
						variant="outline"
						className="bg-amber-50 text-amber-700 border-amber-200 font-medium"
					>
						<Clock className="w-3 h-3 mr-1" />
						Pending
					</Badge>
				);
			case "accepted":
				return (
					<Badge
						variant="outline"
						className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
					>
						<Users className="w-3 h-3 mr-1" />
						Accepted
					</Badge>
				);
			case "declined":
				return (
					<Badge
						variant="outline"
						className="bg-red-50 text-red-700 border-red-200 font-medium"
					>
						Declined
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header Section */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-montserrat-bold tracking-tight text-guardian">
						Connection Invitations
					</h1>
					<p className="text-muted-foreground mt-2">
						Manage participant-to-support worker connection requests and monitor
						invitation status
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Badge
						variant="outline"
						className="text-guardian border-guardian/20 bg-guardian/5"
					>
						Total: {flattenedInvites.length} invitations
					</Badge>
				</div>
			</div>

			{/* Filters and Search */}
			<Card className="border-guardian/10 shadow-sm">
				<CardContent className="p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex items-center gap-4">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search by participant, worker, or organization..."
									className="w-[300px] pl-10 border-guardian/20 focus:border-guardian"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="border-guardian/20 hover:bg-guardian/5"
									>
										<Filter className="h-4 w-4 mr-2" />
										{statusFilter ? `Status: ${statusFilter}` : "All statuses"}
										<ChevronDown className="h-4 w-4 ml-2" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem onClick={() => setStatusFilter(null)}>
										All statuses
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setStatusFilter("pending")}>
										Pending
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setStatusFilter("accepted")}>
										Accepted
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setStatusFilter("declined")}>
										Declined
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<Button
							variant="outline"
							onClick={() => refetch()}
							className="border-guardian/20 hover:bg-guardian/5"
						>
							<RefreshCw className="h-4 w-4 mr-2" />
							Refresh Data
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Main Table */}
			<Card className="border-guardian/10 shadow-sm overflow-hidden">
				<CardContent className="p-0">
					{/* Loading State */}
					{isLoading ? (
						<div className="p-6">
							<div className="space-y-4">
								{Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className="flex items-center space-x-4">
										<Skeleton className="h-12 w-12 rounded-full" />
										<div className="space-y-2 flex-1">
											<Skeleton className="h-4 w-1/4" />
											<Skeleton className="h-4 w-1/2" />
										</div>
										<div className="space-y-2">
											<Skeleton className="h-4 w-20" />
											<Skeleton className="h-4 w-16" />
										</div>
										<Skeleton className="h-8 w-24" />
									</div>
								))}
							</div>
						</div>
					) : error ? (
						<div className="p-6 text-center">
							<div className="text-red-600">
								<p>Error loading invitations. Please try again.</p>
								<Button
									variant="outline"
									onClick={() => refetch()}
									className="mt-4"
								>
									<RefreshCw className="h-4 w-4 mr-2" />
									Retry
								</Button>
							</div>
						</div>
					) : (
						<Table>
							<TableHeader className="bg-guardian/5">
								<TableRow className="border-guardian/10">
									<TableHead className="font-montserrat-semibold text-guardian">
										<div className="flex items-center gap-2">
											<Users className="w-4 h-4" />
											Participant
										</div>
									</TableHead>
									<TableHead className="font-montserrat-semibold text-guardian">
										<div className="flex items-center gap-2">
											<Users className="w-4 h-4" />
											Support Worker
										</div>
									</TableHead>
									<TableHead className="font-montserrat-semibold text-guardian">
										<div className="flex items-center gap-2">
											<Clock className="w-4 h-4" />
											Status
										</div>
									</TableHead>
									<TableHead className="font-montserrat-semibold text-guardian">
										<div className="flex items-center gap-2">
											<Calendar className="w-4 h-4" />
											Date
										</div>
									</TableHead>
									<TableHead className="text-right font-montserrat-semibold text-guardian">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredInvitations.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center py-12 text-muted-foreground"
										>
											<div className="flex flex-col items-center gap-2">
												<Users className="w-8 h-8 text-muted-foreground/50" />
												<span>No invitations found</span>
												<span className="text-sm">
													Try adjusting your search or filters
												</span>
											</div>
										</TableCell>
									</TableRow>
								) : (
									filteredInvitations.map((invitation, index) => (
										<TableRow
											key={invitation.inviteId}
											className={`hover:bg-guardian/5 transition-colors ${
												index % 2 === 0 ? "bg-gray-100/50" : "bg-white"
											}`}
										>
											<TableCell className="py-4">
												<div className="flex items-center gap-3">
													<Avatar className="border-2 border-guardian/10">
														<AvatarFallback className="bg-guardian/10 text-guardian font-medium">
															{getAvatarPlaceholder(invitation.participantName)}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-medium text-gray-900">
															{invitation.participantName}
														</div>
														<div className="flex items-center gap-1 text-sm text-muted-foreground">
															<Building className="w-3 h-3" />
															{invitation.organizationName}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell className="py-4">
												<div className="flex items-center gap-3">
													<Avatar className="border-2 border-guardian/10">
														<AvatarFallback className="bg-guardian/10 text-guardian font-medium">
															{getAvatarPlaceholder(invitation.workerName)}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-medium text-gray-900">
															{invitation.workerName}
														</div>
														<div className="flex items-center gap-1 text-sm text-muted-foreground">
															<DollarSign className="w-3 h-3" />
															Base Rate:{" "}
															{formatCurrency(
																invitation.proposedRates.baseHourlyRate
															)}
															/hr
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell className="py-4">
												{getStatusBadge(invitation.status)}
											</TableCell>
											<TableCell className="py-4">
												<div className="text-sm">
													<div className="font-medium">
														{new Date(invitation.inviteDate).toLocaleDateString(
															"en-AU",
															{
																year: "numeric",
																month: "short",
																day: "numeric",
															}
														)}
													</div>
													<div className="text-muted-foreground">
														{new Date(invitation.inviteDate).toLocaleTimeString(
															"en-AU",
															{
																hour: "2-digit",
																minute: "2-digit",
															}
														)}
													</div>
												</div>
											</TableCell>
											<TableCell className="text-right py-4">
												<div className="flex justify-end gap-2">
													<Link
														to={`/admin/invites/${invitation.inviteId}/details`}
													>
														<Button
															variant="outline"
															size="sm"
															className="h-8 border-guardian/20 hover:bg-guardian/5 hover:border-guardian/40"
														>
															<Info className="h-3 w-3 mr-1" />
															Details
														</Button>
													</Link>

													{/* <Link to={`/admin/chat/${invitation.workerId}`}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 border-guardian/20 hover:bg-guardian/5 hover:border-guardian/40"
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </Link> */}

													{/* {invitation.status === "pending" && (
                          <Button
                            size="sm"
                            className="h-8 bg-guardian hover:bg-guardian/90 text-white"
                            onClick={() => handleMakeInvitationAvailable(invitation.inviteId)}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Make Available
                          </Button>
                        )} */}
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
