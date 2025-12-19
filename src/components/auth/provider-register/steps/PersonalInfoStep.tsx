import { memo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProviderRegisterFormValues } from "@/types/auth/provider-register/schema";
import { getPasswordRequirements } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  form: UseFormReturn<ProviderRegisterFormValues>;
}

export const PersonalInfoStep = memo(({ form }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-montserrat-bold text-gray-900 mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-montserrat-semibold">First Name</FormLabel>
              <FormControl><Input placeholder="e.g John" className="h-12 bg-[#F7F7F7]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-montserrat-semibold">Last Name</FormLabel>
              <FormControl><Input placeholder="e.g Doe" className="h-12 bg-[#F7F7F7]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-montserrat-semibold">Phone Number</FormLabel>
            <FormControl><Input type="tel" placeholder="e.g 0412345678" className="h-12 bg-[#F7F7F7]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-montserrat-semibold">Email Address</FormLabel>
            <FormControl><Input type="email" placeholder="e.g john@company.com" className="h-12 bg-[#F7F7F7]" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-montserrat-semibold">Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="h-12 pr-12 bg-[#F7F7F7]"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </FormControl>
            <FormMessage>
               {/* Simplified requirements display logic */}
               <div className="space-y-1 mt-2">
                 {getPasswordRequirements(field.value?.length || 0, field.value || "").map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                       <div className={`w-1.5 h-1.5 rounded-full ${req.met ? "bg-green-500" : "bg-gray-300"}`} />
                       <span className={req.met ? "text-green-600" : "text-gray-500"}>{req.text}</span>
                    </div>
                 ))}
               </div>
            </FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-montserrat-semibold">Confirm Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="h-12 pr-12 bg-[#F7F7F7]"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
})