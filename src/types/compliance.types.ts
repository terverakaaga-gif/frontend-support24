/**
 * Compliance types
 * Type definitions for worker compliance documents and status
 */

/**
 * Types of compliance documents that workers can upload
 */
export enum ComplianceDocumentType {
  FIRST_AID_CERTIFICATE = 'firstAidCertificate',
  CPR_CERTIFICATE = 'cprCertificate',
  POLICE_CHECK = 'policeCheck',
  WWCC = 'wwcc',
  RELEVANT_DOCUMENT = 'relevantDocument',
  RELEVANT_INSURANCE = 'relevantInsurance',
}

/**
 * Status of a compliance submission
 */
export enum ComplianceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * Required documents list
 */
export const REQUIRED_DOCUMENTS: ComplianceDocumentType[] = [
  ComplianceDocumentType.FIRST_AID_CERTIFICATE,
  ComplianceDocumentType.CPR_CERTIFICATE,
  ComplianceDocumentType.POLICE_CHECK,
  ComplianceDocumentType.WWCC,
];

export const OPTIONAL_DOCUMENTS: ComplianceDocumentType[] = [
  ComplianceDocumentType.RELEVANT_DOCUMENT,
  ComplianceDocumentType.RELEVANT_INSURANCE,
];

/**
 * Compliance answers interface (14 questions)
 */
export interface IComplianceAnswers {
  ndisWorkerScreeningCheck: boolean;
  ndisWorkerOrientationModule: boolean;
  nationalPoliceCheck: boolean;
  workingWithChildrenCheck: boolean;
  firstAidCertification: boolean;
  cprCertification: boolean;
  covidVaccinationEvidence: boolean;
  influenzaVaccinationEvidence: boolean;
  relevantQualifications: boolean;
  ndisCodeOfConductAgreement: boolean;
  manualHandlingTraining: boolean;
  medicationAdministrationTraining: boolean;
  infectionControlTraining: boolean;
  publicLiabilityInsurance: boolean;
}

/**
 * Compliance document interface
 */
export interface IComplianceDocument {
  type: ComplianceDocumentType;
  url: string;
  uploadedAt: string;
  expiryDate?: string;
  isRequired: boolean;
}

/**
 * Worker basic info for compliance list
 */
export interface IComplianceWorker {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

/**
 * Full compliance record
 */
export interface ICompliance {
  _id: string;
  workerId: IComplianceWorker;  // API returns workerId, not worker
  status: ComplianceStatus;
  complianceAnswers: IComplianceAnswers;  // API returns complianceAnswers, not answers
  documents: IComplianceDocument[];
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  rejectionReasons?: string[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  answeredQuestionsCount?: number;
  hasAllRequiredDocuments?: boolean;
}

/**
 * Labels for compliance questions
 */
export const COMPLIANCE_QUESTION_LABELS: Record<keyof IComplianceAnswers, string> = {
  ndisWorkerScreeningCheck: 'Do you have NDIS Worker Screening Check?',
  ndisWorkerOrientationModule: 'Do you have NDIS Worker Orientation Module (Quality, Safety, and You)?',
  nationalPoliceCheck: 'Do you have National Police Check?',
  workingWithChildrenCheck: 'Do you have Experience Working with Children Check?',
  firstAidCertification: 'Do you have First Aid Certifications (HLTAID011)?',
  cprCertification: 'Do you have CPR Certifications (HLTAID009)?',
  covidVaccinationEvidence: 'Do you have COVID-19 Vaccination Evidence?',
  influenzaVaccinationEvidence: 'Do you have Influenza Vaccination Evidence?',
  relevantQualifications: 'Do you have Relevant Qualifications (Certificate in individual, community or disability support service)?',
  ndisCodeOfConductAgreement: 'Do you have NDIS Code of Conduct Agreement?',
  manualHandlingTraining: 'Do you have Manual Handling Training?',
  medicationAdministrationTraining: 'Do you have Medication Administration Training?',
  infectionControlTraining: 'Do you have Infection Control Training?',
  publicLiabilityInsurance: 'Do you have Public Liability & Professional Indemnity Insurance?',
};

/**
 * Labels for document types
 */
export const DOCUMENT_TYPE_LABELS: Record<ComplianceDocumentType, string> = {
  [ComplianceDocumentType.FIRST_AID_CERTIFICATE]: 'First Aid Certificate',
  [ComplianceDocumentType.CPR_CERTIFICATE]: 'CPR Certificate',
  [ComplianceDocumentType.POLICE_CHECK]: 'Police Check',
  [ComplianceDocumentType.WWCC]: 'Working with Children Check',
  [ComplianceDocumentType.RELEVANT_DOCUMENT]: 'Relevant Document',
  [ComplianceDocumentType.RELEVANT_INSURANCE]: 'Relevant Insurance',
};

// ============================================
// API Response Types
// ============================================

export interface IComplianceStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  draft: number;
}

export interface IComplianceListResponse {
  compliances: ICompliance[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface IComplianceFilters {
  status?: ComplianceStatus;
  page?: number;
  limit?: number;
}

export interface IReviewComplianceRequest {
  decision: 'approved' | 'rejected';
  rejectionReasons?: string[];
  adminNotes?: string;
}
