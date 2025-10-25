import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import shiftService, { ShiftFilters } from "../api/services/shiftService";
import { CreateShiftRequest, Shift } from "../entities/Shift";
import { toast } from "sonner";
import { post, patch } from "@/api/apiClient";

// Keys for React Query
export const shiftKeys = {
  all: ["shifts"] as const,
  lists: () => [...shiftKeys.all, "list"] as const,
  list: (filters?: ShiftFilters) => [...shiftKeys.lists(), filters] as const,
  details: () => [...shiftKeys.all, "detail"] as const,
  detail: (id: string) => [...shiftKeys.details(), id] as const,
  byShiftId: (shiftIdRef: string) =>
    [...shiftKeys.all, "byShiftId", shiftIdRef] as const,
};

// Hook to get all shifts with optional filters
export const useGetShifts = (
  filters?: ShiftFilters
): UseQueryResult<Shift[]> => {
  return useQuery({
    queryKey: shiftKeys.list(filters),
    queryFn: () => shiftService.getShifts(filters),
  });
};

// Hook to get a specific shift by MongoDB ID
export const useGetShiftById = (id?: string): UseQueryResult<Shift> => {
  return useQuery({
    queryKey: shiftKeys.detail(id || ""),
    queryFn: () => shiftService.getShiftById(id || ""),
    enabled: !!id,
  });
};

// Hook to get shift by shiftId reference
export const useGetShiftByShiftId = (
  shiftIdRef?: string
): UseQueryResult<Shift> => {
  return useQuery({
    queryKey: shiftKeys.byShiftId(shiftIdRef || ""),
    queryFn: () => shiftService.getShiftByShiftId(shiftIdRef || ""),
    enabled: !!shiftIdRef,
  });
};

/**
 * Hook to create a new shift
 */
export const useCreateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShiftRequest) => shiftService.createShift(data),
    onSuccess: (newShift) => {
      // Invalidate and refetch shifts
      queryClient.invalidateQueries({ queryKey: shiftKeys.all });
      toast.success("Shift created successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create shift";
      toast.error(errorMessage);
      console.error("Create shift error:", error);
    },
  });
};

/**
 * Hook to accept or reject a shift
 */
export const useAcceptShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shiftId,
      accept,
      declineReason,
    }: {
      shiftId: string;
      accept: boolean;
      declineReason?: string;
    }) => {
      const payload = accept
        ? { accept: true }
        : { accept: false, declineReason };
      return post(`/shifts/${shiftId}/respond`, payload);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch shifts
      queryClient.invalidateQueries({ queryKey: shiftKeys.all });
      toast.success(
        `Shift ${variables.accept ? "accepted" : "rejected"} successfully!`
      );
    },
    onError: (
      error: any,
      variables: { shiftId: string; accept: boolean; declineReason?: string }
    ) => {
      const errorMessage =
        error.response?.data?.message ||
        `Failed to ${variables.accept ? "accept" : "reject"} shift`;
      toast.error(errorMessage);
      console.error("Accept shift error:", error);
    },
  });
};

/**
 * Hook to update shift status
 * Supports: confirmed, in_progress, completed, cancelled
 */
export const useUpdateShiftStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shiftId,
      status,
    }: {
      shiftId: string;
      status: "confirmed" | "inProgress" | "completed" | "cancelled";
    }) => {
      return patch(`/shifts/${shiftId}`, { status });
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch shifts
      queryClient.invalidateQueries({ queryKey: shiftKeys.all });

      const statusMessages: Record<string, string> = {
        confirmed: "Shift confirmed successfully!",
        inProgress: "Shift started successfully!",
        completed: "Shift completed successfully!",
        cancelled: "Shift cancelled successfully!",
      };

      toast.success(
        statusMessages[variables.status] || "Shift updated successfully!"
      );
    },
    onError: (error: any, variables) => {
      const errorMessage =
        error.response?.data?.message ||
        `Failed to update shift to ${variables.status}`;
      toast.error(errorMessage);
      console.error("Update shift status error:", error);
    },
  });
};
