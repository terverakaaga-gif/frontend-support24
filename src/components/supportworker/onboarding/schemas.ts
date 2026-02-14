import { z } from "zod";

export const bioSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters.").max(500),
  languages: z.array(z.string()).min(1, "Select at least one language."),
  address: z.string().min(5, "Address is required."),
  stateIds: z.array(z.string()).min(1, "Select at least one state."),
  regionIds: z.array(z.string()).min(1, "Select at least one region."),
  serviceAreaIds: z.array(z.string()).min(1, "Select at least one area."),
});

export const serviceCategoriesSchema = z.object({
  serviceCategories: z
    .array(z.string())
    .min(1, "Select at least one servicing category."),
});

// Helper to check time overlap
const checkOverlap = (slots: any[]) => {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (
        (slots[i].start < slots[j].end && slots[i].end > slots[j].start) ||
        slots[i].start === slots[j].start
      ) {
        return false;
      }
    }
  }
  return true;
};

export const availabilitySchema = z.object({
  availability: z.object({
    weekdays: z.array(
      z.object({
        day: z.string(),
        available: z.boolean(),
        slots: z
          .array(
            z.object({
              start: z
                .string()
                .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time"),
              end: z
                .string()
                .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time"),
            })
          )
          .refine((slots) => slots.every((s) => s.end > s.start), {
            message: "End time must be after start time",
          })
          .refine((slots) => checkOverlap(slots), {
            message: "Time slots cannot overlap",
          }),
      })
    ),
  }),
});

export const experienceSchema = z.object({
  experience: z
    .array(
      z.object({
        title: z.string().min(2, "Job title is required."),
        organization: z.string().min(2, "Organization is required."),
        startDate: z.date({ required_error: "Start date is required" }),
        endDate: z.date().optional(),
        description: z.string().min(10, "Description too short."),
      })
    )
    .refine(
      (data) => {
        return data.every((item) => {
          return item.endDate >= item.startDate;
        });
      },
      { message: "End date cannot be before start date", path: ["experience"] }
    ),
  resume: z.instanceof(File, { message: "Resume is required" }),
});

export const rateSchema = z.object({
  shiftRates: z.array(
    z.object({
      rateTimeBandId: z.string(),
      hourlyRate: z.string().refine((val) => parseFloat(val) >= 38, {
        message: "Min $38/hr",
      }),
    })
  ),
});
