import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// MessageBubble Component
export const MessageBubble = ({ message, user, currentConversation, getOtherMember }: any) => {
  const isOwn = message.sender._id === user._id;
  const sender = isOwn ? user : (currentConversation.type === "direct" ? getOtherMember(currentConversation) : message.sender);

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && (
        <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-white shadow-sm">
          <AvatarImage src={sender?.profileImage} className="object-cover" />
          <AvatarFallback className="bg-primary text-white font-montserrat-semibold text-sm">
            {sender?.firstName?.[0]}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && currentConversation.type === "group" && (
          <span className="text-xs text-gray-600 font-montserrat-semibold mb-1 px-1">
            {sender?.firstName} {sender?.lastName}
          </span>
        )}
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isOwn 
            ? 'bg-primary text-white rounded-br-md' 
            : 'bg-white text-gray-900 rounded-bl-md border border-gray-100'
        }`}>
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        </div>
        <span className="text-xs text-gray-1000 mt-1 px-1">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};