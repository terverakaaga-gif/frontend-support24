import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { availabilitySchema } from "../schemas";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrashBinMinimalistic,
  AltArrowLeft,
} from "@solar-icons/react";
import { CustomTimePicker } from "@/components/supportworker/CustomTimePicker";
import React from "react";

type SchemaType = z.infer<typeof availabilitySchema>;

interface Props {
  defaultValues: any;
  onSubmit: (data: any) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export const StepAvailability = React.memo(({ defaultValues, onSubmit, onBack, isSubmitting = false }: Props) => {
  const form = useForm<SchemaType>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      availability: defaultValues.availability, // Ensure default structure matches
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "availability.weekdays",
  });

  const handleToggleDay = (index: number) => {
    const current = form.getValues(`availability.weekdays.${index}`);
    form.setValue(
      `availability.weekdays.${index}.available`,
      !current.available
    );
    if (!current.available && current.slots.length === 0) {
      form.setValue(`availability.weekdays.${index}.slots`, [
        { start: "09:00", end: "17:00" },
      ]);
    }
  };

  const addSlot = (dayIndex: number) => {
    const currentSlots = form.getValues(
      `availability.weekdays.${dayIndex}.slots`
    );
    
    // Sort slots by start time to find the latest available time
    const sortedSlots = [...currentSlots].sort((a, b) => a.start.localeCompare(b.start));
    
    let startTime = "09:00";
    let endTime = "17:00";
    
    if (sortedSlots.length > 0) {
      const lastSlot = sortedSlots[sortedSlots.length - 1];
      // Use the last slot's end time as the new start time to prevent overlap
      startTime = lastSlot.end;
      const [hours, minutes] = lastSlot.end.split(':').map(Number);
      // Set end time to 8 hours later or end of day
      const newHours = Math.min(hours + 8, 23);
      endTime = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    
    form.setValue(`availability.weekdays.${dayIndex}.slots`, [
      ...currentSlots,
      { start: startTime, end: endTime },
    ]);
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const currentSlots = form.getValues(
      `availability.weekdays.${dayIndex}.slots`
    );
    const newSlots = currentSlots.filter((_, i) => i !== slotIndex);
    form.setValue(`availability.weekdays.${dayIndex}.slots`, newSlots);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-montserrat-bold text-gray-900">Availability</h2>
          <p className="text-gray-500 text-sm">Set your weekly schedule.</p>
        </div>

        <div className="space-y-4">
          {fields.map((field, dayIndex) => {
            const isAvailable = form.watch(
              `availability.weekdays.${dayIndex}.available`
            );
            const slots = form.watch(`availability.weekdays.${dayIndex}.slots`);

            return (
              <div
                key={field.id}
                className={cn(
                  "border rounded-xl p-4 transition-all",
                  isAvailable
                    ? "border-primary-200 bg-primary-50/30"
                    : "border-gray-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => handleToggleDay(dayIndex)}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center",
                        isAvailable
                          ? "bg-primary-600 border-primary-600"
                          : "bg-white border-gray-300"
                      )}
                    >
                      {isAvailable && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <span className="font-montserrat-semibold capitalize text-gray-900">
                      {field.day}
                    </span>
                  </div>
                  {isAvailable && (
                    <button
                      type="button"
                      onClick={() => addSlot(dayIndex)}
                      className="text-primary-600 text-xs font-montserrat-semibold hover:bg-primary-100 px-2 py-1 rounded"
                    >
                      + Add Slot
                    </button>
                  )}
                </div>

                {isAvailable && (
                  <div className="mt-4 space-y-3 pl-8">
                    {slots.map((_, slotIndex) => (
                      <div key={slotIndex} className="flex items-end gap-3">
                        <FormField
                          control={form.control}
                          name={`availability.weekdays.${dayIndex}.slots.${slotIndex}.start`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-xs text-gray-500">
                                Start
                              </FormLabel>
                              <CustomTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Start time"
                                format="24"
                                minuteStep={15}
                              />
                            </FormItem>
                          )}
                        />
                        <span className="mb-2 text-gray-400">-</span>
                        <FormField
                          control={form.control}
                          name={`availability.weekdays.${dayIndex}.slots.${slotIndex}.end`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-xs text-gray-500">
                                End
                              </FormLabel>
                              <CustomTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="End time"
                                format="24"
                                minuteStep={15}
                              />
                            </FormItem>
                          )}
                        />
                        {slots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSlot(dayIndex, slotIndex)}
                            className="mb-2 text-gray-400 hover:text-red-500"
                          >
                            <TrashBinMinimalistic className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    {/* Error message for the whole slots array (overlap check) */}
                    <FormMessage>
                      {
                        form.formState.errors.availability?.weekdays?.[dayIndex]
                          ?.slots?.root?.message
                      }
                    </FormMessage>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-32"
            disabled={isSubmitting}
          >
            <AltArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>

          <Button
            type="submit"
            className="bg-primary-600 text-white font-montserrat-semibold hover:bg-primary-700 min-w-[120px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
})
