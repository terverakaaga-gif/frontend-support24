import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	MapPin,
	Clock,
	Star,
	Languages,
	Workflow,
	User,
	ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSupportWorkerProfile } from "@/hooks/useParticipant";
import { useMyOrganizations } from "@/hooks/useParticipant";
import { Loader2 } from "lucide-react";
import { SupportWorker } from "@/types/user.types";

export default function SupportWorkerProfilePreview() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [isInviteDisabled, setIsInviteDisabled] = useState(false);

	const {
		data: workerProfile,
		isLoading,
		isError,
		error,
	} = useSupportWorkerProfile(id || "", {
		enabled: !!id,
		queryKey: ["supportWorkerProfile", id],
	});

	const { data: organizations } = useMyOrganizations();

	useEffect(() => {
		console.log("Profile API Response:", {
			workerProfile,
			isLoading,
			isError,
			error,
		});
	}, [workerProfile, isLoading, isError, error]);

	useEffect(() => {
		if (workerProfile && organizations) {
			const isInOrganization = organizations.some((org) =>
				org.workers?.some((member) => member._id === workerProfile.worker._id)
			);
			setIsInviteDisabled(isInOrganization);
		}
	}, [workerProfile, organizations]);

	const getWorkerInitials = (worker: SupportWorker) => {
		return `${worker.firstName.charAt(0)}${worker.lastName.charAt(
			0
		)}`.toUpperCase();
	};

	const getWorkerFullName = (worker: SupportWorker) => {
		return `${worker.firstName} ${worker.lastName}`;
	};

	if (isLoading) {
		return (
			<div className="container mx-auto py-8">
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<span className="ml-2 text-primary">Loading profile...</span>
				</div>
			</div>
		);
	}

	if (isError || !workerProfile) {
		return (
			<div className="container mx-auto py-8">
				<div className="text-center py-12">
					<p className="text-red-600 font-medium">Failed to load profile</p>
					<p className="text-sm text-muted-foreground mt-1">
						{error instanceof Error ? error.message : "Please try again later"}
					</p>
					<Button onClick={() => navigate(-1)} className="mt-4">
						Go Back
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
				<ArrowLeft className="h-4 w-4 mr-2" />
				Back
			</Button>

			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex items-center gap-6 mb-6">
					<Avatar className="h-24 w-24">
						<AvatarFallback className="text-2xl">
							{getWorkerInitials(workerProfile.worker)}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<h1 className="text-3xl font-bold">
							{getWorkerFullName(workerProfile.worker)}
						</h1>
						<div className="flex items-center gap-2 text-muted-foreground mt-1">
							<MapPin className="h-4 w-4" />
							<span>
								{workerProfile.worker.serviceAreas?.join(", ") ||
									"No location specified"}
							</span>
						</div>
						<div className="flex items-center gap-2 mt-2">
							<Star className="h-4 w-4 text-yellow-500 fill-current" />
							<span className="font-medium">
								{workerProfile.worker.ratings?.average?.toFixed(1) || "0.0"} (
								{workerProfile.worker.ratings?.count || 0} reviews)
							</span>
						</div>
					</div>
					<Button
						onClick={() =>
							navigate(`/participant/invite/${workerProfile.worker._id}`)
						}
						disabled={isInviteDisabled}
						className="bg-primary hover:bg-primary/90"
					>
						{isInviteDisabled
							? "Already in Organization"
							: "Invite to Organization"}
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div>
							<h3 className="font-semibold flex items-center gap-2 mb-2">
								<User className="h-4 w-4" />
								About
							</h3>
							<p className="text-muted-foreground">
								{workerProfile.worker.bio || "No bio available"}
							</p>
						</div>

						<div>
							<h3 className="font-semibold flex items-center gap-2 mb-2">
								<Languages className="h-4 w-4" />
								Languages
							</h3>
							<div className="flex flex-wrap gap-2">
								{workerProfile.worker.languages?.map((language: string) => (
									<span
										key={language}
										className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
									>
										{language}
									</span>
								)) || "No languages specified"}
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<h3 className="font-semibold flex items-center gap-2 mb-2">
								<Workflow className="h-4 w-4" />
								Workflow & Specializations
							</h3>
							<div className="flex flex-wrap gap-2">
								{workerProfile.worker.skills?.map((skill) => (
									<span
										key={skill._id}
										className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
									>
										{skill.name}
									</span>
								)) || "No skills specified"}
							</div>
						</div>

						<div>
							<h3 className="font-semibold flex items-center gap-2 mb-2">
								<Clock className="h-4 w-4" />
								Rates
							</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Base Rate:</span>
									<span className="font-medium">
										${workerProfile.worker.hourlyRate || "0"}/hr
									</span>
								</div>
								{workerProfile.worker.shiftRates?.map((rate, index: number) => (
									<div key={index} className="flex justify-between">
										<span className="text-muted-foreground">
											{rate.rateTimeBandId.name}:
										</span>
										<span className="font-medium">${rate.hourlyRate}/hr</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
