import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useLogin } from "@/hooks/useAuthHooks";
import { Eye, EyeClosed } from "@solar-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user.types";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [savePassword, setSavePassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Onboarding slides data
  const onboardingSlides = [
    {
      image: "/new-res/onboarding1.svg",
      title: "Effortless NDIS Support Service",
      subtitle: "Manage your care plans, services, and routine in one place",
    },
    {
      image: "/new-res/onboarding2.svg",
      title: "Trusted & Verified Workers",
      subtitle: "Connect with only background check qualified professionals",
    },
    {
      image: "/new-res/onboarding3.svg",
      title: "24/7 Support Network",
      subtitle: "Access help and resources whenever you need them most",
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [onboardingSlides.length]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login.mutateAsync({
        email: values.email,
        password: values.password,
      });

      // The login mutation should update the user state
      // We need to wait for that to complete before navigation
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Add this useEffect to handle navigation after successful login
  useEffect(() => {
    if (user && !login.isPending) {
      // Check for return URL first, but validate it against user role
      const returnUrl = sessionStorage.getItem("returnUrl");
      const lastUserRole = sessionStorage.getItem("lastUserRole");

      if (returnUrl && lastUserRole === user.role) {
        // Only use return URL if it's for the same user role
        const isValidReturnUrl = validateReturnUrlForRole(returnUrl, user.role);
        if (isValidReturnUrl) {
          sessionStorage.removeItem("returnUrl");
          sessionStorage.removeItem("lastUserRole");
          navigate(returnUrl, { replace: true });
          return;
        }
      }

      // Clear any invalid return URL
      sessionStorage.removeItem("returnUrl");
      sessionStorage.removeItem("lastUserRole");

      // Navigate to role-specific dashboard
      const dashboardRoute = getRoleBasedRoute(user.role);
      navigate(dashboardRoute, { replace: true });
    }
  }, [user, login.isPending, navigate]);

  // Helper function to get role-based routes
  const getRoleBasedRoute = (role: UserRole): string => {
    switch (role) {
      case "admin":
        return "/admin";
      case "participant":
        return "/participant";
      case "guardian":
        return "/guardian";
      case "coordinator":
        return "/support-coordinator"; // Updated to use support-coordinator
      case "supportWorker":
        return "/support-worker";
      case "provider":
        return "/provider";
      default:
        return "/login";
    }
  };

  // Helper function to validate return URL against user role
  const validateReturnUrlForRole = (url: string, role: UserRole): boolean => {
    const rolePathMap = {
      admin: "/admin",
      participant: "/participant",
      guardian: "/guardian",
      coordinator: "/support-coordinator",
      supportWorker: "/support-worker",
      provider: "/provider",
    };

    const expectedPath = rolePathMap[role];
    return url.startsWith(expectedPath);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left side - Onboarding Carousel */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-[#F7F7F7] relative overflow-hidden"
      >
        {/* Carousel Container */}
        <div className="flex flex-col justify-between w-full p-12 relative z-10">
          {/* Top Section with Carousel */}
          <div className="flex-1 gap-8 flex flex-col justify-center items-center">
            {/* Carousel Images */}
            <div className="w-full max-w-lg mb-8 relative">
              <div className="relative w-full h-80 overflow-hidden rounded-2xl">
                {onboardingSlides.map((slide, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{
                      opacity: currentSlide === index ? 1 : 0,
                      x: currentSlide === index ? 0 : 100,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={`absolute inset-0 flex items-center justify-center ${
                      currentSlide === index ? "z-10" : "z-0"
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={`Onboarding ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Slide Indicators */}
            <div className="self-start flex items-center gap-4">
              <div className="flex gap-2">
                {onboardingSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-4 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-primary-600 w-9"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Carousel Content */}
            <motion.div
              key={currentSlide}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md self-start"
            >
              <h2 className="text-3xl font-montserrat-bold text-gray-900 mb-4">
                {currentSlide === 0 && (
                  <>
                    Effortless NDIS{" "}
                    <span className="text-primary-600">Support Service</span>
                  </>
                )}
                {currentSlide === 1 && (
                  <>
                    Trusted &{" "}
                    <span className="text-primary-600">Verified Workers</span>
                  </>
                )}
                {currentSlide === 2 && (
                  <>
                    24/7{" "}
                    <span className="text-primary-600">Support Network</span>
                  </>
                )}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed font-montserrat-semibold">
                {onboardingSlides[currentSlide].subtitle}
              </p>
            </motion.div>
            {/* Bottom Navigation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="self-start w-full flex items-center justify-between"
            >
              <button
                className="text-gray-1000 font-montserrat-semibold hover:text-gray-700 transition-colors"
                onClick={() => setCurrentSlide(onboardingSlides.length - 1)}
              >
                Skip
              </button>
              <Button
                className="bg-primary-600 font-montserrat-semibold hover:bg-primary-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                onClick={() =>
                  setCurrentSlide(
                    (prev) => (prev + 1) % onboardingSlides.length
                  )
                }
              >
                Next
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                  <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right side - Login Form */}
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
          className="flex justify-center items-center w-full my-28"
        >
          <img src="/logo.svg" alt="Support 24" className="h-12" />
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="font-montserrat-semibold text-gray-600">
              Enter your details below to continue to Support24
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-montserrat-semibold">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g johndoe@gmail.com"
                        type="email"
                        className="h-12 px-4 bg-[#F7F7F7] border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-montserrat-semibold">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="e.g Phoenix-878-@"
                          type={showPassword ? "text" : "password"}
                          className="h-12 px-4 pr-12 bg-[#F7F7F7] border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeClosed className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Save Password & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="savePassword"
                    checked={savePassword}
                    onCheckedChange={(checked) =>
                      setSavePassword(checked === true)
                    }
                    className="border-gray-300 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                  />
                  <label
                    htmlFor="savePassword"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Save Password
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-500 hover:text-orange-600 font-montserrat-semibold transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={login.isPending}
                >
                  {login.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          {/* Sign up link */}
          <div className="text-center pt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <Link
              to="/register"
              className="text-orange-500 hover:text-orange-600 font-montserrat-semibold transition-colors"
            >
              Create account
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
