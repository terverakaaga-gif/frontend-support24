import { useContext } from "react";
import { ChatContext } from "@/contexts/ChatContext";
import { useChatStore } from "@/store/chatStore";

export default function useChat() {
	const context = useContext(ChatContext);
	const chatStore = useChatStore();

	if (!context) {
		throw new Error("useChat must be used within a ChatProvider");
	}

	// Return both context methods and store state
	return {
		// Context methods
		...context,

		// Store state and actions
		conversations: chatStore.conversations,
		currentConversation: chatStore.currentConversation,
		messages: chatStore.messages,
		onlineUsers: chatStore.onlineUsers,
		loading: chatStore.loading,
		error: chatStore.error,

		// Store actions (in case you need them)
		setConversations: chatStore.setConversations,
		setCurrentConversation: chatStore.setCurrentConversation,
		setMessages: chatStore.setMessages,
		addMessage: chatStore.addMessage,
		updateMessage: chatStore.updateMessage,
		deleteMessage: chatStore.deleteMessage,
		setOnlineUsers: chatStore.setOnlineUsers,
		setLoading: chatStore.setLoading,
		setError: chatStore.setError,
	};
}
