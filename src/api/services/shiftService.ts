import { get, post } from '../apiClient';
import { CreateShiftRequest, Shift, ShiftStatus } from '../../entities/Shift';

// Interface for shift filters
export interface ShiftFilters {
  status?: ShiftStatus;
  startDate?: string;
  endDate?: string;
  isMultiWorkerShift?: boolean;
  participantId?: string;
  workerId?: string;
}

// Interface for the API response structure
interface ShiftsResponse {
  shifts: Shift[];
}

interface ShiftResponse {
    shift: Shift;
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
    
    // return await get<Shift[]>(url);

    // Get the response which contains { shifts: [...] }
    const response = await get<ShiftsResponse>(url);
    
    // Return just the shifts array
    return response.shifts;
  },
  
  // Get a specific shift by MongoDB ID
  getShiftById: async (id: string): Promise<Shift> => {
    // return await get<Shift>(`/shifts/${id}`);

    const response =  await get<ShiftResponse>(`/shifts/${id}`);
    return response.shift
  },
  
  // Get shift by shiftId reference
  getShiftByShiftId: async (shiftIdRef: string): Promise<Shift> => {
    // Use the correct API endpoint /shifts/:shiftId
    const response = await get<ShiftResponse>(`/shifts/${shiftIdRef}`);
    return response.shift;
  },

  // Post a new shift
  createShift: async (data: CreateShiftRequest): Promise<Shift> => {
    const response = await post<Shift>('/shifts', data);
    return response;
  }

};

export default shiftService;