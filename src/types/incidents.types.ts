// Types
export type TSeverity = "LOW" | "MEDIUM" | "HIGH";
export type TIncidentStatus =
	| "OPEN"
	| "IN_REVIEW"
	| "RESOLVED"
	| "PENDING"
	| "REJECTED";

// DTOs
export type CreateIncidentDTO = {
	shiftId: string;
	title: string;
	description: string;
	severity: TSeverity;
	urlLinks?: string[];
};

export type UpdateIncidentStatusDTO = {
	status: TIncidentStatus;
	updatedBy: string;
};

export type ResolveIncidentDTO = {
	resolutionNote: string;
	resolvedBy: string;
};

export interface IIncidentResponse {
	incidents: IIncident[];
	totalCount: number;
	totalPages: number;
	currentPage: number;
}

export interface IIncident {
	_id: string;
	shiftId: string;
	reportedBy: IUserIncident;
	reportedAgainst: IUserIncident;
	title: string;
	description: string;
	severity: TSeverity;
	urlLinks: string[];
	status: TIncidentStatus;
	createdAt: string;
	updatedAt: string;
	resolutionNote?: string;
	resolvedAt?: string;
	resolvedBy?: IUserIncident;
	shift: IShiftInfo;
}

export interface IUserIncident {
	_id: string;
	email: string;
	firstName: string;
	lastName: string;
}

export interface IShiftInfo {
	_id: string;
	startTime: string;
	endTime: string;
	shiftId: string;
}

export interface ICreateIncidentResponse {
	success: boolean;
	code: number;
	message: string;
	data: ICreatedIncident;
	error: any;
}

export interface ICreatedIncident {
	_id: string;
	shiftId: string;
	reportedBy: IUserIncident;
	reportedAgainst: IUserIncident;
	title: string;
	description: string;
	severity: TSeverity;
	urlLinks: string[];
	status: TIncidentStatus;
	createdAt: string;
	updatedAt: string;
}

export interface IIncidentStatusUpdateResponse {
	success: boolean;
	code: number;
	message: string;
	data: IUpdatedIncident;
	error: any;
}

export interface IUpdatedIncident {
	_id: string;
	shiftId: string;
	reportedBy: string;
	reportedAgainst: string;
	title: string;
	description: string;
	severity: TSeverity;
	urlLinks: string[];
	status: TIncidentStatus;
	createdAt: string;
	updatedAt: string;
}

export interface IIncidentResolveResponse {
	success: boolean;
	code: number;
	message: string;
	data: IResolvedIncident;
	error: any;
}

export interface IResolvedIncident {
	_id: string;
	shiftId: string;
	reportedBy: IUserIncident;
	reportedAgainst: IUserIncident;
	title: string;
	description: string;
	severity: TSeverity;
	urlLinks: string[];
	status: "RESOLVED";
	createdAt: string;
	updatedAt: string;
	__v: number;
	resolutionNote: string;
	resolvedAt: string;
	resolvedBy: IUserIncident;
}

export interface IShiftIncidentsResponse {
	success: boolean;
	code: number;
	message: string;
	data: IIncident[];
	error: any;
}
export interface IIncidentByIdResponse {
	success: boolean;
	code: number;
	message: string;
	data: IIncident;
	error: any;
}
