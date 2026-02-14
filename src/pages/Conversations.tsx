import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import useChat from "@/hooks/useChat";
import { tokenStorage } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { organizationService } from "@/api/services/organizationService";
import { useChatStore } from "@/store/chatStore";
import { adminUserService } from "@/api/services/adminUserService";
import { useNavigate } from "react-router-dom";
import chatServices from "@/api/services/chatService";
import Loader from "@/components/Loader";
import { ChatCreationModal } from "@/components/ChatCreationModal";
import { Bell, Magnifer, Filter } from "@solar-icons/react";
import { ConversationItem } from "@/components/ConversationItem";
import { ChatFilterButton } from "@/components/ChatFilterButton";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { AddIcon } from "@/components/icons";

export default function Conversations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatType, setChatType] = useState<"direct" | "group" | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const {
    loadConversations,
    connect,
    loading,
    setLoading,
    cleanupSocketListeners,
    conversations: chatConversations,
    createNewConversation,
  } = useChat();

  const { setCurrentConversation, currentConversation } = useChatStore();

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

    if (tokens?.access?.token && conv) {
      setCurrentConversation(conv);

      const roleRoutes: Record<string, string> = {
        supportWorker: `/support-worker/chat/${conv._id}`,
        participant: `/participant/chat/${conv._id}`,
        admin: `/admin/chat/${conv._id}`,
      };

      navigate(roleRoutes[user.role] || `/admin/chat/${conv._id}`);
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
        organizations[0]?._id
      );

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
        organizations[0]?._id
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

  const directChatCount = chatConversations.filter(
    (c) => c.type === "direct"
  ).length;

  const groupChatCount = chatConversations.filter(
    (c) => c.type === "group"
  ).length;

  useEffect(() => {
    // Dynamically set chat type based on selected users count
    if (selectedUsers.length === 0) {
      setChatType(null);
    } else if (selectedUsers.length === 1) {
      setChatType("direct");
    } else {
      setChatType("group");
    }
  }, [selectedUsers.length]); // Only depend on selectedUsers.length, not chatType

  if (loadingUsers) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-100 font-montserrat space-y-4 md:space-y-8">
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
                className="w-full h-11 bg-primary hover:bg-primary-700 text-white font-montserrat-semibold  shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <AddIcon size={24} />
                Create New Chat
              </Button>
            )}
          </>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 md:gap-5 h-[85vh]">
        {/* Left Sidebar - Conversations List */}
        <div className="w-full md:w-[400px] shadow-sm rounded-xl flex flex-col bg-white overflow-hidden">
          {/* Conversation Search */}
          <div className="px-4 pt-4 pb-3">
            <div className="relative">
              <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-8 py-3 md:py-5 border-gray-200 focus:border-primary-300 text-sm md:text-base"
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
            <div className="divide-y divide-gray-100">
              {filteredConversations.length === 0 ? (
                <div className="p-4 md:p-8 text-center">
                  <div className="mb-4 text-gray-300">
                    <svg
                      className="mx-auto h-16 w-16 md:h-20 md:w-20"
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
                  <h3 className="text-lg md:text-xl font-montserrat-semibold text-gray-700 mb-2">
                    No conversations found
                  </h3>
                  <p className="text-sm text-gray mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button
                    onClick={() => setIsCreatingChat(true)}
                    className="w-full h-11 bg-primary hover:bg-primary-700 text-white font-montserrat-semibold  shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <AddIcon size={24} />
                    Start New Chat
                  </Button>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    conversation={conversation}
                    user={user}
                    onClick={() => handleChatClick(conversation._id)}
                    isActive={currentConversation?._id === conversation._id}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area - Empty State or Chat View */}
        <div className="flex-1 flex items-center justify-center bg-white rounded-xl shadow-sm p-4 md:p-0">
          <div className="text-center max-w-md px-4">
            <div className="mb-6 text-gray-300">
              <svg
                className="mx-auto h-24 w-24 md:h-32 md:w-32"
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
            <h3 className="text-xl md:text-2xl font-montserrat-semibold mb-3">
              Select a conversation
            </h3>
            <p className="text-gray leading-relaxed text-sm md:text-base">
              Choose a conversation from the list to start messaging or create a
              new one to begin chatting
            </p>
          </div>
        </div>

        {/* Chat Creation Modal */}
        {user.role !== "supportWorker" && isCreatingChat && (
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
