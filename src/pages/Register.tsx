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
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left side - Registration Form */}
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
              Create Account
            </h1>
            <p className="font-montserrat-semibold text-gray-600">
              Sign up to get started with Support24
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields - Two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-montserrat-semibold">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g John"
                          className="h-12 px-4 bg-[#F7F7F7] border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-montserrat-semibold">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g Doe"
                          className="h-12 px-4 bg-[#F7F7F7] border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
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
                    <FormLabel className="text-gray-700 font-montserrat-semibold">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g 0412345678"
                        type="tel"
                        className="h-12 px-4 bg-[#F7F7F7] border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

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
                          placeholder="Create a strong password"
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
                    <FormMessage>
                      <div className="space-y-1 mt-2">
                        {getPasswordRequirements(
                          field.value?.length || 0,
                          field.value || ""
                        ).map((req, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs"
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                req.met ? "bg-green-500" : "bg-gray-300"
                              }`}
                            />
                            <span
                              className={
                                req.met ? "text-green-600" : "text-gray-500"
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
                    <FormLabel className="text-gray-700 font-montserrat-semibold">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirm your password"
                          type={showConfirmPassword ? "text" : "password"}
                          className="h-12 px-4 pr-12 bg-[#F7F7F7] border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
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

              {/* Role Selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-montserrat-semibold">
                      I am a...
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === "provider") {
                          // Redirect to provider registration page
                          navigate("/register-provider");
                        } else {
                          field.onChange(value);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 bg-[#F7F7F7] border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="participant">Participant</SelectItem>
                        {/* <SelectItem value="guardian">Guardian</SelectItem> */}
                        <SelectItem value="supportWorker">
                          Support Worker
                        </SelectItem>
                        <SelectItem value="provider">
                          Service Provider
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm" />
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
                  className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={register.isPending}
                >
                  {register.isPending ? (
                    <div className="flex items-center gap-2">
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
          <div className="text-center pt-2">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="text-orange-500 hover:text-orange-600 font-montserrat-semibold transition-colors"
            >
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
              {/* Slide Indicators */}
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
              key={currentSlide} // Key prop to trigger re-animation
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
              {/* Next Button */}
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
    </div>
  );
}
