import { Participant, SupportWorker, BaseUser } from "@/types/user.types";
import { get, patch, post } from "../apiClient";
import { ServiceType } from "@/entities/ServiceType";

export interface UpdateProfileData {
	firstName?: string;
	lastName?: string;
	phone?: string;
	bio?: string;
	emergencyContact?: {
		name: string;
		relationship: string;
		phone: string;
	};
	// Participant specific
	supportNeeds?: string[];
	preferredLanguages?: string[];
	preferredGenders?: string[];
	requiresSupervision?: boolean;
	// Support Worker specific
	skills?: ServiceType[];
	availability?: {
		weekdays: Array<{
			day: string;
			available: boolean;
			slots?: Array<{
				start: string;
				end: string;
			}>;
		}>;
		unavailableDates?: Date[];
	};
	serviceAreas?: string[];
	languages?: string[];
	qualifications?: string[];
	experience?: Array<{
		title: string;
		organization: string;
		startDate: Date;
		endDate?: Date;
		description?: string;
	}>;
	hourlyRate?: number;
	weekendRate?: number;
	holidayRate?: number;
	overnightRate?: number;
}

export class UserService {
	// Get current user profile
	async getProfile(): Promise<{
		user: BaseUser | Participant | SupportWorker;
	}> {
		return await get("/users/profile");
	}

	// Update current user profile
	async updateProfile(
		data: UpdateProfileData
	): Promise<BaseUser | Participant | SupportWorker> {
		return await patch("/users/profile", data);
	}

	// Update profile image
	async updateProfileImage(
		file: File
	): Promise<BaseUser | Participant | SupportWorker> {
		const formData = new FormData();
		formData.append("image", file);

		return await post("/users/profile-image", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	// Change password
	async changePassword(data: {
		currentPassword: string;
		newPassword: string;
	}): Promise<{ success: boolean; message: string }> {
		return await post("/users/change-password", data);
	}

	// Complete worker onboarding
	// async completeWorkerOnboarding<D>(data: D): Promise<ProfileResponse> {
	// 	return await post("/users/workers/onboarding", data);
	// }

	// Complete participant onboarding
	// async completeParticipantOnboarding<D>(data: D): Promise<ProfileResponse> {
	// 	return await post("/users/participants/onboarding", data);
	// }
}

export const userService = new UserService();
