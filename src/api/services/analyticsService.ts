// src/api/services/analyticsService.ts
import { get, post } from '../apiClient';
import { 
  DateRange, 
  DateRangeType, 
  TrendDataPoint, 
  ComparisonData, 
  AnalyticsResponse
} from '../../entities/Analytics';
import { ServiceTypeInfo } from '../../entities/types';

// Analytics overview interfaces
export interface AdminOverviewAnalytics {
  userMetrics: {
    totalUsers: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
    newUsersToday: number;
    activeToday: number;
    growthRate: ComparisonData;
  };
  platformActivity: {
    activeOrganizations: number;
    activeShifts: number;
    pendingTimesheets: number;
    completedShiftsToday: number;
    platformUsageTrend: TrendDataPoint[];
  };
  financialSummary: {
    totalRevenue: ComparisonData;
    pendingPayments: number;
    processedToday: number;
    averageShiftValue: number;
  };
  operationalMetrics: {
    pendingInvites: number;
    shiftCompletionRate: number;
    averageResponseTime: number;
    cancellationRate: ComparisonData;
  };
}

// User analytics interfaces
export interface AdminUserAnalytics {
  registrationTrends: TrendDataPoint[];
  verificationStats: {
    emailVerified: number;
    profileComplete: number;
    documentsVerified: number;
    fullyOnboarded: number;
  };
  userDistribution: {
    byState: Record<string, number>;
    byServiceArea: Record<string, number>;
  };
  retentionMetrics: {
    monthlyActiveUsers: number;
    churnRate: number;
    averageLifespan: number;
  };
}

// Financial analytics interfaces
export interface AdminFinancialAnalytics {
  revenue: {
    total: number;
    trend: TrendDataPoint[];
    byOrganization: Array<{
      organizationId: string;
      name: string;
      revenue: number;
    }>;
    byServiceType: Record<string, number>;
  };
  payments: {
    processed: number;
    pending: number;
    failed: number;
    averageProcessingTime: number;
  };
  projections: {
    monthlyProjected: number;
    quarterlyProjected: number;
    growthRate: number;
  };
}

// Platform metrics interfaces
export interface PlatformSummary {
  userGrowth: {
    total: number;
    new: number;
    byRole: Record<string, number>;
    growthRate: ComparisonData;
  };
  shiftMetrics: {
    total: number;
    byStatus: Record<string, number>;
    completionRate: number;
    cancellationRate: number;
  };
  financialMetrics: {
    totalRevenue: number;
    pendingPayments: number;
    averageShiftValue: number;
    paymentDistribution: {
      paid: number;
      unpaid: number;
    };
  };
  organizationMetrics: {
    total: number;
    active: number;
    pendingInvites: number;
    averageWorkersPerOrg: number;
  };
  dateRange: DateRange;
}

// Real-time metrics interfaces
export interface RealTimeMetrics {
  activeUsers: number;
  shiftsToday: number;
  completedShiftsToday: number;
  platformUsage: TrendDataPoint[];
  lastUpdated: Date;
}

// Filter options for analytics
export interface AnalyticsFilters {
  dateRange: DateRange;
  organizationId?: string;
  workerId?: string;
  serviceType?: string;
  status?: string;
  comparison?: boolean;
  groupBy?: 'day' | 'week' | 'month' | 'worker' | 'service' | 'status';
}

// Export options
export interface ExportOptions {
  dateRange: DateRangeType | string;
  startDate?: string;
  endDate?: string;
  format: 'pdf' | 'csv' | 'excel' | 'json';
}

// Participant analytics interfaces
export interface ParticipantOverviewAnalytics {
  careOverview: {
    activeWorkers: number;
    upcomingShifts: any[];
    completedShiftsThisMonth: number;
    totalCareHours: {
      current: number;
      previous: number;
      percentageChange: number;
      trend: 'up' | 'down' | 'stable';
    };
    pendingTimesheets: number;
  };
  financialSummary: {
    currentMonthExpenses: number;
    expensesByCategory: {
      serviceFees: number;
      travelCosts: number;
      additionalExpenses: number;
    };
    budgetUtilization: number;
    spendingTrend: TrendDataPoint[];
  };
  workerMetrics: {
    totalWorkers: number;
    averageRating: number;
    topWorkers: Array<{
      workerId: string;
      name: string;
      hours: number;
      rating: number;
    }>;
  };
}

