import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeSocket, getSocket, disconnectSocket } from "../lib/socket";
import { useChatStore } from "@/store/chatStore";
import { tokenStorage } from "@/api/apiClient";
import {
  IConversation,
  TConversationType,
  TMessageType,
} from "@/types/chat.types";
import chatServices from "@/api/services/chatService";
import { useAuth } from "./AuthContext";

interface ChatContextType {
  connect: (token: string) => void;
  disconnect: () => void;
  loadConversations: (token: string) => Promise<void>;
  selectConversation: (conversationId: string, token: string) => Promise<void>;
  sendMessage: (
    content: string,
    type?: TMessageType,
    attachments?: string[]
  ) => Promise<void>;
  createNewConversation: (
    type: TConversationType,
    memberIds: string[],
    token: string,
    name?: string,
    description?: string,
    organizationId?: string
  ) => Promise<IConversation>;
  cleanupSocketListeners: () => void;
  loadMessages: (conversationId: string, token: string) => Promise<void>;
  sendTypingStatus: (conversationId: string, isTyping: boolean) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    setConversations,
    setCurrentConversation,
    setMessages,
    messages,
    addMessage,
    updateMessage,
    setOnlineUsers,
    setLoading,
    setError,
    currentConversation,
    conversations,
    updateConversationLastMessage,
    updateMessageStatus,
    setTypingUsers,
    addTypingUser,
    removeTypingUser,
  } = useChatStore();

  const [socketInitialized, setSocketInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  const connect = (token: string) => {
    try {
      // Disconnect existing socket first
      try {
        const existingSocket = getSocket();
        if (existingSocket) {
          existingSocket.removeAllListeners();
          existingSocket.disconnect();
        }
      } catch (err) {
        // No existing socket
      }

      initializeSocket(token);
      const socket = getSocket();

      socket.on("connect", () => {
        console.log("Socket connected");
        setSocketInitialized(true);
        setIsConnected(true);
        
        // Join all conversation rooms on connect
        const currentConversations = useChatStore.getState().conversations;
        currentConversations.forEach((conv) => {
          socket.emit("join_conversation", { conversationId: conv._id });
        });
      });

      socket.on("authenticated", (data) => {
        console.log("Socket authenticated", data);
        // Request online users list
        socket.emit("get_online_users");
      });

      // Handle new messages - FIXED: Better conversation isolation
      socket.on("new_message", (message) => {
        console.log("Received new message:", message);
        
        const currentConversationId = useChatStore.getState().currentConversation?._id;
        const currentMessages = useChatStore.getState().messages;

        // Check if message already exists to prevent duplicates
        const messageExists = currentMessages.some((msg) => msg._id === message._id);

        if (!messageExists) {
          // Only add message to UI if it's for the currently active conversation
          if (currentConversationId === message.conversationId) {
            console.log("Adding new message to current conversation:", message.conversationId);
            addMessage(message); // This should add to existing messages, not replace them
          } else {
            console.log("Message for different conversation:", message.conversationId, "current:", currentConversationId);
          }

          // Always update conversation list with new last message (for conversation previews)
          updateConversationLastMessage(message.conversationId, {
            messageId: message._id,
            content: message.content,
            sender: message.sender,
            timestamp: message.createdAt,
            messageType: message.type,
          });
        } else {
          console.log("Duplicate message received, ignoring");
        }
      });

      // Handle message status updates
      socket.on("message_sent", (data) => {
        console.log("Message sent:", data);
        if (data.messageId) {
          updateMessageStatus(data.messageId, "sent");
        }
      });

      socket.on("message_delivered", (data) => {
        console.log("Message delivered:", data);
        updateMessageStatus(data.messageId, "delivered");
      });

      socket.on("message_read", (data) => {
        console.log("Message read:", data);
        data.messageIds?.forEach((messageId: string) => {
          updateMessageStatus(messageId, "read");
        });
      });

      // Handle typing indicators
      socket.on("user_typing", (data) => {
        console.log("User typing:", data);
        if (data.isTyping) {
          addTypingUser(data.conversationId, data.userId);
        } else {
          removeTypingUser(data.conversationId, data.userId);
        }
      });

      // Handle user presence
      socket.on("online_users_list", (users) => {
        console.log("Online users:", users);
        setOnlineUsers(
          users.map((user: any) => ({
            _id: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            profileImage: user.profileImage,
          }))
        );
      });

      socket.on("user_status_change", (data) => {
        console.log("User status change:", data);
        if (data.status === "online") {
          socket.emit("get_online_users");
        } else {
          const currentOnlineUsers = useChatStore.getState().onlineUsers;
          setOnlineUsers(
            currentOnlineUsers.filter((user) => user._id !== data.userId)
          );
        }
      });

      // Handle conversation creation
      socket.on("conversation_created", (conversation) => {
        console.log("New conversation created:", conversation);
        const currentConversations = useChatStore.getState().conversations;
        setConversations([conversation, ...currentConversations]);
        
        // Join the new conversation room
        socket.emit("join_conversation", { conversationId: conversation._id });
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
        setError(error.message || "Connection error");
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setSocketInitialized(false);
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setError("Failed to connect to chat server");
        setSocketInitialized(false);
        setIsConnected(false);
      });

    } catch (err) {
      console.error("Failed to connect:", err);
      setError("Failed to connect to chat server");
    }
  };

  const disconnect = () => {
    try {
      try {
        const socket = getSocket();
        if (socket) {
          socket.removeAllListeners();
          socket.disconnect();
        }
      } catch (err) {
        console.log("No socket to disconnect");
      }
      
      disconnectSocket();
      setSocketInitialized(false);
      setIsConnected(false);
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  const loadConversations = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatServices.getConversations(token);

      if (response.conversations && Array.isArray(response.conversations)) {
        setConversations(response.conversations);
        
        // Join all conversation rooms after loading
        if (socketInitialized) {
          const socket = getSocket();
          response.conversations.forEach((conv) => {
            socket.emit("join_conversation", { conversationId: conv._id });
          });
        }
      } else {
        setConversations([]);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError("Failed to load conversations");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // Update the selectConversation function with better logging and error handling
  const selectConversation = async (conversationId: string, token: string) => {
    console.log("=== ChatContext selectConversation ===");
    console.log("Target conversation:", conversationId);
    
    setLoading(true);
    setError(null);
    
    try {
      // Find conversation in current list
      const conversation = conversations.find((c) => c._id === conversationId);
      
      if (!conversation) {
        console.error("Conversation not found in context list:", conversationId);
        setError("Conversation not found");
        setLoading(false);
        return;
      }

      console.log("Found conversation:", conversation.name || conversation.type);

      // Get current conversation to check if we're actually switching
      const currentConv = useChatStore.getState().currentConversation;
      const isActuallySwitching = !currentConv || currentConv._id !== conversationId;

      if (isActuallySwitching) {
        console.log("Actually switching conversations, clearing and loading messages");
        
        // Clear messages only when switching
        setMessages([]);
        
        // Set current conversation
        setCurrentConversation(conversation);

        // Join conversation room
        if (socketInitialized) {
          const socket = getSocket();
          console.log("Joining conversation room:", conversationId);
          socket.emit("join_conversation", { conversationId });
        }

        // Load messages for this specific conversation
        console.log("Loading messages for conversation:", conversationId);
        const response = await chatServices.getMessages(token, conversationId);
        
        if (response && response.messages && Array.isArray(response.messages)) {
          // Double check we're still on the same conversation
          const finalCurrentConv = useChatStore.getState().currentConversation;
          if (finalCurrentConv && finalCurrentConv._id === conversationId) {
            console.log("Setting initial messages for conversation:", conversationId, "count:", response.messages.length);
            setMessages(response.messages);
          }
        } else {
          console.log("No messages found for conversation:", conversationId);
          setMessages([]);
        }
      } else {
        console.log("Same conversation already selected, no reload needed");
        // Just make sure we're joined to the room
        if (socketInitialized) {
          const socket = getSocket();
          socket.emit("join_conversation", { conversationId });
        }
      }
    } catch (err) {
      console.error("Failed to select conversation:", err);
      setError("Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Update the sendMessage function to not reload messages
  const sendMessage = async (content: string, type: TMessageType = "text") => {
    if (!currentConversation) {
      setError("No conversation selected");
      return;
    }

    const tokens = tokenStorage.getTokens();
    const token = tokens?.access?.token;

    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      // Create optimistic message for immediate UI feedback
      const optimisticMessage = {
        _id: `temp-${Date.now()}`, // Temporary ID
        content,
        type,
        sender: {
          _id: user?._id || '',
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          role: user?.role || 'user',
          profileImage: user?.profileImage,
        },
        conversationId: currentConversation._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'sending' as const,
        readBy: [],
        reactions: [],
        attachments: [],
        mentions: [],
        readReceipts: [],
        deletedFor: [],
      };

      // Add optimistic message immediately
      addMessage(optimisticMessage);

      // Send message through REST API
      const response = await chatServices.sendMessage(
        token,
        currentConversation._id,
        content,
        type
      );

      console.log("Message sent via API:", response);
      
      // Remove the optimistic message and let the real message come through socket
      const currentMessages = useChatStore.getState().messages;
      const filteredMessages = currentMessages.filter(msg => msg._id !== optimisticMessage._id);
      setMessages(filteredMessages);
      
      // The real message will come through the socket event
    
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
      
      // Remove the optimistic message on error
      const currentMessages = useChatStore.getState().messages;
      const filteredMessages = currentMessages.filter(msg => msg._id !== optimisticMessage._id);
      setMessages(filteredMessages);
    }
  };

  const sendTypingStatus = (conversationId: string, isTyping: boolean) => {
    if (socketInitialized && isConnected) {
      try {
        const socket = getSocket();
        if (isTyping) {
          socket.emit("typing_start", { conversationId, isTyping: true });
        } else {
          socket.emit("typing_stop", { conversationId, isTyping: false });
        }
      } catch (err) {
        console.error("Failed to send typing status:", err);
      }
    }
  };

  const loadMessages = async (conversationId: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatServices.getMessages(token, conversationId);
      if (response.messages && Array.isArray(response.messages)) {
        setMessages(response.messages);
      } else {
        setMessages([]);
      }

      // Join conversation room after loading messages
      if (socketInitialized) {
        const socket = getSocket();
        socket.emit("join_conversation", { conversationId });
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Update createNewConversation to be more conservative
  const createNewConversation = async (
    type: "direct" | "group",
    memberIds: string[],
    token: string,
    name?: string,
    description?: string,
    organizationId?: string
  ) => {
    try {
      console.log("Creating conversation:", { type, memberIds, name });
      
      const response = await chatServices.createConversation(
        token,
        type,
        memberIds,
        name,
        description,
        organizationId
      );

      console.log("Conversation created:", response);

      if (response && response.conversation) {
        // Add to local state
        const currentConversations = useChatStore.getState().conversations;
        setConversations([response.conversation, ...currentConversations]);

        // Join the new conversation room
        if (socketInitialized) {
          const socket = getSocket();
          socket.emit("join_conversation", { conversationId: response.conversation._id });
        }

        // Don't automatically set as current conversation here
        // Let the navigation handle it
        return response.conversation;
      } else {
        throw new Error("Invalid conversation response");
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
      setError("Failed to create conversation");
      throw err;
    }
  };

  const cleanupSocketListeners = () => {
    try {
      const socket = getSocket();
      if (socket) {
        socket.removeAllListeners();
      }
    } catch (err) {
      // Socket not initialized
    }
  };

  return (
    <ChatContext.Provider
      value={{
        connect,
        disconnect,
        loadConversations,
        selectConversation,
        sendMessage,
        loadMessages,
        createNewConversation,
        cleanupSocketListeners,
        sendTypingStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};