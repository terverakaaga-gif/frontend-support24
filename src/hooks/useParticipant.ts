import {
	useMutation,
	useQuery,
	useQueryClient,
	UseQueryOptions,
} from "@tanstack/react-query";

import {
	ISearchSupportWorkersResponse,
	participantService,
	ISearchSupportWorkerResponse,
} from "@/api/services/participantService";
import { IInvitationRequest } from "@/entities/Invitation";
import inviteService from "@/api/services/inviteService";
import {
	Organization,
	organizationService,
} from "@/api/services/organizationService";

const queryKeys = {
	searchSupportWorkers: (filters?: unknown) => [
		"supportWorkers",
		"search",
		filters,
	],
	supportWorkerProfile: (id: string) => ["supportWorkers", "profile", id],
	inviteSupportWorkers: (orgId: string) => ["inviteSupportWorkers", orgId],
	organizations: ["orgs"],
};

export function useSupportWorkers(
	filters?: unknown,
	options?: UseQueryOptions<ISearchSupportWorkersResponse>
) {
	return useQuery<ISearchSupportWorkersResponse>({
		queryKey: queryKeys.searchSupportWorkers(filters),
		queryFn: () => participantService.getSupportWorkers(),
		...options,
	});
}

export function useSupportWorkerProfile(
	id: string,
	options?: UseQueryOptions<ISearchSupportWorkerResponse>
) {
	return useQuery<ISearchSupportWorkerResponse>({
		queryKey: queryKeys.supportWorkerProfile(id),
		queryFn: () => participantService.getSupportWorkerProfile(id),
		enabled: !!id, // Only run query if id exists
		...options,
	});
}

// Get my organizations
export function useMyOrganizations() {
	return useQuery<Organization[]>({
		queryKey: queryKeys.organizations,
		queryFn: async () =>
			(await organizationService.getOrganizations()).organizations,
	});
}

// send invites to support workers to join your organization
export function useSendInvitationToSupportWorkers(orgId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: IInvitationRequest) =>
			inviteService.sendInvitationToSupportWorkers(orgId, data),
		onMutate: async (data: IInvitationRequest) => {
			await queryClient.cancelQueries({
				queryKey: queryKeys.inviteSupportWorkers(orgId),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.inviteSupportWorkers(orgId),
			});
		},
	});
}

export function useParticipantService() {
	const queryClient = useQueryClient();

	return {
		// Queries
		useSupportWorkers,
		useSupportWorkerProfile,
		useSendInvitationToSupportWorkers,

		// Prefetching
		prefetchSupportWorkers: (filters?: unknown) => {
			queryClient.prefetchQuery({
				queryKey: queryKeys.searchSupportWorkers(filters),
				queryFn: () => participantService.getSupportWorkers(),
			});
		},

		prefetchSupportWorkerProfile: (id: string) => {
			queryClient.prefetchQuery({
				queryKey: queryKeys.supportWorkerProfile(id),
				queryFn: () => participantService.getSupportWorkerProfile(id),
			});
		},

		prefetchOrganizations: () => {
			queryClient.prefetchQuery({
				queryKey: queryKeys.organizations,
				queryFn: () => organizationService.getOrganizations(),
			});
		},

		// Invalidation
		invalidateSupportWorkers: (filters?: unknown) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.searchSupportWorkers(filters),
			});
		},

		invalidateSupportWorkerProfile: (id: string) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.supportWorkerProfile(id),
			});
		},

		invalidateOrganizations: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.organizations,
			});
		},

		// Query keys for external use
		queryKeys,
	};
}
