// Helper function to safely get worker full name
export const getWorkerFullName = (worker: any): string => {
  if (worker?.workerId?.firstName && worker?.workerId?.lastName) {
    return `${worker.workerId.firstName} ${worker.workerId.lastName}`;
  }
  if (worker?.firstName && worker?.lastName) {
    return `${worker.firstName} ${worker.lastName}`;
  }
  return "Unknown Worker";
};

// Helper function to get worker initials
export const getWorkerInitials = (worker: any): string => {
  if (worker?.workerId?.firstName && worker?.workerId?.lastName) {
    return `${worker.workerId.firstName.charAt(
      0
    )}${worker.workerId.lastName.charAt(0)}`.toUpperCase();
  }
  if (worker?.firstName && worker?.lastName) {
    return `${worker.firstName.charAt(0)}${worker.lastName.charAt(
      0
    )}`.toUpperCase();
  }
  return "UW";
};

// Helper function to get worker email
export const getWorkerEmail = (worker: any): string => {
  return worker?.workerId?.email || worker?.email || "No email";
};
