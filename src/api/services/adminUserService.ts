// adminUserService.ts
import { get } from '../apiClient';

// Base filter interface
export interface BaseUserFilters {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  isEmailVerified?: boolean;
  hasProfileImage?: boolean;
}

// Participant-specific filters
export interface ParticipantFilters extends BaseUserFilters {
  hasGuardian?: boolean;
  subscriptionTier?: string;
  subscriptionStatus?: 'active' | 'inactive';
  hasNdisNumber?: boolean;
  requiresSupervision?: boolean;
  hasOrganization?: boolean;
}

// Support Worker-specific filters
export interface WorkerFilters extends BaseUserFilters {
  skills?: string[];
  serviceAreas?: string[];
  languages?: string[];
  hasAbn?: boolean;
  hasBankDetails?: boolean;
  minRating?: number;
  maxRating?: number;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  hasQualifications?: boolean;
  hasExperience?: boolean;
  profileSetupComplete?: boolean;
  identityVerified?: boolean;
  policeCheckVerified?: boolean;
  ndisWorkerScreeningVerified?: boolean;
  onboardingComplete?: boolean;
  onboardingFeeReceived?: boolean;
  minOrganizations?: number;
  maxOrganizations?: number;
}

// Admin-specific filters
export interface AdminFilters extends BaseUserFilters {
  adminType?: string;
  hasAssignedOrganizations?: boolean;
  canManageUsers?: boolean;
  canManageWorkers?: boolean;
  canManageParticipants?: boolean;
  canApproveInvites?: boolean;
  canManageServiceAgreements?: boolean;
  canManageSubscriptions?: boolean;
  canAccessFinancials?: boolean;
  canManageAdmins?: boolean;
}

// Sorting options
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Pagination options
export interface PaginationOptions {
  page: number;
  limit: number;
}

// Response interface
export interface PaginatedUserResponse<T> {
  users: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    hasMore: boolean;
  };
  filters: Record<string, any>;
  sort: SortOptions;
}

// Statistics interface
export interface UserStatistics {
  overview: {
    totalUsers: number;
    totalParticipants: number;
    totalWorkers: number;
    totalAdmins: number;
  };
  verification: {
    participants: {
      verified: number;
      unverified: number;
    };
    workers: {
      verified: number;
      unverified: number;
      completelyVerified: number;
      partiallyVerified: number;
      notStarted: number;
    };
    admins: {
      verified: number;
      unverified: number;
    };
  };
}

// Filter options interface
export interface FilterOptions {
  skills: string[];
  serviceAreas: string[];
  languages: string[];
  subscriptionTiers: string[];
  adminTypes: string[];
  userStatuses: string[];
}

// Helper function to build query string from filters
const buildQueryString = (
  filters: Record<string, any>, 
  sort: SortOptions, 
  pagination: PaginationOptions
): string => {
  const params = new URLSearchParams();

  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        params.append(key, value.join(','));
      } else {
        params.append(key, String(value));
      }
    }
  });

  // Add sorting
  params.append('sortField', sort.field);
  params.append('sortDirection', sort.direction);

  // Add pagination
  params.append('page', String(pagination.page));
  params.append('limit', String(pagination.limit));

  return params.toString();
};

// Admin User Service
export const adminUserService = {
  // Get participants
  getParticipants: async (
    filters: ParticipantFilters = {},
    sort: SortOptions = { field: 'createdAt', direction: 'desc' },
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedUserResponse<any>> => {
    const queryString = buildQueryString(filters, sort, pagination);
    return await get<PaginatedUserResponse<any>>(`/admin/participants?${queryString}`);
  },

  // Get support workers
  getWorkers: async (
    filters: WorkerFilters = {},
    sort: SortOptions = { field: 'createdAt', direction: 'desc' },
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedUserResponse<any>> => {
    const queryString = buildQueryString(filters, sort, pagination);
    return await get<PaginatedUserResponse<any>>(`/admin/support-workers?${queryString}`);
  },

  // Get admins
  getAdmins: async (
    filters: AdminFilters = {},
    sort: SortOptions = { field: 'createdAt', direction: 'desc' },
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedUserResponse<any>> => {
    const queryString = buildQueryString(filters, sort, pagination);
    return await get<PaginatedUserResponse<any>>(`/admin/admins?${queryString}`);
  },

  // Get filter options
  getFilterOptions: async (): Promise<FilterOptions> => {
    const response = await get<{ filterOptions: FilterOptions }>('/admin/users/filter-options');
    return response.filterOptions;
  },

  // Get user statistics
  getStatistics: async (): Promise<UserStatistics> => {
    const response = await get<{ statistics: UserStatistics }>('/admin/users/statistics');
    return response.statistics;
  }
};
