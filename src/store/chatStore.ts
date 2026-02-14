import { IChatState, IMessage, IUser } from "@/types/chat.types";
import { create } from "zustand";

interface ExtendedChatState extends IChatState {
  typingUsers: Record<string, string[]>; // conversationId -> userId[]
  setTypingUsers: (conversationId: string, userIds: string[]) => void;
  addTypingUser: (conversationId: string, userId: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;
  clearMessages: () => void; // Add this missing function
  clearCurrentConversation: () => void; // Add this missing function
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
  setCurrentConversation: (currentConversation) => {
    console.log("Setting current conversation:", currentConversation?._id);
    set({ currentConversation });
  },
  
  clearCurrentConversation: () => {
    console.log("Clearing current conversation");
    set({ currentConversation: null, messages: [] });
  },

  addMessage: (message: IMessage) => {
    const currentConversation = get().currentConversation;

    // Only add message if it belongs to current conversation
    if (
      currentConversation &&
      message.conversationId === currentConversation._id
    ) {
      set(
        (state) => {
          // Check if message already exists to prevent duplicates
          const messageExists = state.messages.some(
            (msg) => msg._id === message._id
          );

          if (!messageExists) {
            console.log("Adding single message to conversation:", currentConversation._id);
            // IMPORTANT: Only append to existing messages, don't replace them
            return {
              messages: [...state.messages, message], // Append new message to existing array
            };
          } else {
            console.log("Message already exists, not adding duplicate");
            return state; // Return unchanged state
          }
        },
        false,
      );
    } else {
      console.log("Message not for current conversation, ignoring");
    }
  },

  // Update setMessages to only be used for initial loading, not for single message updates
  setMessages: (messages) => {
    console.log("Setting complete message list (initial load):", messages.length);
    set(() => {
      // Remove duplicates based on message ID
      const uniqueMessages = messages.filter(
        (message, index, self) =>
          index === self.findIndex((m) => m._id === message._id)
      );
      console.log("Set unique messages for initial load:", uniqueMessages.length);
      return { messages: uniqueMessages };
    });
  },

  clearMessages: () => {
    console.log("Clearing messages");
    set({ messages: [] });
  },

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
