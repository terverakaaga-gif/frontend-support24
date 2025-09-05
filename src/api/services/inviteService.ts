import { get, post } from "../apiClient";
import {
	OrganizationInvites,
	OrganizationsInvitesResponse,
	Invite,
	FlattenedInvite,
	ProcessInviteRequest,
	IInvitationRequest,
	IInvitationResponse,
} from "../../entities/Invitation";

// Service for invite operations
const inviteService = {
	// Get all organization invites
	getOrganizationInvites: async (): Promise<OrganizationInvites[]> => {
		// Get the response which contains { organizations: [...] }
		const response = await get<OrganizationsInvitesResponse>("/organizations");

		// Return just the organizations array
		return response.organizations;
	},

	// Find a specific invite by inviteId (client-side search)
	findInviteById: async (inviteId: string): Promise<FlattenedInvite | null> => {
		const organizations = await inviteService.getOrganizationInvites();

		for (const org of organizations) {
			for (const invite of org.invites) {
				if (invite.inviteId === inviteId) {
					return {
						...invite,
						organizationId: org.organizationId,
						organizationName: org.organizationName,
						participantId: org.participantId,
						participantName: org.participantName,
						status: "pending", // Default status since API doesn't provide it
					};
				}
			}
		}

		return null;
	},

	// Flatten all invites for easier table display
	getFlattenedInvites: async (): Promise<FlattenedInvite[]> => {
		const organizations = await inviteService.getOrganizationInvites();
		const result: FlattenedInvite[] = [];

		organizations.forEach((org) => {
			org.invites.forEach((invite) => {
				result.push({
					...invite,
					organizationName: org.organizationName,
					organizationId: org.organizationId,
					participantId: org.participantId,
					participantName: org.participantName,
					status: "pending", // Default status since API doesn't provide it
				});
			});
		});

		return result;
	},

	// Process invite acceptance or decline
	processInvite: async (
		organizationId: string,
		inviteId: string,
		data: ProcessInviteRequest
	): Promise<unknown> => {
		const url = `/organizations/${organizationId}/invites/${inviteId}/process`;
		return await post(url, data);
	},

	// let participant send invitation to available support workers
	sendInvitationToSupportWorkers: async (
		organizationId: string,
		data: IInvitationRequest
	): Promise<{ organization: IInvitationResponse }> => {
		return post<{ organization: IInvitationResponse }>(
			`/organizations/${organizationId}/invite`,
			data
		);
	},
};

export default inviteService;
