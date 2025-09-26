import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import authService from "@/api/services/authService";

export default function ResetPassword() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const email = searchParams.get("email") || "";
	const userId = searchParams.get("userId") || "";
	const verified = searchParams.get("verified") === "true";

	const [formData, setFormData] = useState({
		newPassword: "",
		confirmPassword: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleInputChange =
		(field: keyof typeof formData) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({ ...prev, [field]: e.target.value }));
			setError(null);
		};

	const validateForm = () => {
		if (!formData.newPassword) {
			setError("Please enter a new password");
			return false;
		}
		if (formData.newPassword.length < 8) {
			setError("Password must be at least 8 characters long");
			return false;
		}
		// Check for at least one uppercase letter
		if (!/[A-Z]/.test(formData.newPassword)) {
			setError("Password must contain at least one uppercase letter");
			return false;
		}
		// Check for at least one lowercase letter
		if (!/[a-z]/.test(formData.newPassword)) {
			setError("Password must contain at least one lowercase letter");
			return false;
		}
		// Check for at least one number
		if (!/\d/.test(formData.newPassword)) {
			setError("Password must contain at least one number");
			return false;
		}
		// Check for at least one special character
		if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) {
			setError("Password must contain at least one special character");
			return false;
		}
		if (formData.newPassword !== formData.confirmPassword) {
			setError("Passwords do not match");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		if (!userId) {
			setError("Invalid reset link. Please request a new password reset.");
			return;
		}

		setError(null);
		setIsLoading(true);

		try {
			await authService.resetPassword({
				userId,
				otpCode: searchParams.get("otpCode") || "",
				password: formData.newPassword,
			});
			setIsSuccess(true);
			toast.success("Password reset successfully!");
		} catch (err: any) {
			const errorMessage =
				err.response?.data?.message || "An error occurred. Please try again.";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLoginRedirect = () => {
		navigate("/login");
	};

	// Redirect to forgot password if no userId
	if (!userId) {
		return (
			<div className="flex min-h-screen w-full items-center justify-center bg-[#FDFDFD]">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-montserrat-bold text-gray-900">
						Invalid Reset Link
					</h2>
					<p className="text-gray-600 font-semibold">
						This password reset link is invalid or has expired.
					</p>
					<Link
						to="/forgot-password"
						className="text-orange-500 hover:text-orange-600 font-montserrat-semibold"
					>
						Request New Reset Link
					</Link>
				</div>
			</div>
		);
	}

	// Password requirements checker
	const getPasswordRequirements = () => {
		const requirements = [
			{
				text: "At least 8 characters",
				met: formData.newPassword.length >= 8
			},
			{
				text: "At least 1 uppercase",
				met: /[A-Z]/.test(formData.newPassword)
			},
			{
				text: "At least 1 lowercase", 
				met: /[a-z]/.test(formData.newPassword)
			},
			{
				text: "At least 1 special character",
				met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
			}
		];
		return requirements;
	};

	return (
		<div className="flex min-h-screen w-full bg-[#FDFDFD]">
			{/* Left side - Illustration */}
			<motion.div
				initial={{ x: -100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="hidden lg:flex lg:w-1/2 bg-[#F7F7F7] relative overflow-hidden"
			>
				{/* Illustration Container */}
				<div className="flex flex-col justify-center items-center w-full p-12 relative z-10">
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.6 }}
						className="w-full max-w-lg"
					>
						<img
							src="/new-res/resetpassword.svg"
							alt="Reset Password"
							className="w-full h-auto object-contain"
						/>
					</motion.div>
				</div>
			</motion.div>

			{/* Right side - Form */}
			<motion.div
				initial={{ x: 100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
				className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative"
			>
				{/* Logo */}
				<motion.div
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="flex justify-center items-center w-full mb-16"
				>
					<img src="/logo.svg" alt="Support 24" className="h-12" />
				</motion.div>

				{/* Form Container */}
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.6 }}
					className="w-full max-w-md space-y-8"
				>
					{isSuccess ? (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center space-y-6"
						>
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
								<CheckCircle className="w-8 h-8 text-green-600" />
							</div>
							<div className="space-y-2">
								<h1 className="text-3xl font-montserrat-bold text-gray-900">
									Password Reset Successfully!
								</h1>
								<p className="text-gray-600 font-semibold">
									Your password has been updated. You can now login with your new password.
								</p>
							</div>
							<Button
								onClick={handleLoginRedirect}
								className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold rounded-lg"
							>
								Continue to Login
							</Button>
						</motion.div>
					) : (
						<>
							{/* Header */}
							<div className="text-center">
								<h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
									Reset Password
								</h1>
								<p className="font-semibold text-gray-600">
									Create a strong new password and confirm to secure
									<br />
									your account
								</p>
							</div>

							{/* Form */}
							<form onSubmit={handleSubmit} className="space-y-6">
								{error && (
									<Alert variant="destructive">
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								{/* New Password Field */}
								<div className="space-y-2">
									<Label 
										htmlFor="newPassword" 
										className="text-gray-700 font-montserrat-semibold"
									>
										New Password
									</Label>
									<div className="relative">
										<Input
											id="newPassword"
											type={showPassword ? "text" : "password"}
											placeholder="e.g Phoenix-878-@"
											value={formData.newPassword}
											onChange={handleInputChange("newPassword")}
											required
											className="h-12 px-4 pr-12 bg-[#F7F7F7] border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
											disabled={isLoading}
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
										>
											{showPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
								</div>

								{/* Confirm Password Field */}
								<div className="space-y-2">
									<Label 
										htmlFor="confirmPassword" 
										className="text-gray-700 font-montserrat-semibold"
									>
										Confirm Password
									</Label>
									<div className="relative">
										<Input
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											placeholder="e.g Phoenix-878-@"
											value={formData.confirmPassword}
											onChange={handleInputChange("confirmPassword")}
											required
											className="h-12 px-4 pr-12 bg-[#F7F7F7] border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
											disabled={isLoading}
										/>
										<button
											type="button"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
										>
											{showConfirmPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
								</div>

								{/* Password Requirements */}
								{formData.newPassword && (
									<div className="space-y-2">
										{getPasswordRequirements().map((req, index) => (
											<div key={index} className="flex items-center gap-2 text-sm">
												<div className={`w-2 h-2 rounded-full ${req.met ? 'bg-green-500' : 'bg-gray-300'}`} />
												<span className={req.met ? 'text-green-600' : 'text-gray-500'}>
													{req.text}
												</span>
											</div>
										))}
									</div>
								)}

								{/* Reset Password Button */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Button
										type="submit"
										className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
										disabled={
											isLoading ||
											!formData.newPassword ||
											!formData.confirmPassword
										}
									>
										{isLoading ? (
											<div className="flex items-center gap-2">
												<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
												Resetting Password...
											</div>
										) : (
											"Reset Password"
										)}
									</Button>
								</motion.div>
							</form>
						</>
					)}
				</motion.div>
			</motion.div>
		</div>
	);
}