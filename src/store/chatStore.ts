import { IChatState, IUser } from "@/types/chat.types";
import { create } from "zustand";

interface ExtendedChatState extends IChatState {
  typingUsers: Record<string, string[]>; // conversationId -> userId[]
  setTypingUsers: (conversationId: string, userIds: string[]) => void;
  addTypingUser: (conversationId: string, userId: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;
}

export const useChatStore = create<ExtendedChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  onlineUsers: [],
  loading: false,
  error: null,
  typingUsers: {},

  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (currentConversation) => set({ currentConversation }),
  addMessage: (message) =>
    set((state) => {
      // Check if message already exists
      const messageExists = state.messages.some(
        (msg) => msg._id === message._id
      );

      if (messageExists) {
        console.log("Message already exists, skipping:", message._id);
        return state;
      }

      return { messages: [...state.messages, message] };
    }),

  // this remove duplicates
  setMessages: (messages) =>
    set(() => {
      // Remove duplicates based on message ID
      const uniqueMessages = messages.filter(
        (message, index, self) =>
          index === self.findIndex((m) => m._id === message._id)
      );
      return { messages: uniqueMessages };
    }),

  deleteMessage(messageId) {
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
    }));
  },
  updateMessage: (messageId, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId ? { ...msg, ...updates } : msg
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
  setTypingUsers: (conversationId, userIds) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [conversationId]: userIds },
    })),
  addTypingUser: (conversationId, userId) =>
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      if (!current.includes(userId)) {
        return {
          typingUsers: {
            ...state.typingUsers,
            [conversationId]: [...current, userId],
          },
        };
      }
      return state;
    }),
  removeTypingUser: (conversationId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: (state.typingUsers[conversationId] || []).filter(
          (id) => id !== userId
        ),
      },
    })),
}));
