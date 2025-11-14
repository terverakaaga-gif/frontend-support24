import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useProfile, useUpdateProfileImage } from "@/hooks/useProfile";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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

		// Upload the image
		updateProfileImage(file, {
			onSuccess: (updatedUser) => {
				console.log("udpatedUser", updatedUser);
				setIsUploading(false);
				// Reset the file input
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
			},
			onError: (error) => {
				setIsUploading(false);
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
		return "U";
	};

	return (
		<div className="relative flex flex-col items-center mb-4">
			<div className="relative">
				<Avatar className="h-24 w-24 border-2 border-gray-300">
					{isUploading ? (
						<div className="h-full w-full flex items-center justify-center bg-gray-100">
							<Loader2 className="h-8 w-8 animate-spin text-primary-500" />
						</div>
					) : (
						<>
							<AvatarImage 
								src={profile.user.profileImage} 
								alt="Profile" 
							/>
							<AvatarFallback className="bg-gray-200 text-2xl font-montserrat-semibold text-gray-600">
								{getInitials()}
							</AvatarFallback>
						</>
					)}
				</Avatar>

				{/* Edit button */}
				{!isUploading && (
					<Button
						className="absolute -bottom-1 -right-1 rounded-full bg-white p-2 border-2 border-gray-300 cursor-pointer shadow-md hover:bg-gray-100 transition-colors z-50 flex items-center justify-center"
						onClick={triggerFileInput}
						aria-label="Edit profile picture"
						style={{ width: 36, height: 36 }}
					>
						<Camera className="text-primary-500" size={20} />
					</Button>
				)}
			</div>

			{/* Edit text indication */}
			{!isUploading && (
				<span
					className="text-sm text-primary-500 mt-2 cursor-pointer hover:text-primary transition-colors"
					onClick={triggerFileInput}
				>
					Edit profile photo
				</span>
			)}

			{isUploading && (
				<span className="text-sm text-gray-1000 mt-2">Uploading...</span>
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
