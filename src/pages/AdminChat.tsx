import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	ArrowLeft,
	Send,
	Paperclip,
	Mic,
	Smile,
	Phone,
	Video,
	MoreVertical,
	Search,
	Pin,
	Users,
	MessageCircle,
	Bell,
	Settings,
	UserPlus,
	Circle,
	Plus,
	Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useChat from "@/hooks/useChat";
import { tokenStorage } from "@/api/apiClient";
import { useChatStore } from "@/store/chatStore";
import { useParams, useNavigate } from "react-router-dom";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IConversation } from "@/types/chat.types";
import { ChatCreationModal } from "@/components/ChatCreationModal";
import { organizationService } from "@/api/services/organizationService";
import { adminUserService } from "@/api/services/adminUserService";
import chatServices from "@/api/services/chatService";
import { useQuery } from "@tanstack/react-query";

export default function ChatView() {
	const { user } = useAuth();
	const { conversationId } = useParams();
	const navigate = useNavigate();
	const messagesEndRef = useRef(null);

	const {
		conversations: chatConversations,
		loadConversations,
		loading,
		setLoading,
		connect,
		loadMessages,
		cleanupSocketListeners,
		sendMessage,
		createNewConversation,
	} = useChat();

	const { currentConversation, messages, setCurrentConversation, onlineUsers } =
		useChatStore();

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilter, setSelectedFilter] = useState("all");
	const [messageText, setMessageText] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [isLoadingMessages, setIsLoadingMessages] = useState(false);
	const [isLoadingConversations, setIsLoadingConversations] = useState(true);
	const [isCreatingChat, setIsCreatingChat] = useState(false);
	const [chatType, setChatType] = useState<"direct" | "group" | null>(null);
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [groupName, setGroupName] = useState("");

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

	// Auto-scroll to bottom when messages change
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		const tokens = tokenStorage.getTokens();
		if (tokens?.access?.token) {
			// Connect to socket for real-time updates
			connect(tokens.access.token);

			// Load conversations
			loadConversations(tokens.access.token).finally(() => {
				setIsLoadingConversations(false);
			});

			if (conversationId) {
				const conversation = chatConversations.find(
					(conv) => conv._id === conversationId
				);
				if (conversation) {
					setCurrentConversation(conversation);
				}
			}
		}

		return () => {
			cleanupSocketListeners();
		};
	}, [conversationId]);

	// Load messages when conversation changes
	useEffect(() => {
		const tokens = tokenStorage.getTokens();
		if (currentConversation && tokens?.access?.token) {
			setIsLoadingMessages(true);
			loadMessages(currentConversation._id, tokens.access.token).finally(() => {
				setIsLoadingMessages(false);
			});
		}
	}, [currentConversation, conversationId]);

	// Update current conversation when conversations list changes
	useEffect(() => {
		if (conversationId && chatConversations.length > 0) {
			const conversation = chatConversations.find(
				(conv) => conv._id === conversationId
			);
			if (
				conversation &&
				(!currentConversation || currentConversation._id !== conversation._id)
			) {
				setCurrentConversation(conversation);
			}
		}
	}, [chatConversations, conversationId]);

	const handleChatSelect = (chatId: string) => {
		if (user.role === "supportWorker") {
			navigate(`/support-worker/chat/${chatId}`);
		} else if (user.role === "participant") {
			navigate(`/participant/chat/${chatId}`);
		} else {
			navigate(`/admin/chat/${chatId}`);
		}
	};

	const handleNewDirectChat = async (userId: string) => {
		const tokens = tokenStorage.getTokens();
		if (!tokens?.access?.token) return;

		try {
			const newConversation = await createNewConversation(
				"direct",
				[userId],
				tokens.access.token
			);

			if (newConversation) {
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
		}
	};

	const handleSendMessage = async () => {
		if (!messageText.trim() || !currentConversation || isSending) return;

		setIsSending(true);
		const messageToSend = messageText.trim();

		// Clear input immediately for better UX
		setMessageText("");

		try {
			// Send message via socket/API - don't add to local state
			// The message will be added via socket listeners when confirmed
			await sendMessage(messageToSend, "text");
			await loadConversations(tokenStorage.getTokens()?.access.token);
			await loadMessages(
				currentConversation._id,
				tokenStorage.getTokens()?.access.token
			);

			// Simulate typing indicator for response (optional)
			setIsTyping(true);
			setTimeout(() => {
				setIsTyping(false);
			}, 2000);
		} catch (error) {
			console.error("Failed to send message:", error);
			// Restore message text on error
			setMessageText(messageToSend);
		} finally {
			setIsSending(false);
		}
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

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "sent":
				return <Circle className="h-3 w-3 text-[#9395A2]" />;
			case "delivered":
				return <Circle className="h-3 w-3 text-[#008CFF] fill-current" />;
			case "read":
				return <Circle className="h-3 w-3 text-[#197879] fill-current" />;
			default:
				return null;
		}
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

	const getOtherMember = (conversation: IConversation) => {
		return conversation.members.find((member) => member.userId._id !== user._id)
			?.userId;
	};

	const isUserOnline = (userId: string) => {
		return onlineUsers.some((user) => user._id === userId);
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

	const handleCreateChat = async () => {
		const tokens = tokenStorage.getTokens();
		if (!tokens?.access?.token) return;

		try {
			setLoading(true);
			let newConversation;

			if (chatType === "direct") {
				newConversation = await createNewConversation(
					"direct",
					selectedUsers,
					tokens.access.token,
					"Direct Chat",
					"Testing Direct Chat",
					organizations[0]?._id
				);
			} else {
				if (selectedUsers.length < 2) return;
				newConversation = await createNewConversation(
					"group",
					selectedUsers,
					tokens.access.token,
					groupName,
					"Group messaging",
					organizations[0]?._id
				);
			}

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
			console.error("Failed to create chat:", error);
		} finally {
			setLoading(false);
			setIsCreatingChat(false);
			setSelectedUsers([]);
			setGroupName("");
		}
	};

	return (
		<div className="min-h-screen bg-[#f8fafc]">
			<div className="h-screen flex">
				{/* Left Sidebar - Conversations List */}
				<div className="w-80 bg-white border-r border-[#9395A2]/20 flex flex-col">
					{/* Header */}
					<div className="p-4 border-b border-[#9395A2]/20">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="relative">
									<MessageCircle className="h-6 w-6 text-[#008CFF]" />
								</div>
								<h2 className="text-lg font-bold text-slate-900">Messages</h2>
							</div>
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 hover:bg-[#66C2EB20]"
								>
									<Settings className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Search */}
						<div className="relative mb-3">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9395A2]" />
							<Input
								placeholder="Search conversations..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 h-9 border-[#9395A2] focus:border-[#008CFF]"
							/>
						</div>

						<div className="flex gap-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center gap-2 hover:bg-[#66C2EB20] border-[#008CFF] text-[#008CFF]"
									>
										<Plus className="h-4 w-4" />
										New Chat
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem
										onClick={() => {
											setIsCreatingChat(true);
											setChatType("direct");
										}}
									>
										Direct Message
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
					</div>

					{/* Conversations List */}
					<div className="flex-1 overflow-y-auto">
						{isLoadingConversations ? (
							<div className="p-6 text-center">
								<Loader2 className="h-8 w-8 text-[#008CFF] mx-auto mb-3 animate-spin" />
								<p className="text-sm text-[#9395A2]">
									Loading conversations...
								</p>
							</div>
						) : filteredConversations.length === 0 ? (
							<div className="p-6 text-center">
								<MessageCircle className="h-8 w-8 text-[#9395A2] mx-auto mb-3" />
								<h3 className="text-sm font-medium text-[#9395A2] mb-1">
									No conversations found
								</h3>
								<p className="text-xs text-[#9395A2]">
									Try adjusting your search
								</p>
							</div>
						) : (
							<div className="divide-y divide-[#9395A2]/10">
								{filteredConversations.map((conversation) => {
									const otherMember = getOtherMember(conversation);
									return (
										<div
											key={conversation._id}
											onClick={() => handleChatSelect(conversation._id)}
											className={`p-3 cursor-pointer transition-all duration-200 hover:bg-[#66C2EB20] ${
												conversationId === conversation._id
													? "bg-[#66C2EB40] border-r-2 border-[#008CFF]"
													: ""
											}`}
										>
											<div className="flex items-center gap-3">
												{/* Avatar */}
												<div className="relative flex-shrink-0">
													{conversation.type === "direct" ? (
														<div className="relative">
															<Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
																<AvatarImage src={otherMember?.profileImage} />
																<AvatarFallback className="bg-[#008CFF] text-white text-sm font-semibold">
																	{otherMember?.firstName[0]}
																</AvatarFallback>
															</Avatar>
															{otherMember && isUserOnline(otherMember._id) && (
																<div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-[#197879] rounded-full ring-2 ring-white"></div>
															)}
														</div>
													) : (
														<div className="relative">
															<div className="h-10 w-10 bg-[#008CFF] rounded-full flex items-center justify-center shadow-sm">
																<Users className="h-5 w-5 text-white" />
															</div>
														</div>
													)}
												</div>

												{/* Content */}
												<div className="flex-1 min-w-0">
													<div className="flex items-center justify-between mb-1">
														<div className="flex items-center gap-1">
															<h3 className="font-medium text-sm text-slate-900 truncate">
																{conversation.type === "direct"
																	? otherMember?.firstName
																	: conversation.name}
															</h3>
														</div>
														<div className="flex items-center gap-1">
															{conversation.lastMessage?.timestamp && (
																<span className="text-xs text-[#9395A2]">
																	{formatMessageTime(
																		conversation.lastMessage.timestamp
																	)}
																</span>
															)}
														</div>
													</div>

													<p className="text-xs truncate text-[#9395A2]">
														{conversation.lastMessage ? (
															<>
																{conversation.type === "group" &&
																	conversation.lastMessage.sender._id !==
																		user._id && (
																		<span className="text-[#008CFF] font-medium mr-1">
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
									);
								})}
							</div>
						)}
					</div>
				</div>

				{/* Right Side - Chat Interface */}
				<div className="flex-1 flex flex-col bg-white">
					{currentConversation ? (
						<>
							{/* Chat Header */}
							<div className="p-4 border-b border-[#9395A2]/20">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="relative">
											{currentConversation.type === "direct" ? (
												<>
													<Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
														<AvatarImage
															src={
																getOtherMember(currentConversation)
																	?.profileImage
															}
														/>
														<AvatarFallback className="bg-[#008CFF] text-white font-semibold">
															{
																getOtherMember(currentConversation)
																	?.firstName[0]
															}
														</AvatarFallback>
													</Avatar>
													{getOtherMember(currentConversation) &&
														isUserOnline(
															getOtherMember(currentConversation)!._id
														) && (
															<div className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#197879] rounded-full ring-2 ring-white"></div>
														)}
												</>
											) : (
												<div className="h-10 w-10 bg-[#008CFF] rounded-full flex items-center justify-center shadow-md">
													<Users className="h-5 w-5 text-white" />
												</div>
											)}
										</div>
										<div>
											<h3 className="font-semibold text-slate-900">
												{currentConversation.type === "direct"
													? getOtherMember(currentConversation)?.firstName
													: currentConversation.name}
											</h3>
											<p className="text-sm text-[#9395A2]">
												{currentConversation.type === "direct" ? (
													getOtherMember(currentConversation) &&
													isUserOnline(
														getOtherMember(currentConversation)!._id
													) ? (
														<span className="text-[#197879] font-medium">
															Online now
														</span>
													) : (
														`Last seen ${formatMessageTime(
															currentConversation.updatedAt
														)}`
													)
												) : (
													`${currentConversation.members.length} members`
												)}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											className="h-9 w-9 hover:bg-[#66C2EB20]"
										>
											<Phone className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="h-9 w-9 hover:bg-[#66C2EB20]"
										>
											<Video className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="h-9 w-9 hover:bg-[#66C2EB20]"
										>
											<MoreVertical className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</div>
							{/* Chat modal */}
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
							{/* Messages Area */}
							<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
								{isLoadingMessages ? (
									<div className="flex items-center justify-center h-full">
										<div className="text-center">
											<Loader2 className="h-8 w-8 text-[#008CFF] mx-auto mb-3 animate-spin" />
											<p className="text-sm text-[#9395A2]">
												Loading messages...
											</p>
										</div>
									</div>
								) : messages.length === 0 ? (
									<div className="flex items-center justify-center h-full">
										<div className="text-center">
											<MessageCircle className="h-12 w-12 text-[#9395A2] mx-auto mb-3" />
											<h3 className="text-lg font-medium text-[#9395A2] mb-1">
												No messages yet
											</h3>
											<p className="text-sm text-[#9395A2]">
												Start the conversation by sending a message
											</p>
										</div>
									</div>
								) : (
									<>
										{messages.map((message) => (
											<div
												key={message._id}
												className={`flex ${
													message.sender._id === user._id
														? "justify-end"
														: "justify-start"
												}`}
											>
												<div
													className={`flex gap-3 items-end max-w-[70%] ${
														message.sender._id === user._id
															? "flex-row-reverse"
															: ""
													}`}
												>
													{message.sender._id !== user._id && (
														<Avatar className="h-7 w-7 ring-2 ring-white shadow-sm">
															<AvatarImage
																src={
																	currentConversation.type === "direct"
																		? getOtherMember(currentConversation)
																				?.profileImage
																		: message.sender.profileImage
																}
															/>
															<AvatarFallback className="bg-[#008CFF] text-white text-xs">
																{currentConversation.type === "direct"
																	? getOtherMember(currentConversation)
																			?.firstName[0]
																	: message.sender.firstName[0]}
															</AvatarFallback>
														</Avatar>
													)}

													<div className="group relative">
														<div
															className={`rounded-2xl px-4 py-2 shadow-sm ${
																message.sender._id === user._id
																	? "bg-[#008CFF] text-white"
																	: "bg-white border border-[#9395A2]/20 text-slate-900"
															}`}
														>
															<p className="text-sm leading-relaxed">
																{message.content}
															</p>
														</div>

														<div
															className={`flex items-center gap-1 mt-1 ${
																message.sender._id === user._id
																	? "justify-end"
																	: "justify-start"
															}`}
														>
															<span className="text-xs text-[#9395A2]">
																{formatMessageTime(message.createdAt)}
															</span>
															{message.sender._id === user._id &&
																getStatusIcon(message.status)}
														</div>
													</div>
												</div>
											</div>
										))}

										{/* Typing Indicator */}
										{isTyping && (
											<div className="flex justify-start">
												<div className="flex gap-3 items-end">
													{currentConversation.type === "direct" && (
														<Avatar className="h-7 w-7 ring-2 ring-white shadow-sm">
															<AvatarImage
																src={
																	getOtherMember(currentConversation)
																		?.profileImage
																}
															/>
															<AvatarFallback className="bg-[#008CFF] text-white text-xs">
																{
																	getOtherMember(currentConversation)
																		?.firstName[0]
																}
															</AvatarFallback>
														</Avatar>
													)}
													<div className="bg-white border border-[#9395A2]/20 rounded-2xl px-4 py-2 shadow-sm">
														<div className="flex gap-1">
															<div className="w-2 h-2 bg-[#9395A2] rounded-full animate-bounce"></div>
															<div
																className="w-2 h-2 bg-[#9395A2] rounded-full animate-bounce"
																style={{ animationDelay: "0.1s" }}
															></div>
															<div
																className="w-2 h-2 bg-[#9395A2] rounded-full animate-bounce"
																style={{ animationDelay: "0.2s" }}
															></div>
														</div>
													</div>
												</div>
											</div>
										)}

										{/* Auto-scroll reference */}
										<div ref={messagesEndRef} />
									</>
								)}
							</div>

							{/* Message Input */}
							<div className="p-4 border-t border-[#9395A2]/20">
								<div className="flex items-end gap-3">
									<Button
										variant="outline"
										size="icon"
										className="shrink-0 hover:bg-[#66C2EB20] border-[#9395A2] h-9 w-9"
									>
										<Paperclip className="h-4 w-4" />
									</Button>

									<div className="flex-1 relative">
										<Textarea
											placeholder="Type your message..."
											className="resize-none min-h-[36px] max-h-32 pr-10 border-[#9395A2] focus:border-[#008CFF] rounded-xl"
											value={messageText}
											onChange={(e) => setMessageText(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter" && !e.shiftKey) {
													e.preventDefault();
													handleSendMessage();
												}
											}}
											disabled={isSending}
										/>
										<Button
											variant="ghost"
											size="icon"
											className="absolute right-2 top-1 h-7 w-7 hover:bg-[#66C2EB20]"
										>
											<Smile className="h-4 w-4" />
										</Button>
									</div>

									<Button
										variant="ghost"
										size="icon"
										className="shrink-0 hover:bg-[#66C2EB20] h-9 w-9"
									>
										<Mic className="h-4 w-4" />
									</Button>

									<Button
										onClick={handleSendMessage}
										disabled={!messageText.trim() || isSending}
										className="shrink-0 bg-[#008CFF] hover:bg-[#008CFF]/90 shadow-lg hover:shadow-xl transition-all duration-200 h-9 min-w-[36px]"
									>
										{isSending ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Send className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
							<div className="text-center">
								<MessageCircle className="h-16 w-16 text-[#9395A2] mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-[#9395A2] mb-2">
									Select a conversation
								</h3>
								<p className="text-[#9395A2]">
									Choose a conversation from the sidebar to start messaging
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
