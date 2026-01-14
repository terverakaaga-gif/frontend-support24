/**
 * Compliance service
 * API calls for worker compliance submissions and admin reviews
 */

import { get, post, patch } from '../apiClient';
import {
  ICompliance,
  IComplianceAnswers,
  IComplianceStatistics,
  IComplianceListResponse,
  IComplianceFilters,
  IReviewComplianceRequest,
  ComplianceDocumentType,
} from '@/types/compliance.types';

// ============================================
// Response Types
// ============================================

interface MyComplianceResponse {
  compliance: ICompliance | null;
}

interface SubmitComplianceResponse {
  compliance: ICompliance;
}

interface UpdateAnswersResponse {
  compliance: ICompliance;
}

interface UploadDocumentResponse {
  document: {
    type: ComplianceDocumentType;
    url: string;
    uploadedAt: string;
    expiryDate?: string;
  };
}

interface ReviewComplianceResponse {
  compliance: ICompliance;
}

// ============================================
// Service
// ============================================

const complianceService = {
  // ============================================
  // WORKER ENDPOINTS
  // ============================================

  /**
   * Get current worker's compliance status
   */
  getMyCompliance: async (): Promise<ICompliance | null> => {
    const response = await get<MyComplianceResponse>('/compliance/my');
    return response.compliance;
  },

  /**
   * Submit compliance with all documents and answers
   * Uses multipart/form-data
   */
  submitCompliance: async (formData: FormData): Promise<ICompliance> => {
    const response = await post<SubmitComplianceResponse>(
      '/compliance/submit',
      formData,
      {
        headers: {
          'Content-Type': undefined, // Let axios set it automatically with boundary
        },
      }
    );
    return response.compliance;
  },

  /**
   * Update compliance answers only
   */
  updateAnswers: async (answers: Partial<IComplianceAnswers>): Promise<ICompliance> => {
    const response = await patch<UpdateAnswersResponse>('/compliance/answers', answers);
    return response.compliance;
  },

  /**
   * Upload a single compliance document
   */
  uploadDocument: async (
    type: ComplianceDocumentType,
    file: File,
    expiryDate?: string
  ): Promise<UploadDocumentResponse['document']> => {
    const formData = new FormData();
    formData.append('file', file);
    if (expiryDate) {
      formData.append('expiryDate', expiryDate);
    }

    const response = await post<UploadDocumentResponse>(
      `/compliance/documents/${type}`,
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      }
    );
    return response.document;
  },

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  /**
   * Get compliance statistics for admin dashboard
   */
  getStatistics: async (): Promise<IComplianceStatistics> => {
    const response = await get<{ statistics: IComplianceStatistics }>('/compliance/statistics');
    return response.statistics;
  },

  /**
   * Get list of pending compliances with pagination
   */
  getPendingCompliances: async (
    filters?: IComplianceFilters
  ): Promise<IComplianceListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (filters?.status) {
      queryParams.append('status', filters.status);
    }
    if (filters?.page !== undefined) {
      queryParams.append('page', String(filters.page));
    }
    if (filters?.limit !== undefined) {
      queryParams.append('limit', String(filters.limit));
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/compliance/pending?${queryString}` : '/compliance/pending';

    const response = await get<IComplianceListResponse>(url);
    return response;
  },

  /**
   * Get detailed compliance by ID
   */
  getComplianceById: async (complianceId: string): Promise<ICompliance> => {
    const response = await get<{ compliance: ICompliance }>(`/compliance/${complianceId}`);
    return response.compliance;
  },

  /**
   * Review compliance (approve or reject)
   */
  reviewCompliance: async (
    complianceId: string,
    data: IReviewComplianceRequest
  ): Promise<ICompliance> => {
    const response = await patch<ReviewComplianceResponse>(
      `/compliance/${complianceId}/review`,
      data
    );
    return response.compliance;
  },
};

export default complianceService;
