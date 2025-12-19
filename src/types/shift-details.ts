
export interface UserInfo {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage: string;
}

export interface ServiceType {
  _id: string;
  name: string;
  code: string;
  status: string;
}

export interface WorkerAssignment {
  _id: string;
  workerId: string | UserInfo;
  status: string;
}

export interface Shift {
  _id: string;
  organizationId: string;
  participantId: string | UserInfo;
  workerId?: string | UserInfo;
  isMultiWorkerShift: boolean;
  workerAssignments?: WorkerAssignment[];
  serviceTypeId: ServiceType;
  startTime: string;
  endTime: string;
  locationType: string;
  address: string;
  shiftType: string;
  requiresSupervision: boolean;
  specialInstructions?: string;
  status: string;
  shiftId: string;
  recurrence?: {
    pattern: string;
  };
  routineRequired?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimesheetFormData {
  actualStartTime: string;
  actualEndTime: string;
  distanceTravelKm: number;
  notes: string;
  expenses: Array<{
    title: string;
    description: string;
    amount: number;
    payer: "participant" | "supportWorker";
  }>;
}