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

interface ChatContextType {
	connect: (token: string) => void; // No need to used this elsewhere as it has be managed in the provider
	disconnect: () => void; // same here
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
}

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
	const {
		setConversations,
		setCurrentConversation,
		setMessages,
		addMessage,
		updateMessage,
		setOnlineUsers,
		setLoading,
		setError,
		currentConversation,
		conversations,
		updateConversationLastMessage,
		updateMessageStatus,
	} = useChatStore();

	const [socketInitialized, setSocketInitialized] = useState(false);

	const connect = (token: string) => {
		try {
			console.log("Connecting to socket with token...");
			initializeSocket(token);
			const socket = getSocket();

			socket.on("connect", () => {
				console.log("Connected to socket successfully");
				setSocketInitialized(true);
			});

			socket.on("newMessage", (message) => {
				console.log("New message received:", message);
				// Add message to current conversation if it matches
				if (
					currentConversation &&
					message.conversationId === currentConversation._id
				) {
					addMessage(message);
					// Update the conversation's last message
					updateConversationLastMessage(message.conversationId, message);
				}

				// Update conversation list with new last message
				const updatedConversations = conversations.map((conv) => {
					if (conv._id === message.conversationId) {
						return {
							...conv,
							lastMessage: message,
							updatedAt: message.timestamp,
						};
					}
					return conv;
				});
				setConversations(updatedConversations);
			});

			// Listen for message status updates
			socket.on("messageStatusUpdate", (data) => {
				updateMessageStatus(data.messageId, data.status);
			});

			socket.on("messageRead", ({ messageId, userId }) => {
				console.log("Message read:", messageId, userId);
				updateMessage(messageId, {
					readReceipts: [
						{ userId, _id: messageId, readAt: new Date().toISOString() },
					],
				});
			});

			socket.on("userOnline", (users) => {
				console.log("Users online:", users);
				setOnlineUsers(users);
			});

			socket.on("userOffline", (userId) => {
				console.log("User offline:", userId);
				// Handle user going offline
			});

			socket.on("conversationCreated", (conversation) => {
				console.log("New conversation created:", conversation);
				setConversations([...conversations, conversation]);
			});

			socket.on("error", (error) => {
				console.error("Socket error:", error);
				setError(error.message || "Connection error");
			});

			socket.on("disconnect", (reason) => {
				console.log("Socket disconnected:", reason);
				setSocketInitialized(false);
			});

			socket.on("connect_error", (error) => {
				console.error("Socket connection error:", error);
				setError("Failed to connect to chat server");
				setSocketInitialized(false);
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
			disconnectSocket();
			setSocketInitialized(false);
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

		try {
			console.log("Sending message:", { content, type });
			const response = await chatServices.sendMessage(
				token,
				currentConversation._id,
				content,
				type
			);

			console.log("Message sent successfully:", response);

			// Emit through socket for real-time delivery
			if (socketInitialized) {
				const socket = getSocket();
				socket.emit("newMessage", {
					conversationId: currentConversation._id,
					message: response.message,
				});
			}

			// Add message to local state
			if (response) {
				addMessage(response.message);
			}
		} catch (err) {
			console.error("Failed to send message:", err);
			setError("Failed to send message");
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
				setConversations([]);
			}
		} catch (err) {
			console.error("Failed to load messages:", err);
			setError("Failed to load messages");
			setConversations([]);
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

				// Emit through socket
				if (socketInitialized) {
					const socket = getSocket();
					socket.emit("conversationCreated", response);
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
		const socket = getSocket();
		if (socket) {
			socket.off("newMessage");
			socket.off("messageStatusUpdate");
			socket.off("conversationUpdate");
			socket.off("messageRead");
			socket.off("userOnline");
			socket.off("userOffline");
			socket.off("conversationCreated");
			socket.off("error");
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
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};
