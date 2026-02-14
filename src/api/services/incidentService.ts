import { del, get, patch, post, put, tokenStorage } from "@/api/apiClient";
import {
	CreateIncidentDTO,
	ICreateIncidentResponse,
	IIncident,
	IIncidentByIdResponse,
	IIncidentResolveResponse,
	IIncidentResponse,
	IIncidentStatusUpdateResponse,
	IResolvedIncident,
	ResolveIncidentDTO,
	TIncidentStatus,
	UpdateIncidentStatusDTO,
} from "@/types/incidents.types";

const incidentService = {
	getIncidents: async (): Promise<IIncidentResponse> => {
		const token = tokenStorage.getAccessToken();
		const headers = { Authorization: `Bearer ${token}` };
		const response = await get<IIncidentResponse>("/incidents", { headers });
		return response;
	},

	getIncidentById: async (id: string): Promise<IIncident> => {
		try {
			const token = tokenStorage.getAccessToken();
			const headers = { Authorization: `Bearer ${token}` };

			// this returns the data immediately
			const response = await get<IIncident>(`/incidents/${id}`, {
				headers,
			});

			return response;
		} catch (error) {
			console.error("💥 Error in getIncidentById:", error);
			throw error;
		}
	},

	getIncidentsByShiftId: async (
		shiftId: string
	): Promise<IIncidentByIdResponse["data"]> => {
		const token = tokenStorage.getAccessToken();
		const headers = { Authorization: `Bearer ${token}` };
		const response = await get<IIncidentByIdResponse>(
			`/incidents/shifts/${shiftId}`,
			{ headers }
		);
		return response.data;
	},

	createIncident: async (
		data: CreateIncidentDTO
	): Promise<ICreateIncidentResponse["data"]> => {
		const token = tokenStorage.getAccessToken();
		const headers = { Authorization: `Bearer ${token}` };
		const response = await post<ICreateIncidentResponse>("/incidents", data, {
			headers,
		});
		return response.data;
	},

	updateIncident: async <D>(id: string, data: D): Promise<void> => {
		const token = tokenStorage.getAccessToken();
		const headers = { Authorization: `Bearer ${token}` };
		await put(`/incidents/${id}/update`, data, { headers });
	},

	updateIncidentStatus: async (
		id: string,
		payload: UpdateIncidentStatusDTO
	): Promise<IIncidentStatusUpdateResponse["data"]> => {
		const token = tokenStorage.getAccessToken();
		const headers = { Authorization: `Bearer ${token}` };
		const response = await patch<IIncidentStatusUpdateResponse>(
			`incidents/${id}/status`,
			payload,
			{ headers }
		);
		return response.data;
	},
	resolveIncident: async (
		id: string,
		payload: ResolveIncidentDTO
	): Promise<IIncidentResolveResponse["data"]> => {
		const token = tokenStorage.getAccessToken();
		const headers = { Authorization: `Bearer ${token}` };
		const response = await patch<IIncidentResolveResponse>(
			`incidents/${id}/resolve`,
			payload,
			{ headers }
		);
		return response.data;
	},
	deleteIncident: async (id: string): Promise<void> => {
		const token = tokenStorage.getAccessToken();
		const headers = { Authorization: `Bearer ${token}` };
		await del(`incidents/${id}/delete`, { headers });
	},
};

export default incidentService;
