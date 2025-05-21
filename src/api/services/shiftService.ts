import { get, post, put, del } from '../apiClient';
import { 
  Shift, 
  ShiftStatus, 
  CancellationReason, 
  WorkerAssignment 
} from '../../entities/Shift';

// Interface for shift creation
// export interface CreateShiftInput {
//   participantId: string;
//   serviceType: string;
//   startTime: Date;
//   endTime: Date;
//   locationType: string;
//   address?: string;
//   isMultiWorkerShift: boolean;
//   workerId?: string;
//   workerAssignments?: Omit<WorkerAssignment, 'responseDate'>[];
//   shiftType: string;
//   requiresSupervision: boolean;
//   specialInstructions?: string;
//   recurrence?: {
//     pattern: string;
//     occurrences?: number;
//     endDate?: Date;
//   };
// }

// Interface for updating shift
// export interface UpdateShiftInput {
//   serviceType?: string;
//   startTime?: Date;
//   endTime?: Date;
//   locationType?: string;
//   address?: string;
//   specialInstructions?: string;
//   requiresSupervision?: boolean;
// }

// Interface for shift status update
// export interface ShiftStatusUpdateInput {
//   status: ShiftStatus;
//   declineReason?: string;
// }

// Interface for shift cancellation
// export interface CancelShiftInput {
//   cancellationReason: CancellationReason;
//   cancellationNote?: string;
// }

// Interface for shift filters
export interface ShiftFilters {
  status?: ShiftStatus;
  startDate?: string;
  endDate?: string;
  isMultiWorkerShift?: boolean;
  participantId?: string;
  workerId?: string;
}

// Service for shift operations
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
  
  // Get a specific shift by ID
  getShiftById: async (shiftId: string): Promise<Shift> => {
    return await get<Shift>(`/shifts/${shiftId}`);
  },

    // Get a specific shift by SHIFTIDREF
  getShiftByShifIdRef: async (shiftIdRef: string): Promise<Shift> => {
    return await get<Shift>(`/shifts/byShiftId/${shiftIdRef}`);
  },
  
  // Create a new shift
//   createShift: async (shiftData: CreateShiftInput): Promise<Shift> => {
//     return await post<Shift>('/shifts', shiftData);
//   },
  
  // Update a shift
//   updateShift: async (id: string, shiftData: UpdateShiftInput): Promise<Shift> => {
//     return await put<Shift>(`/shifts/${id}`, shiftData);
//   },
  
  // Update shift status (accept/decline for workers)
//   updateShiftStatus: async (id: string, statusData: ShiftStatusUpdateInput): Promise<Shift> => {
//     return await put<Shift>(`/shifts/${id}/status`, statusData);
//   },
  
  // Cancel a shift
//   cancelShift: async (id: string, cancellationData: CancelShiftInput): Promise<Shift> => {
//     return await put<Shift>(`/shifts/${id}/cancel`, cancellationData);
//   },
  
  // Complete a shift (mark as completed)
//   completeShift: async (id: string): Promise<Shift> => {
//     return await put<Shift>(`/shifts/${id}/complete`, {});
//   },
  
  // Delete a shift (may be restricted by business rules)
//   deleteShift: async (id: string): Promise<void> => {
//     return await del<void>(`/shifts/${id}`);
//   },
};

export default shiftService;