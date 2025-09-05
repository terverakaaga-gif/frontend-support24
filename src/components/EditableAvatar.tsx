import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useProfile, useUpdateProfileImage } from "@/hooks/useProfile";
import { Button } from "./ui/button";

const EditableAvatar = () => {
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { data: profile } = useProfile();
	const { mutate: updateProfileImage } = useUpdateProfileImage();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file");
			return;
		}

		// Validate file size (e.g., 5MB max)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image size must be less than 5MB");
			return;
		}

		setIsUploading(true);

		// Create preview while uploading
		const reader = new FileReader();
		reader.onload = () => {
			// Temporarily update the UI with the new image
			if (typeof reader.result === "string") {
				// This is just for immediate UI feedback - the actual update comes from the mutation
			}
		};
		reader.readAsDataURL(file);

		// Upload the image
		updateProfileImage(file, {
			onSuccess: (updatedUser) => {
				// Update the auth context with the new profile data
				console.log("udpatedUser", updatedUser);
				setIsUploading(false);
				// Reset the file input
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
			},
			onError: (error) => {
				setIsUploading(false);
				// Error handling is already done in the mutation
			},
		});
	};

	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// Generate initials as fallback
	const getInitials = () => {
		if (profile.user.firstName && profile.user.lastName) {
			return `${profile.user.firstName.charAt(0)}${profile.user.lastName.charAt(
				0
			)}`.toUpperCase();
		}
		return "U"; // Default fallback
	};

	const getAvatarContent = () => {
		if (isUploading) {
			return (
				<div className="h-full w-full rounded-full flex items-center justify-center bg-gray-100">
					<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
				</div>
			);
		}

		if (profile.user.profileImage) {
			return (
				<img
					src={profile.user.profileImage}
					alt="Profile"
					className="h-full w-full rounded-full object-cover"
					onError={(e) => {
						// If image fails to load, fall back to initials
						e.currentTarget.style.display = "none";
					}}
				/>
			);
		}

		return (
			<div className="h-full w-full flex items-center justify-center bg-gray-200">
				<span className="text-2xl font-semibold text-gray-600">
					{getInitials()}
				</span>
			</div>
		);
	};

	return (
		<div className="relative flex flex-col items-center mb-4">
			<div className="relative">
				<div className="h-24 w-24 rounded-full bg-gray-200 border-2 border-gray-300 relative">
					{getAvatarContent()}

					{/* Edit button - always visible */}
					{!isUploading && (
						<Button
							className="absolute -bottom-1 -right-1 rounded-full bg-white p-2 border-2 border-gray-300 cursor-pointer shadow-md hover:bg-gray-50 transition-colors z-50 flex items-center justify-center"
							onClick={triggerFileInput}
							aria-label="Edit profile picture"
							style={{ width: 36, height: 36 }}
						>
							<Camera className="text-blue-500" size={20} />
						</Button>
					)}
				</div>
			</div>

			{/* Edit text indication */}
			{!isUploading && (
				<span
					className="text-sm text-blue-500 mt-2 cursor-pointer hover:text-blue-600 transition-colors"
					onClick={triggerFileInput}
				>
					Edit profile photo
				</span>
			)}

			{isUploading && (
				<span className="text-sm text-gray-500 mt-2">Uploading...</span>
			)}

			{/* Hidden file input */}
			<input
				type="file"
				ref={fileInputRef}
				name="image"
				accept="image/*"
				className="hidden"
				onChange={handleImageChange}
				disabled={isUploading}
			/>
		</div>
	);
};

export default EditableAvatar;
