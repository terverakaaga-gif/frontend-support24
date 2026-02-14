// RateTimeBand entity interfaces and types

export interface RateTimeBand {
  _id: string;
  name: string;
  code: string;
  startTime?: string;
  endTime?: string;
  description: string;
  isWeekend: boolean;
  isPublicHoliday: boolean;
  isSleepover: boolean;
  isActive: boolean;
  baseRateMultiplier: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Create/Update request interfaces
export interface CreateRateTimeBandRequest {
  name: string;
  code: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  isWeekend?: boolean;
  isPublicHoliday?: boolean;
  isSleepover?: boolean;
  isActive?: boolean;
  baseRateMultiplier: number;
}

export interface UpdateRateTimeBandRequest {
  name?: string;
  code?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  isWeekend?: boolean;
  isPublicHoliday?: boolean;
  isSleepover?: boolean;
  isActive?: boolean;
  baseRateMultiplier?: number;
}

// API response interfaces
export interface RateTimeBandsResponse {
  rateTimeBands: RateTimeBand[];
}

export interface RateTimeBandResponse {
  rateTimeBand: RateTimeBand;
}

// Filter and query interfaces
export interface RateTimeBandFilters {
  isActive?: boolean;
  search?: string;
  isWeekend?: boolean;
  isPublicHoliday?: boolean;
  isSleepover?: boolean;
  page?: number;
  limit?: number;
  sortField?: 'name' | 'code' | 'createdAt' | 'updatedAt' | 'baseRateMultiplier';
  sortDirection?: 'asc' | 'desc';
}

// Status configuration for UI
export const RATE_TIME_BAND_STATUS_CONFIG = {
  active: {
    label: 'Active',
    variant: 'default' as const,
    color: 'bg-green-50 text-green-700 border-green-300'
  },
  inactive: {
    label: 'Inactive',
    variant: 'secondary' as const,
    color: 'bg-red-50 text-red-700 border-red-300'
  }
}; 