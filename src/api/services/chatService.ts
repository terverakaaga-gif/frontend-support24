import { get, patch, post } from "@/api/apiClient";
import {
	ICreateConversationResponse,
	IGetConversationsResponse,
	IMarkMessageAsReadResponse,
	IMessagesResponse,
	IMySupportWorkersResponse,
	ISendMessageResponse,
	TMessageType,
} from "@/types/chat.types";

const chatServices = {
	createConversation: async (
		token: string,
		type: "direct" | "group",
		memberIds: string[],
		name?: string,
		description?: string,
		organizationId?: string
	) => {
		const response = await post<ICreateConversationResponse>(
			`/chat/conversations`,
			{
				type,
				memberIds,
				...(type === "group" && { name, description, organizationId }),
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},

	getConversations: async (token: string) => {
		const response = await get<IGetConversationsResponse>(
			`/chat/conversations`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},

	getMessages: async (
		token: string,
		conversationId: string,
		page = 1,
		limit = 50
	) => {
		const response = await get<IMessagesResponse>(
			`/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},

	sendMessage: async (
		token: string,
		conversationId: string,
		content: string,
		type: TMessageType = "text"
	) => {
		const response = await post<ISendMessageResponse>(
			`/chat/conversations/${conversationId}/messages`,
			{
				type,
				content,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},

	markAsRead: async (token: string, messageId: string) => {
		const response = await patch<IMarkMessageAsReadResponse>(
			`/chat/messages/${messageId}/read`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	},

	getMySupportWorkers: async () => {
		const response = await get<IMySupportWorkersResponse>(
			"/organizations/my-support-workers"
		);
		return response.supportWorkers;
	},
};

export default chatServices;
