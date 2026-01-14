/**
 * Compliance React Query Hooks
 * Hooks for worker compliance submissions and admin reviews
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import complianceService from "../api/services/complianceService";
import {
  ICompliance,
  IComplianceAnswers,
  IComplianceStatistics,
  IComplianceListResponse,
  IComplianceFilters,
  IReviewComplianceRequest,
} from "@/types/compliance.types";
import { toast } from "sonner";

// Keys for React Query
export const complianceKeys = {
  all: ["compliance"] as const,
  my: () => [...complianceKeys.all, "my"] as const,
  statistics: () => [...complianceKeys.all, "statistics"] as const,
  lists: () => [...complianceKeys.all, "list"] as const,
  list: (filters?: IComplianceFilters) => [...complianceKeys.lists(), filters] as const,
  details: () => [...complianceKeys.all, "detail"] as const,
  detail: (id: string) => [...complianceKeys.details(), id] as const,
};

// ============================================
// WORKER HOOKS
// ============================================

/**
 * Hook to get current worker's compliance status
 */
export const useGetMyCompliance = (): UseQueryResult<ICompliance | null> => {
  return useQuery({
    queryKey: complianceKeys.my(),
    queryFn: () => complianceService.getMyCompliance(),
  });
};

/**
 * Hook to submit compliance with documents and answers
 */
export const useSubmitCompliance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => complianceService.submitCompliance(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.all });
      toast.success("Compliance documents submitted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to submit compliance";
      toast.error(errorMessage);
      console.error("Submit compliance error:", error);
    },
  });
};

/**
 * Hook to update compliance answers only
 */
export const useUpdateComplianceAnswers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answers: Partial<IComplianceAnswers>) => 
      complianceService.updateAnswers(answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.my() });
      toast.success("Answers updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to update answers";
      toast.error(errorMessage);
      console.error("Update answers error:", error);
    },
  });
};

// ============================================
// ADMIN HOOKS
// ============================================

/**
 * Hook to get compliance statistics
 */
export const useGetComplianceStatistics = (): UseQueryResult<IComplianceStatistics> => {
  return useQuery({
    queryKey: complianceKeys.statistics(),
    queryFn: () => complianceService.getStatistics(),
  });
};

/**
 * Hook to get pending compliances with pagination
 */
export const useGetPendingCompliances = (filters?: IComplianceFilters): UseQueryResult<IComplianceListResponse> => {
  return useQuery({
    queryKey: complianceKeys.list(filters),
    queryFn: () => complianceService.getPendingCompliances(filters),
  });
};

/**
 * Hook to get detailed compliance by ID
 */
export const useGetComplianceById = (complianceId?: string): UseQueryResult<ICompliance> => {
  return useQuery({
    queryKey: complianceKeys.detail(complianceId || ""),
    queryFn: () => complianceService.getComplianceById(complianceId || ""),
    enabled: !!complianceId,
  });
};

/**
 * Hook to review compliance (approve/reject)
 */
export const useReviewCompliance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ complianceId, data }: { complianceId: string; data: IReviewComplianceRequest }) =>
      complianceService.reviewCompliance(complianceId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.all });
      queryClient.invalidateQueries({ queryKey: complianceKeys.detail(variables.complianceId) });
      const action = variables.data.decision === "approved" ? "approved" : "rejected";
      toast.success(`Compliance ${action} successfully!`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to review compliance";
      toast.error(errorMessage);
      console.error("Review compliance error:", error);
    },
  });
};
