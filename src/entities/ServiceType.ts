// ServiceType entity interfaces and types

export interface ServiceType {
  _id: string;
  name: string;
  code: string;
  categoryId: string;
  status: ServiceTypeStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export enum ServiceTypeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

// Create/Update request interfaces
export interface CreateServiceTypeRequest {
  name: string;
  code: string;
  status?: ServiceTypeStatus;
  categoryId: string;
}

export interface UpdateServiceTypeRequest {
  name?: string;
  code?: string;
  status?: ServiceTypeStatus;
}

// API response interfaces
export interface ServiceTypesResponse {
  serviceTypes: ServiceType[];
}

export interface ServiceTypeResponse {
  serviceType: ServiceType;
}

// Filter and query interfaces
export interface ServiceTypeFilters {
  status?: ServiceTypeStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortField?: 'name' | 'code' | 'createdAt' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
}

// Status configuration for UI
export const SERVICE_TYPE_STATUS_CONFIG = {
  [ServiceTypeStatus.ACTIVE]: {
    label: 'Active',
    variant: 'default' as const,
    color: 'text-green-700 bg-green-100 border-green-200'
  },
  [ServiceTypeStatus.INACTIVE]: {
    label: 'Inactive',
    variant: 'secondary' as const,
    color: 'text-gray-700 bg-gray-100 border-gray-200'
  }
}; 