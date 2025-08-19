import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

const formSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email." }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters." }),
});

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		try {
			await login(values.email, values.password);
			// Auth context will handle redirects via ProtectedRoute component
		} catch (error) {
			// Error is handled in the AuthContext
		} finally {
			setIsLoading(false);
		}
	}

	const handleDemoLogin = (email: string) => {
		form.setValue("email", email);
		form.setValue("password", "password");
		form.handleSubmit(onSubmit)();
	};

	return (
		<div className="flex h-screen w-full overflow-hidden">
			{/* Brand section - Left side */}
			<motion.div
				initial={{ x: -50, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="hidden md:flex md:w-1/2 bg-gradient-to-br from-guardian-light to-guardian p-12 flex-col justify-between"
			>
				<div className="mb-auto">
					<div className="flex items-center gap-2 mb-2">
						<Heart className="h-8 w-8 text-white" />
						<span className="text-2xl font-bold text-white">Support 24</span>
					</div>
				</div>

				<div className="space-y-6 max-w-md">
					<h1 className="text-4xl font-bold text-white">
						Welcome back to your care platform
					</h1>
					<p className="text-white/90 text-lg">
						Connect with your care network, manage appointments, and access
						support services all in one place.
					</p>

					<div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg border border-white/30">
						<p className="text-white italic">
							"Support 24 has transformed how we manage care for our family
							members. The platform makes coordination seamless and gives us
							peace of mind."
						</p>
						<p className="text-white/80 mt-4 font-medium">
							— Jane Wilson, Guardian
						</p>
					</div>
				</div>

				<div className="mt-auto">
					<p className="text-white/70 text-sm">
						© 2025 Support 24. All rights reserved.
					</p>
				</div>
			</motion.div>

			{/* Form section - Right side */}
			<motion.div
				initial={{ x: 50, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full md:w-1/2 flex items-center justify-center p-8 bg-muted/30"
			>
				<div className="w-full max-w-md space-y-8">
					<div className="text-center">
						<h2 className="text-3xl font-bold tracking-tight text-gray-900">
							Let's get you started
						</h2>
						<p className="mt-2 text-gray-600">
							Sign in to your account to continue
						</p>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<ScrollArea className="h-[180px] pr-4">
								<div className="space-y-6 px-1">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														placeholder="your@email.com"
														type="email"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														placeholder="••••••••"
														type="password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</ScrollArea>

							<Button
								type="submit"
								className="w-full py-6"
								disabled={isLoading}
							>
								{isLoading ? "Signing in..." : "Login"}
							</Button>
						</form>
					</Form>

					<div className="text-center">
						<span className="text-gray-600">Don't have an account? </span>
						<a
							href="/register"
							className="text-guardian font-medium hover:underline"
						>
							Register here...
						</a>
					</div>

					<div className="pt-4">
						<p className="text-center text-sm text-gray-600 mb-4">
							Demo Accounts
						</p>
						<div className="grid grid-cols-2 gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleDemoLogin("admin@example.com")}
							>
								Admin
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleDemoLogin("john@example.com")}
							>
								Guardian
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleDemoLogin("emma@example.com")}
							>
								Participant
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleDemoLogin("sarah@example.com")}
							>
								Support Worker
							</Button>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
