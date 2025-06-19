// api/services/timesheetService.ts
import { get } from '../apiClient';
import { 
  TimesheetsResponse, 
  TimesheetResponse, 
  TimesheetFilters, 
  TimesheetClientFilters,
  ProcessedTimesheetData,
  Timesheet,
  TimesheetSummary
} from '../../entities/Timesheet';

// Helper function to build query string from filters
const buildQueryString = (filters: TimesheetFilters): string => {
  const params = new URLSearchParams();

  // Add backend-supported filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  return params.toString();
};

// Client-side filtering function
const applyClientFilters = (
  timesheets: Timesheet[], 
  filters: TimesheetClientFilters
): Timesheet[] => {
  let filtered = [...timesheets];

  // Apply search filter
  if (filters.search && filters.search.trim() !== '') {
    const searchTerm = filters.search.toLowerCase().trim();
    filtered = filtered.filter(timesheet => {
      const participantName = `${timesheet.participantId.firstName} ${timesheet.participantId.lastName}`.toLowerCase();
      // Handle both string workerId and object workerId cases
      const workerName = typeof timesheet.workerId === 'string' 
        ? timesheet.workerId.toLowerCase()
        : `${timesheet.workerId.firstName} ${timesheet.workerId.lastName}`.toLowerCase();
      const shiftId = timesheet.shiftIdRef.toLowerCase();
      
      return participantName.includes(searchTerm) || 
             workerName.includes(searchTerm) || 
             shiftId.includes(searchTerm);
    });
  }

  return filtered;
};

// Client-side sorting function
const applySorting = (
  timesheets: Timesheet[], 
  sortField?: string, 
  sortDirection: 'asc' | 'desc' = 'desc'
): Timesheet[] => {
  if (!sortField) return timesheets;

  return [...timesheets].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'scheduledStartTime':
        aValue = new Date(a.scheduledStartTime).getTime();
        bValue = new Date(b.scheduledStartTime).getTime();
        break;
      case 'totalAmount':
        aValue = a.totalAmount;
        bValue = b.totalAmount;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
};

// Client-side pagination function
const applyPagination = (
  timesheets: Timesheet[], 
  page: number = 1, 
  limit: number = 20
): { paginatedData: Timesheet[]; pagination: ProcessedTimesheetData['pagination'] } => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = timesheets.slice(startIndex, endIndex);
  
  const totalResults = timesheets.length;
  const totalPages = Math.ceil(totalResults / limit);
  const hasMore = page < totalPages;

  return {
    paginatedData,
    pagination: {
      page,
      limit,
      totalPages,
      totalResults,
      hasMore,
    },
  };
};

// Calculate summary statistics
const calculateSummary = (timesheets: Timesheet[]): TimesheetSummary => {
  const totalTimesheets = timesheets.length;
  const pendingCount = timesheets.filter(t => t.status === 'pending').length;
  const approvedCount = timesheets.filter(t => t.status === 'approved').length;
  const rejectedCount = timesheets.filter(t => t.status === 'rejected').length;
  const totalAmount = timesheets.reduce((sum, t) => sum + t.totalAmount, 0);
  
  // Calculate total hours from rate calculations
  const totalHours = timesheets.reduce((sum, t) => {
    const shiftHours = t.rateCalculations.reduce((hourSum, calc) => hourSum + calc.hours, 0);
    return sum + shiftHours;
  }, 0);

  return {
    totalTimesheets,
    pendingCount,
    approvedCount,
    rejectedCount,
    totalAmount,
    totalHours,
  };
};

// Timesheet Service
export const timesheetService = {
  // Get all timesheets with client-side processing
  getTimesheets: async (filters: TimesheetClientFilters = {}): Promise<ProcessedTimesheetData> => {
    // Extract backend filters
    const backendFilters: TimesheetFilters = {
      status: filters.status,
      startDate: filters.startDate,
      endDate: filters.endDate,
      participantId: filters.participantId,
    };

    // Build query string for backend
    const queryString = buildQueryString(backendFilters);
    const url = queryString ? `/timesheets?${queryString}` : '/timesheets';
    
    // Fetch data from backend
    const response = await get<TimesheetsResponse>(url);
    let timesheets = response.timesheets; // Changed from response.data.timesheets

    // Apply client-side filters
    timesheets = applyClientFilters(timesheets, filters);

    // Apply sorting
    timesheets = applySorting(timesheets, filters.sortField, filters.sortDirection);

    // Calculate summary before pagination
    const summary = calculateSummary(timesheets);

    // Apply pagination
    const { paginatedData, pagination } = applyPagination(
      timesheets, 
      filters.page, 
      filters.limit
    );

    return {
      timesheets: paginatedData,
      summary,
      pagination,
    };
  },

  // Get single timesheet by ID
  getTimesheetById: async (timesheetId: string): Promise<Timesheet> => {
    const response = await get<TimesheetResponse>(`/timesheets/${timesheetId}`);
    return response.timesheet;
  },

  // Get all timesheets without processing (for exports, etc.)
  getAllTimesheets: async (filters: TimesheetFilters = {}): Promise<Timesheet[]> => {
    const queryString = buildQueryString(filters);
    const url = queryString ? `/timesheets?${queryString}` : '/timesheets';
    
    const response = await get<TimesheetsResponse>(url);
    return response.timesheets; // Changed from response.data.timesheets
  },

  // Get timesheet summary statistics
  getTimesheetSummary: async (filters: TimesheetFilters = {}): Promise<TimesheetSummary> => {
    const timesheets = await timesheetService.getAllTimesheets(filters);
    return calculateSummary(timesheets);
  },

  // Helper functions for client-side processing
  processTimesheets: (
    timesheets: Timesheet[], 
    filters: TimesheetClientFilters
  ): ProcessedTimesheetData => {
    // Apply client-side filters
    let processed = applyClientFilters(timesheets, filters);

    // Apply sorting
    processed = applySorting(processed, filters.sortField, filters.sortDirection);

    // Calculate summary
    const summary = calculateSummary(processed);

    // Apply pagination
    const { paginatedData, pagination } = applyPagination(
      processed, 
      filters.page, 
      filters.limit
    );

    return {
      timesheets: paginatedData,
      summary,
      pagination,
    };
  },
};