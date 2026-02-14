import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { batchInvoiceService } from '../api/services/batchInvoiceService';
import { 
  BatchInvoice,
  BatchInvoicesResponse,
  BatchProcessingHistory,
  BatchProcessingHistoryResponse,
  BatchConfig,
  BatchInvoiceFilters,
  BatchHistoryFilters,
  BatchConfigUpdateRequest,
  BatchGenerationRequest,
  BatchInvoiceEmailRequest,
} from '../entities/BatchInvoice';

// Query keys for cache management
export const batchInvoiceKeys = {
  all: ['batchInvoices'] as const,
  lists: () => [...batchInvoiceKeys.all, 'list'] as const,
  list: (filters?: BatchInvoiceFilters) => [...batchInvoiceKeys.lists(), filters] as const,
  details: () => [...batchInvoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...batchInvoiceKeys.details(), id] as const,
  history: () => [...batchInvoiceKeys.all, 'history'] as const,
  historyList: (filters?: BatchHistoryFilters) => [...batchInvoiceKeys.history(), filters] as const,
  config: () => [...batchInvoiceKeys.all, 'config'] as const,
  stats: (filters?: BatchInvoiceFilters) => [...batchInvoiceKeys.all, 'stats', filters] as const,
  recentActivity: (limit?: number) => [...batchInvoiceKeys.all, 'recent', limit] as const,
  processingStatus: () => [...batchInvoiceKeys.all, 'processing-status'] as const,
  worker: (workerId: string) => [...batchInvoiceKeys.all, 'worker', workerId] as const,
  participant: (participantId: string) => [...batchInvoiceKeys.all, 'participant', participantId] as const,
};

// Hook to get batch invoices with optional filters
export const useGetBatchInvoices = (
  filters?: BatchInvoiceFilters,
  enabled: boolean = true
): UseQueryResult<BatchInvoicesResponse> => {
  return useQuery({
    queryKey: batchInvoiceKeys.list(filters),
    queryFn: () => batchInvoiceService.getBatchInvoices(filters),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
};

// Hook to get a single batch invoice by ID
export const useGetBatchInvoice = (
  batchInvoiceId: string,
  enabled: boolean = true
): UseQueryResult<BatchInvoice> => {
  return useQuery({
    queryKey: batchInvoiceKeys.detail(batchInvoiceId),
    queryFn: () => batchInvoiceService.getBatchInvoiceById(batchInvoiceId),
    enabled: enabled && !!batchInvoiceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get batch processing history
export const useGetBatchProcessingHistory = (
  filters?: BatchHistoryFilters,
  enabled: boolean = true
): UseQueryResult<BatchProcessingHistoryResponse> => {
  return useQuery({
    queryKey: batchInvoiceKeys.historyList(filters),
    queryFn: () => batchInvoiceService.getBatchProcessingHistory(filters),
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent updates for processing status)
  });
};

// Hook to get batch configuration
export const useGetBatchConfig = (
  enabled: boolean = true
): UseQueryResult<BatchConfig> => {
  return useQuery({
    queryKey: batchInvoiceKeys.config(),
    queryFn: () => batchInvoiceService.getBatchConfig(),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes (config doesn't change often)
  });
};

// Hook to get batch invoice statistics
export const useGetBatchInvoiceStats = (
  filters?: BatchInvoiceFilters,
  enabled: boolean = true
): UseQueryResult<{
  totalInvoices: number;
  pendingCount: number;
  completedCount: number;
  failedCount: number;
  cancelledCount: number;
  totalAmount: number;
}> => {
  return useQuery({
    queryKey: batchInvoiceKeys.stats(filters),
    queryFn: () => batchInvoiceService.getBatchInvoiceStats(filters),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get recent batch processing activity
export const useGetRecentBatchActivity = (
  limit: number = 5,
  enabled: boolean = true
): UseQueryResult<BatchProcessingHistory[]> => {
  return useQuery({
    queryKey: batchInvoiceKeys.recentActivity(limit),
    queryFn: () => batchInvoiceService.getRecentBatchActivity(limit),
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook to check if batch processing is currently running
export const useIsBatchProcessingRunning = (
  enabled: boolean = true
): UseQueryResult<boolean> => {
  return useQuery({
    queryKey: batchInvoiceKeys.processingStatus(),
    queryFn: () => batchInvoiceService.isBatchProcessingRunning(),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds when processing
  });
};

// Hook to get batch invoices for a specific worker
export const useGetWorkerBatchInvoices = (
  workerId: string,
  filters?: BatchInvoiceFilters,
  enabled: boolean = true
): UseQueryResult<BatchInvoicesResponse> => {
  return useQuery({
    queryKey: [...batchInvoiceKeys.worker(workerId), filters],
    queryFn: () => batchInvoiceService.getBatchInvoicesForWorker(workerId, filters),
    enabled: enabled && !!workerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get batch invoices for a specific participant
export const useGetParticipantBatchInvoices = (
  participantId: string,
  filters?: BatchInvoiceFilters,
  enabled: boolean = true
): UseQueryResult<BatchInvoicesResponse> => {
  return useQuery({
    queryKey: [...batchInvoiceKeys.participant(participantId), filters],
    queryFn: () => batchInvoiceService.getBatchInvoicesForParticipant(participantId, filters),
    enabled: enabled && !!participantId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutation hook to update batch configuration
export const useUpdateBatchConfig = (): UseMutationResult<
  BatchConfig,
  Error,
  BatchConfigUpdateRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (configUpdate: BatchConfigUpdateRequest) =>
      batchInvoiceService.updateBatchConfig(configUpdate),
    onSuccess: (data) => {
      // Invalidate and refetch batch config
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.config() });
      toast.success('Batch configuration updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update batch configuration: ${error.message}`);
    },
  });
};

// Mutation hook to generate batch invoice
export const useGenerateBatchInvoice = (): UseMutationResult<
  BatchProcessingHistory,
  Error,
  BatchGenerationRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BatchGenerationRequest) =>
      batchInvoiceService.generateBatchInvoice(request),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.history() });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.processingStatus() });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.recentActivity() });
      
      toast.success('Batch invoice generation started successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate batch invoice: ${error.message}`);
    },
  });
};

// Mutation hook to send batch invoice email
export const useSendBatchInvoiceEmail = (): UseMutationResult<
  void,
  Error,
  { batchInvoiceId: string; emailRequest: BatchInvoiceEmailRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchInvoiceId, emailRequest }) =>
      batchInvoiceService.sendBatchInvoiceEmail(batchInvoiceId, emailRequest),
    onSuccess: (_, { batchInvoiceId }) => {
      // Invalidate the specific batch invoice to refresh email status
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.detail(batchInvoiceId) });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.lists() });
      
      toast.success('Batch invoice email sent successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send batch invoice email: ${error.message}`);
    },
  });
};