// Updated interface to match actual API response
export interface ParticipantServiceAnalytics {
  serviceDistribution: Array<{
    serviceType: ServiceTypeInfo;
    hours: number;
    percentage: number;
  }>;
  peakServiceTimes: Array<{
    dayOfWeek: string;
    hour: number;
    frequency: number;
  }>;
  servicetrends: TrendDataPoint[];
  preferredWorkers: Array<{
    workerId: string;
    name: string;
    serviceCount: number;
  }>;
}

// Support Worker analytics interfaces
export interface SupportWorkerOverviewAnalytics {
  workSummary: {
    activeClients: number;
    upcomingShifts: any[];
    completedThisPeriod: number;
    hoursWorked: {
      current: number;
      previous: number;
      percentageChange: number;
      trend: 'up' | 'down' | 'stable';
    };
    earnings: {
      current: number;
      previous: number;
      percentageChange: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
  performanceMetrics: {
    acceptanceRate: number;
    completionRate: number;
    onTimeRate: number;
    averageRating: number;
    totalReviews: number;
  };
  availability: {
    utilizationRate: number;
    peakWorkDays: string[];
    averageShiftLength: number;
  };
}

export interface SupportWorkerFinancialAnalytics {
  earnings: {
    currentPeriod: number;
    pending: number;
    paid: number;
    trend: TrendDataPoint[];
    byOrganization: Array<{
      organizationId: string;
      name: string;
      amount: number;
    }>;
  };
  expenses: {
    travelReimbursements: number;
    expenseClaims: number;
    totalExpenses: number;
  };
  projections: {
    monthlyProjected: number;
    averageHourlyRate: number;
    highestPayingService: string;
  };
}

export interface SupportWorkerScheduleAnalytics {
  weeklyHours: TrendDataPoint[];
  shiftDistribution: {
    byServiceType: Record<string, number>;
    byDayOfWeek: Array<{
      day: string;
      hours: number;
    }>;
    byTimeOfDay: Array<{
      hour: number;
      frequency: number;
    }>;
  };
  travelAnalysis: {
    totalDistance: number;
    averageDistancePerShift: number;
    travelReimbursements: number;
  };
}

export interface SupportWorkerPerformanceAnalytics {
  skillUtilization: any[];
  availabilityComparison: {
    availableHours: number;
    bookedHours: number;
    utilizationPercentage: number;
    unutilizedHours: number;
  };
  documentAlerts: any[];
}

// Helper function to create date range
export const createDateRange = (
  type: DateRangeType,
  startDate?: Date,
  endDate?: Date
): DateRange => {
  const now = new Date();
  let start: Date;
  let end = now;

  switch (type) {
    case DateRangeType.TODAY:
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case DateRangeType.WEEK:
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      break;
    case DateRangeType.MONTH:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case DateRangeType.QUARTER: {
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    }
    case DateRangeType.YEAR:
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case DateRangeType.CUSTOM:
      if (!startDate || !endDate) {
        throw new Error('Custom date range requires start and end dates');
      }
      start = startDate;
      end = endDate;
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { startDate: start, endDate: end, type };
};

// Analytics service functions
const analyticsService = {
  // Get overview analytics
  getDashboardOverview: async (
    dateRange: DateRange,
    comparison: boolean = true
  ): Promise<AdminOverviewAnalytics> => {
    const params = new URLSearchParams({
      dateRange: dateRange.type,
      comparison: comparison.toString()
    });
    
    if (dateRange.type === DateRangeType.CUSTOM) {
      params.append('startDate', dateRange.startDate.toISOString());
      params.append('endDate', dateRange.endDate.toISOString());
    }
    
    // return await get<AdminOverviewAnalytics>(`/analytics/overview?${params}`);
    const response = await get<AnalyticsResponse<AdminOverviewAnalytics>>(`/analytics/overview?${params}`)
    return response.analytics;
  },
  
  // Get user analytics
  getUserAnalytics: async (dateRange: DateRange): Promise<AdminUserAnalytics> => {
    const params = new URLSearchParams({
      dateRange: dateRange.type
    });
    
    if (dateRange.type === DateRangeType.CUSTOM) {
      params.append('startDate', dateRange.startDate.toISOString());
      params.append('endDate', dateRange.endDate.toISOString());
    }
    
    // return await get<AdminUserAnalytics>(`/analytics/admin/users?${params}`);
    const response = await get<AnalyticsResponse<AdminUserAnalytics>>(`/analytics/admin/users?${params}`);
    return response.analytics;
  },
  
  // Get financial analytics
  getFinancialAnalytics: async (dateRange: DateRange): Promise<AdminFinancialAnalytics> => {
    const params = new URLSearchParams({
      dateRange: dateRange.type
    });
    
    if (dateRange.type === DateRangeType.CUSTOM) {
      params.append('startDate', dateRange.startDate.toISOString());
      params.append('endDate', dateRange.endDate.toISOString());
    }
    
    // return await get<AdminFinancialAnalytics>(`/analytics/admin/financial?${params}`);
    const response = await get<AnalyticsResponse<AdminFinancialAnalytics>>(`/analytics/admin/financial?${params}`);
    return response.analytics
  },
  
  // Get filtered analytics
  getFilteredAnalytics: async (filters: AnalyticsFilters): Promise<any> => {
    return await post<any>('/analytics/filtered', filters);
  },
  
  // Get platform summary
  getPlatformSummary: async (dateRange: DateRange): Promise<PlatformSummary> => {
    const params = new URLSearchParams({
      dateRange: dateRange.type
    });
    
    if (dateRange.type === DateRangeType.CUSTOM) {
      params.append('startDate', dateRange.startDate.toISOString());
      params.append('endDate', dateRange.endDate.toISOString());
    }
    
    // return await get<PlatformSummary>(`/analytics/platform/summary?${params}`);
    const response = await get<AnalyticsResponse<PlatformSummary>>(`/analytics/platform/summary?${params}`);
    return response.analytics;
  },
  
  // Get real-time metrics
  getRealTimeMetrics: async (): Promise<RealTimeMetrics> => {
    // return await get<RealTimeMetrics>('/analytics/realtime');
    const response = await get<AnalyticsResponse<RealTimeMetrics>>('/analytics/realtime');
    return response.analytics
  },
  
  // Export analytics data
  exportAnalyticsData: async (options: ExportOptions): Promise<Blob> => {
    const response = await post<Blob>('/analytics/export', options, {
      responseType: 'blob'
    });
    
    return response;
  },

  // Get participant overview analytics
  getParticipantOverview: async (
    dateRange: string = 'month',
    comparison: boolean = true
  ): Promise<ParticipantOverviewAnalytics> => {
    const params = new URLSearchParams({
      dateRange,
      comparison: comparison.toString()
    });

    const response = await get<AnalyticsResponse<ParticipantOverviewAnalytics>>(`/analytics/overview?${params}`);
    return response.analytics;
  },

  // Get participant service analytics
  getParticipantServices: async (
    dateRange: string = 'month'
  ): Promise<ParticipantServiceAnalytics> => {
    const params = new URLSearchParams({
      dateRange
    });

    const response = await get<AnalyticsResponse<ParticipantServiceAnalytics>>(`/analytics/participant/services?${params}`);
    return response.analytics;
  },

  // Get support worker overview analytics
  getSupportWorkerOverview: async (
    dateRange: string = 'month',
    comparison: boolean = true
  ): Promise<SupportWorkerOverviewAnalytics> => {
    const params = new URLSearchParams({
      dateRange,
      comparison: comparison.toString()
    });

    const response = await get<AnalyticsResponse<SupportWorkerOverviewAnalytics>>(`/analytics/overview?${params}`);
    return response.analytics;
  },

  // Get support worker financial analytics
  getSupportWorkerFinancial: async (
    dateRange: string = 'month'
  ): Promise<SupportWorkerFinancialAnalytics> => {
    const params = new URLSearchParams({
      dateRange
    });

    const response = await get<AnalyticsResponse<SupportWorkerFinancialAnalytics>>(`/analytics/worker/financial?${params}`);
    return response.analytics;
  },

  // Get support worker schedule analytics
  getSupportWorkerSchedule: async (
    dateRange: string = 'month'
  ): Promise<SupportWorkerScheduleAnalytics> => {
    const params = new URLSearchParams({
      dateRange
    });

    const response = await get<AnalyticsResponse<SupportWorkerScheduleAnalytics>>(`/analytics/worker/schedule?${params}`);
    return response.analytics;
  },

  // Get support worker performance analytics
  getSupportWorkerPerformance: async (
    dateRange: string = 'month'
  ): Promise<SupportWorkerPerformanceAnalytics> => {
    const params = new URLSearchParams({
      dateRange
    });

    const response = await get<{ skillUtilization: any[]; availabilityComparison: any; documentAlerts: any[] }>(`/analytics/worker/performance?${params}`);
    return response;
  }
};

export default analyticsService;