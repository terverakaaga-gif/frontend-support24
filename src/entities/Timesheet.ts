// types/timesheet.ts

export interface Timesheet {
  _id: string;
  shiftId: {
    _id: string;
    isMultiWorkerShift: boolean;
    serviceType: ServiceType;
    shiftId: string;
  };
  shiftIdRef: string;
  organizationId: {
    _id: string;
    name: string;
  };
  participantId: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  workerId: string | {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    profileImage?: string;
  };
  isMultiWorkerShift: boolean;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime: string;
  actualEndTime: string;
  extraTime: number; // in minutes
  distanceTravelKm: number;
  distanceTravelRate: number;
  distanceTravelAmount: number;
  notes: string;
  expenses: Expense[];
  participantExpensesTotal: number;
  workerExpensesTotal: number;
  totalExpenses: number;
  rateCalculations: RateCalculation[];
  subtotal: number;
  totalAmount: number;
  grandTotal: number;
  status: TimesheetStatus;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface Expense {
  title: string;
  description: string;
  amount: number;
  receiptUrl?: string;
  payer: 'participant' | 'supportWorker';
  _id: string;
}

export interface RateCalculation {
  rateTimeBandId: {
    _id: string;
    name: string;
    code: string;
    isWeekend: boolean;
    isPublicHoliday: boolean;
    baseRateMultiplier: number;
  };
  name: string;
  hourlyRate: number;
  hours: number;
  amount: number;
  _id: string;
}

export type ServiceType = 
  | 'personalCare' 
  | 'communityAccess' 
  | 'socialSupport' 
  | 'domesticAssistance'
  | 'transportSupport'
  | 'skillDevelopment';

export type TimesheetStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'revised' 
  | 'processed';

// Filter interfaces
export interface TimesheetFilters {
  status?: TimesheetStatus;
  startDate?: string; // ISO date string for filtering by createdAt
  endDate?: string; // ISO date string for filtering by createdAt
  participantId?: string;
}

// Client-side filters (for frontend processing)
export interface TimesheetClientFilters extends TimesheetFilters {
  search?: string; // For searching participant name, worker name, shift ID
  sortField?: 'createdAt' | 'scheduledStartTime' | 'totalAmount';
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// API Response interface (what we get after apiClient.get() extracts response.data.data)
export interface TimesheetsResponse {
  timesheets: Timesheet[];
}

export interface TimesheetResponse {
  timesheet: Timesheet;
}

// Helper interfaces for display
export interface TimesheetSummary {
  totalTimesheets: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalAmount: number;
  totalHours: number;
}

export interface ProcessedTimesheetData {
  timesheets: Timesheet[];
  summary: TimesheetSummary;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    hasMore: boolean;
  };
}

// Service type display names
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  personalCare: 'Personal Care',
  communityAccess: 'Community Access',
  socialSupport: 'Social Support',
  domesticAssistance: 'Domestic Assistance',
  transportSupport: 'Transport Support',
  skillDevelopment: 'Skill Development',
};

// Status display configuration
export const TIMESHEET_STATUS_CONFIG: Record<TimesheetStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  color: string;
}> = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    color: 'text-yellow-600',
  },
  approved: {
    label: 'Approved',
    variant: 'default',
    color: 'text-green-600',
  },
  rejected: {
    label: 'Rejected',
    variant: 'destructive',
    color: 'text-red-600',
  },
  revised: {
    label: 'Revised',
    variant: 'outline',
    color: 'text-blue-600',
  },
  processed: {
    label: 'Processed',
    variant: 'default',
    color: 'text-gray-600',
  },
};