import { get, post, put, patch, del } from "../apiClient";

// Job interfaces based on API response
export interface JobCompetencies {
  rightToWorkInAustralia?: boolean;
  ndisWorkerScreeningCheck?: boolean;
  wwcc?: boolean;
  policeCheck?: boolean;
  firstAid?: boolean;
  cpr?: boolean;
  ahpraRegistration?: boolean;
  professionalIndemnityInsurance?: boolean;
  covidVaccinationStatus?: boolean;
}

export interface JobPostedBy {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export interface Job {
  _id: string;
  postedBy: JobPostedBy;
  postedByType: "participant" | "provider";
  jobRole: string;
  jobDescription: string;
  keyResponsibilities?: string;
  requiredCompetencies: JobCompetencies;
  location: string;
  price: number;
  jobType: "fullTime" | "partTime" | "contract" | "casual";
  additionalNote?: string;
  status: "active" | "closed" | "draft";
  isDeleted: boolean;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobWithSaveStatus {
  job: Job;
  isSaved?: boolean;
  hasApplied?: boolean;
}

export interface JobApplication {
  _id: string;
  jobId: string | Job;
  applicantId?: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    email: string;
  } | null;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  attachments: JobAttachment[];
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobAttachment {
  fieldName: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface SavedJob {
  _id: string;
  userId: string;
  jobId: Job;
  savedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  jobRole: string;
  jobDescription: string;
  keyResponsibilities?: string;
  requiredCompetencies: JobCompetencies;
  location: string;
  price: number;
  jobType: "fullTime" | "partTime" | "contract" | "casual";
  additionalNote?: string;
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  status?: "active" | "closed" | "draft";
}

export interface JobFilters {
  jobRole?: string;
  jobType?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface JobsResponse {
  jobs: Job[];
  total: number;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface MyJobsResponse {
  jobs: Job[];
  total: number;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface SingleJobResponse {
  job: JobWithSaveStatus;
  isSaved: boolean;
  hasApplied: boolean;
}

interface CreateJobResponse {
  job: Job;
}

interface UpdateJobResponse {
  job: Job;
}

interface DeleteJobResponse {
  success: boolean;
  message: string;
}

interface ApplicationsResponse {
  applications: JobApplication[];
  total: number;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface SingleApplicationResponse {
  application: JobApplication;
}

interface UpdateApplicationStatusResponse {
  application: JobApplication;
}

interface SavedJobsResponse {
  savedJobs: SavedJob[];
  total: number;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface ToggleSaveResponse {
  saved: boolean;
}

const jobService = {
  // Get all jobs with filters
  getAllJobs: async (filters?: JobFilters): Promise<JobsResponse> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/jobs?${queryString}` : "/jobs";

    const response = await get<JobsResponse>(url);
    return response;
  },

  // Get my posted jobs
  getMyPostedJobs: async (params?: {
    limit?: number;
    offset?: number;
    includeDeleted?: boolean;
  }): Promise<MyJobsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.offset) queryParams.append("offset", String(params.offset));
    if (params?.includeDeleted !== undefined)
      queryParams.append("includeDeleted", String(params.includeDeleted));

    const queryString = queryParams.toString();
    const url = queryString
      ? `/jobs/user/my-posts?${queryString}`
      : "/jobs/user/my-posts";

    const response = await get<MyJobsResponse>(url);
    return response;
  },

  // Get single job by ID
  getJobById: async (jobId: string): Promise<JobWithSaveStatus> => {
    const response = await get<JobWithSaveStatus>(`/jobs/${jobId}`);
    return response;
  },

  // Create job
  createJob: async (data: CreateJobRequest): Promise<Job> => {
    const response = await post<CreateJobResponse>("/jobs", data);
    return response.job;
  },

  // Update job
  updateJob: async (jobId: string, data: UpdateJobRequest): Promise<Job> => {
    const response = await put<UpdateJobResponse>(`/jobs/${jobId}`, data);
    return response.job;
  },

  // Delete job (soft delete)
  deleteJob: async (jobId: string): Promise<void> => {
    await del<DeleteJobResponse>(`/jobs/${jobId}`);
  },

  // Get applications for a job
  getJobApplications: async (
    jobId: string,
    params?: { limit?: number; offset?: number }
  ): Promise<ApplicationsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.offset) queryParams.append("offset", String(params.offset));

    const queryString = queryParams.toString();
    const url = queryString
      ? `/jobs/${jobId}/applications?${queryString}`
      : `/jobs/${jobId}/applications`;

    const response = await get<ApplicationsResponse>(url);
    return response;
  },

  // Get my applications
  getMyApplications: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApplicationsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.offset) queryParams.append("offset", String(params.offset));

    const queryString = queryParams.toString();
    const url = queryString
      ? `/jobs/user/my-applications?${queryString}`
      : "/jobs/user/my-applications";

    const response = await get<ApplicationsResponse>(url);
    return response;
  },

  // Get single application
  getApplicationById: async (
    applicationId: string
  ): Promise<JobApplication> => {
    const response = await get<SingleApplicationResponse>(
      `/jobs/applications/${applicationId}`
    );
    return response.application;
  },

  // Update application status
  updateApplicationStatus: async (
    applicationId: string,
    status: JobApplication["status"]
  ): Promise<JobApplication> => {
    const response = await patch<UpdateApplicationStatusResponse>(
      `/jobs/applications/${applicationId}/status`,
      { status }
    );
    return response.application;
  },

  // Delete application (soft delete)
  deleteApplication: async (applicationId: string): Promise<void> => {
    await del(`/jobs/applications/${applicationId}`);
  },

  // Apply for a job (multipart/form-data)
  applyForJob: async (
    jobId: string,
    formData: FormData
  ): Promise<JobApplication> => {
    const response = await post<SingleApplicationResponse>(
      `/jobs/${jobId}/apply`,
      formData,
      {
        headers: {
          "Content-Type": undefined, // Let axios set it automatically with boundary
        },
      }
    );
    return response.application;
  },

  // Save a job
  saveJob: async (jobId: string): Promise<void> => {
    await post(`/jobs/${jobId}/save`, {});
  },

  // Unsave a job
  unsaveJob: async (jobId: string): Promise<void> => {
    await del(`/jobs/${jobId}/save`);
  },

  // Toggle save status
  toggleSaveJob: async (jobId: string): Promise<boolean> => {
    const response = await post<ToggleSaveResponse>(
      `/jobs/${jobId}/toggle-save`,
      {}
    );
    return response.saved;
  },

  // Get my saved jobs
  getMySavedJobs: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<SavedJobsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", String(params.limit));
    if (params?.offset) queryParams.append("offset", String(params.offset));

    const queryString = queryParams.toString();
    const url = queryString
      ? `/jobs/user/saved?${queryString}`
      : "/jobs/user/saved";

    const response = await get<SavedJobsResponse>(url);
    return response;
  },
};

export default jobService;
