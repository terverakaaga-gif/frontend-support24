import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import inviteService from '@/api/services/inviteService';
import { OrganizationInvites, FlattenedInvite, ProcessInviteRequest } from '@/entities/Invitation';

// Query keys for caching
export const INVITE_QUERY_KEYS = {
  organizations: ['invites', 'organizations'] as const,
  flattened: ['invites', 'flattened'] as const,
  detail: (inviteId: string) => ['invites', 'detail', inviteId] as const,
};

// Hook to get all organization invites
export const useGetOrganizationInvites = () => {
  return useQuery({
    queryKey: INVITE_QUERY_KEYS.organizations,
    queryFn: inviteService.getOrganizationInvites,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

// Hook to get flattened invites for table display
export const useGetFlattenedInvites = () => {
  return useQuery({
    queryKey: INVITE_QUERY_KEYS.flattened,
    queryFn: inviteService.getFlattenedInvites,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

// Hook to get a specific invite by ID
export const useGetInviteById = (inviteId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: INVITE_QUERY_KEYS.detail(inviteId),
    queryFn: () => inviteService.findInviteById(inviteId),
    enabled: enabled && !!inviteId,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

// Hook to process invite acceptance or decline
export const useProcessInvite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ organizationId, inviteId, data }: {
      organizationId: string;
      inviteId: string;
      data: ProcessInviteRequest;
    }) => inviteService.processInvite(organizationId, inviteId, data),
    onSuccess: () => {
      // Invalidate and refetch invite data after successful processing
      queryClient.invalidateQueries({ queryKey: INVITE_QUERY_KEYS.organizations });
      queryClient.invalidateQueries({ queryKey: INVITE_QUERY_KEYS.flattened });
      queryClient.invalidateQueries({ queryKey: ['invites', 'detail'] });
    },
  });
}; 