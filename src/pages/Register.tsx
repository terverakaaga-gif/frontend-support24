import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useRegister } from "@/hooks/useAuthHooks";
import { useAuth } from "@/contexts/AuthContext";
import { getPasswordRequirements } from "@/lib/utils";
import { Eye, EyeClosed } from "@solar-icons/react";
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
  GRID_2_COLS,
  FLEX_CENTER,
  FLEX_ROW_BETWEEN,
} from "@/lib/design-utils";
import { GAP, TEXT_SIZE, TEXT_COLORS, FONT_WEIGHT, BG_COLORS } from "@/constants/design-system";

const formSchema = z
  .object({
    phone: z.string(),
    firstName: z.string().min(2, { message: "First name is required." }),
    lastName: z.string().min(2, { message: "Last name is required." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),
    confirmPassword: z.string(),
    role: z.enum(["participant", "guardian", "supportWorker"], {
      required_error: "Please select a role.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const register = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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
      phone: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await register.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
        phone: values.phone,
      });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  useEffect(() => {
    if (register.isSuccess) {
      navigate(
        `/otp-verify?email=${encodeURIComponent(
          form.getValues("email")
        )}&userId=${register.data.userId}&register=true`
      );
    }
  }, [register.isSuccess, navigate, form]);

  return (
    <div className={AUTH_PAGE_WRAPPER}>
      {/* Left side - Registration Form */}
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
            <h1 className={AUTH_HEADING}>Create Account</h1>
            <p className={AUTH_SUBHEADING}>
              Sign up to get started with Support24
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields - Two columns */}
              <div className={cn(GRID_2_COLS, GAP.base)}>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={AUTH_LABEL}>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g John"
                          className={AUTH_INPUT}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={cn(TEXT_COLORS.error, TEXT_SIZE.sm)} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={AUTH_LABEL}>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g Doe"
                          className={AUTH_INPUT}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={cn(TEXT_COLORS.error, TEXT_SIZE.sm)} />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={AUTH_LABEL}>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g 0412345678"
                        type="tel"
                        className={AUTH_INPUT}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={cn(TEXT_COLORS.error, TEXT_SIZE.sm)} />
                  </FormItem>
                )}
              />

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
                          placeholder="Create a strong password"
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
                    <FormMessage>
                      <div className="space-y-1 mt-2">
                        {getPasswordRequirements(
                          field.value?.length || 0,
                          field.value || ""
                        ).map((req, index) => (
                          <div
                            key={index}
                            className={cn(FLEX_ROW_CENTER, "gap-2 text-xs")}
                          >
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                req.met ? `${BG_COLORS.success}` : `${BG_COLORS.gray300}`
                              )}
                            />
                            <span
                              className={
                                req.met ? TEXT_COLORS.success : TEXT_COLORS.gray500
                              }
                            >
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={AUTH_LABEL}>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirm your password"
                          type={showConfirmPassword ? "text" : "password"}
                          className={AUTH_INPUT_PASSWORD}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className={cn(
                            "absolute right-3 top-1/2 transform -translate-y-1/2",
                            TEXT_COLORS.gray400,
                            "hover:text-gray-600 transition-colors"
                          )}
                        >
                          {showConfirmPassword ? (
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

              {/* Role Selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={AUTH_LABEL}>I am a...</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === "provider") {
                          navigate("/register-provider");
                        } else {
                          field.onChange(value);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={AUTH_INPUT}>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="participant">Participant</SelectItem>
                        <SelectItem value="supportWorker">
                          Support Worker
                        </SelectItem>
                        <SelectItem value="provider">
                          Service Provider
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className={cn(TEXT_COLORS.error, TEXT_SIZE.sm)} />
                  </FormItem>
                )}
              />

              {/* Register Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  className={AUTH_BUTTON_PRIMARY}
                  disabled={register.isPending}
                >
                  {register.isPending ? (
                    <div className={cn(FLEX_ROW_CENTER, "gap-2")}>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          {/* Sign in link */}
          <div className={cn(FLEX_COL_CENTER, "pt-2")}>
            <span className={TEXT_COLORS.gray600}>Already have an account? </span>
            <Link to="/login" className={AUTH_LINK}>
              Sign in
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Right side - Onboarding Carousel */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
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
    </div>
  );
}
