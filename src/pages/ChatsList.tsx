import { useEffect, useMemo, useState } from "react";
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
import { organizationService } from "@/api/services/organizationService";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/store/chatStore";
import { adminUserService } from "@/api/services/adminUserService";
import { useNavigate } from "react-router-dom";
import chatServices from "@/api/services/chatService";
import Loader from "@/components/Loader";
import { ChatCreationModal } from "@/components/ChatCreationModal";

export default function ChatsList() {
	const [searchQuery, setSearchQuery] = useState("");
	const [chatType, setChatType] = useState<"direct" | "group" | null>();
	const [selectedFilter, setSelectedFilter] = useState("all");
	const [isCreatingChat, setIsCreatingChat] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [groupName, setGroupName] = useState("");

	const { user } = useAuth();
	const navigate = useNavigate();
	const {
		data: all_users = [],
		isLoading: loadingUsers,
		error: usersError,
	} = useQuery({
		queryKey: ["support-worker-organizations"],
		queryFn: async () => {
			if (user.role === "participant") {
				const workers = await chatServices.getMySupportWorkers();

				console.log("supportworkers: ", workers);

				return workers;
			}
			if (user.role === "admin") {
				const workers = await adminUserService.getWorkers();
				const partcipants = await adminUserService.getParticipants();

				const users = [...workers.users, ...partcipants.users];
				return users;
			}
		},
	});

	const {
		data: organizations = [],
		isLoading: loadingOrganizations,
		error: organizationsError,
	} = useQuery({
		queryKey: ["organizations"],
		queryFn: async () => {
			return await organizationService.getOrganizations();
		},
	});

	const {
		loadConversations,
		connect,
		loading,
		setLoading,
		cleanupSocketListeners,
		conversations: chatConversations,
		createNewConversation,
	} = useChat();

	const { setCurrentConversation } = useChatStore();

	useEffect(() => {
		const tokens = tokenStorage.getTokens();
		if (tokens?.access?.token) {
			connect(tokens.access.token);
			loadConversations(tokens.access.token);
		}

		return () => {
			cleanupSocketListeners();
		};
	}, []);

	const handleChatClick = (chatId: string) => {
		const tokens = tokenStorage.getTokens();
		const conv = chatConversations.find((conv) => conv._id === chatId) || null;
		if (tokens?.access?.token) {
			setCurrentConversation(conv);
			if (user.role === "supportWorker") {
				navigate(`/support-worker/chat/${conv._id}`);
			} else if (user.role === "participant") {
				navigate(`/participant/chat/${conv._id}`);
			} else {
				navigate(`/admin/chat/${conv._id}`);
			}
		}
	};

	const handleNewDirectChat = async (userId: string) => {
		const tokens = tokenStorage.getTokens();
		if (!tokens?.access?.token) return;

		try {
			setLoading(true);
			setIsCreatingChat(true);
			const newConversation = await createNewConversation(
				"direct",
				[userId],
				tokens.access.token,
				"Direct Chat",
				"Testing Direct Chat",
				organizations[0]?._id // Using first organization for demo
			);

			if (newConversation) {
				setCurrentConversation(newConversation);
				if (user.role === "supportWorker") {
					navigate(`/support-worker/chat/${newConversation._id}`);
				} else if (user.role === "participant") {
					navigate(`/participant/chat/${newConversation._id}`);
				} else {
					navigate(`/admin/chat/${newConversation._id}`);
				}
			}
		} catch (error) {
			console.error("Failed to create direct chat:", error);
		} finally {
			setLoading(false);
			setIsCreatingChat(false);
		}
	};

	const handleNewGroupChat = async () => {
		const tokens = tokenStorage.getTokens();
		if (!tokens?.access?.token || selectedUsers.length < 2) return;

		try {
			setIsCreatingChat(true);
			setLoading(true);
			const newConversation = await createNewConversation(
				"group",
				selectedUsers,
				tokens.access.token,
				groupName,
				"Group messagings",
				organizations[0]?._id // Using first organization for demo
			);

			if (newConversation) {
				setCurrentConversation(newConversation);
			}
		} catch (error) {
			console.error("Failed to create group chat:", error);
		} finally {
			setIsCreatingChat(false);
			setLoading(false);
			setSelectedUsers([]);
			setGroupName("");
		}
	};

	const handleCreateChat = async () => {
		if (chatType === "direct") {
			handleNewDirectChat(selectedUsers[0]);
			return;
		}
		handleNewGroupChat();
	};

	const toggleUserSelection = (userId: string) => {
		if (chatType === "direct") {
			setSelectedUsers([userId]);
			return;
		}
		setSelectedUsers((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId]
		);
	};

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

	const filteredConversations = chatConversations.filter((conv) => {
		const matchesSearch =
			searchQuery === "" ||
			(conv.type === "direct" &&
				conv.members
					.map((m) => m.userId.firstName)
					.join(" ")
					.toLowerCase()
					.includes(searchQuery.toLowerCase())) ||
			(conv.type === "group" &&
				conv.name?.toLowerCase().includes(searchQuery.toLowerCase()));

		const matchesFilter =
			selectedFilter === "all" ||
			(selectedFilter === "direct" && conv.type === "direct") ||
			(selectedFilter === "group" && conv.type === "group");

		return matchesSearch && matchesFilter;
	});

	// const totalUnreadCount = chatConversations.reduce(
	//   (sum, conv) => sum + (conv.unreadCount || 0),
	//   0
	// );

	if (loadingUsers || loadingOrganizations) {
		return <Loader />;
	}

	return (
		<div className="min-h-screen bg-[#f8fafc]">
			<div className="container mx-auto p-4 max-w-7xl">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<div className="relative">
							<MessageCircle className="h-8 w-8 text-guardian" />
							{/* {totalUnreadCount > 0 && (
                <div className="absolute -top-2 -right-2 h-5 w-5 bg-[#FF2D55] rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {totalUnreadCount}
                  </span>
                </div>
              )} */}
						</div>
						<div>
							<h1 className="text-3xl font-bold text-slate-900">Messages</h1>
							<p className="text-[#9395A2]">Manage your conversations</p>
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
						<Card className="shadow-lg border-0 bg-white">
							<CardHeader className="pb-4">
								{user.role !== "supportWorker" && (
									<div className="flex items-center justify-between">
										<CardTitle className="text-lg">Quick Actions</CardTitle>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="outline"
													size="icon"
													className="hover:bg-blue-50"
												>
													<UserPlus className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem
													onClick={() => {
														setIsCreatingChat(true);
														setChatType("direct");
													}}
												>
													New Chat
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														setIsCreatingChat(true);
														setChatType("group");
													}}
												>
													Group Chat
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								)}
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9395A2]" />
									<Input
										placeholder="Search conversations..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 border-[#9395A2] focus:border-guardian"
									/>
								</div>
							</CardContent>
						</Card>

						{/* Filters */}
						<Card className="shadow-lg border-0 bg-white">
							<CardHeader className="pb-4">
								<CardTitle className="text-lg">Filters</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								{[
									{
										key: "all",
										label: "All Chats",
										count: chatConversations.length,
									},
									// {
									//   key: "unread",
									//   label: "Unread",
									//   count: chatConversations.filter((c) => (c.unreadCount || 0) > 0).length,
									// },
									{
										key: "direct",
										label: "Individual",
										count: chatConversations.filter((c) => c.type === "direct")
											.length,
									},
									{
										key: "group",
										label: "Groups",
										count: chatConversations.filter((c) => c.type === "group")
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
												? "bg-guardian text-white"
												: "hover:bg-blue-50"
										}`}
										onClick={() => setSelectedFilter(filter.key)}
									>
										<span>{filter.label}</span>
										<span
											className={`text-xs px-2 py-1 rounded-full ${
												selectedFilter === filter.key
													? "bg-white/20 text-white"
													: "bg-[#9395A2]/20 text-[#9395A2]"
											}`}
										>
											{filter.count}
										</span>
									</Button>
								))}
							</CardContent>
						</Card>
					</div>

					{/* Main Content Area */}
					<div className="lg:col-span-3">
						{/* New Chat Creation Modal */}
						{isCreatingChat && (
							<ChatCreationModal
								isOpen={isCreatingChat}
								onClose={() => {
									setIsCreatingChat(false);
									setSelectedUsers([]);
									setGroupName("");
								}}
								chatType={chatType!}
								users={all_users}
								selectedUsers={selectedUsers}
								onUserSelect={toggleUserSelection}
								groupName={groupName}
								onGroupNameChange={setGroupName}
								onCreate={handleCreateChat}
								isLoading={loading}
							/>
						)}

						{/* Conversations List */}
						<Card className="shadow-xl border-0 bg-white">
							<CardHeader className="border-b border-[#9395A2]/20">
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-xl">Conversations</CardTitle>
										<CardDescription>
											{filteredConversations.length} conversation
											{filteredConversations.length !== 1 ? "s" : ""}
											{/* {totalUnreadCount > 0 && (
                        <span className="ml-2 text-[#008CFF] font-medium">
                          • {totalUnreadCount} unread
                        </span>
                      )} */}
										</CardDescription>
									</div>
								</div>
							</CardHeader>

							<CardContent className="p-0">
								<div className="max-h-[600px] overflow-y-auto">
									{filteredConversations.length === 0 ? (
										<div className="p-8 text-center">
											<MessageCircle className="h-12 w-12 text-[#9395A2] mx-auto mb-4" />
											<h3 className="text-lg font-medium text-[#9395A2] mb-2">
												No conversations found
											</h3>
											<p className="text-[#9395A2] mb-4">
												Try adjusting your search or filters
											</p>
											<Button
												onClick={() => setIsCreatingChat(true)}
												className="bg-guardian hover:bg-guardian/90"
											>
												<Plus className="h-4 w-4 mr-2" />
												Start Chat
											</Button>
										</div>
									) : (
										<div className="divide-y divide-[#9395A2]/10">
											{filteredConversations.map((conversation) => (
												<div
													key={conversation._id}
													onClick={() => handleChatClick(conversation._id)}
													className="p-4 hover:bg-[#66C2EB20] cursor-pointer transition-all duration-200"
												>
													<div className="flex items-center gap-4">
														{/* Avatar Section */}
														<div className="relative flex-shrink-0">
															{conversation.type === "direct" ? (
																<div className="relative">
																	<Avatar className="h-8 w-8 overflow flex items-center justify-center rounded-full ring-2 ring-white shadow-md">
																		<AvatarImage
																			className="h-8 w-8 rounded-full object-cover"
																			src={
																				conversation.members.find(
																					(member) =>
																						member.userId._id !== user._id
																				)?.userId.profileImage
																			}
																		/>
																		<AvatarFallback className="bg-guardian text-white font-semibold">
																			{
																				conversation.members.find(
																					(member) =>
																						member.userId._id !== user._id
																				)?.userId.firstName[0]
																			}
																		</AvatarFallback>
																	</Avatar>
																	{conversation.isActive && (
																		<div className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#197879] rounded-full ring-2 ring-white"></div>
																	)}
																</div>
															) : (
																<div className="relative">
																	<div className="h-12 w-12 bg-guardian rounded-full flex items-center justify-center shadow-md">
																		<Users className="h-6 w-6 text-white" />
																	</div>
																</div>
															)}
														</div>

														{/* Content Section */}
														<div className="flex-1 min-w-0">
															<div className="flex items-center justify-between mb-1">
																<div className="flex items-center gap-2">
																	<h3 className="font-semibold text-slate-900 truncate">
																		{conversation.type === "direct"
																			? conversation.members.find(
																					(member) =>
																						member.userId._id !== user._id
																			  )?.userId.firstName
																			: conversation.name}
																	</h3>
																</div>
																<div className="flex items-center gap-2">
																	{conversation.lastMessage?.timestamp && (
																		<span className="text-xs text-[#9395A2]">
																			{formatMessageTime(
																				conversation.lastMessage.timestamp
																			)}
																		</span>
																	)}
																	{/* {(conversation.unreadCount || 0) > 0 && (
                                    <div className="h-5 w-5 bg-[#008CFF] rounded-full flex items-center justify-center">
                                      <span className="text-xs text-white font-bold">
                                        {conversation.unreadCount > 9
                                          ? "9+"
                                          : conversation.unreadCount}
                                      </span>
                                    </div>
                                  )} */}
																</div>
															</div>

															<div className="flex items-center justify-between">
																<div className="flex-1">
																	{conversation.type === "direct" && (
																		<p className="text-xs text-[#9395A2] mb-1">
																			{
																				conversation.members.find(
																					(member) =>
																						member.userId._id !== user._id
																				)?.userId.role
																			}{" "}
																			•
																			{conversation.isActive ? (
																				<span className="text-[#197879] ml-1">
																					Online
																				</span>
																			) : (
																				<span className="ml-1">
																					{conversation.lastMessage
																						?.timestamp &&
																						formatMessageTime(
																							conversation.lastMessage.timestamp
																						)}
																				</span>
																			)}
																		</p>
																	)}
																	<p className={`text-sm truncate `}>
																		{conversation.lastMessage ? (
																			<>
																				{conversation.type === "group" &&
																					conversation.lastMessage.sender
																						._id !== user._id && (
																						<span className="text-guardian font-medium mr-1">
																							{
																								conversation.lastMessage.sender
																									.firstName
																							}
																							:
																						</span>
																					)}
																				{conversation.lastMessage.content}
																			</>
																		) : (
																			"No messages yet"
																		)}
																	</p>
																</div>
															</div>
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
			</div>
		</div>
	);
}
