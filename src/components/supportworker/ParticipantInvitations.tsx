import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	MessageCircle,
	Calendar,
	UserCheck,
	Loader2,
	Mail,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
	organizationService,
	type Invite,
	type SupportWorker,
} from "@/api/services/organizationService";

export function ParticipantInvitations() {
	const [invites, setInvites] = useState<Invite[]>([]);
	const [connections, setConnections] = useState<SupportWorker[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [processingInviteId, setProcessingInviteId] = useState<string | null>(
		null
	);

	// Load worker invites and connections on component mount
	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			setIsLoading(true);
			// Load worker's invites and existing connections
			const [workerInvites] = await Promise.all([
				organizationService.getWorkerInvites(),
				// Note: You might need to add an API endpoint to get worker's existing connections
				// For now, we'll just show invites
			]);

			setInvites(workerInvites);
		} catch (error) {
			console.error("Failed to load invitations:", error);
			toast({
				title: "Error",
				description: "Failed to load invitations. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleAcceptInvitation = async (inviteId: string) => {
		try {
			setProcessingInviteId(inviteId);

			const invite = invites.find((inv) => inv.id === inviteId);
			if (!invite) return;

			// Process the invite as approved
			await organizationService.processInvite(invite.organizationId, inviteId, {
				action: "approve",
			});

			// Update local state
			setInvites((prev) =>
				prev.map((inv) =>
					inv.id === inviteId
						? {
								...inv,
								status: "approved" as const,
								updatedAt: new Date().toISOString(),
						  }
						: inv
				)
			);

			toast({
				title: "Invitation Accepted",
				description: "You are now connected with this participant",
			});
		} catch (error) {
			console.error("Failed to accept invitation:", error);
			toast({
				title: "Error",
				description: "Failed to accept invitation. Please try again.",
				variant: "destructive",
			});
		} finally {
			setProcessingInviteId(null);
		}
	};

	const handleRejectInvitation = async (inviteId: string) => {
		try {
			setProcessingInviteId(inviteId);

			const invite = invites.find((inv) => inv.id === inviteId);
			if (!invite) return;

			// Process the invite as rejected
			await organizationService.processInvite(invite.organizationId, inviteId, {
				action: "reject",
			});

			// Remove from local state
			setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));

			toast({
				title: "Invitation Rejected",
				description: "The invitation has been declined",
			});
		} catch (error) {
			console.error("Failed to reject invitation:", error);
			toast({
				title: "Error",
				description: "Failed to reject invitation. Please try again.",
				variant: "destructive",
			});
		} finally {
			setProcessingInviteId(null);
		}
	};

	const pendingInvites =
		invites.length > 0 ? invites.filter((inv) => inv.status === "pending") : [];
	const acceptedInvites =
		invites.length > 0
			? invites.filter((inv) => inv.status === "approved")
			: [];

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>My Network</CardTitle>
					<CardDescription>
						Manage your connections with participants
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin mr-2" />
						<span>Loading invitations...</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>My Network</CardTitle>
				<CardDescription>
					Manage your connections with participants
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Pending Invitations Section */}
				<div>
					<h3 className="text-lg font-medium mb-4">Pending Invitations</h3>
					{pendingInvites.length === 0 ? (
						<div className="text-center py-8 bg-muted rounded-md">
							<Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<p className="text-muted-foreground font-medium">
								No pending invitations
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								New invitations from participants will appear here
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Organization</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Message</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{pendingInvites.map((invite) => (
									<TableRow key={invite.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar>
													<AvatarFallback>
														{invite.organizationId
															.substring(0, 2)
															.toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="font-medium">
														{invite.workerEmail}
													</div>
													<div className="text-sm text-muted-foreground">
														Organization ID: {invite.organizationId}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											{new Date(invite.createdAt).toLocaleDateString("en-AU", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</TableCell>
										<TableCell>
											<div className="max-w-[300px] truncate">
												{invite.message || "No message"}
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="outline">{invite.status}</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="default"
													size="sm"
													disabled={processingInviteId === invite.id}
													onClick={() => handleAcceptInvitation(invite.id)}
												>
													{processingInviteId === invite.id ? (
														<Loader2 className="h-4 w-4 mr-2 animate-spin" />
													) : (
														<UserCheck className="h-4 w-4 mr-2" />
													)}
													Accept
												</Button>
												<Button
													variant="outline"
													size="sm"
													disabled={processingInviteId === invite.id}
													onClick={() => handleRejectInvitation(invite.id)}
												>
													Reject
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>

				{/* Accepted Connections Section */}
				<div>
					<h3 className="text-lg font-medium mb-4">My Connections</h3>
					{acceptedInvites.length === 0 ? (
						<div className="text-center py-8 bg-muted rounded-md">
							<UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<p className="text-muted-foreground font-medium">
								No active connections
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								Accept invitations to start building your network
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{acceptedInvites.map((invite) => (
								<Card key={invite.id} className="overflow-hidden">
									<div className="p-4">
										<div className="flex items-start gap-4">
											<Avatar className="h-16 w-16">
												<AvatarFallback className="text-lg">
													{invite.organizationId.substring(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<h3 className="font-montserrat-semibold text-lg">
													{invite.workerEmail}
												</h3>
												<p className="text-sm text-muted-foreground">
													Connected since{" "}
													{new Date(invite.updatedAt).toLocaleDateString(
														"en-AU",
														{
															year: "numeric",
															month: "short",
															day: "numeric",
														}
													)}
												</p>
												{invite.message && (
													<p className="text-sm text-muted-foreground mt-1 line-clamp-2">
														{invite.message}
													</p>
												)}
												<div className="flex gap-2 mt-3">
													<Button variant="secondary" size="sm">
														<MessageCircle className="h-4 w-4 mr-2" />
														Message
													</Button>
													<Button variant="secondary" size="sm">
														<Calendar className="h-4 w-4 mr-2" />
														View Schedule
													</Button>
												</div>
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
