import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  CalendarMark,
  DollarMinimalistic,
  CheckCircle,
  TrashBinMinimalistic,
} from "@solar-icons/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetRateTimeBands } from "@/hooks/useRateTimeBandHooks";
import { CustomTimePicker } from "@/components/supportworker/CustomTimePicker";

interface Props {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export const RatesStep = React.memo(({ formData, onChange }: Props) => {
  const { data: timeBands = [], isLoading } = useGetRateTimeBands();

  // Initialize shiftRates if empty when timeBands load
  useEffect(() => {
    if (
      timeBands.length > 0 &&
      (!formData.shiftRates || formData.shiftRates.length === 0)
    ) {
      const initial = timeBands.map((band) => ({
        rateTimeBandId: band._id,
        hourlyRate: "",
      }));
      onChange("shiftRates", initial);
    } else if (
      timeBands.length > 0 &&
      formData.shiftRates &&
      formData.shiftRates.length > 0
    ) {
      // Ensure all time bands are represented in shiftRates
      const existingRateMap = new Map(
        formData.shiftRates.map((rate: any) => [
          rate.rateTimeBandId,
          rate.hourlyRate,
        ])
      );

      const completeRates = timeBands.map((band) => ({
        rateTimeBandId: band._id,
        hourlyRate: existingRateMap.get(band._id) || "",
      }));

      // Only update if there's a difference
      if (completeRates.length !== formData.shiftRates.length) {
        onChange("shiftRates", completeRates);
      }
    }
  }, [timeBands, formData.shiftRates]);

  const handleRateChange = (index: number, value: string) => {
    const updatedRates = [...(formData.shiftRates || [])];
    updatedRates[index] = {
      ...updatedRates[index],
      hourlyRate: value,
    };
    onChange("shiftRates", updatedRates);
  };

  // Availability handlers
  const handleToggleDay = (dayIndex: number) => {
    const weekdays = [...(formData.availability?.weekdays || [])];
    const currentDay = weekdays[dayIndex];
    weekdays[dayIndex] = {
      ...currentDay,
      available: !currentDay.available,
      slots:
        !currentDay.available && currentDay.slots.length === 0
          ? [{ start: "09:00", end: "17:00" }]
          : currentDay.slots,
    };
    onChange("availability", { ...formData.availability, weekdays });
  };

  const addSlot = (dayIndex: number) => {
    const weekdays = [...(formData.availability?.weekdays || [])];
    const currentSlots = weekdays[dayIndex].slots || [];

    const sortedSlots = [...currentSlots].sort((a, b) =>
      a.start.localeCompare(b.start)
    );

    let startTime = "09:00";
    let endTime = "17:00";

    if (sortedSlots.length > 0) {
      const lastSlot = sortedSlots[sortedSlots.length - 1];
      startTime = lastSlot.end;
      const [hours, minutes] = lastSlot.end.split(":").map(Number);
      const newHours = Math.min(hours + 8, 23);
      endTime = `${String(newHours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
    }

    weekdays[dayIndex] = {
      ...weekdays[dayIndex],
      slots: [...currentSlots, { start: startTime, end: endTime }],
    };
    onChange("availability", { ...formData.availability, weekdays });
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const weekdays = [...(formData.availability?.weekdays || [])];
    const currentSlots = weekdays[dayIndex].slots || [];
    weekdays[dayIndex] = {
      ...weekdays[dayIndex],
      slots: currentSlots.filter((_, i) => i !== slotIndex),
    };
    onChange("availability", { ...formData.availability, weekdays });
  };

  const updateSlotTime = (
    dayIndex: number,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    const weekdays = [...(formData.availability?.weekdays || [])];
    const currentSlots = [...weekdays[dayIndex].slots];
    currentSlots[slotIndex] = {
      ...currentSlots[slotIndex],
      [field]: value,
    };
    weekdays[dayIndex] = {
      ...weekdays[dayIndex],
      slots: currentSlots,
    };
    onChange("availability", { ...formData.availability, weekdays });
  };

  return (
    <div className="space-y-6">
      {/* Rates Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <CalendarMark className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-montserrat-bold text-gray-900">Hourly Rates</h2>
          <p className="text-sm text-gray-600">
            Set your rates for different time bands (Min $38)
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">
          Loading rate bands...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timeBands.map((band, index) => {
            const currentRate = formData.shiftRates?.[index]?.hourlyRate;
            const hasValue = currentRate && parseFloat(currentRate) >= 38;

            return (
              <div
                key={band._id}
                className={cn(
                  "border-2 rounded-xl p-5 transition-all space-y-4",
                  hasValue
                    ? "border-primary-600 bg-primary-50/30"
                    : "border-gray-200 bg-white"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-montserrat-bold text-gray-900">
                      {band.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {band.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-2 text-[10px] bg-gray-100 border-gray-200"
                    >
                      {band.startTime} - {band.endTime}
                    </Badge>
                  </div>
                  {hasValue && (
                    <CheckCircle className="text-primary-600 w-6 h-6" />
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-montserrat-bold text-gray-700">
                    Hourly Rate ($)
                  </Label>
                  <div className="relative">
                    <DollarMinimalistic className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="38.00"
                      className="pl-9 bg-white h-12"
                      value={currentRate || ""}
                      onChange={(e) => handleRateChange(index, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Availability Section */}
      <div className="border-t pt-6 mt-8">
        <div className="mb-6">
          <h3 className="text-lg font-montserrat-bold text-gray-900 mb-1">
            Weekly Availability
          </h3>
          <p className="text-sm text-gray-600">Set your weekly schedule</p>
        </div>

        <div className="space-y-4">
          {formData.availability?.weekdays?.map(
            (day: any, dayIndex: number) => {
              const isAvailable = day.available;
              const slots = day.slots || [];

              return (
                <div
                  key={dayIndex}
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
                        {day.day}
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
                      {slots.map((slot: any, slotIndex: number) => (
                        <div
                          key={slotIndex}
                          className="flex items-center gap-3"
                        >
                          <div className="flex-1">
                            <Label className="text-xs text-gray-500 mb-1 block">
                              Start
                            </Label>
                            <CustomTimePicker
                              value={slot.start}
                              onChange={(value) =>
                                updateSlotTime(
                                  dayIndex,
                                  slotIndex,
                                  "start",
                                  value
                                )
                              }
                              placeholder="Start time"
                              format="24"
                              minuteStep={15}
                            />
                          </div>
                          <span className="mt-5 text-gray-400">-</span>
                          <div className="flex-1">
                            <Label className="text-xs text-gray-500 mb-1 block">
                              End
                            </Label>
                            <CustomTimePicker
                              value={slot.end}
                              onChange={(value) =>
                                updateSlotTime(
                                  dayIndex,
                                  slotIndex,
                                  "end",
                                  value
                                )
                              }
                              placeholder="End time"
                              format="24"
                              minuteStep={15}
                            />
                          </div>
                          {slots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSlot(dayIndex, slotIndex)}
                              className="mt-5 text-gray-400 hover:text-red-500"
                            >
                              <TrashBinMinimalistic className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
});