// Mutation hook to download batch invoice
export const useDownloadBatchInvoice = (): UseMutationResult<
  void,
  Error,
  { batchInvoiceId: string; fileName?: string }
> => {
  return useMutation({
    mutationFn: ({ batchInvoiceId, fileName }) =>
      batchInvoiceService.downloadBatchInvoiceFile(batchInvoiceId, fileName),
    onSuccess: () => {
      toast.success('Batch invoice downloaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to download batch invoice: ${error.message}`);
    },
  });
};

// Quick action hooks
export const useQuickActions = () => {
  const queryClient = useQueryClient();

  const sendToAll = useMutation({
    mutationFn: (batchInvoiceId: string) =>
      batchInvoiceService.quickActions.sendToAll(batchInvoiceId),
    onSuccess: (_, batchInvoiceId) => {
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.detail(batchInvoiceId) });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.lists() });
      toast.success('Batch invoice sent to both participant and worker');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send batch invoice: ${error.message}`);
    },
  });

  const sendToParticipant = useMutation({
    mutationFn: (batchInvoiceId: string) =>
      batchInvoiceService.quickActions.sendToParticipant(batchInvoiceId),
    onSuccess: (_, batchInvoiceId) => {
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.detail(batchInvoiceId) });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.lists() });
      toast.success('Batch invoice sent to participant');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send batch invoice: ${error.message}`);
    },
  });

  const sendToWorker = useMutation({
    mutationFn: (batchInvoiceId: string) =>
      batchInvoiceService.quickActions.sendToWorker(batchInvoiceId),
    onSuccess: (_, batchInvoiceId) => {
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.detail(batchInvoiceId) });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.lists() });
      toast.success('Batch invoice sent to worker');
    },
    onError: (error: Error) => {
      toast.error(`Failed to send batch invoice: ${error.message}`);
    },
  });

  const generateCurrentWeek = useMutation({
    mutationFn: ({ workerId, participantId }: { workerId?: string; participantId?: string }) =>
      batchInvoiceService.quickActions.generateCurrentWeek(workerId, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.history() });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.processingStatus() });
      toast.success('Current week batch generation started');
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate current week batch: ${error.message}`);
    },
  });

  const generatePreviousWeek = useMutation({
    mutationFn: ({ workerId, participantId }: { workerId?: string; participantId?: string }) =>
      batchInvoiceService.quickActions.generatePreviousWeek(workerId, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.history() });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.processingStatus() });
      toast.success('Previous week batch generation started');
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate previous week batch: ${error.message}`);
    },
  });

  const generateCurrentMonth = useMutation({
    mutationFn: ({ workerId, participantId }: { workerId?: string; participantId?: string }) =>
      batchInvoiceService.quickActions.generateCurrentMonth(workerId, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.history() });
      queryClient.invalidateQueries({ queryKey: batchInvoiceKeys.processingStatus() });
      toast.success('Current month batch generation started');
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate current month batch: ${error.message}`);
    },
  });

  return {
    sendToAll,
    sendToParticipant,
    sendToWorker,
    generateCurrentWeek,
    generatePreviousWeek,
    generateCurrentMonth,
  };
};

// Hook to get batch invoice by batch number
export const useGetBatchInvoiceByNumber = (
  batchNumber: string,
  enabled: boolean = true
): UseQueryResult<BatchInvoice | null> => {
  return useQuery({
    queryKey: [...batchInvoiceKeys.all, 'batch-number', batchNumber],
    queryFn: () => batchInvoiceService.getBatchInvoiceByBatchNumber(batchNumber),
    enabled: enabled && !!batchNumber,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for real-time batch processing status monitoring
export const useBatchProcessingMonitor = (
  enabled: boolean = true,
  refetchInterval: number = 10000 // 10 seconds
): UseQueryResult<BatchProcessingHistory[]> => {
  return useQuery({
    queryKey: [...batchInvoiceKeys.history(), 'monitor'],
    queryFn: () => batchInvoiceService.getRecentBatchActivity(3),
    enabled,
    staleTime: 5 * 1000, // 5 seconds
    refetchInterval,
  });
}; 