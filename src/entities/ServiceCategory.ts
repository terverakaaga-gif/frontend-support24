// ServiceCategory entity interfaces and types

export interface SubCategory {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  _id: string;
  name: string;
  status: ServiceCategoryStatus;
  subCategories: SubCategory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export enum ServiceCategoryStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

// Create/Update request interfaces
export interface CreateServiceCategoryRequest {
  name: string;
  status?: ServiceCategoryStatus;
  subCategories: string[];
}

export interface UpdateServiceCategoryRequest {
  name?: string;
  status?: ServiceCategoryStatus;
  subCategories?: string[];
}

// API response interfaces
export interface ServiceCategoriesResponse {
  categories: ServiceCategory[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface ServiceCategoryResponse {
  category: ServiceCategory;
}

export interface ServiceCategoryStatisticsResponse {
  totalCategories: number;
  byStatus: Record<string, number>;
  totalSubCategories: number;
}

// Filter and query interfaces
export interface ServiceCategoryFilters {
  status?: ServiceCategoryStatus;
  name?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

// Status configuration for UI
export const serviceCategoryStatusConfig = {
  [ServiceCategoryStatus.ACTIVE]: {
    label: "Active",
    color: "text-green-700 bg-green-100 border-green-200",
    badgeVariant: "default",
  },
  [ServiceCategoryStatus.INACTIVE]: {
    label: "Inactive",
    color: "text-gray-700 bg-gray-100 border-gray-200",
    badgeVariant: "secondary",
  },
} as const;
