// pages/ChatView.tsx
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plain3,
  Magnifer,
  InfoCircle,
  OutgoingCall,
  Videocamera,
  UsersGroupTwoRounded,
  Paperclip,
  Microphone2,
  SmileCircle,
  Filter,
  Bell,
} from "@solar-icons/react";
import { Loader2, Plus } from "lucide-react";
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
import { ConversationItem } from "@/components/ConversationItem";
import { ChatFilterButton } from "@/components/ChatFilterButton";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";

// Message Component
const MessageBubble = ({
  message,
  user,
  currentConversation,
  getOtherMember,
}) => {
  const isOwnMessage = message.sender._id === user._id;

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusIcon = (status: string) => {
    if (status === "read") {
      return (
        <svg
          className="h-4 w-4 text-primary"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
          <path d="M11.354 1.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z" />
        </svg>
      );
    }
    return (
      <svg
        className="h-4 w-4 text-gray-400"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
      </svg>
    );
  };

  return (
    <div
      className={`flex gap-3 mb-4 ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isOwnMessage && (
        <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-white shadow-sm">
          <AvatarImage
            src={
              currentConversation.type === "direct"
                ? getOtherMember(currentConversation)?.profileImage
                : message.sender.profileImage
            }
            className="object-cover"
          />
          <AvatarFallback className="bg-primary text-white font-montserrat-semibold text-sm">
            {currentConversation.type === "direct"
              ? getOtherMember(currentConversation)?.firstName[0]
              : message.sender.firstName[0]}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`flex flex-col max-w-[70%] ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        {!isOwnMessage && currentConversation.type === "group" && (
          <span className="text-xs font-medium text-gray-600 mb-1 px-1">
            {message.sender.firstName}
          </span>
        )}

        <div
          className={`rounded-2xl px-4 py-2.5 shadow-sm ${
            isOwnMessage
              ? "bg-primary text-white rounded-br-md"
              : "bg-white text-gray-900 rounded-bl-md border border-gray-100"
          }`}
        >
          <p className="text-[15px] leading-relaxed break-words">
            {message.content}
          </p>
        </div>

        <div
          className={`flex items-center gap-1.5 mt-1 px-1 ${
            isOwnMessage ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span className="text-xs text-gray-1000">
            {formatMessageTime(message.createdAt)}
          </span>
          {isOwnMessage && getStatusIcon(message.status)}
        </div>
      </div>
    </div>
  );
};

export default function ChatView() {
  const { user, logout } = useAuth();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const { data: all_users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["support-worker-organizations"],
    queryFn: async () => {
      if (user.role === "participant") {
        return await chatServices.getMySupportWorkers();
      }
      if (user.role === "admin") {
        const workers = await adminUserService.getWorkers();
        const participants = await adminUserService.getParticipants();
        return [...workers.users, ...participants.users];
      }
      return [];
    },
  });

  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => await organizationService.getOrganizations(),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const tokens = tokenStorage.getTokens();
    if (tokens?.access?.token) {
      connect(tokens.access.token);
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

  useEffect(() => {
    const tokens = tokenStorage.getTokens();
    if (currentConversation && tokens?.access?.token) {
      setIsLoadingMessages(true);
      loadMessages(currentConversation._id, tokens.access.token).finally(() => {
        setIsLoadingMessages(false);
      });
    }
  }, [currentConversation, conversationId]);

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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [messageText]);

  const handleChatSelect = (chatId: string) => {
    const roleRoutes: Record<string, string> = {
      supportWorker: `/support-worker/chat/${chatId}`,
      participant: `/participant/chat/${chatId}`,
      admin: `/admin/chat/${chatId}`,
    };
    navigate(roleRoutes[user.role] || `/admin/chat/${chatId}`);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentConversation || isSending) return;

    setIsSending(true);
    const messageToSend = messageText.trim();
    setMessageText("");

    try {
      await sendMessage(messageToSend, "text");
      await loadConversations(tokenStorage.getTokens()?.access.token);
      await loadMessages(
        currentConversation._id,
        tokenStorage.getTokens()?.access.token
      );

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to send message:", error);
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
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) {
      const days = Math.floor(diffInMinutes / 1440);
      return days === 1 ? "Yesterday" : `${days}d`;
    }
    return date.toLocaleDateString();
  };

  const filteredConversations = chatConversations.filter((conv) => {
    const matchesSearch =
      searchQuery === "" ||
      (conv.type === "direct" &&
        conv.members
          .map((m) => `${m.userId.firstName} ${m.userId.lastName}`)
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
    return onlineUsers.some((u) => u._id === userId);
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
        const roleRoutes: Record<string, string> = {
          supportWorker: `/support-worker/chat/${newConversation._id}`,
          participant: `/participant/chat/${newConversation._id}`,
          admin: `/admin/chat/${newConversation._id}`,
        };
        navigate(roleRoutes[user.role] || `/admin/chat/${newConversation._id}`);
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

  const directChatCount = chatConversations.filter(
    (c) => c.type === "direct"
  ).length;

  const groupChatCount = chatConversations.filter(
    (c) => c.type === "group"
  ).length;

  return (
    <div className="min-h-screen p-10 bg-gray-100 font-montserrat space-y-8">
      {/* Header */}
      <GeneralHeader
        title={
          user.role === "supportWorker"
            ? pageTitles.supportWorker["/support-worker/chats"].title
            : user.role === "participant"
            ? pageTitles.participant["/participant/chats"].title
            : pageTitles.admin["/admin/chats"].title
        }
        subtitle={
          user.role === "supportWorker"
            ? pageTitles.supportWorker["/support-worker/chats"].subtitle
            : user.role === "participant"
            ? pageTitles.participant["/participant/chats"].subtitle
            : pageTitles.admin["/admin/chats"].subtitle
        }
        user={user}
        onViewProfile={() => {
          navigate(
            user.role === "supportWorker"
              ? Object.keys(pageTitles.supportWorker).find(
                  (key) =>
                    key !== "/support-worker/chats" &&
                    pageTitles.supportWorker[key] ===
                      pageTitles.supportWorker["/support-worker/profile"]
                )
              : user.role === "participant"
              ? Object.keys(pageTitles.participant).find(
                  (key) =>
                    key !== "/participant/chats" &&
                    pageTitles.participant[key] ===
                      pageTitles.participant["/participant/profile"]
                )
              : Object.keys(pageTitles.admin).find(
                  (key) =>
                    key !== "/admin/chats" &&
                    pageTitles.admin[key] === pageTitles.admin["/admin/profile"]
                )
          );
        }}
        onLogout={logout}
        rightComponent={
          <>
            {/* Create New Chat Button (Direct or Group) */}
            {user.role !== "supportWorker" && (
              <Button
                onClick={() => setIsCreatingChat(true)}
                className="w-full h-11 bg-primary hover:bg-primary-700 text-white font-medium shadow-sm"
              >
                <Plus size={24} />
                Create New Chat
              </Button>
            )}
          </>
        }
      />

      <div className="flex flex-col md:flex-row gap-5 h-[85vh]">
        {/* Left Sidebar - Conversations List */}
        <div className="w-[400px] shadow-sm rounded-xl flex flex-col bg-white overflow-hidden">
          {/* Conversation Search */}
          <div className="px-4 pt-4 pb-3 bg-white">
            <div className="relative">
              <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-white border-gray-200 focus:border-primary-300"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 pb-3 flex gap-2 bg-white">
            <ChatFilterButton
              active={selectedFilter === "all"}
              onClick={() => setSelectedFilter("all")}
              label="All"
              count={chatConversations.length}
            />
            <ChatFilterButton
              active={selectedFilter === "direct"}
              onClick={() => setSelectedFilter("direct")}
              label="Direct Chat"
              count={directChatCount}
            />
            <ChatFilterButton
              active={selectedFilter === "group"}
              onClick={() => setSelectedFilter("group")}
              label="Group Chat"
              count={groupChatCount}
            />
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1 bg-white">
            {isLoadingConversations ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 text-primary mx-auto mb-3 animate-spin" />
                <p className="text-sm text-gray-1000">
                  Loading conversations...
                </p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mb-4 text-gray-300">
                  <svg
                    className="mx-auto h-20 w-20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-montserrat-semibold text-gray-700 mb-2">
                  No conversations found
                </h3>
                <p className="text-sm text-gray-1000 mb-4">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    conversation={conversation}
                    user={user}
                    onClick={() => handleChatSelect(conversation._id)}
                    isActive={currentConversation?._id === conversation._id}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right Side - Chat Interface */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {currentConversation.type === "direct" ? (
                        <>
                          <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                            <AvatarImage
                              src={
                                getOtherMember(currentConversation)
                                  ?.profileImage
                              }
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-primary text-white font-montserrat-semibold">
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
                              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                        </>
                      ) : (
                        <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center shadow-sm">
                          <UsersGroupTwoRounded className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-montserrat-semibold text-gray-900 text-[17px]">
                        {currentConversation.type === "direct"
                          ? `${
                              getOtherMember(currentConversation)?.firstName ||
                              ""
                            } ${
                              getOtherMember(currentConversation)?.lastName ||
                              ""
                            }`.trim()
                          : currentConversation.name}
                      </h3>
                      <p className="text-sm text-gray-1000 mt-0.5">
                        {currentConversation.type === "direct" ? (
                          getOtherMember(currentConversation) &&
                          isUserOnline(
                            getOtherMember(currentConversation)!._id
                          ) ? (
                            <span className="text-green-600 font-medium flex items-center gap-1">
                              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                              Online
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

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-gray-100 rounded-full"
                    >
                      <OutgoingCall className="h-5 w-5 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-gray-100 rounded-full"
                    >
                      <Videocamera className="h-5 w-5 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-gray-100 rounded-full"
                    >
                      <InfoCircle className="h-5 w-5 text-gray-600" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 px-6 py-4 bg-gray-100">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 text-primary mx-auto mb-3 animate-spin" />
                      <p className="text-sm text-gray-1000">
                        Loading messages...
                      </p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="mb-4 text-gray-300">
                        <svg
                          className="mx-auto h-24 w-24"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-montserrat-semibold text-gray-700 mb-2">
                        No messages yet
                      </h3>
                      <p className="text-sm text-gray-1000">
                        Start the conversation by sending a message
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto">
                    {/* Date Divider */}
                    <div className="flex items-center justify-center my-6">
                      <div className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
                        <span className="text-xs font-medium text-gray-600">
                          Today
                        </span>
                      </div>
                    </div>

                    {messages.map((message) => (
                      <MessageBubble
                        key={message._id}
                        message={message}
                        user={user}
                        currentConversation={currentConversation}
                        getOtherMember={getOtherMember}
                      />
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex gap-3 mb-4">
                        <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-white shadow-sm">
                          <AvatarImage
                            src={
                              getOtherMember(currentConversation)?.profileImage
                            }
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary text-white font-montserrat-semibold text-sm">
                            {getOtherMember(currentConversation)?.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <div className="flex items-end gap-3 max-w-4xl mx-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-10 w-10 hover:bg-gray-100 rounded-full"
                  >
                    <Paperclip className="h-5 w-5 text-gray-600" />
                  </Button>

                  <div className="flex-1 relative bg-gray-100 rounded-2xl border border-gray-200 focus-within:border-primary-300 focus-within:bg-white transition-colors">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Type your message....."
                      className="resize-none min-h-[44px] max-h-[120px] border-0 bg-transparent pr-12 py-3 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px]"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isSending}
                      rows={1}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 hover:bg-gray-200 rounded-full"
                    >
                      <SmileCircle className="h-5 w-5 text-gray-1000" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-10 w-10 hover:bg-gray-100 rounded-full"
                  >
                    <Microphone2 className="h-5 w-5 text-gray-600" />
                  </Button>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || isSending}
                    className="shrink-0 h-10 w-10 bg-primary hover:bg-primary-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 p-0"
                  >
                    {isSending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Plain3 className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <div className="text-center max-w-md px-4">
                <div className="mb-6 text-gray-300">
                  <svg
                    className="mx-auto h-32 w-32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-montserrat-semibold text-gray-800 mb-3">
                  Select a conversation
                </h3>
                <p className="text-gray-1000 leading-relaxed">
                  Choose a conversation from the list to start messaging or
                  create a new one to begin chatting
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Creation Modal */}
        {isCreatingChat && (
          <ChatCreationModal
            isOpen={isCreatingChat}
            onClose={() => {
              setIsCreatingChat(false);
              setSelectedUsers([]);
              setGroupName("");
              setChatType(null);
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
      </div>
    </div>
  );
}
