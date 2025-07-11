import { get, post, patch, del } from '../apiClient';
import { 
  RateTimeBand, 
  CreateRateTimeBandRequest, 
  UpdateRateTimeBandRequest, 
  RateTimeBandFilters
} from '../../entities/RateTimeBand';

// Interface for the API response structure
interface RateTimeBandsApiResponse {
  rateTimeBands: RateTimeBand[];
}

interface RateTimeBandApiResponse {
  rateTimeBand: RateTimeBand;
}

const rateTimeBandService = {
  // Get all rate time bands with optional filters
  getRateTimeBands: async (filters?: RateTimeBandFilters): Promise<RateTimeBand[]> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/rate-time-band?${queryString}` : '/rate-time-band';
    
    // Get the response which contains { rateTimeBands: [...] }
    const response = await get<RateTimeBandsApiResponse>(url);
    
    // Return just the rateTimeBands array
    return response.rateTimeBands;
  },

  // Get active rate time bands only
  getActiveRateTimeBands: async (): Promise<RateTimeBand[]> => {
    const response = await get<RateTimeBandsApiResponse>('/rate-time-band?isActive=true');
    return response.rateTimeBands;
  },

  // Get a specific rate time band by ID
  getRateTimeBandById: async (id: string): Promise<RateTimeBand> => {
    const response = await get<RateTimeBandApiResponse>(`/rate-time-band/${id}`);
    return response.rateTimeBand;
  },

  // Create a new rate time band
  createRateTimeBand: async (data: CreateRateTimeBandRequest): Promise<RateTimeBand> => {
    const response = await post<RateTimeBandApiResponse>('/rate-time-band', data);
    return response.rateTimeBand;
  },

  // Update an existing rate time band
  updateRateTimeBand: async (id: string, data: UpdateRateTimeBandRequest): Promise<RateTimeBand> => {
    const response = await patch<RateTimeBandApiResponse>(`/rate-time-band/${id}`, data);
    return response.rateTimeBand;
  },

  // Delete a rate time band (soft delete - changes status to inactive)
  deleteRateTimeBand: async (id: string): Promise<void> => {
    await del(`/rate-time-band/${id}`);
  }
};

export default rateTimeBandService; 