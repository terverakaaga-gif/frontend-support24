import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserRole, UserRegistrationInput } from "@/types/user.types";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Phone, User, Lock } from "lucide-react";
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

// Registration form schema
const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    phone: z
      .string()
      .min(10, { message: "Please enter a valid phone number." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    role: z.enum([
      "admin",
      "guardian",
      "participant",
      "supportWorker",
    ] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegistrationFormValues = z.infer<typeof formSchema>;

interface RegistrationFormProps {
  onSubmit: (data: UserRegistrationInput) => void;
  isLoading?: boolean;
}

export function RegistrationForm({
  onSubmit,
  isLoading = false,
}: RegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "participant" as UserRole,
    },
  });

  const handleSubmit = (values: RegistrationFormValues) => {
    const { confirmPassword, ...registrationData } = values;
    onSubmit(registrationData as UserRegistrationInput);
  };

  // Toggle password visibility handlers
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-4 px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">First Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-[18px] w-[18px]" />
                      <Input
                        placeholder="Dylan"
                        className="pl-10 py-6 bg-gray-100 border-gray-200 rounded-xl focus:ring-guardian focus:border-guardian/50 transition-all duration-200"
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Last Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-[18px] w-[18px]" />
                      <Input
                        placeholder="Smith"
                        className="pl-10 py-6 bg-gray-100 border-gray-200 rounded-xl focus:ring-guardian focus:border-guardian/50 transition-all duration-200"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        type="email"
                        placeholder="dylan.smith@gmail.com"
                        className="pl-10 py-6 bg-gray-100 border-gray-200 rounded-xl focus:ring-guardian focus:border-guardian/50 transition-all duration-200"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-[18px] w-[18px]" />
                      <Input
                        type="tel"
                        placeholder="+61 405 000 000"
                        className="pl-10 py-6 bg-gray-100 border-gray-200 rounded-xl focus:ring-guardian focus:border-guardian/50 transition-all duration-200"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 py-6 bg-gray-100 border-gray-200 rounded-xl focus:ring-guardian focus:border-guardian/50 transition-all duration-200"
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
                          <EyeOff className="h-4 w-4 text-gray-1000" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-1000" />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-[18px] w-[18px]" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 py-6 bg-gray-100 border-gray-200 rounded-xl focus:ring-guardian focus:border-guardian/50 transition-all duration-200"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-1000" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-1000" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">I am a</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="py-6 bg-gray-100 border-gray-200 rounded-xl focus:ring-guardian focus:border-guardian/50 transition-all duration-200">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="participant">Participant</SelectItem>
                    <SelectItem value="supportWorker">
                      Support Worker
                    </SelectItem>
                    {/* <SelectItem value="admin">Admin</SelectItem> */}
                  </SelectContent>
                </Select>
                <FormMessage className="text-rose-500" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full py-6 mt-4 rounded-xl bg-guardian hover:bg-guardian/80 text-white font-montserrat-semibold shadow-md hover:shadow-lg transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
