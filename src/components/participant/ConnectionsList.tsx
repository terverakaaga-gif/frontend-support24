import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SupportWorker } from "@/entities/SupportWorker";
import { getUserFullName } from "@/entities/User";
import { useMyOrganizations } from "@/hooks/useParticipant";
import { Calendar, ChatRound, Magnifer } from "@solar-icons/react";

export function ConnectionsList() {
	const { data: organizations, isSuccess } = useMyOrganizations();
	const connections = useMemo(() => {
		if (isSuccess) {
			return organizations[0].workers;
		}
		return [];
	}, [isSuccess, organizations]);

	const [searchQuery, setSearchQuery] = useState("");

	const filteredConnections = connections.filter((connection) => {
		const searchLower = searchQuery.toLowerCase();
		return (
			connection.workerId.firstName.toLowerCase().includes(searchLower) ||
			connection.workerId.lastName.toLowerCase().includes(searchLower) ||
			connection.workerId.email.toLowerCase().includes(searchLower)
		);
	});

	const formatSkills = (skills: string[] | undefined) => {
		if (!skills || skills.length === 0) return "No skills listed";

		return skills.map((skill) => {
			const formattedSkill = skill
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

			return (
				<Badge key={skill} variant="outline" className="mr-1 mb-1">
					{formattedSkill}
				</Badge>
			);
		});
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-center">
					<div>
						<CardTitle>My Support Worker Network</CardTitle>
						<CardDescription>
							View and interact with your connected support workers
						</CardDescription>
					</div>
					<div className="relative">
						<Magnifer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Magnifer network..."
							className="pl-9 w-[250px]"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{filteredConnections.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-muted-foreground">No connections found</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{filteredConnections.map((connection) => (
							<Card key={connection._id} className="overflow-hidden">
								<div className="flex flex-col h-full">
									<div className="flex items-start p-4 gap-4">
										<Avatar className="h-16 w-16">
											<AvatarImage src={connection.workerId.profileImage} />
											<AvatarFallback className="text-lg">
												{connection.workerId.firstName.charAt(0)}
												{connection.workerId.lastName.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<h3 className="font-montserrat-semibold text-lg">
												{getUserFullName(connection.workerId)}
											</h3>
											{/* <div className="flex flex-wrap mt-2">
												{formatSkills(connection.skills)}
											</div> */}
										</div>
									</div>
									{/* <div className="p-4 pt-0">
										<p className="text-sm text-muted-foreground mb-3">
											{connection.experience && connection.experience[0]
												? `${connection.experience[0].title} at ${connection.experience[0].organization}`
												: "No experience information available"}
										</p>
										<div className="text-sm">
											<div className="mt-1">
												<span className="font-montserrat-semibold">Languages:</span>{" "}
												{connection.languages
													? connection.languages.join(", ")
													: "Not specified"}
											</div>
											<div className="mt-1">
												<span className="font-montserrat-semibold">Base Rate:</span> $
												{connection.hourlyRate.baseRate}/hr
											</div>
										</div>
									</div> */}
									<div className="flex justify-between items-center p-4 mt-auto">
										<Link to={`/support-worker/profile/${connection._id}`}>
											<Button variant="outline" size="sm">
												View Profile
											</Button>
										</Link>
										<div className="flex gap-2">
											<Button variant="secondary" size="sm">
												<ChatRound className="h-4 w-4 mr-2" />
												Message
											</Button>
											<Button variant="secondary" size="sm">
												<Calendar className="h-4 w-4 mr-2" />
												Book
											</Button>
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
