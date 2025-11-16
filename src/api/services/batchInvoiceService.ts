import { get, post, put, downloadBlob } from '../apiClient';
import { 
  BatchInvoice,
  BatchInvoicesResponse,
  BatchInvoiceResponse,
  BatchProcessingHistory,
  BatchProcessingHistoryResponse,
  BatchConfig,
  BatchConfigResponse,
  BatchInvoiceFilters,
  BatchHistoryFilters,
  BatchConfigUpdateRequest,
  BatchGenerationRequest,
  BatchInvoiceEmailRequest,
  BatchGenerationResponse,
  BatchInvoiceEmailResponse,
} from '../../entities/BatchInvoice';

// Helper function to build query string from filters
const buildQueryString = (filters: Record<string, any>): string => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  
  return params.toString();
};

// Batch Invoice Service
export const batchInvoiceService = {
  // Get all batch invoices with optional filters
  getBatchInvoices: async (filters: BatchInvoiceFilters = {}): Promise<BatchInvoicesResponse> => {
    const queryString = buildQueryString(filters);
    const url = queryString ? `/batch-invoices?${queryString}` : '/batch-invoices';
    
    const response = await get<BatchInvoicesResponse>(url);
    return response;
  },

  // Get single batch invoice by ID
  getBatchInvoiceById: async (batchInvoiceId: string): Promise<BatchInvoice> => {
    const response = await get<BatchInvoiceResponse>(`/batch-invoices/${batchInvoiceId}`);
    return response.batchInvoice;
  },

  // Get batch processing history
  getBatchProcessingHistory: async (filters: BatchHistoryFilters = {}): Promise<BatchProcessingHistoryResponse> => {
    const queryString = buildQueryString(filters);
    const url = queryString ? `/batch-invoices/history?${queryString}` : '/batch-invoices/history';
    
    const response = await get<BatchProcessingHistoryResponse>(url);
    return response;
  },

  // Get batch configuration
  getBatchConfig: async (): Promise<BatchConfig> => {
    const response = await get<BatchConfigResponse>('/batch-invoices/config');
    return response.config;
  },

  // Update batch configuration
  updateBatchConfig: async (configUpdate: BatchConfigUpdateRequest): Promise<BatchConfig> => {
    const response = await put<BatchConfigResponse, BatchConfigUpdateRequest>(
      '/batch-invoices/config',
      configUpdate
    );
    return response.config;
  },

  // Download batch invoice (returns blob for PDF)
  downloadBatchInvoice: async (batchInvoiceId: string): Promise<Blob> => {
    return await downloadBlob(`/batch-invoices/${batchInvoiceId}/download`);
  },

  // Trigger batch invoice generation manually
  generateBatchInvoice: async (generationRequest: BatchGenerationRequest): Promise<BatchProcessingHistory> => {
    const response = await post<BatchGenerationResponse, BatchGenerationRequest>(
      '/batch-invoices/generate',
      generationRequest
    );
    return response.processingHistory;
  },

  // Send batch invoice email
  sendBatchInvoiceEmail: async (
    batchInvoiceId: string,
    emailRequest: BatchInvoiceEmailRequest
  ): Promise<void> => {
    await post<BatchInvoiceEmailResponse, BatchInvoiceEmailRequest>(
      `/batch-invoices/${batchInvoiceId}/send`,
      emailRequest
    );
  },

  // Helper function to download and trigger file download in browser
  downloadBatchInvoiceFile: async (batchInvoiceId: string, fileName?: string): Promise<void> => {
    try {
      const blob = await batchInvoiceService.downloadBatchInvoice(batchInvoiceId);

      // Verify that we received a valid blob
      if (!blob || blob.size === 0) {
        throw new Error('Invalid or empty file received from server');
      }
      
      // Check if the blob is actually a PDF (or at least not an error response)
      if (blob.type && !blob.type.includes('pdf') && !blob.type.includes('application/octet-stream') && blob.type !== '') {
        // If it's not a PDF, it might be an error response
        const text = await blob.text();
        try {
          const errorResponse = JSON.parse(text);
          throw new Error(errorResponse.message || 'Failed to download invoice');
        } catch (parseError) {
          throw new Error('Failed to download invoice: Invalid response format');
        }
      }
      
      // Generate filename if not provided
      const downloadFileName = fileName || `batch-invoice-${batchInvoiceId}.pdf`;
    
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFileName;
      link.style.display = 'none';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      throw error;
    }
  },

  // Get batch invoice statistics (derived from the list data)
  getBatchInvoiceStats: async (filters: BatchInvoiceFilters = {}): Promise<{
    totalInvoices: number;
    pendingCount: number;
    completedCount: number;
    failedCount: number;
    cancelledCount: number;
    totalAmount: number;
  }> => {
    // Get all invoices without pagination to calculate stats
    const allInvoicesFilters = { ...filters };
    delete allInvoicesFilters.page;
    delete allInvoicesFilters.limit;
    
    const response = await batchInvoiceService.getBatchInvoices(allInvoicesFilters);
    const invoices = response.batchInvoices;
    
    const stats = {
      totalInvoices: invoices.length,
      pendingCount: invoices.filter(inv => inv.status === 'pending').length,
      completedCount: invoices.filter(inv => inv.status === 'completed').length,
      failedCount: invoices.filter(inv => inv.status === 'failed').length,
      cancelledCount: invoices.filter(inv => inv.status === 'cancelled').length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.invoiceTotal, 0),
    };
    
    return stats;
  },

  // Get recent batch processing activity
  getRecentBatchActivity: async (limit: number = 5): Promise<BatchProcessingHistory[]> => {
    const response = await batchInvoiceService.getBatchProcessingHistory({ limit });
    return response.history;
  },

  // Check if batch processing is currently running
  isBatchProcessingRunning: async (): Promise<boolean> => {
    const response = await batchInvoiceService.getBatchProcessingHistory({ limit: 1 });
    const latestRun = response.history[0];
    return latestRun?.status === 'started';
  },

  // Get batch invoice by batch number
  getBatchInvoiceByBatchNumber: async (batchNumber: string): Promise<BatchInvoice | null> => {
    try {
      // Since there's no specific endpoint for batch number search, we'll get all and filter
      const response = await batchInvoiceService.getBatchInvoices({ limit: 1000 });
      const invoice = response.batchInvoices.find(inv => inv.batchNumber === batchNumber);
      return invoice || null;
    } catch (error) {
      console.error('Error getting batch invoice by batch number:', error);
      return null;
    }
  },

  // Get batch invoices for a specific worker
  getBatchInvoicesForWorker: async (workerId: string, filters: BatchInvoiceFilters = {}): Promise<BatchInvoicesResponse> => {
    // Add worker filter logic if the API supports it, otherwise filter client-side
    const response = await batchInvoiceService.getBatchInvoices(filters);
    
    // Filter by worker ID client-side
    const filteredInvoices = response.batchInvoices.filter(inv => inv.workerId._id === workerId);
    
    return {
      ...response,
      batchInvoices: filteredInvoices,
      totalResults: filteredInvoices.length,
      totalPages: Math.ceil(filteredInvoices.length / (filters.limit || 10)),
    };
  },

  // Get batch invoices for a specific participant
  getBatchInvoicesForParticipant: async (participantId: string, filters: BatchInvoiceFilters = {}): Promise<BatchInvoicesResponse> => {
    // Add participant filter logic if the API supports it, otherwise filter client-side
    const response = await batchInvoiceService.getBatchInvoices(filters);
    
    // Filter by participant ID client-side
    const filteredInvoices = response.batchInvoices.filter(inv => inv.participantId._id === participantId);
    
    return {
      ...response,
      batchInvoices: filteredInvoices,
      totalResults: filteredInvoices.length,
      totalPages: Math.ceil(filteredInvoices.length / (filters.limit || 10)),
    };
  },

  // Quick actions for batch invoices
  quickActions: {
    // Send to both participant and worker
    sendToAll: async (batchInvoiceId: string): Promise<void> => {
      await batchInvoiceService.sendBatchInvoiceEmail(batchInvoiceId, {
        sendToParticipant: true,
        sendToWorker: true,
      });
    },

    // Send to participant only
    sendToParticipant: async (batchInvoiceId: string): Promise<void> => {
      await batchInvoiceService.sendBatchInvoiceEmail(batchInvoiceId, {
        sendToParticipant: true,
        sendToWorker: false,
      });
    },

    // Send to worker only
    sendToWorker: async (batchInvoiceId: string): Promise<void> => {
      await batchInvoiceService.sendBatchInvoiceEmail(batchInvoiceId, {
        sendToParticipant: false,
        sendToWorker: true,
      });
    },

    // Generate batch for current week
    generateCurrentWeek: async (workerId?: string, participantId?: string): Promise<BatchProcessingHistory> => {
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      
      startOfWeek.setHours(0, 0, 0, 0);
      endOfWeek.setHours(23, 59, 59, 999);
      
      return await batchInvoiceService.generateBatchInvoice({
        startDate: startOfWeek.toISOString(),
        endDate: endOfWeek.toISOString(),
        workerId,
        participantId,
        sendEmails: true,
      });
    },

    // Generate batch for previous week
    generatePreviousWeek: async (workerId?: string, participantId?: string): Promise<BatchProcessingHistory> => {
      const now = new Date();
      const startOfPrevWeek = new Date(now.setDate(now.getDate() - now.getDay() - 7));
      const endOfPrevWeek = new Date(now.setDate(now.getDate() - now.getDay() - 1));
      
      startOfPrevWeek.setHours(0, 0, 0, 0);
      endOfPrevWeek.setHours(23, 59, 59, 999);
      
      return await batchInvoiceService.generateBatchInvoice({
        startDate: startOfPrevWeek.toISOString(),
        endDate: endOfPrevWeek.toISOString(),
        workerId,
        participantId,
        sendEmails: true,
      });
    },

    // Generate batch for current month
    generateCurrentMonth: async (workerId?: string, participantId?: string): Promise<BatchProcessingHistory> => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      startOfMonth.setHours(0, 0, 0, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      return await batchInvoiceService.generateBatchInvoice({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
        workerId,
        participantId,
        sendEmails: true,
      });
    },
  },
};

export default batchInvoiceService; 