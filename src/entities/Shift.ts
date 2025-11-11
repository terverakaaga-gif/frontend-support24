import { UserSummary } from "./types";

/**
 * Cancellation reason enumeration
 * Reasons for shift cancellation
 */
export enum CancellationReason {
	PARTICIPANT_REQUEST = "participantRequest",
	WORKER_UNAVAILABLE = "workerUnavailable",
	EMERGENCY = "emergency",
	SCHEDULING_ERROR = "schedulingError",
	OTHER = "other",
}

/**
 * Shift status enumeration
 * Defines the possible status values for shifts
 */
export enum ShiftStatus {
	OPEN = "open",
	PENDING = "pending",
	CONFIRMED = "confirmed",
	IN_PROGRESS = "inProgress",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
	NO_SHOW = "noShow",
	DECLINED = "declined",
}

/**
 * Shift type enumeration
 * Differentiates between direct bookings and open requests
 */
export enum ShiftType {
	DIRECT_BOOKING = "directBooking", // Specific worker was requested
	// OPEN_REQUEST = 'openRequest'       // Open to eligible workers
}

/**
 * Recurrence pattern enumeration
 * For recurring shifts
 */
export type RecurrencePattern =
	| "none"
	| "daily"
	| "weekly"
	| "biweekly"
	| "monthly";

export interface Recurrence {
	pattern: RecurrencePattern;
	occurrences?: number;
	endDate?: Date;
	parentShiftId?: string;
}

/**
 * Service type enumeration
 * Types of services that can be requested in a shift
 */
export enum ServiceType {
	PERSONAL_CARE = "personalCare",
	HOUSEHOLD_TASKS = "householdTasks",
	SOCIAL_SUPPORT = "socialSupport",
	TRANSPORT = "transport",
	MEAL_PREPARATION = "mealPreparation",
	MEDICATION_SUPPORT = "medicationSupport",
	MOBILITY_ASSISTANCE = "mobilityAssistance",
	THERAPY_SUPPORT = "therapySupport",
	BEHAVIOR_SUPPORT = "behaviorSupport",
	COMMUNITY_ACCESS = "communityAccess",
}

export interface ServiceTypeId {
	_id: string;
	name: string;
	code: string;
	status: string;
}

/**
 * Shift location type enumeration
 * Whether the shift is in-person or virtual
 */
export enum LocationType {
	IN_PERSON = "inPerson", // At participant's address or specified location
	// VIRTUAL = 'virtual'      // Online/video call
}
/**
 * Worker assignment status for multi-worker shifts
 */
export interface ShiftWorkerAssignment {
	_id: string;
	workerId: UserSummary;
	status: ShiftStatus;
	declineReason?: string;
	responseDate?: Date;
	cancelledBy?: string; // originally mongoose.Types.ObjectId
	cancellationReason?: CancellationReason;
	cancellationNote?: string;
}

export interface ShiftRecurrence {
  pattern: "none" | "daily" | "weekly" | "biweekly" | "monthly";
  occurrences?: number;
}

export interface CreateShiftRequest {
  organizationId: string;
  isMultiWorkerShift: boolean;
  workerId?: string;
  workerIds?: string[];
  serviceType: string;
  startTime: string;
  endTime: string;
  locationType: "inPerson" | "virtual";
  address: string;
  shiftType: "directBooking" | "openShift";
  requiresSupervision: boolean;
  specialInstructions?: string;
  recurrence?: ShiftRecurrence;
}

export interface Shift {
  _id: string;
  shiftId: string;
  organizationId: string;
  isMultiWorkerShift: boolean;
  workerId?: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  workerAssignments?: Array<{
    _id: string;
    workerId: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
  }>;
  serviceTypeId: {
    _id: string;
    name: string;
    displayName?: string;
  };
  startTime: string;
  endTime: string;
  locationType: "inPerson" | "virtual";
  address?: string;
  status: string;
  shiftType: "directBooking" | "openShift";
  requiresSupervision: boolean;
  specialInstructions?: string;
  recurrence?: ShiftRecurrence;
  createdAt: string;
  updatedAt: string;
}