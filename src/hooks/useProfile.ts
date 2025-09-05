import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, UpdateProfileData } from "@/api/services/userService";
import { toast } from "sonner";

export const PROFILE_QUERY_KEY = ["profile"];

export const useProfile = () => {
	return useQuery({
		queryKey: PROFILE_QUERY_KEY,
		queryFn: userService.getProfile,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});
};

export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: userService.updateProfile,
		onSuccess: (data) => {
			// Update the cache with new data
			queryClient.setQueryData(PROFILE_QUERY_KEY, data);
			toast.success("Profile updated successfully");
		},
		onError: (error: unknown) => {
			let errorMessage = "Failed to update profile";
			if (typeof error === "object" && error !== null && "response" in error) {
				const err = error as { response: unknown };
				const response = err.response;
				if (
					typeof response === "object" &&
					response !== null &&
					"data" in response
				) {
					const data = (response as { data: unknown }).data;
					if (
						typeof data === "object" &&
						data !== null &&
						"message" in data &&
						typeof (data as { message?: unknown }).message === "string"
					) {
						errorMessage = (data as { message: string }).message;
					}
				}
			}
			toast.error(errorMessage);
		},
	});
};

export const useUpdateProfileImage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: userService.updateProfileImage,
		onSuccess: (data) => {
			// Update the cache with new data
			queryClient.setQueryData(PROFILE_QUERY_KEY, data);
			toast.success("Profile image updated successfully");
		},
		onError: (error: unknown) => {
			let errorMessage = "Failed to update profile image";
			if (typeof error === "object" && error !== null && "response" in error) {
				const err = error as { response: unknown };
				const response = err.response;
				if (
					typeof response === "object" &&
					response !== null &&
					"data" in response
				) {
					const data = (response as { data: unknown }).data;
					if (
						typeof data === "object" &&
						data !== null &&
						"message" in data &&
						typeof (data as { message?: unknown }).message === "string"
					) {
						errorMessage = (data as { message: string }).message;
					}
				}
			}
			toast.error(errorMessage);
		},
	});
};

export const useChangePassword = () => {
	return useMutation({
		mutationFn: userService.changePassword,
		onSuccess: () => {
			toast.success("Password changed successfully");
		},
		onError: (error: unknown) => {
			let errorMessage = "Failed to change password";
			if (typeof error === "object" && error !== null && "response" in error) {
				const err = error as { response: unknown };
				const response = err.response;
				if (
					typeof response === "object" &&
					response !== null &&
					"data" in response
				) {
					const data = (response as { data: unknown }).data;
					if (
						typeof data === "object" &&
						data !== null &&
						"message" in data &&
						typeof (data as { message?: unknown }).message === "string"
					) {
						errorMessage = (data as { message: string }).message;
					}
				}
			}
			toast.error(errorMessage);
		},
	});
};
