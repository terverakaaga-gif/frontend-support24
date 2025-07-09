import { get, patch, post, tokenStorage } from "@/api/apiClient";
import {
	CreateIncidentDTO,
	ICreateIncidentResponse,
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
	getIncidents: async () => {
		try {
			const token = tokenStorage.getAccessToken();
			const headers = { Authorization: `Bearer ${token}` };
			const response = await get<IIncidentResponse>("/incidents", { headers });
			return response;
		} catch (error) {
			throw error;
		}
	},

	getIncidentById: async (id: string) => {
		try {
			const token = tokenStorage.getAccessToken();
			const headers = { Authorization: `Bearer ${token}` };
			const response = await get<IIncidentByIdResponse>(`/incidents/${id}`, {
				headers,
			});

			return response.data;
		} catch (error) {
			throw error;
		}
	},

	getIncidentsByShiftId: async (shiftId: string) => {
		try {
			const token = tokenStorage.getAccessToken();
			const headers = { Authorization: `Bearer ${token}` };
			const response = await get<IIncidentByIdResponse>(
				`/incidents/shifts/${shiftId}`,
				{ headers }
			);

			return response.data;
		} catch (error) {
			throw error;
		}
	},

	createIncident: async (data: CreateIncidentDTO) => {
		try {
			const token = tokenStorage.getAccessToken();
			const headers = { Authorization: `Bearer ${token}` };
			const response = await post<ICreateIncidentResponse>("/incidents", data, {
				headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	updateIncidentStatus: async (
		id: string,
		payload: UpdateIncidentStatusDTO
	) => {
		try {
			const token = tokenStorage.getAccessToken();
			const headers = { Authorization: `Bearer ${token}` };
			const response = await patch<IIncidentStatusUpdateResponse>(
				`incidents/${id}/status`,
				payload,
				{ headers }
			);

			return response.data;
		} catch (error) {
			throw error;
		}
	},
	resolveIncident: async (id: string, payload: ResolveIncidentDTO) => {
		try {
			const token = tokenStorage.getAccessToken();
			const headers = { Authorization: `Bearer ${token}` };
			const response = await patch<IIncidentResolveResponse>(
				`incidents/${id}/resolve`,
				payload,
				{ headers }
			);

			return response.data;
		} catch (error) {
			throw error;
		}
	},
};

export default incidentService;
