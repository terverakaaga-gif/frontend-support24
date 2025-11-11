import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { get, post } from "@/api/apiClient";

// Routine types
export interface RoutineTask {
  title: string;
  description: string;
}

export interface Routine {
  _id: string;
  routineId: string;
  name: string;
  description: string;
  tasks: RoutineTask[];
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoutineRequest {
  name: string;
  description: string;
  tasks: RoutineTask[];
}

// Keys for React Query
export const routineKeys = {
  all: ["routines"] as const,
  lists: () => [...routineKeys.all, "list"] as const,
  list: (organizationId?: string) =>
    [...routineKeys.lists(), organizationId] as const,
  details: () => [...routineKeys.all, "detail"] as const,
  detail: (id: string) => [...routineKeys.details(), id] as const,
};

/**
 * Hook to get all routines
 */
export const useGetRoutines = (): UseQueryResult<Routine[]> => {
  return useQuery({
    queryKey: routineKeys.lists(),
    queryFn: async () => {
      // get<Routine[]> already returns Routine[], not {data: Routine[]}
      const response = await get<Routine[]>(`/routines`);
      console.log("Fetched routines:", response);
      // Response is already Routine[], no need to access .data
      return response || [];
    },
    // Add initial data to prevent undefined
    initialData: [],
  });
};

/**
 * Hook to get a specific routine by ID
 */
export const useGetRoutineById = (id?: string): UseQueryResult<Routine> => {
  return useQuery({
    queryKey: routineKeys.detail(id || ""),
    queryFn: async () => {
      // get<Routine> already returns Routine, not {data: Routine}
      const response = await get<Routine>(`/routines/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a new routine
 */
export const useCreateRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoutineRequest) => {
      // post<Routine> already returns Routine, not {data: Routine}
      const response = await post<Routine>(`/routines`, data);
      return response;
    },
    onSuccess: (newRoutine) => {
      // Update the cache directly with the new routine
      queryClient.setQueryData<Routine[]>(
        routineKeys.lists(),
        (oldData = []) => {
          return [...oldData, newRoutine];
        }
      );

      // Also invalidate to ensure fresh data from server
      queryClient.invalidateQueries({ queryKey: routineKeys.lists() });

      toast.success("Routine created successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create routine";
      toast.error(errorMessage);
      console.error("Create routine error:", error);
    },
  });
};
