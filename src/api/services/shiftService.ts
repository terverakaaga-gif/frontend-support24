import { get } from '../apiClient';
import { Shift, ShiftStatus } from '../../entities/Shift';

// Interface for shift filters
export interface ShiftFilters {
  status?: ShiftStatus;
  startDate?: string;
  endDate?: string;
  isMultiWorkerShift?: boolean;
  participantId?: string;
  workerId?: string;
}

// Service for shift GET operations only
const shiftService = {
  // Get all shifts with optional filters
  getShifts: async (filters?: ShiftFilters): Promise<Shift[]> => {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/shifts?${queryString}` : '/shifts';
    
    return await get<Shift[]>(url);
  },
  
  // Get a specific shift by MongoDB ID
  getShiftById: async (id: string): Promise<Shift> => {
    return await get<Shift>(`/shifts/${id}`);
  },
  
  // Get shift by shiftId reference
  getShiftByShiftId: async (shiftIdRef: string): Promise<Shift> => {
    return await get<Shift>(`/shifts/byShiftId/${shiftIdRef}`);
  }
};

export default shiftService;