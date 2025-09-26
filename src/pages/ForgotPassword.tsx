import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import authService from "@/api/services/authService";

export default function ForgotPassword() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const response = await authService.forgotPassword({ email });

			if (response.success && response.data?.userId) {
				toast.success(response.message);
				// Redirect to reset password page with userId
				navigate(
					`/reset-password?userId=${
						response.data.userId
					}&email=${encodeURIComponent(email)}`
				);
			} else {
				// Handle case where API call succeeds but doesn't return expected data
				const errorMessage =
					response.message || "Failed to send reset instructions";
				setError(errorMessage);
				toast.error(errorMessage);
			}
		} catch (err: any) {
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				"An error occurred. Please try again.";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
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
							src="/new-res/forgotpassword.svg"
							alt="Forgot Password"
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
									Check your email
								</h1>
								<p className="text-gray-600 font-semibold">
									We've sent password reset instructions to {email}
								</p>
							</div>
							<Button
								asChild
								className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold rounded-lg"
							>
								<Link to="/login">
									<ArrowLeft className="w-4 h-4 mr-2" />
									Back to Login
								</Link>
							</Button>
						</motion.div>
					) : (
						<>
							{/* Header */}
							<div className="text-center">
								<h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
									Forgot Password
								</h1>
								<p className="font-semibold text-gray-600">
									Please enter your email and we will send an OTP code
									<br />
									in the next step to reset your password
								</p>
							</div>

							{/* Form */}
							<form onSubmit={handleSubmit} className="space-y-6">
								{error && (
									<Alert variant="destructive">
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								{/* Email Field */}
								<div className="space-y-2">
									<Label 
										htmlFor="email" 
										className="text-gray-700 font-montserrat-semibold"
									>
										Email Address
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="e.g johndoe@gmail.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="h-12 px-4 bg-[#F7F7F7] border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
										disabled={isLoading}
									/>
								</div>

								{/* Continue Button */}
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Button
										type="submit"
										className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
										disabled={isLoading || !email.trim()}
									>
										{isLoading ? (
											<div className="flex items-center gap-2">
												<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
												Sending...
											</div>
										) : (
											<div className="flex items-center gap-2">
												Continue
												<ArrowRight className="w-4 h-4" />
											</div>
										)}
									</Button>
								</motion.div>
							</form>

							{/* Back to Login */}
							<div className="text-center pt-4">
								<Link
									to="/login"
									className="text-orange-500 hover:text-orange-600 font-montserrat-semibold transition-colors inline-flex items-center gap-1"
								>
									Back to Login
								</Link>
							</div>
						</>
					)}
				</motion.div>
			</motion.div>
		</div>
	);
}