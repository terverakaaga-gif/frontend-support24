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

// Interfaces based on API response
interface Organization {
	_id: string;
	name: string;
}

/**
 * Worker assignment status for multi-worker shifts
 */
interface WorkerAssignment {
	_id: string;
	workerId: UserSummary;
	status: ShiftStatus;
	declineReason?: string;
	responseDate?: Date;
	cancelledBy?: string; // originally mongoose.Types.ObjectId
	cancellationReason?: CancellationReason;
	cancellationNote?: string;
}

export interface Shift {
	serviceType: any;
	_id: string; // Unique MongoDB ID
	shiftId: string; // Unique shift identifier
	organizationId: string | Organization; // Organization this shift belongs to
	participantId: string | UserSummary; // Participant who created the shift
	isMultiWorkerShift: boolean; // Whether shift requires multiple workers
	workerId?: string | UserSummary; // Support worker assigned (single-worker mode)
	workerAssignments?: WorkerAssignment[]; // Support workers assigned (multi-worker mode)
	serviceTypeId?: ServiceTypeId; // Type of service requested
	startTime: string; // Scheduled start time
	endTime: string; // Scheduled end time

	// Location details
	locationType: LocationType;
	address?: string; // Required for in-person shifts

	// Shift configuration
	shiftType: ShiftType; // Direct booking or open request
	requiresSupervision: boolean; // Whether supervision is required
	specialInstructions?: string; // Any special notes or requirements

	// Status tracking
	status: ShiftStatus; // Current status of the shift
	cancelledBy?: string; // User who cancelled the shift
	cancellationReason?: CancellationReason; // Reason for cancellation
	cancellationNote?: string; // Additional notes for cancellation
	declineReason?: string; // Reason for worker declining

	// Recurrence for recurring shifts
	recurrence?: Recurrence;

	// Timestamps
	createdAt: string;
	updatedAt: string;
}
