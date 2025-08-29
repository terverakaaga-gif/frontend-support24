import { UserRole } from "@/types/user.types";

export type TConversationType = "direct" | "group";

export interface IMessagesResponse {
	messages: IMessage[];
	pagination: IPagination;
}

export interface IMessage {
	_id: string;
	conversationId: string;
	sender: IUser;
	type: TMessageType;
	content: string;
	attachments: IAttachment[];
	mentions: IMention[];
	reactions: IReaction[];
	readReceipts: IReadReceipt[];
	status: TMessageStatus;
	deletedFor: string[];
	createdAt: string;
	updatedAt: string;
}

export type TMessageType = "text" | "image" | "video" | "file";

export type TMessageStatus = "sent" | "delivered" | "read" | "failed";

export interface IReadReceipt {
	_id: string;
	userId: string;
	readAt: string;
}

export interface IPagination {
	currentPage: number;
	totalCount: number;
	hasMore: boolean;
	limit: number;
}

// Optional types for future expansion
export interface IAttachment {
	url?: string;
	type?: "image" | "file" | "video";
	name?: string;
	size?: number;
}

export interface IMention {
	userId: string;
}

export interface IReaction {
	emoji: string;
	userId: string;
}

export interface IUser {
	_id: string;
	firstName: string;
	lastName: string;
	role: UserRole;
	profileImage?: string;
}

export interface IConversationMember {
	userId: IUser;
	joinedAt: string;
	role: UserRole;
	notifications: boolean;
	_id: string;
}

export interface IConversation {
	_id: string;
	type: TConversationType;
	name?: string;
	description?: string;
	organizationId?: string;
	members: IConversationMember[];
	createdBy: IUser | string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	lastMessage?: ILastMessage;
}

// Interfaces for chat state
export interface IChatState {
	conversations: IConversation[];
	currentConversation: IConversation | null;
	messages: IMessage[];
	onlineUsers: IUser[];
	loading: boolean;
	error: string | null;
	setConversations: (conversations: IConversation[]) => void;
	setCurrentConversation: (conversation: IConversation | null) => void;
	setMessages: (messages: IMessage[]) => void;
	addMessage: (message: IMessage) => void;
	updateMessage: (message: IMessage, updates: Partial<IMessage>) => void;
	deleteMessage: (messageId: string) => void;
	setOnlineUsers: (users: IUser[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	updateConversationLastMessage: (
		conversationId: string,
		message: ILastMessage
	) => void;
	updateMessageStatus: (messageId: string, status: TMessageStatus) => void;
}

export interface ICreateConversationResponse {
	conversation: IConversation;
}

export interface ICreator {
	_id: string;
	firstName: string;
	lastName: string;
}

export interface IGetConversationsResponse {
	conversations: IConversation[];
	pagination: IPagination;
}

export interface ILastMessage {
	messageId: string;
	content: string;
	sender: {
		_id: string;
		firstName: string;
		lastName: string;
	};
	timestamp: string;
	messageType: "text" | "image" | "video" | "file";
}

export interface ISendMessageResponse {
	message: IMessage;
}

export interface IMarkMessageAsReadResponse {
	success: boolean;
	code: number;
	message: string;
	data: {
		messageId: string;
		readBy: IUser[];
	};
	error: unknown;
}

export interface ISupportWorkers {
	firstName: string;
	lastName: string;
	joinedDate: string;
	_id: string;
}

export interface IMySupportWorkersResponse {
	supportWorkers: ISupportWorkers[];
}
