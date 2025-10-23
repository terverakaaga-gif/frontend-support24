import { organizationService } from "@/api/services/organizationService";
import { useQuery } from "@tanstack/react-query";

export const useGetOrganizations = () => {
  return useQuery({
    queryKey: ["support-worker-organizations"],
    queryFn: async () => await((await organizationService.getOrganizations()).organizations),
  });
};
