import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
	Archive,
	Trash2,
	Star,
	Circle,
	Plus,
	Users,
	MessageCircle,
	Filter,
	SortDesc,
	Bell,
	Settings,
} from "lucide-react";

// Mock data for all conversations (same as chat list)
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

// Mock messages for the active conversation
const mockMessages = [
	{
		id: "1",
		sender: "admin",
		content:
			"Hi Olivia, I wanted to let you know there's a new connection request for you.",
		timestamp: new Date("2025-04-09T10:30:00").toISOString(),
		status: "read",
	},
	{
		id: "2",
		sender: "participant",
		content: "Thanks for letting me know! Is this the one from John Smith?",
		timestamp: new Date("2025-04-09T10:32:00").toISOString(),
		status: "read",
	},
	{
		id: "3",
		sender: "admin",
		content:
			"Yes, that's correct. John is looking for support with daily activities and requires someone with experience in mobility assistance.",
		timestamp: new Date("2025-04-09T10:35:00").toISOString(),
		status: "read",
	},
	{
		id: "4",
		sender: "participant",
		content:
			"Perfect! I have extensive experience with mobility support. I'll review the full details and respond to the invitation within the next hour.",
		timestamp: new Date("2025-04-09T10:40:00").toISOString(),
		status: "delivered",
	},
];

