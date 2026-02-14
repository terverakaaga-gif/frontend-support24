import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UsersGroupTwoRounded } from "@solar-icons/react";
import { IConversation, IUser } from "@/types/chat.types";
import { useChatStore } from "@/store/chatStore";

interface ConversationItemProps {
  conversation: IConversation;
  user: IUser;
  onClick: () => void;
  isActive: boolean;
}

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

export const ConversationItem = ({
  conversation,
  user,
  onClick,
  isActive,
}: ConversationItemProps) => {
  const { onlineUsers } = useChatStore();
  
  const otherMember = conversation.members.find(
    (member) => member.userId._id !== user._id
  )?.userId;

  const displayName =
    conversation.type === "direct"
      ? `${otherMember?.firstName || ""} ${otherMember?.lastName || ""}`.trim()
      : conversation.name;

  // Fix: Check if the OTHER member is online, not the current user
  const isOtherMemberOnline = otherMember && onlineUsers.some(onlineUser => onlineUser._id === otherMember._id);

  const getLastMessagePreview = () => {
    if (!conversation.lastMessage) return "No messages yet";

    const isOwnMessage = conversation.lastMessage.sender._id === user._id;
    const senderName = conversation.lastMessage.sender.firstName;
    const content = conversation.lastMessage.content;

    if (conversation.type === "group" && !isOwnMessage) {
      return `${senderName}: ${content}`;
    }

    return content;
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-4 cursor-pointer transition-all duration-150 ${
        isActive
          ? "bg-primary-100 border-l-4 border-primary"
          : "hover:bg-gray-100 border-l-4 border-transparent"
      }`}
    >
      {/* Avatar Section */}
      <div className="relative flex-shrink-0">
        {conversation.type === "direct" ? (
          <>
            <Avatar className="h-12 w-12 ring-2 ring-white">
              <AvatarImage
                src={otherMember?.profileImage}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-white font-montserrat-semibold text-sm">
                {otherMember?.firstName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            {/* Fix: Show online status for the other member, not current user */}
            {conversation.type === "direct" && isOtherMemberOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full" />
            )}
          </>
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <UsersGroupTwoRounded className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-montserrat-semibold text-gray-900 truncate text-[15px]">
            {displayName}
          </h3>
          {conversation.lastMessage?.timestamp && (
            <span className="text-xs text-gray-1000 ml-2 flex-shrink-0 font-montserrat-semibold">
              {formatMessageTime(conversation.lastMessage.timestamp)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {conversation.lastMessage?.sender._id === user._id && (
              <span className="text-primary flex-shrink-0">✓</span>
            )}
            <p className="text-[13px] text-gray-600 truncate">
              {getLastMessagePreview()}
            </p>
          </div>

          {(conversation as any).unreadCount > 0 && (
            <Badge className="bg-orange-500 hover:bg-orange-500 text-white h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center text-[11px] font-montserrat-semibold">
              {(conversation as any).unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};