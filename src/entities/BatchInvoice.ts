// entities/BatchInvoice.ts

// Core BatchInvoice interfaces
export interface BatchInvoice {
  _id: string;
  batchNumber: string;
  workerId: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  participantId: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  startDate: string;
  endDate: string;
  invoiceNumber: string;
  timesheetIds: BatchInvoiceTimesheet[];
  status: BatchInvoiceStatus;
  generatedAt: string;
  sentToParticipant: boolean;
  sentToWorker: boolean;
  subtotal: number;
  travelExpenseTotal: number;
  invoiceTotal: number;
  additionalExpensesTotal: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  pdfPath?: string;
  participantEmailSentAt?: string;
  workerEmailSentAt?: string;
}

export interface BatchInvoiceTimesheet {
  _id: string;
  shiftId: {
    _id: string;
    serviceTypeId: {
      _id: string;
      name: string;
      code: string;
      status: string;
    };
    shiftId: string;
  };
  actualStartTime: string;
  actualEndTime: string;
  distanceTravelAmount: number;
  subtotal: number;
}

export type BatchInvoiceStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

// Batch Processing History interfaces
export interface BatchProcessingHistory {
  _id: string;
  runId: string;
  runType: BatchRunType;
  startDate: string;
  endDate: string;
  initiatedBy: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  processingStartTime: string;
  processingEndTime?: string;
  status: BatchProcessingStatus;
  totalTimesheetsProcessed: number;
  totalBatchesGenerated: number;
  totalWorkers: number;
  totalParticipants: number;
  totalErrors: number;
  errorDetails: string[];
  processingLog: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type BatchRunType = 'manual' | 'scheduled';
export type BatchProcessingStatus = 'started' | 'completed' | 'failed' | 'partiallyCompleted';

// Batch Configuration interfaces
export interface BatchConfig {
  _id: string;
  isEnabled: boolean;
  frequency: BatchFrequency;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  timeOfDay: string; // HH:MM format
  timezone: string;
  periodStartDay: number;
  periodEndDay: number;
  monthlyStartDate?: number; // For monthly frequency
  automaticEmailParticipant: boolean;
  automaticEmailWorker: boolean;
  nextScheduledRun?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type BatchFrequency = 'daily' | 'weekly' | 'monthly';

// API Response interfaces
export interface BatchInvoicesResponse {
  batchInvoices: BatchInvoice[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface BatchInvoiceResponse {
  batchInvoice: BatchInvoice;
}

export interface BatchProcessingHistoryResponse {
  history: BatchProcessingHistory[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface BatchConfigResponse {
  config: BatchConfig;
}

// Filter interfaces
export interface BatchInvoiceFilters {
  status?: BatchInvoiceStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export interface BatchHistoryFilters {
  status?: BatchProcessingStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

// Request interfaces
export interface BatchConfigUpdateRequest {
  isEnabled?: boolean;
  frequency?: BatchFrequency;
  dayOfWeek?: number;
  timeOfDay?: string;
  timezone?: string;
  periodStartDay?: number;
  periodEndDay?: number;
  monthlyStartDate?: number;
  automaticEmailParticipant?: boolean;
  automaticEmailWorker?: boolean;
}

export interface BatchGenerationRequest {
  startDate: string;
  endDate: string;
  workerId?: string;
  participantId?: string;
  sendEmails?: boolean;
}

export interface BatchInvoiceEmailRequest {
  sendToParticipant?: boolean;
  sendToWorker?: boolean;
}

// Response interfaces for operations
export interface BatchGenerationResponse {
  processingHistory: BatchProcessingHistory;
}

export interface BatchInvoiceEmailResponse {
  // Empty data object as per API response
}

// Status configurations for UI
export const BATCH_INVOICE_STATUS_CONFIG: Record<BatchInvoiceStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  color: string;
}> = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    color: 'text-yellow-600',
  },
  completed: {
    label: 'Completed',
    variant: 'default',
    color: 'text-green-600',
  },
  failed: {
    label: 'Failed',
    variant: 'destructive',
    color: 'text-red-600',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'outline',
    color: 'text-gray-600',
  },
};

export const BATCH_PROCESSING_STATUS_CONFIG: Record<BatchProcessingStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  color: string;
}> = {
  started: {
    label: 'Started',
    variant: 'secondary',
    color: 'text-primary',
  },
  completed: {
    label: 'Completed',
    variant: 'default',
    color: 'text-green-600',
  },
  failed: {
    label: 'Failed',
    variant: 'destructive',
    color: 'text-red-600',
  },
  partiallyCompleted: {
    label: 'Partially Completed',
    variant: 'outline',
    color: 'text-yellow-600',
  },
};

// Frequency labels
export const BATCH_FREQUENCY_LABELS: Record<BatchFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

// Day of week labels
export const DAY_OF_WEEK_LABELS: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
}; 