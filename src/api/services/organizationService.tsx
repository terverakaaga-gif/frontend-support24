import { get, post, del } from "../apiClient";

interface ShiftRate {
	rateTimeBandId: string;
	hourlyRate: number;
	_id: string;
}

interface ServiceAgreement {
	baseHourlyRate: number;
	shiftRates: ShiftRate[];
	distanceTravelRate: number;
	startDate: string;
	termsAccepted: boolean;
}

export interface IWorker {
	serviceAgreement: ServiceAgreement;
	workerId: {
		profileImage: string | null;
		_id: string;
		email: string;
		firstName: string;
		lastName: string;
		phone: string;
	};
	joinedDate: string;
	_id: string;
}

export interface PendingInvite {
  serviceAgreement: null;
  notes: string;
	status: string;
	proposedRates: {
		baseHourlyRate: number;
		shiftRates: ShiftRate[];
		distanceTravelRate: number;
	};
	inviteId: string;
	workerId: {
    phone: string;
		profileImage: string;
		_id: string;
		email: string;
		firstName: string;
		lastName: string;
	};
	inviteDate: string;
	proposedHourlyRate: number;
	_id: string;
}

export interface Organization {
	_id: string;
	name: string;
	participantId: string;
	workers: IWorker[];
	pendingInvites: PendingInvite[];
	description: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}
export interface CreateOrganizationRequest {
	name: string;
	description?: string;
}

export interface InviteWorkerRequest {
	email: string;
	message?: string;
}

export interface ProcessInviteRequest {
	action: "approve" | "reject";
	reason?: string;
}

export interface Invite {
	id: string;
	organizationId: string;
	workerEmail: string;
	status: "pending" | "approved" | "rejected";
	message?: string;
	createdAt: string;
	updatedAt: string;
}

export interface SupportWorker {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	organizationId: string;
	joinedAt: string;
}

export class OrganizationService {
	// Create organization (Participant only)
	async createOrganization(
		data: CreateOrganizationRequest
	): Promise<Organization> {
		return await post<Organization>("/organizations", data);
	}

	// Get organizations (based on user role)
	async getOrganizations(): Promise<{ organizations: Organization[] }> {
		return await get<{ organizations: Organization[] }>("/organizations");
	}

	// Invite worker to organization (Participant only)
	async inviteWorker(
		organizationId: string,
		data: InviteWorkerRequest
	): Promise<Invite> {
		return await post<Invite>(`/organizations/${organizationId}/invite`, data);
	}

	// Process invite (Admin only)
	async processInvite(
		organizationId: string,
		inviteId: string,
		data: ProcessInviteRequest
	): Promise<Invite> {
		return await post<Invite>(
			`/organizations/${organizationId}/invites/${inviteId}/process`,
			data
		);
	}

	// Get all pending invites (Admin only)
	async getPendingInvites(): Promise<Invite[]> {
		return await get<Invite[]>("/organizations/invites/pending");
	}

	// Get worker's invites (IWorker only)
	async getWorkerInvites(): Promise<Invite[]> {
		return await get<Invite[]>("/organizations/invites/worker");
	}

	// Get organization ID for the authenticated participant
	async getMyOrganizationId(): Promise<{ organizationId: string }> {
		return await get<{ organizationId: string }>(
			"/organizations/my-organization-id"
		);
	}

	// Get support workers for the authenticated participant's organization
	async getMySupportWorkers(): Promise<SupportWorker[]> {
		return await get<SupportWorker[]>("/organizations/my-support-workers");
	}

	// Get organization ID for a specified participant (admin only)
	async getOrganizationIdForParticipant(
		participantId: string
	): Promise<{ organizationId: string }> {
		return await get<{ organizationId: string }>(
			`/organizations/participant/${participantId}/organization-id`
		);
	}

	// Remove worker from organization (Participant or Admin)
	async removeWorker(organizationId: string, workerId: string): Promise<void> {
		return await del<void>(
			`/organizations/${organizationId}/workers/${workerId}`
		);
	}
	
	// Get organization details by ID
	async getOrganizationDetails(id: string): Promise<Organization> {
		const response = await get<{ organizations: Organization[] }>(
			"/organizations"
		);
		const organization = response.organizations.find((org) => org._id === id);
		if (!organization) {
			throw new Error("Organization not found");
		}
		return organization;
	}

}

// Create and export a singleton instance
export const organizationService = new OrganizationService();
