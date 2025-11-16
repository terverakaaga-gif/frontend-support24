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
      // Check if socket exists and is connected
      try {
        const existingSocket = getSocket();
        if (existingSocket && existingSocket.connected) {
          existingSocket.removeAllListeners();
        }
      } catch (err) {
        // Socket doesn't exist yet, which is fine
      }

      initializeSocket(token);
      const socket = getSocket();

      // Remove any existing listeners first to avoid duplicates
      socket.removeAllListeners();

      socket.on("connect", () => {
        setSocketInitialized(true);
        setIsConnected(true);
      });

      socket.on("authenticated", (data) => {
        // Join conversation rooms for current conversations
        conversations.forEach((conv) => {
          socket.emit("join_conversation", { conversationId: conv._id });
        });
      });

      // Handle new messages - IMPORTANT: Check for duplicates
      socket.on("new_message", (message) => {

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
        if (data.messageId) {
          updateMessageStatus(data.messageId, "sent");
        }
      });

      socket.on("message_delivered", (data) => {
        updateMessageStatus(data.messageId, "delivered");
      });

      socket.on("message_read", (data) => {
        data.messageIds?.forEach((messageId: string) => {
          updateMessageStatus(messageId, "read");
        });
      });

      // Handle typing indicators
      socket.on("user_typing", (data) => {
        if (data.isTyping) {
          addTypingUser(data.conversationId, data.userId);
        } else {
          removeTypingUser(data.conversationId, data.userId);
        }
      });

      // Handle user presence
      socket.on("online_users_list", (users) => {
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
        setConversations([conversation, ...conversations]);
      });

      socket.on("error", (error) => {
        setError(error.message || "Connection error");
      });

      socket.on("disconnect", (reason) => {
        setSocketInitialized(false);
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        setError("Failed to connect to chat server");
        setSocketInitialized(false);
        setIsConnected(false);
      });

      // Connect the socket
      if (!socket.connected) {
        socket.connect();
      }
    } catch (err) {
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
      }
      
      disconnectSocket();
      setSocketInitialized(false);
      setIsConnected(false);
    } catch (err) {
      throw new Error("Failed to disconnect from chat server");
    }
  };

  const loadConversations = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatServices.getConversations(token);

      if (response.conversations && Array.isArray(response.conversations)) {
        setConversations(response.conversations);
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

  const selectConversation = async (conversationId: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatServices.getMessages(token, conversationId);

      const conversation = conversations.find((c) => c._id === conversationId);
      if (conversation) {
        setCurrentConversation(conversation);

        if (response.messages && Array.isArray(response.messages)) {
          setMessages(response.messages);
        } else {
          setMessages([]);
        }
      } else {
        setError("Conversation not found");
      }
    } catch (err) {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, type: TMessageType = "text") => {
    if (!currentConversation) {
      return;
    }

    const tokens = tokenStorage.getTokens();
    const { token } = tokens.access;

    if (!token) {
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

      // Add optimistic message to UI
      addMessage(optimisticMessage);

      // Send through REST API
      const response = await chatServices.sendMessage(
        token,
        currentConversation._id,
        content,
        type
      );


      if (response.message) {
        // Remove optimistic message and add real message
        const currentMessages = useChatStore.getState().messages;
        setMessages(
          currentMessages.filter((msg) => msg._id !== optimisticMessage._id)
        );
        
        // The real message will come through socket's "new_message" event
      }
    } catch (err) {
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
      const response = await chatServices.getMessages(token, conversationId);
      if (response.messages && Array.isArray(response.messages)) {
        setMessages(response.messages);
      } else {
        setMessages([]);
      }
    } catch (err) {
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
    
      const response = await chatServices.createConversation(
        token,
        type,
        memberIds,
        name,
        description,
        organizationId
      );


      if (response) {
        // Add to local state
        setConversations([...conversations, response.conversation]);

        // Emit through socket if available
        if (socketInitialized) {
          try {
            const socket = getSocket();
            socket.emit("conversationCreated", response);
          } catch (err) {
            setError(err)
          }
        }

        return response.conversation;
      } else {
        setError("Invalid conversation response");
      }
    } catch (err) {
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