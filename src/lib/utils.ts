
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Helper functions
export interface WorkerProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
}

// Safe helper functions
export const getWorkerDisplayName = (workerId: string | WorkerProfile | null): string => {
  if (!workerId) {
    return "Unknown Worker";
  }
  if (typeof workerId === "string") {
    return `Worker ${workerId.slice(-8)}`;
  }
  return `${workerId.firstName || ''} ${workerId.lastName || ''}`.trim() || "Unknown Worker";
};

export const getWorkerInitials = (workerId: string | WorkerProfile | null): string => {
  if (!workerId) {
    return "??";
  }
  if (typeof workerId === "string") {
    return workerId.slice(0, 2).toUpperCase();
  }
  return `${workerId.firstName?.[0] || ''}${workerId.lastName?.[0] || ''}`.toUpperCase() || '??';
};

export const getWorkerEmail = (workerId: string | WorkerProfile | null): string => {
  if (!workerId) {
    return "Email not available";
  }
  if (typeof workerId === "string") {
    return "Email not available";
  }
  return workerId.email || "Email not available";
};

export const getWorkerPhone = (workerId: string | WorkerProfile | null): string => {
  if (!workerId) {
    return "Phone not available";
  }
  if (typeof workerId === "string") {
    return "Phone not available";
  }
  return workerId.phone || "Phone not available";
};

export const getWorkerProfileImage = (workerId: string | WorkerProfile | null): string | undefined => {
  if (!workerId) {
    return undefined;
  }
  if (typeof workerId === "string") {
    return undefined;
  }
  return workerId.profileImage;
};

// Safe data filtering
export const filterValidWorkers = <T extends { workerId: string | WorkerProfile | null }>(
  items: T[]
): T[] => {
  return items.filter(item => item.workerId !== null && item.workerId !== undefined);
};

 // Password requirements checker
  export const getPasswordRequirements = (len:number,char:string) => {
    const requirements = [
      {
        text: "At least 8 characters",
        met: len >= 8,
      },
      {
        text: "At least 1 uppercase",
        met: /[A-Z]/.test(char),
      },
      {
        text: "At least 1 lowercase",
        met: /[a-z]/.test(char),
      },
      {
        text: "At least 1 special character",
        met: /[!@#$%^&*(),.?":{}|<>]/.test(char),
      },
    ];
    return requirements;
  };