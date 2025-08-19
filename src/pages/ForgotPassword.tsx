import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
		<div className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100">
			{/* Brand section - Left side */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				className="hidden lg:flex lg:w-1/2 bg-[#2195F2] p-12 flex-col justify-between relative overflow-hidden"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_60%)]"></div>

				<motion.div
					initial={{ y: -20 }}
					animate={{ y: 0 }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className="z-10 mb-auto"
				>
					<div className="flex items-center gap-2 mb-2">
						{/* <Heart className="h-8 w-8 text-white drop-shadow-md" fill="white" /> */}
						<img src="/favicon.svg" alt="Support 24" className="h-10 w-10" />
						<span className="text-2xl font-bold text-white drop-shadow-sm">
							GuardianCare+
						</span>
					</div>
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.5 }}
					className="z-10 space-y-8"
				>
					<div className="space-y-6">
						<h1 className="text-4xl font-bold text-white leading-tight">
							Reset Your Password
						</h1>
						<p className="text-white/90 text-lg leading-relaxed">
							Don't worry, it happens to the best of us. Enter your email
							address and we'll send you instructions to reset your password.
						</p>
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8, duration: 0.5 }}
						className="grid grid-cols-2 gap-4"
					>
						<div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl border border-white/30 flex flex-col items-center shadow-lg hover:bg-white/25 transition-all">
							<Mail className="h-8 w-8 text-white mb-2" />
							<h3 className="text-white font-medium">Email Verification</h3>
							<p className="text-white/80 text-sm text-center">
								Secure password reset via email
							</p>
						</div>
						<div className="bg-white/20 backdrop-blur-sm p-5 rounded-xl border border-white/30 flex flex-col items-center shadow-lg hover:bg-white/25 transition-all">
							<CheckCircle className="h-8 w-8 text-white mb-2" />
							<h3 className="text-white font-medium">Quick Process</h3>
							<p className="text-white/80 text-sm text-center">
								Get back to your account quickly
							</p>
						</div>
					</motion.div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.9, duration: 0.5 }}
					className="z-10 mt-auto"
				>
					<p className="text-white/70 text-sm">
						© {new Date().getFullYear()} Support 24. All rights reserved.
					</p>
				</motion.div>
			</motion.div>

			{/* Form section - Right side */}
			<div className="flex w-full lg:w-1/2 items-center justify-center p-8">
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="w-full max-w-md space-y-6"
				>
					<div className="lg:hidden text-center mb-8">
						<div className="flex items-center justify-center gap-2 mb-4">
							<Heart className="h-8 w-8 text-[#2195F2]" fill="#2195F2" />
							<span className="text-2xl font-bold text-gray-900">
								Support 24
							</span>
						</div>
					</div>

					<Card className="border-0  bg-transparent">
						<CardHeader className="text-center space-y-1 pb-6">
							<CardTitle className="text-2xl font-bold">
								Forgot Password?
							</CardTitle>
							<CardDescription className="text-gray-600">
								Enter your email address and we'll send you a link to reset your
								password
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{isSuccess ? (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-center space-y-4"
								>
									<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
										<CheckCircle className="w-8 h-8 text-green-600" />
									</div>
									<div className="space-y-2">
										<h3 className="text-lg font-semibold text-gray-900">
											Check your email
										</h3>
										<p className="text-gray-600 text-sm">
											We've sent password reset instructions to {email}
										</p>
									</div>
									<div className="space-y-3">
										<Button
											asChild
											className="w-full bg-[#2195F2] hover:bg-[#1976D2]"
										>
											<Link to="/login">
												<ArrowLeft className="w-4 h-4 mr-2" />
												Back to Login
											</Link>
										</Button>
									</div>
								</motion.div>
							) : (
								<form onSubmit={handleSubmit} className="space-y-4">
									{error && (
										<Alert variant="destructive">
											<AlertDescription>{error}</AlertDescription>
										</Alert>
									)}

									<div className="space-y-2">
										<Label htmlFor="email">Email Address</Label>
										<Input
											id="email"
											type="email"
											placeholder="Enter your email address"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											className="h-11"
											disabled={isLoading}
										/>
									</div>

									<Button
										type="submit"
										className="w-full h-11 bg-[#2195F2] hover:bg-[#1976D2] text-white font-medium"
										disabled={isLoading || !email.trim()}
									>
										{isLoading ? "Sending..." : "Send Reset Instructions"}
									</Button>

									<div className="text-center">
										<Link
											to="/login"
											className="text-sm text-[#2195F2] hover:text-[#1976D2] font-medium inline-flex items-center gap-1"
										>
											<ArrowLeft className="w-4 h-4" />
											Back to Login
										</Link>
									</div>
								</form>
							)}
						</CardContent>
					</Card>

					<div className="text-center text-sm text-gray-600">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-[#2195F2] hover:text-[#1976D2] font-medium"
						>
							Sign up
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
