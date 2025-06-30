import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
	Search,
	Plus,
	Users,
	MessageCircle,
	MoreVertical,
	Pin,
	Archive,
	Star,
	Circle,
	Filter,
	SortDesc,
	Phone,
	Video,
	Bell,
	Settings,
	UserPlus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useChat from "@/hooks/useChat";
import { tokenStorage } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { organizationService } from "./OrganizationsPage";

// Mock data for conversations
const mockConversations = [
	{
		id: "1",
		type: "individual",
		participant: {
			name: "Olivia Thompson",
			email: "olivia.thompson@example.com.au",
			avatar: "https://i.pravatar.cc/150?img=5",
			role: "Support Worker",
			isOnline: true,
		},
		lastMessage: {
			content: "Thanks for the update! I'll check it out right away.",
			timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
			sender: "participant",
			unread: true,
		},
		isPinned: true,
		unreadCount: 2,
	},
	{
		id: "2",
		type: "individual",
		participant: {
			name: "Marcus Chen",
			email: "marcus.chen@example.com.au",
			avatar: "https://i.pravatar.cc/150?img=8",
			role: "Support Worker",
			isOnline: false,
			lastSeen: "2 hours ago",
		},
		lastMessage: {
			content: "I've completed the assessment report for the new client.",
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
			sender: "participant",
			unread: false,
		},
		isPinned: false,
		unreadCount: 0,
	},
	{
		id: "3",
		type: "group",
		groupName: "Support Team Alpha",
		participants: [
			{ name: "Sarah Williams", avatar: "https://i.pravatar.cc/150?img=9" },
			{ name: "David Brown", avatar: "https://i.pravatar.cc/150?img=7" },
			{ name: "Emily Davis", avatar: "https://i.pravatar.cc/150?img=6" },
		],
		lastMessage: {
			content: "Meeting scheduled for tomorrow at 2 PM",
			timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
			sender: "Sarah Williams",
			unread: true,
		},
		isPinned: false,
		unreadCount: 5,
	},
	{
		id: "4",
		type: "individual",
		participant: {
			name: "Jessica Rodriguez",
			email: "jessica.rodriguez@example.com.au",
			avatar: "https://i.pravatar.cc/150?img=10",
			role: "Care Coordinator",
			isOnline: true,
		},
		lastMessage: {
			content:
				"The new care plan has been approved and is ready for implementation.",
			timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
			sender: "admin",
			unread: false,
		},
		isPinned: false,
		unreadCount: 0,
	},
	{
		id: "5",
		type: "group",
		groupName: "Emergency Response Team",
		participants: [
			{ name: "Michael Johnson", avatar: "https://i.pravatar.cc/150?img=11" },
			{ name: "Lisa Anderson", avatar: "https://i.pravatar.cc/150?img=12" },
			{ name: "Robert Wilson", avatar: "https://i.pravatar.cc/150?img=13" },
			{ name: "Amanda Taylor", avatar: "https://i.pravatar.cc/150?img=14" },
		],
		lastMessage: {
			content: "All clear on the emergency response protocol review",
			timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
			sender: "Michael Johnson",
			unread: false,
		},
		isPinned: true,
		unreadCount: 0,
	},
];

