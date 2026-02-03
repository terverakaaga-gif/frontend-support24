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
import {
  cn,
  AUTH_PAGE_WRAPPER,
  AUTH_PANEL,
  AUTH_CAROUSEL_PANEL,
  AUTH_CAROUSEL_CONTENT,
  AUTH_FORM_CONTAINER,
  AUTH_LOGO_CONTAINER,
  AUTH_HEADING,
  AUTH_SUBHEADING,
  AUTH_INPUT,
  AUTH_INPUT_PASSWORD,
  AUTH_BUTTON_PRIMARY,
  AUTH_LABEL,
  AUTH_LINK,
  FLEX_ROW_CENTER,
  FLEX_COL_CENTER,
  FLEX_CENTER,
  FLEX_ROW_BETWEEN,
} from "@/lib/design-utils";
import {
  TEXT_SIZE,
  TEXT_COLORS,
  FONT_WEIGHT,
  BG_COLORS,
} from "@/constants/design-system";

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
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle navigation after successful login
  useEffect(() => {
    if (user && !login.isPending) {
      const returnUrl = sessionStorage.getItem("returnUrl");
      const lastUserRole = sessionStorage.getItem("lastUserRole");

      if (returnUrl && lastUserRole === user.role) {
        const isValidReturnUrl = validateReturnUrlForRole(returnUrl, user.role);
        if (isValidReturnUrl) {
          sessionStorage.removeItem("returnUrl");
          sessionStorage.removeItem("lastUserRole");
          navigate(returnUrl, { replace: true });
          return;
        }
      }

      sessionStorage.removeItem("returnUrl");
      sessionStorage.removeItem("lastUserRole");

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
    <div className={AUTH_PAGE_WRAPPER}>
      {/* Left side - Onboarding Carousel */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={AUTH_CAROUSEL_PANEL}
      >
        {/* Carousel Container */}
        <div className={AUTH_CAROUSEL_CONTENT}>
          {/* Top Section with Carousel */}
          <div className={cn(FLEX_COL_CENTER, "flex-1 gap-8")}>
            {/* Carousel Images */}
            <div className={`w-full max-w-lg mb-8 relative`}>
              <div className={cn("relative w-full h-80 overflow-hidden", "rounded-2xl")}>
                {onboardingSlides.map((slide, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{
                      opacity: currentSlide === index ? 1 : 0,
                      x: currentSlide === index ? 0 : 100,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={cn(
                      FLEX_CENTER,
                      "absolute inset-0",
                      currentSlide === index ? "z-10" : "z-0"
                    )}
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
            <div className={cn(FLEX_ROW_CENTER, "self-start gap-4")}>
              <div className={cn(FLEX_ROW_CENTER, "gap-2")}>
                {onboardingSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      currentSlide === index
                        ? `${BG_COLORS.primary} w-9`
                        : `${BG_COLORS.gray300} hover:bg-gray-400 w-4`
                    )}
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
              <h2 className={cn(AUTH_HEADING, TEXT_SIZE["3xl"], "mb-4")}>
                {currentSlide === 0 && (
                  <>
                    Effortless NDIS{" "}
                    <span className={TEXT_COLORS.primary}>Support Service</span>
                  </>
                )}
                {currentSlide === 1 && (
                  <>
                    Trusted &{" "}
                    <span className={TEXT_COLORS.primary}>Verified Workers</span>
                  </>
                )}
                {currentSlide === 2 && (
                  <>
                    24/7{" "}
                    <span className={TEXT_COLORS.primary}>Support Network</span>
                  </>
                )}
              </h2>
              <p className={cn(AUTH_SUBHEADING, TEXT_SIZE.lg, "leading-relaxed")}>
                {onboardingSlides[currentSlide].subtitle}
              </p>
            </motion.div>

            {/* Bottom Navigation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={cn(FLEX_ROW_BETWEEN, "self-start w-full")}
            >
              <button
                className={cn(
                  TEXT_COLORS.gray900,
                  FONT_WEIGHT.semibold,
                  "hover:text-gray-700 transition-colors"
                )}
                onClick={() => setCurrentSlide(onboardingSlides.length - 1)}
              >
                Skip
              </button>
              <Button
                className={cn(
                  BG_COLORS.primary,
                  FONT_WEIGHT.semibold,
                  TEXT_COLORS.white,
                  "px-6 py-2 rounded-lg",
                  FLEX_ROW_CENTER,
                  "gap-2"
                )}
                onClick={() =>
                  setCurrentSlide(
                    (prev) => (prev + 1) % onboardingSlides.length
                  )
                }
              >
                Next
                <div className={cn(FLEX_ROW_CENTER, "gap-1")}>
                  <div className={`w-1 h-1 bg-white rounded-full opacity-60`}></div>
                  <div className={`w-1 h-1 bg-white rounded-full opacity-60`}></div>
                  <div className={`w-1 h-1 bg-white rounded-full`}></div>
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
        className={AUTH_PANEL}
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={cn(AUTH_LOGO_CONTAINER, "my-28")}
        >
          <img src="/logo.svg" alt="Support 24" className="h-12" />
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className={AUTH_FORM_CONTAINER}
        >
          {/* Header */}
          <div className={FLEX_COL_CENTER}>
            <h1 className={AUTH_HEADING}>Welcome Back!</h1>
            <p className={AUTH_SUBHEADING}>
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
                    <FormLabel className={AUTH_LABEL}>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g johndoe@gmail.com"
                        type="email"
                        className={AUTH_INPUT}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={cn(TEXT_COLORS.error, TEXT_SIZE.sm)} />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={AUTH_LABEL}>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="e.g Phoenix-878-@"
                          type={showPassword ? "text" : "password"}
                          className={AUTH_INPUT_PASSWORD}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className={cn(
                            "absolute right-3 top-1/2 transform -translate-y-1/2",
                            TEXT_COLORS.gray400,
                            "hover:text-gray-600 transition-colors"
                          )}
                        >
                          {showPassword ? (
                            <EyeClosed className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className={cn(TEXT_COLORS.error, TEXT_SIZE.sm)} />
                  </FormItem>
                )}
              />

              {/* Save Password & Forgot Password */}
              <div className={FLEX_ROW_BETWEEN}>
                <div className={cn(FLEX_ROW_CENTER, "space-x-2")}>
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
                    className={cn(TEXT_SIZE.sm, TEXT_COLORS.gray600, "cursor-pointer")}
                  >
                    Save Password
                  </label>
                </div>
                <Link to="/forgot-password" className={AUTH_LINK}>
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
                  className={AUTH_BUTTON_PRIMARY}
                  disabled={login.isPending}
                >
                  {login.isPending ? (
                    <div className={cn(FLEX_ROW_CENTER, "gap-2")}>
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
          <div className={cn(FLEX_COL_CENTER, "pt-4")}>
            <span className={TEXT_COLORS.gray600}>Don't have an account? </span>
            <Link to="/register" className={AUTH_LINK}>
              Create account
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
