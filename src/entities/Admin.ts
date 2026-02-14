// types/admin.ts

export interface Admin {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin";
  status: "active" | "inactive" | "pending" | "suspended";
  phone: string;
  notificationPreferences: string;
  isEmailVerified: boolean;
  adminType: string;
  permissions: {
    canManageUsers: boolean;
    canManageWorkers: boolean;
    canManageParticipants: boolean;
    canApproveInvites: boolean;
    canManageServiceAgreements: boolean;
    canManageSubscriptions: boolean;
    canAccessFinancials: boolean;
    canManageAdmins: boolean;
  };
  assignedOrganizations: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  __v: number;
  assignedOrgDetails: OrganizationDetail[];
  assignedOrganizationCount: number;
}

export interface OrganizationDetail {
  _id: string;
  name: string;
  // Add other organization fields as needed
}

// Admin-specific filter interface
export interface AdminTableFilters {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  isEmailVerified?: boolean;
  hasProfileImage?: boolean;
  adminType?: string;
  hasAssignedOrganizations?: boolean;
  canManageUsers?: boolean;
  canManageWorkers?: boolean;
  canManageParticipants?: boolean;
  canApproveInvites?: boolean;
  canManageServiceAgreements?: boolean;
  canManageSubscriptions?: boolean;
  canAccessFinancials?: boolean;
  canManageAdmins?: boolean;
}

// Permission summary interface
export interface PermissionSummary {
  total: number;
  granted: number;
  percentage: number;
}

// Helper type for permission keys
export type PermissionKey = keyof Admin['permissions'];