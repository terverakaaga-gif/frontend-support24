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
      console.log("Connecting to socket with token...");
      
      // Check if socket exists and is connected
      try {
        const existingSocket = getSocket();
        if (existingSocket && existingSocket.connected) {
          console.log("Socket already connected, cleaning up listeners...");
          existingSocket.removeAllListeners();
        }
      } catch (err) {
        // Socket doesn't exist yet, which is fine
        console.log("No existing socket found, creating new one");
      }

      initializeSocket(token);
      const socket = getSocket();

      // Remove any existing listeners first to avoid duplicates
      socket.removeAllListeners();

      socket.on("connect", () => {
        console.log("Connected to socket successfully");
        setSocketInitialized(true);
        setIsConnected(true);
      });

      socket.on("authenticated", (data) => {
        console.log("Socket authenticated:", data);
        // Join conversation rooms for current conversations
        conversations.forEach((conv) => {
          socket.emit("join_conversation", { conversationId: conv._id });
        });
      });

      // Handle new messages - IMPORTANT: Check for duplicates
      socket.on("new_message", (message) => {
        console.log("New message received:", message);

        const currentUserId = user?._id;

        // Only add message if it's NOT from current user OR if it's the first time receiving it
        if (message.sender._id !== currentUserId) {
          // Check if message already exists to prevent duplicates
          const messageExists = messages.some((msg) => msg._id === message._id);

          if (!messageExists) {
            if (
              currentConversation &&
              message.conversationId === currentConversation._id
            ) {
              addMessage(message);
            }

            // Update conversation list with new last message
            updateConversationLastMessage(message.conversationId, {
              messageId: message._id,
              content: message.content,
              sender: message.sender,
              timestamp: message.createdAt,
              messageType: message.type,
            });
          }
        }
      });

      // Handle message status updates
      socket.on("message_sent", (data) => {
        console.log("Message sent confirmation:", data);
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
        console.log("Online users received:", users);
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
          // Add user to online list (would need user details)
          socket.emit("get_online_users");
        } else {
          // Remove user from online list
          const currentOnlineUsers = useChatStore.getState().onlineUsers;
          setOnlineUsers(
            currentOnlineUsers.filter((user) => user._id !== data.userId)
          );
        }
      });

      socket.on("conversation_created", (conversation) => {
        console.log("New conversation created:", conversation);
        setConversations([conversation, ...conversations]);
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

      // Connect the socket
      if (!socket.connected) {
        socket.connect();
      }
    } catch (err) {
      console.error("Error initializing socket:", err);
      setError("Failed to connect to chat server");
    }
  };

  const disconnect = () => {
    try {
      // Safe check before trying to get socket
      try {
        const socket = getSocket();
        if (socket) {
          socket.removeAllListeners();
        }
      } catch (err) {
        console.log("No socket to disconnect");
      }
      
      disconnectSocket();
      setSocketInitialized(false);
      setIsConnected(false);
      console.log("Disconnected from socket");
    } catch (err) {
      console.error("Error disconnecting socket:", err);
    }
  };

  const loadConversations = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Loading conversations...");
      const response = await chatServices.getConversations(token);
      console.log("Conversations loaded:", response);

      if (response.conversations && Array.isArray(response.conversations)) {
        setConversations(response.conversations);
      } else {
        console.warn("Invalid conversations response:", response);
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

  const selectConversation = async (conversationId: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Loading messages for conversation:", conversationId);
      const response = await chatServices.getMessages(token, conversationId);
      console.log("Messages loaded for conversation:", response);

      const conversation = conversations.find((c) => c._id === conversationId);
      if (conversation) {
        setCurrentConversation(conversation);

        if (response.messages && Array.isArray(response.messages)) {
          setMessages(response.messages);
        } else {
          console.warn("Invalid messages response:", response);
          setMessages([]);
        }
      } else {
        console.error("Conversation not found:", conversationId);
        setError("Conversation not found");
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, type: TMessageType = "text") => {
    if (!currentConversation) {
      console.error("No current conversation selected");
      return;
    }

    const tokens = tokenStorage.getTokens();
    const { token } = tokens.access;

    if (!token) {
      console.error("No token available");
      setError("Authentication required");
      return;
    }

    // Create optimistic message for immediate UI update
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      conversationId: currentConversation._id,
      sender: user,
      type,
      content,
      attachments: [],
      mentions: [],
      reactions: [],
      readReceipts: [],
      status: "sending" as any,
      deletedFor: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      console.log("Sending message:", { content, type });

      // Add optimistic message to UI
      addMessage(optimisticMessage);

      // Send through REST API
      const response = await chatServices.sendMessage(
        token,
        currentConversation._id,
        content,
        type
      );

      console.log("Message sent successfully:", response);

      if (response.message) {
        // Remove optimistic message and add real message
        const currentMessages = useChatStore.getState().messages;
        setMessages(
          currentMessages.filter((msg) => msg._id !== optimisticMessage._id)
        );
        
        // The real message will come through socket's "new_message" event
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
      // Update optimistic message to show error
      updateMessage(optimisticMessage._id, { status: "failed" });
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
      console.log("Messages loading...");
      const response = await chatServices.getMessages(token, conversationId);
      if (response.messages && Array.isArray(response.messages)) {
        setMessages(response.messages);
      } else {
        console.warn("Invalid messages response:", response);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = async (
    type: "direct" | "group",
    memberIds: string[],
    token: string,
    name?: string,
    description?: string,
    organizationId?: string
  ) => {
    try {
      console.log("Creating new conversation:", {
        type,
        memberIds,
        name,
        description,
        organizationId,
      });
      const response = await chatServices.createConversation(
        token,
        type,
        memberIds,
        name,
        description,
        organizationId
      );

      console.log("New conversation created:", response);

      if (response) {
        // Add to local state
        setConversations([...conversations, response.conversation]);

        // Emit through socket if available
        if (socketInitialized) {
          try {
            const socket = getSocket();
            socket.emit("conversationCreated", response);
          } catch (err) {
            console.log("Socket not available for conversation creation event");
          }
        }

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
      // Socket not initialized, nothing to clean up
      console.log("No socket listeners to clean up");
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