export default function AdminChatWithSidebar() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedChatId, setSelectedChatId] = useState("1");
	const [messageText, setMessageText] = useState("");
	const [messages, setMessages] = useState(mockMessages);
	const [isTyping, setIsTyping] = useState(false);
	const [conversations, setConversations] = useState(mockConversations);

	const activeConversation = conversations.find(
		(conv) => conv.id === selectedChatId
	);
	const totalUnreadCount = conversations.reduce(
		(sum, conv) => sum + conv.unreadCount,
		0
	);

	const handleChatSelect = (chatId: string) => {
		setSelectedChatId(chatId);
		// In a real app, you would fetch messages for this conversation
		console.log(`Selected chat: ${chatId}`);
	};

	const handleNewChat = () => {
		console.log("Create new individual chat");
	};

	const handleNewGroupChat = () => {
		console.log("Create new group chat");
	};

	const handleSendMessage = () => {
		if (!messageText.trim()) return;

		const newMessage = {
			id: `${Date.now()}`,
			sender: "admin",
			content: messageText,
			timestamp: new Date().toISOString(),
			status: "sent",
		};

		setMessages((prev) => [...prev, newMessage]);
		setMessageText("");

		// Simulate typing indicator
		setIsTyping(true);
		setTimeout(() => {
			setIsTyping(false);
			const responseMessage = {
				id: `${Date.now()}-response`,
				sender: "participant",
				content: "Thanks for the update! I'll check it out right away.",
				timestamp: new Date().toISOString(),
				status: "delivered",
			};
			setMessages((prev) => [...prev, responseMessage]);
		}, 2000);
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
				return <Circle className="h-3 w-3 text-slate-400" />;
			case "delivered":
				return <Circle className="h-3 w-3 text-blue-500 fill-current" />;
			case "read":
				return <Circle className="h-3 w-3 text-green-500 fill-current" />;
			default:
				return null;
		}
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
			return matchesSearch;
		})
		.sort((a, b) => {
			if (a.isPinned && !b.isPinned) return -1;
			if (!a.isPinned && b.isPinned) return 1;
			return (
				new Date(b.lastMessage.timestamp).getTime() -
				new Date(a.lastMessage.timestamp).getTime()
			);
		});

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			<div className="h-screen flex">
				{/* Left Sidebar - Conversations List */}
				<div className="w-80 bg-white/90 backdrop-blur-sm border-r border-slate-200 flex flex-col">
					{/* Header */}
					<div className="p-4 border-b border-slate-200/60 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="relative">
									<MessageCircle className="h-6 w-6 text-blue-600" />
									{totalUnreadCount > 0 && (
										<div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
											<span className="text-xs text-white font-bold text-[10px]">
												{totalUnreadCount}
											</span>
										</div>
									)}
								</div>
								<h2 className="text-lg font-bold text-slate-900">Messages</h2>
							</div>
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 hover:bg-blue-50"
								>
									<Settings className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Search */}
						<div className="relative mb-3">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Search conversations..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 h-9 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
							/>
						</div>

						{/* New Chat Buttons */}
						<div className="flex gap-2">
							<Button
								onClick={handleNewChat}
								size="sm"
								className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-8"
							>
								<Plus className="h-3 w-3 mr-1" />
								New Chat
							</Button>
							<Button
								onClick={handleNewGroupChat}
								variant="outline"
								size="sm"
								className="flex-1 hover:bg-blue-50 h-8"
							>
								<Users className="h-3 w-3 mr-1" />
								Group
							</Button>
						</div>
					</div>

					{/* Conversations List */}
					<div className="flex-1 overflow-y-auto">
						{filteredConversations.length === 0 ? (
							<div className="p-6 text-center">
								<MessageCircle className="h-8 w-8 text-slate-300 mx-auto mb-3" />
								<h3 className="text-sm font-medium text-slate-600 mb-1">
									No conversations found
								</h3>
								<p className="text-xs text-slate-500">
									Try adjusting your search
								</p>
							</div>
						) : (
							<div className="divide-y divide-slate-100">
								{filteredConversations.map((conversation) => (
									<div
										key={conversation.id}
										onClick={() => handleChatSelect(conversation.id)}
										className={`p-3 cursor-pointer transition-all duration-200 hover:bg-blue-50/50 ${
											selectedChatId === conversation.id
												? "bg-gradient-to-r from-blue-100 to-indigo-100 border-r-2 border-blue-500"
												: ""
										}`}
									>
										<div className="flex items-center gap-3">
											{/* Avatar */}
											<div className="relative flex-shrink-0">
												{conversation.type === "individual" ? (
													<div className="relative">
														<Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
															<AvatarImage
																src={conversation.participant.avatar}
															/>
															<AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
																{conversation.participant.name
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</AvatarFallback>
														</Avatar>
														{conversation.participant.isOnline && (
															<div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white"></div>
														)}
													</div>
												) : (
													<div className="relative">
														<div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-sm">
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
															{conversation.type === "individual"
																? conversation.participant.name
																: conversation.groupName}
														</h3>
														{conversation.isPinned && (
															<Pin className="h-3 w-3 text-blue-500 fill-current flex-shrink-0" />
														)}
													</div>
													<div className="flex items-center gap-1">
														<span className="text-xs text-slate-500">
															{formatMessageTime(
																conversation.lastMessage.timestamp
															)}
														</span>
														{conversation.unreadCount > 0 && (
															<div className="h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center">
																<span className="text-xs text-white font-bold text-[10px]">
																	{conversation.unreadCount > 9
																		? "9+"
																		: conversation.unreadCount}
																</span>
															</div>
														)}
													</div>
												</div>

												<p
													className={`text-xs truncate ${
														conversation.lastMessage.unread
															? "font-medium text-slate-900"
															: "text-slate-600"
													}`}
												>
													{conversation.type === "group" &&
														conversation.lastMessage.sender !== "admin" && (
															<span className="text-blue-600 font-medium mr-1">
																{conversation.lastMessage.sender.split(" ")[0]}:
															</span>
														)}
													{conversation.lastMessage.content}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Right Side - Chat Interface */}
				<div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm">
					{activeConversation ? (
						<>
							{/* Chat Header */}
							<div className="p-4 border-b border-slate-200/60 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="relative">
											{activeConversation.type === "individual" ? (
												<>
													<Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
														<AvatarImage
															src={activeConversation.participant.avatar}
														/>
														<AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
															{activeConversation.participant.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													{activeConversation.participant.isOnline && (
														<div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white"></div>
													)}
												</>
											) : (
												<div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-md">
													<Users className="h-5 w-5 text-white" />
												</div>
											)}
										</div>
										<div>
											<h3 className="font-semibold text-slate-900">
												{activeConversation.type === "individual"
													? activeConversation.participant.name
													: activeConversation.groupName}
											</h3>
											<p className="text-sm text-slate-600">
												{activeConversation.type === "individual" ? (
													activeConversation.participant.isOnline ? (
														<span className="text-green-600 font-medium">
															Online now
														</span>
													) : (
														`Last seen ${activeConversation.participant.lastSeen}`
													)
												) : (
													`${activeConversation.participants.length} members`
												)}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											className="h-9 w-9 hover:bg-blue-50"
										>
											<Search className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="h-9 w-9 hover:bg-blue-50"
										>
											<Phone className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="h-9 w-9 hover:bg-blue-50"
										>
											<Video className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="h-9 w-9 hover:bg-blue-50"
										>
											<MoreVertical className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</div>

							{/* Messages Area */}
							<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/30 to-white/30">
								{messages.map((message) => (
									<div
										key={message.id}
										className={`flex ${
											message.sender === "admin"
												? "justify-end"
												: "justify-start"
										}`}
									>
										<div
											className={`flex gap-3 items-end max-w-[70%] ${
												message.sender === "admin" ? "flex-row-reverse" : ""
											}`}
										>
											{message.sender !== "admin" &&
												activeConversation.type === "individual" && (
													<Avatar className="h-7 w-7 ring-2 ring-white shadow-sm">
														<AvatarImage
															src={activeConversation.participant.avatar}
														/>
														<AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
															{activeConversation.participant.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
												)}

											<div className="group relative">
												<div
													className={`rounded-2xl px-4 py-2 shadow-sm ${
														message.sender === "admin"
															? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
															: "bg-white border border-slate-200 text-slate-900"
													}`}
												>
													<p className="text-sm leading-relaxed">
														{message.content}
													</p>
												</div>

												<div
													className={`flex items-center gap-1 mt-1 ${
														message.sender === "admin"
															? "justify-end"
															: "justify-start"
													}`}
												>
													<span className="text-xs text-slate-500">
														{formatMessageTime(message.timestamp)}
													</span>
													{message.sender === "admin" &&
														getStatusIcon(message.status)}
												</div>
											</div>

											{message.sender === "admin" && (
												<Avatar className="h-7 w-7 ring-2 ring-white shadow-sm">
													<AvatarImage src="https://i.pravatar.cc/150?img=12" />
													<AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-white text-xs">
														AD
													</AvatarFallback>
												</Avatar>
											)}
										</div>
									</div>
								))}

								{/* Typing Indicator */}
								{isTyping && (
									<div className="flex justify-start">
										<div className="flex gap-3 items-end">
											{activeConversation.type === "individual" && (
												<Avatar className="h-7 w-7 ring-2 ring-white shadow-sm">
													<AvatarImage
														src={activeConversation.participant.avatar}
													/>
													<AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
														{activeConversation.participant.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
											)}
											<div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
												<div className="flex gap-1">
													<div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
													<div
														className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
														style={{ animationDelay: "0.1s" }}
													></div>
													<div
														className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
														style={{ animationDelay: "0.2s" }}
													></div>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Message Input */}
							<div className="p-4 border-t border-slate-200/60 bg-white/80 backdrop-blur-sm">
								<div className="flex items-end gap-3">
									<Button
										variant="outline"
										size="icon"
										className="shrink-0 hover:bg-blue-50 border-slate-300 h-9 w-9"
									>
										<Paperclip className="h-4 w-4" />
									</Button>

									<div className="flex-1 relative">
										<Textarea
											placeholder="Type your message..."
											className="resize-none min-h-[36px] max-h-32 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
											value={messageText}
											onChange={(e) => setMessageText(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter" && !e.shiftKey) {
													e.preventDefault();
													handleSendMessage();
												}
											}}
										/>
										<Button
											variant="ghost"
											size="icon"
											className="absolute right-2 top-1 h-7 w-7 hover:bg-blue-50"
										>
											<Smile className="h-4 w-4" />
										</Button>
									</div>

									<Button
										variant="ghost"
										size="icon"
										className="shrink-0 hover:bg-blue-50 h-9 w-9"
									>
										<Mic className="h-4 w-4" />
									</Button>

									<Button
										onClick={handleSendMessage}
										disabled={!messageText.trim()}
										className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 h-9"
									>
										<Send className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-100/50 to-blue-50/50">
							<div className="text-center">
								<MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-slate-600 mb-2">
									Select a conversation
								</h3>
								<p className="text-slate-500">
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