export default function ChatsList() {
	const { user } = useAuth();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilter, setSelectedFilter] = useState("all");
	const [conversations, setConversations] = useState(mockConversations);
	const {
		data: organizations = [],
		isLoading: loadingOrgs,
		error: orgsError,
		refetch,
	} = useQuery({
		queryKey: ["support-worker-organizations"],
		queryFn: () => organizationService.getOrganizations(),
	});

	console.log("Organizations:", organizations);

	const handleChatClick = (chatId: string) => {
		// In a real app, this would navigate to /admin/chat/:id
		console.log(`Navigate to chat: ${chatId}`);
	};

	const handleNewChat = () => {
		console.log("Create new individual chat");
	};

	const handleNewGroupChat = () => {
		console.log("Create new group chat");
	};

	const { loadConversations } = useChat();

	const formatMessageTime = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInMinutes = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60)
		);

		if (diffInMinutes < 1) return "now";
		if (diffInMinutes < 60) return `${diffInMinutes}m`;
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
		if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
		return date.toLocaleDateString();
	};

	const filteredConversations = conversations
		.filter((conv) => {
			const matchesSearch =
				searchQuery === "" ||
				(conv.type === "individual" &&
					conv.participant.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase())) ||
				(conv.type === "group" &&
					conv.groupName.toLowerCase().includes(searchQuery.toLowerCase()));

			const matchesFilter =
				selectedFilter === "all" ||
				(selectedFilter === "unread" && conv.unreadCount > 0) ||
				(selectedFilter === "pinned" && conv.isPinned) ||
				(selectedFilter === "individual" && conv.type === "individual") ||
				(selectedFilter === "group" && conv.type === "group");

			return matchesSearch && matchesFilter;
		})
		.sort((a, b) => {
			// Pinned conversations first
			if (a.isPinned && !b.isPinned) return -1;
			if (!a.isPinned && b.isPinned) return 1;

			// Then by timestamp
			return (
				new Date(b.lastMessage.timestamp).getTime() -
				new Date(a.lastMessage.timestamp).getTime()
			);
		});

	const totalUnreadCount = conversations.reduce(
		(sum, conv) => sum + conv.unreadCount,
		0
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			<div className="container mx-auto p-4 max-w-7xl">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<div className="relative">
							<MessageCircle className="h-8 w-8 text-blue-600" />
							{totalUnreadCount > 0 && (
								<div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
									<span className="text-xs text-white font-bold">
										{totalUnreadCount}
									</span>
								</div>
							)}
						</div>
						<div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
								Messages
							</h1>
							<p className="text-slate-600">Manage your conversations</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button variant="outline" size="icon" className="hover:bg-blue-50">
							<Bell className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="icon" className="hover:bg-blue-50">
							<Settings className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<div className="grid lg:grid-cols-4 gap-6">
					{/* Chat List Sidebar */}
					<div className="lg:col-span-1 space-y-4">
						{/* Search and New Chat */}
						<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
							<CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">Quick Actions</CardTitle>
									<Button
										variant="outline"
										size="icon"
										onClick={handleNewChat}
										className="hover:bg-blue-50"
									>
										<UserPlus className="h-4 w-4" />
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
									<Input
										placeholder="Search conversations..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
									/>
								</div>
							</CardContent>
						</Card>

						{/* Filters */}
						<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
							<CardHeader className="pb-4">
								<CardTitle className="text-lg flex items-center gap-2">
									<Filter className="h-4 w-4" />
									Filters
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								{[
									{
										key: "all",
										label: "All Chats",
										count: conversations.length,
									},
									{
										key: "unread",
										label: "Unread",
										count: conversations.filter((c) => c.unreadCount > 0)
											.length,
									},
									{
										key: "pinned",
										label: "Pinned",
										count: conversations.filter((c) => c.isPinned).length,
									},
									{
										key: "individual",
										label: "Individual",
										count: conversations.filter((c) => c.type === "individual")
											.length,
									},
									{
										key: "group",
										label: "Groups",
										count: conversations.filter((c) => c.type === "group")
											.length,
									},
								].map((filter) => (
									<Button
										key={filter.key}
										variant={
											selectedFilter === filter.key ? "default" : "ghost"
										}
										className={`w-full justify-between ${
											selectedFilter === filter.key
												? "bg-gradient-to-r from-blue-600 to-indigo-600"
												: "hover:bg-blue-50"
										}`}
										onClick={() => setSelectedFilter(filter.key)}
									>
										<span>{filter.label}</span>
										<span
											className={`text-xs px-2 py-1 rounded-full ${
												selectedFilter === filter.key
													? "bg-white/20 text-white"
													: "bg-slate-200 text-slate-600"
											}`}
										>
											{filter.count}
										</span>
									</Button>
								))}
							</CardContent>
						</Card>
					</div>

					{/* Conversations List */}
					<div className="lg:col-span-3">
						<Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
							<CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-xl">Conversations</CardTitle>
										<CardDescription>
											{filteredConversations.length} conversation
											{filteredConversations.length !== 1 ? "s" : ""}
											{totalUnreadCount > 0 && (
												<span className="ml-2 text-blue-600 font-medium">
													• {totalUnreadCount} unread
												</span>
											)}
										</CardDescription>
									</div>
									<Button
										variant="outline"
										size="icon"
										className="hover:bg-blue-50"
									>
										<SortDesc className="h-4 w-4" />
									</Button>
								</div>
							</CardHeader>

							<CardContent className="p-0">
								<div className="max-h-[600px] overflow-y-auto">
									{filteredConversations.length === 0 ? (
										<div className="p-8 text-center">
											<MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
											<h3 className="text-lg font-medium text-slate-600 mb-2">
												No conversations found
											</h3>
											<p className="text-slate-500 mb-4">
												Try adjusting your search or filters
											</p>
											<Button
												onClick={handleNewChat}
												className="bg-gradient-to-r from-blue-600 to-indigo-600"
											>
												<Plus className="h-4 w-4 mr-2" />
												Start New Chat
											</Button>
										</div>
									) : (
										<div className="divide-y divide-slate-100">
											{filteredConversations.map((conversation) => (
												<div
													key={conversation.id}
													onClick={() => handleChatClick(conversation.id)}
													className="p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 cursor-pointer transition-all duration-200 group"
												>
													<div className="flex items-center gap-4">
														{/* Avatar Section */}
														<div className="relative flex-shrink-0">
															{conversation.type === "individual" ? (
																<div className="relative">
																	<Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
																		<AvatarImage
																			src={conversation.participant.avatar}
																		/>
																		<AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
																			{conversation.participant.name
																				.split(" ")
																				.map((n) => n[0])
																				.join("")}
																		</AvatarFallback>
																	</Avatar>
																	{conversation.participant.isOnline && (
																		<div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full ring-2 ring-white"></div>
																	)}
																</div>
															) : (
																<div className="relative">
																	<div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-md">
																		<Users className="h-6 w-6 text-white" />
																	</div>
																	<div className="absolute -top-1 -right-1 flex -space-x-1">
																		{conversation.participants
																			.slice(0, 2)
																			.map((participant, index) => (
																				<Avatar
																					key={index}
																					className="h-5 w-5 ring-1 ring-white"
																				>
																					<AvatarImage
																						src={participant.avatar}
																					/>
																					<AvatarFallback className="text-xs bg-slate-300">
																						{participant.name[0]}
																					</AvatarFallback>
																				</Avatar>
																			))}
																	</div>
																</div>
															)}
														</div>

														{/* Content Section */}
														<div className="flex-1 min-w-0">
															<div className="flex items-center justify-between mb-1">
																<div className="flex items-center gap-2">
																	<h3 className="font-semibold text-slate-900 truncate">
																		{conversation.type === "individual"
																			? conversation.participant.name
																			: conversation.groupName}
																	</h3>
																	{conversation.isPinned && (
																		<Pin className="h-3 w-3 text-blue-500 fill-current" />
																	)}
																</div>
																<div className="flex items-center gap-2">
																	<span className="text-xs text-slate-500">
																		{formatMessageTime(
																			conversation.lastMessage.timestamp
																		)}
																	</span>
																	{conversation.unreadCount > 0 && (
																		<div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
																			<span className="text-xs text-white font-bold">
																				{conversation.unreadCount > 9
																					? "9+"
																					: conversation.unreadCount}
																			</span>
																		</div>
																	)}
																</div>
															</div>

															<div className="flex items-center justify-between">
																<div className="flex-1">
																	{conversation.type === "individual" && (
																		<p className="text-xs text-slate-500 mb-1">
																			{conversation.participant.role} •
																			{conversation.participant.isOnline ? (
																				<span className="text-green-600 ml-1">
																					Online
																				</span>
																			) : (
																				<span className="ml-1">
																					{conversation.participant.lastSeen}
																				</span>
																			)}
																		</p>
																	)}
																	<p
																		className={`text-sm truncate ${
																			conversation.lastMessage.unread
																				? "font-medium text-slate-900"
																				: "text-slate-600"
																		}`}
																	>
																		{conversation.type === "group" &&
																			conversation.lastMessage.sender !==
																				"admin" && (
																				<span className="text-blue-600 font-medium mr-1">
																					{conversation.lastMessage.sender}:
																				</span>
																			)}
																		{conversation.lastMessage.content}
																	</p>
																</div>
															</div>
														</div>

														{/* Actions */}
														<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 hover:bg-blue-50"
															>
																<Phone className="h-3 w-3" />
															</Button>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 hover:bg-blue-50"
															>
																<Video className="h-3 w-3" />
															</Button>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 hover:bg-blue-50"
															>
																<MoreVertical className="h-3 w-3" />
															</Button>
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Floating Action Button for Mobile */}
				<div className="fixed bottom-6 right-6 lg:hidden">
					<Button
						onClick={handleNewChat}
						size="icon"
						className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl"
					>
						<Plus className="h-6 w-6" />
					</Button>
				</div>

				{/* Quick Stats Cards */}
				{user.role === "admin" && (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
						{[
							{
								label: "Total Chats",
								value: conversations.length,
								icon: MessageCircle,
								color: "blue",
							},
							{
								label: "Unread",
								value: totalUnreadCount,
								icon: Circle,
								color: "red",
							},
							{
								label: "Groups",
								value: conversations.filter((c) => c.type === "group").length,
								icon: Users,
								color: "purple",
							},
							{
								label: "Online Now",
								value: conversations.filter(
									(c) => c.type === "individual" && c.participant.isOnline
								).length,
								icon: Circle,
								color: "green",
							},
						].map((stat, index) => (
							<Card
								key={index}
								className="shadow-md border-0 bg-white/80 backdrop-blur-sm"
							>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-slate-600">{stat.label}</p>
											<p className="text-2xl font-bold text-slate-900">
												{stat.value}
											</p>
										</div>
										<div className={`p-2 rounded-lg bg-${stat.color}-100`}>
											<stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
