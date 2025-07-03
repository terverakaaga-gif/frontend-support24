import { IChatState } from "@/types/chat.types";
import { create } from "zustand";

export const useChatStore = create<IChatState>((set) => ({
	conversations: [],
	currentConversation: null,
	messages: [],
	onlineUsers: [],
	loading: false,
	error: null,
	setConversations: (conversations) => set({ conversations }),
	setCurrentConversation: (currentConversation) => set({ currentConversation }),
	setMessages: (messages) => set({ messages }),
	addMessage: (message) =>
		set((state) => ({ messages: [...state.messages, message] })),

	deleteMessage(messageId) {
		set((state) => ({
			messages: state.messages.filter((msg) => msg._id !== messageId),
		}));
	},
	updateMessage: (messageId, updates) =>
		set((state) => ({
			messages: state.messages.map((msg) =>
				msg._id === messageId._id ? { ...msg, ...updates } : msg
			),
		})),
	setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	updateConversationLastMessage: (conversationId, message) => {
		set((state) => ({
			conversations: state.conversations.map((conv) =>
				conv._id === conversationId
					? { ...conv, lastMessage: message, updatedAt: message.timestamp }
					: conv
			),
		}));
	},
	updateMessageStatus: (messageId, status) => {
		set((state) => ({
			messages: state.messages.map((msg) =>
				msg._id === messageId ? { ...msg, status } : msg
			),
		}));
	},
}));
