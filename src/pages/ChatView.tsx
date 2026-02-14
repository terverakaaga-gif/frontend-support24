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
} from "@solar-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import useChat from "@/hooks/useChat";
import { useChatStore } from "@/store/chatStore";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import chatServices from "@/api/services/chatService";
import { adminUserService } from "@/api/services/adminUserService";
import { organizationService } from "@/api/services/organizationService";
import { tokenStorage } from "@/api/apiClient";
import { IConversation } from "@/types/chat.types";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { ChatFilterButton } from "@/components/ChatFilterButton";
import { ConversationItem } from "@/components/ConversationItem";
import { ChatCreationModal } from "@/components/ChatCreationModal";
import { MessageBubble } from "@/components/MessageBubble";
import { AddIcon } from "@/components/icons";
import { WaveLoader } from "@/components/Loader";

export default function ChatView() {
  const { user, logout } = useAuth();
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    conversations: chatConversations,
    loadConversations,
    loading,
    setLoading,
    connect,
    selectConversation,
    cleanupSocketListeners,
    sendMessage,
    createNewConversation,
    sendTypingStatus,
  } = useChat();

  const {
    currentConversation,
    messages,
    setCurrentConversation,
    clearMessages, // Add this
    clearCurrentConversation, // Add this
    onlineUsers,
    typingUsers,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [chatType, setChatType] = useState<"direct" | "group" | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

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

  // Auto-scroll effect
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [messages.length]);

  // Initialize socket and load conversations ONCE
  useEffect(() => {
    const initializeChat = async () => {
      const tokens = tokenStorage.getTokens();
      if (tokens?.access?.token) {
        try {
          setIsLoadingConversations(true);
          
          // Connect to socket
          connect(tokens.access.token);
          setSocketConnected(true);
          
          // Load conversations
          await loadConversations(tokens.access.token);
        } catch (error) {
          console.error("Failed to initialize chat:", error);
        } finally {
          setIsLoadingConversations(false);
        }
      }
    };

    initializeChat();

    return () => {
      cleanupSocketListeners();
    };
  }, []); // Empty dependency array - only run once on mount

  // Update the conversation selection effect to prevent unnecessary reloads
  useEffect(() => {
    const selectConversationFromUrl = async () => {
      console.log("=== Conversation Selection ===");
      console.log("URL conversationId:", conversationId);
      console.log("Current conversation:", currentConversation?._id);
      console.log("Available conversations:", chatConversations.length);

      if (conversationId && chatConversations.length > 0 && !isLoadingConversations) {
        const conversation = chatConversations.find(
          (conv) => conv._id === conversationId
        );
        
        if (conversation) {
          // Only load if we're actually switching conversations
          if (!currentConversation || currentConversation._id !== conversationId) {
            console.log("Switching to new conversation, loading messages");
            
            const tokens = tokenStorage.getTokens();
            if (tokens?.access?.token) {
              setIsLoadingMessages(true);
              try {
                await selectConversation(conversationId, tokens.access.token);
                console.log("Successfully switched conversation");
              } catch (error) {
                console.error("Failed to select conversation:", error);
              } finally {
                setIsLoadingMessages(false);
              }
            }
          } else {
            console.log("Same conversation already selected, no action needed");
          }
        } else {
          console.error("Conversation not found in list:", conversationId);
          clearCurrentConversation();
          navigate(
            user.role === "supportWorker"
              ? "/support-worker/chats"
              : user.role === "participant"
              ? "/participant/chats"
              : "/admin/chats"
          );
        }
      } else if (!conversationId) {
        console.log("No conversationId, clearing current conversation");
        clearCurrentConversation();
      }
    };

    selectConversationFromUrl();
  }, [conversationId, chatConversations, isLoadingConversations]); // Removed currentConversation dependency

  // Add a debug effect to monitor current conversation and messages
  useEffect(() => {
    console.log("Current conversation changed:", currentConversation?._id);
    console.log("Messages count:", messages.length);
  }, [currentConversation?._id, messages.length]);

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

  const handleChatSelect = async (chatId: string) => {
    // Close sidebar on mobile when selecting a chat
    setIsSidebarOpen(false);
    
    // Navigate to the new conversation
    const roleRoutes: Record<string, string> = {
      supportWorker: `/support-worker/chat/${chatId}`,
      participant: `/participant/chat/${chatId}`,
      admin: `/admin/chat/${chatId}`,
    };
    navigate(roleRoutes[user.role] || `/admin/chat/${chatId}`);
  };

  // Update handleSendMessage to not trigger any reloads
  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentConversation || isSending) return;

    setIsSending(true);
    const messageToSend = messageText.trim();
    setMessageText(""); // Clear input immediately

    try {
      // Send message - this will use optimistic updates
      await sendMessage(messageToSend, "text");
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

  // Handle typing indicator
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;

    if (messageText.length > 0 && currentConversation) {
      sendTypingStatus(currentConversation._id, true);

      // Clear previous timer
      if (typingTimer) {
        clearTimeout(typingTimer);
      }

      // Set timer to stop typing indicator
      typingTimer = setTimeout(() => {
        sendTypingStatus(currentConversation._id, false);
      }, 2000);
    } else if (currentConversation) {
      sendTypingStatus(currentConversation._id, false);
    }

    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [messageText, currentConversation?._id]);

  // Get typing users for current conversation (excluding current user)
  const currentTypingUsers = currentConversation
    ? (typingUsers[currentConversation._id] || []).filter(
        (userId) => userId !== user._id
      )
    : [];

  const isUserOnline = (userId: string) => {
    return onlineUsers.some((onlineUser) => onlineUser._id === userId);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        // Deselect the user
        return prev.filter((id) => id !== userId);
      } else {
        // Add the user to selection
        return [...prev, userId];
      }
    });
  };

  // Fix the chatType useEffect to prevent infinite loops
  useEffect(() => {
    // Only set chat type when creating chat and users are selected
    if (isCreatingChat) {
      if (selectedUsers.length > 1) {
        setChatType('group');
      } else if (selectedUsers.length === 1) {
        setChatType('direct');
      } else {
        setChatType(null);
      }
    }
  }, [selectedUsers.length, isCreatingChat]); // Removed chatType dependency

  const handleCreateChat = async () => {
    const tokens = tokenStorage.getTokens();
    if (!tokens?.access?.token) return;

    try {
      setLoading(true);
      let newConversation;

      if (chatType === "direct") {
        if (selectedUsers.length !== 1) {
          console.error("Direct chat requires exactly 1 user");
          return;
        }
        
        // Check if direct conversation already exists
        const existingDirectConv = chatConversations.find(conv => 
          conv.type === "direct" && 
          conv.members.length === 2 && // Ensure it's a direct chat
          conv.members.some(member => member.userId._id === selectedUsers[0]) &&
          conv.members.some(member => member.userId._id === user._id)
        );

        if (existingDirectConv) {
          console.log("Direct conversation already exists, navigating to it");
          // Navigate to existing conversation instead of creating new one
          const roleRoutes: Record<string, string> = {
            supportWorker: `/support-worker/chat/${existingDirectConv._id}`,
            participant: `/participant/chat/${existingDirectConv._id}`,
            admin: `/admin/chat/${existingDirectConv._id}`,
          };
          navigate(roleRoutes[user.role] || `/admin/chat/${existingDirectConv._id}`);
          
          setIsCreatingChat(false);
          setSelectedUsers([]);
          setGroupName("");
          setChatType(null);
          return;
        }

        newConversation = await createNewConversation(
          "direct",
          selectedUsers,
          tokens.access.token,
          undefined, // No name for direct chat
          undefined, // No description for direct chat
          organizations[0]?._id
        );
      } else {
        if (selectedUsers.length < 2) {
          console.error("Group chat requires at least 2 users");
          return;
        }
        if (!groupName.trim()) {
          console.error("Group chat requires a name");
          return;
        }
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
        // Navigate to the new conversation
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
      setChatType(null);
    }
  };

  const directChatCount = chatConversations.filter(
    (c) => c.type === "direct"
  ).length;

  const groupChatCount = chatConversations.filter(
    (c) => c.type === "group"
  ).length;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-100 font-montserrat space-y-4 sm:space-y-6 md:space-y-8">
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
              ? "/support-worker/profile"
              : user.role === "participant"
              ? "/participant/profile"
              : "/admin/profile"
          );
        }}
        onLogout={logout}
        rightComponent={
          <>
            {/* Mobile sidebar toggle button */}
            <Button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden mr-2 h-10 w-10 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
            {/* Create New Chat Button */}
            {user.role !== "supportWorker" && (
              <Button
                onClick={() => {
                  setIsCreatingChat(true);
                  setChatType(null);
                }}
                className="w-full sm:w-auto h-10 sm:h-11 bg-primary hover:bg-primary-700 text-white font-montserrat-semibold shadow-sm text-sm sm:text-base"
              >
                <AddIcon size={20} className="sm:w-6 sm:h-6" />
                <span className="hidden sm:inline ml-2">Create New Chat</span>
              </Button>
            )}
          </>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 sm:gap-5 h-[85vh] md:h-[85vh]">
        {/* Left Sidebar - Conversations List */}
        <div
          className={`w-full md:w-[400px] shadow-sm rounded-xl flex flex-col bg-white overflow-hidden fixed md:static inset-0 z-50 md:z-auto transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          {/* Close button for mobile */}
          <div className="md:hidden p-4 border-b border-gray-200">
            <Button
              onClick={() => setIsSidebarOpen(false)}
              className="h-8 w-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {/* Conversation Search */}
          <div className="px-4 pt-4 pb-3 bg-white">
            <div className="relative">
              <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-white border-gray-200 focus:border-primary-300 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 pb-3 flex gap-2 bg-white overflow-x-auto">
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
                <WaveLoader />
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

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Right Side - Chat Interface */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative">
                      {currentConversation.type === "direct" ? (
                        <>
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-white shadow-sm">
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
                                  ?.firstName?.[0]
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
                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary rounded-full flex items-center justify-center shadow-sm">
                          <UsersGroupTwoRounded className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-montserrat-semibold text-gray-900 text-sm sm:text-[17px] truncate">
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
                      <p className="text-xs sm:text-sm text-gray-1000 mt-0.5 truncate">
                        {currentConversation.type === "direct" ? (
                          getOtherMember(currentConversation) &&
                          isUserOnline(
                            getOtherMember(currentConversation)!._id
                          ) ? (
                            <span className="text-green-600 font-montserrat-semibold flex items-center gap-1">
                              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                              Online
                            </span>
                          ) : (
                            `Last seen ${formatMessageTime(
                              currentConversation.updatedAt
                            )}`
                          )
                        ) : currentTypingUsers.length > 0 ? (
                          <span className="text-primary font-montserrat-semibold">
                            {currentTypingUsers.length === 1
                              ? "Someone is typing..."
                              : `${currentTypingUsers.length} people are typing...`}
                          </span>
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
                      className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-gray-100 rounded-full"
                    >
                      <OutgoingCall className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-gray-100 rounded-full"
                    >
                      <Videocamera className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-gray-100 rounded-full"
                    >
                      <InfoCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gray-100">
                {isLoadingMessages ? (
                  <>
                  {/* Loading bubbles */}
                  <div className="flex items-center justify-center h-full">
                    <div className="space-y-4 w-full max-w-2xl">
                      {/* Loading bubble 1 - left side */}
                      <div className="flex gap-3 animate-pulse">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="h-16 bg-gray-200 rounded-2xl rounded-bl-md max-w-md"></div>
                          <div className="h-3 w-20 bg-gray-200 rounded"></div>
                        </div>
                      </div>

                      {/* Loading bubble 2 - right side */}
                      <div className="flex gap-3 justify-end animate-pulse" style={{ animationDelay: '0.2s' }}>
                        <div className="flex flex-col gap-2 items-end flex-1">
                          <div className="h-12 bg-primary/20 rounded-2xl rounded-br-md max-w-sm"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>

                      {/* Loading bubble 3 - left side */}
                      <div className="flex gap-3 animate-pulse" style={{ animationDelay: '0.4s' }}>
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="h-20 bg-gray-200 rounded-2xl rounded-bl-md max-w-lg"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
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
                  <div className="max-w-6xl mx-auto">
                    {/* Date Divider */}
                    <div className="flex items-center justify-center my-6">
                      <div className="bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
                        <span className="text-xs font-montserrat-semibold text-gray-600">
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
                    {currentTypingUsers.length > 0 && (
                      <div className="flex gap-3 mb-4">
                        <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-white shadow-sm">
                          <AvatarFallback className="bg-primary text-white font-montserrat-semibold text-sm">
                            T
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
                      <WaveLoader />
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
            chatType={chatType}
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