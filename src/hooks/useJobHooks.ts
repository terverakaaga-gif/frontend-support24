import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import jobService, {
  Job,
  JobWithSaveStatus,
  JobApplication,
  SavedJob,
  CreateJobRequest,
  UpdateJobRequest,
  JobFilters,
} from "../api/services/jobService";
import { toast } from "sonner";

// Keys for React Query
export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (filters?: JobFilters) => [...jobKeys.lists(), filters] as const,
  myPosts: (params?: { limit?: number; offset?: number; includeDeleted?: boolean }) => 
    [...jobKeys.all, "myPosts", params] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  applications: (jobId: string, params?: { limit?: number; offset?: number }) => 
    [...jobKeys.all, "applications", jobId, params] as const,
  myApplications: (params?: { limit?: number; offset?: number }) => 
    [...jobKeys.all, "myApplications", params] as const,
  savedJobs: (params?: { limit?: number; offset?: number }) => 
    [...jobKeys.all, "saved", params] as const,
  application: (id: string) => [...jobKeys.all, "application", id] as const,
};

// Hook to get all jobs with filters
export const useGetJobs = (filters?: JobFilters) => {
  return useQuery({
    queryKey: jobKeys.list(filters),
    queryFn: () => jobService.getAllJobs(filters),
  });
};

// Hook to get my posted jobs
export const useGetMyPostedJobs = (params?: { limit?: number; offset?: number; includeDeleted?: boolean }) => {
  return useQuery({
    queryKey: jobKeys.myPosts(params),
    queryFn: () => jobService.getMyPostedJobs(params),
  });
};

// Hook to get a specific job by ID
export const useGetJobById = (jobId?: string): UseQueryResult<JobWithSaveStatus> => {
  return useQuery({
    queryKey: jobKeys.detail(jobId || ""),
    queryFn: () => jobService.getJobById(jobId || ""),
    enabled: !!jobId,
  });
};

// Hook to create a job
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobRequest) => jobService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.myPosts() });
      toast.success("Job created successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to create job";
      toast.error(errorMessage);
      console.error("Create job error:", error);
    },
  });
};

// Hook to update a job
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: UpdateJobRequest }) =>
      jobService.updateJob(jobId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.myPosts() });
      toast.success("Job updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update job";
      toast.error(errorMessage);
      console.error("Update job error:", error);
    },
  });
};

// Hook to delete a job
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.myPosts() });
      toast.success("Job deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to delete job";
      toast.error(errorMessage);
      console.error("Delete job error:", error);
    },
  });
};

// Hook to get applications for a job
export const useGetJobApplications = (jobId?: string, params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: jobKeys.applications(jobId || "", params),
    queryFn: () => jobService.getJobApplications(jobId || "", params),
    enabled: !!jobId,
  });
};

// Hook to get my applications
export const useGetMyApplications = (params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: jobKeys.myApplications(params),
    queryFn: () => jobService.getMyApplications(params),
  });
};

// Hook to get single application
export const useGetApplicationById = (applicationId?: string): UseQueryResult<JobApplication> => {
  return useQuery({
    queryKey: jobKeys.application(applicationId || ""),
    queryFn: () => jobService.getApplicationById(applicationId || ""),
    enabled: !!applicationId,
  });
};

// Hook to update application status
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: JobApplication['status'] }) =>
      jobService.updateApplicationStatus(applicationId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.application(variables.applicationId) });
      toast.success("Application status updated successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update application status";
      toast.error(errorMessage);
      console.error("Update application status error:", error);
    },
  });
};

// Hook to delete application
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) => jobService.deleteApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      toast.success("Application deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to delete application";
      toast.error(errorMessage);
      console.error("Delete application error:", error);
    },
  });
};

// Hook to apply for a job
export const useApplyForJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, formData }: { jobId: string; formData: FormData }) =>
      jobService.applyForJob(jobId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.myApplications() });
      toast.success("Application submitted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to submit application";
      toast.error(errorMessage);
      console.error("Apply for job error:", error);
    },
  });
};

// Hook to save a job
export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.saveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.savedJobs() });
      toast.success("Job saved successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to save job";
      toast.error(errorMessage);
      console.error("Save job error:", error);
    },
  });
};

// Hook to unsave a job
export const useUnsaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.unsaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.savedJobs() });
      toast.success("Job removed from saved!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to unsave job";
      toast.error(errorMessage);
      console.error("Unsave job error:", error);
    },
  });
};

// Hook to toggle save status
export const useToggleSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.toggleSaveJob(jobId),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: jobKeys.savedJobs() });
      toast.success(saved ? "Job saved successfully!" : "Job removed from saved!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to toggle save status";
      toast.error(errorMessage);
      console.error("Toggle save job error:", error);
    },
  });
};

// Hook to get my saved jobs
export const useGetMySavedJobs = (params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: jobKeys.savedJobs(params),
    queryFn: () => jobService.getMySavedJobs(params),
  });
};
