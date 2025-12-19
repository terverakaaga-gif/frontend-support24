import { z } from "zod";

export const providerRegisterSchema = z
  .object({
    // Personal Information
    firstName: z.string().min(2, { message: "First name is required." }),
    lastName: z.string().min(2, { message: "Last name is required." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    phone: z.string().min(10, { message: "Valid phone number is required." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
      .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
      .regex(/[0-9]/, { message: "Must contain at least one number." }),
    confirmPassword: z.string(),

    // Provider-specific Information
    organizationName: z.string().min(2, { message: "Organization name is required." }),
    abn: z.string().min(11, { message: "Valid ABN is required (11 digits)." }),
    
    // Fixed: Business Address is now strictly typed as an object
    businessAddress: z.object({
      street: z.string().min(5, { message: "Street address is required." }),
      city: z.string().min(2, { message: "City is required." }),
      state: z.string().min(2, { message: "State is required." }),
      postcode: z.string().min(4, { message: "Postcode is required." }),
      country: z.string().optional().default("Australia"),
    }),

    providerType: z.enum(
      ["DISABILITY_SUPPORT", "AGED_CARE", "MENTAL_HEALTH", "COMMUNITY_SUPPORT", "HOME_CARE"],
      { required_error: "Please select a provider type." }
    ),
    
    primaryContactName: z.string().min(2, { message: "Primary contact name is required." }),
    primaryContactPhone: z.string().min(10, { message: "Valid contact phone is required." }),
    primaryContactEmail: z.string().email({ message: "Valid contact email is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ProviderRegisterFormValues = z.infer<typeof providerRegisterSchema>;

export const STEPS = [
  { number: 1, title: "Personal Info", description: "Basic details" },
  { number: 2, title: "Organization", description: "Business details" },
  { number: 3, title: "Review", description: "Confirm details" },
];