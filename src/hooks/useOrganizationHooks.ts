import { organizationService } from "@/api/services/organizationService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetOrganizations = () => {
  return useQuery({
    queryKey: ["support-worker-organizations"],
    queryFn: async () => await((await organizationService.getOrganizations()).organizations),
  });
};

export const useRemoveWorkerFromOrganization = () => {
  return useMutation({
    mutationKey: ["remove-from-organization"],
    mutationFn: async ({ organizationId, workerId }: { organizationId: string, workerId: string }) => await organizationService.removeWorker(organizationId, workerId),
  });
};

export const useGetMyOrganizationDetails = () => {
  return useQuery({
    queryKey: ["my-organization-details"],
    queryFn: async () => {
      const { organizationId } = await organizationService.getMyOrganizationId();
      return await organizationService.getOrganizationDetails(organizationId);
    },
  });
};
export const useGetOrganizationDetails = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization-details", organizationId],
    queryFn: async () => {
      return await organizationService.getOrganizationDetails(organizationId);
    },
  });
};