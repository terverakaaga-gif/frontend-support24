import { z } from "zod";

export const personalInfoSchema = z.object({
  ndisNumber: z.string().min(8, "NDIS number must be at least 8 characters."),
  preferredLanguages: z.array(z.string()).min(1, "Select at least one language."),
  address: z.string().min(5, "Address is required."),
  stateId: z.string().min(1, "State is required."),
  regionId: z.string().min(1, "Region is required."),
  serviceAreaId: z.string().min(1, "Service area is required."),
});

export const supportNeedsSchema = z.object({
  serviceCategories: z.array(z.string()).min(1, "Select at least one service category."),
});

export const emergencyContactSchema = z.object({
  emergencyContact: z.object({
    name: z.string().min(2, "Contact name is required."),
    relationship: z.string().min(2, "Relationship is required."),
    phone: z.string().min(10, "Valid phone number is required."),
  }),
});

export const coordinationSchema = z.object({
  planManager: z.object({
    name: z.string().optional(),
    email: z.union([z.literal(""), z.string().email("Invalid email")]).optional(),
  }),
  coordinator: z.object({
    name: z.string().optional(),
    email: z.union([z.literal(""), z.string().email("Invalid email")]).optional(),
  }),
  behaviorSupportPractitioner: z.object({
    name: z.string().optional(),
    email: z.union([z.literal(""), z.string().email("Invalid email")]).optional(),
  }),
});