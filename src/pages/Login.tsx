import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, ChevronRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
import { useLogin } from "@/hooks/useAuthHooks";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export default function Login() {
  const navigate = useNavigate();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

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
      // Auth context will handle redirects via ProtectedRoute component
    } catch (error) {
      // Error is handled by the API client
      console.error("Login failed:", error);
    }
  }

  // Demo account logins for development
  const handleDemoLogin = (email: string, password: string = "password") => {
    form.setValue("email", email);
    form.setValue("password", password);
    form.handleSubmit(onSubmit)();
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
            <img src="/favicon.svg" alt="Guardian Care Pro" className="h-10 w-10" />
            <span className="text-2xl font-bold text-white drop-shadow-sm">
              GuardianCare+
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="z-10 space-y-8 max-w-md"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-sm">
            Welcome back to your care platform
          </h1>
          <p className="text-white/90 text-lg">
            Connect with your care network, manage appointments, and access
            support services all in one place.
          </p>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-white/20 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/30 shadow-lg"
          >
            <p className="text-white text-lg italic">
              "Guardian Care Pro has transformed how we manage care for our
              family members. The platform makes coordination seamless and gives
              us peace of mind."
            </p>
            <p className="text-white/80 mt-4 font-medium">
              — Jane Wilson, Guardian
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="z-10 mt-auto"
        >
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} Guardian Care Pro. All rights reserved.
          </p>
        </motion.div>
      </motion.div>

      {/* Form section - Right side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-md space-y-8 p-6 sm:p-8 md:p-10 bg-white/5 rounded-2xl "
        >
          <div className="text-center">
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl font-bold tracking-tight text-gray-900"
            >
              Welcome Back
            </motion.h2>
            <motion.p
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-2 text-gray-600"
            >
              Sign in to your account to continue
            </motion.p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-[18px] w-[18px]" />
                          <Input
                            placeholder="dylan.smith@gmail.com"
                            type="email"
                            className="pl-10 py-6 bg-gray-50 border-gray-200 rounded-xl focus:ring-guardian focus:border-guardian/50 transition-all duration-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-[18px] w-[18px]" />
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            className="pl-10 py-6 bg-gray-50 border-gray-200 rounded-xl focus:ring-guardian focus:border-guardian/50 transition-all duration-200"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-500" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-guardian hover:text-guardian/80 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full py-6 rounded-xl bg-guardian hover:bg-guardian/80 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={login.isPending}
                >
                  {login.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Sign In
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          <div className="text-center pt-2">
            <span className="text-gray-600">Don't have an account yet ? </span>
            <Link
              to="/register"
              className="text-guardian font-medium hover:text-guardian hover:underline"
            >
              Register
            </Link>
          </div>

          {/* Demo accounts section - uncomment for development */}
          {/* {process.env.NODE_ENV !== 'production' && (
            <div className="pt-6">
              <p className="text-center text-sm text-gray-600 mb-4">
                Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-lg border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                  onClick={() => handleDemoLogin("timiayanlola@outlook.com", "workerPro23!")}
                  disabled={login.isPending}
                >
                  Support Worker
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-lg border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                  onClick={() => handleDemoLogin("timiayanlola@outlook.com", "participantPro23!")}
                  disabled={login.isPending}
                >
                  Participant
                </Button>
              </div>
            </div>
          )} */}
        </motion.div>
      </motion.div>
    </div>
  );
}
