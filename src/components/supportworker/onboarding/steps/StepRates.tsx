import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rateSchema } from "../schemas";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, AltArrowLeft, AltArrowRight, DollarMinimalistic } from "@solar-icons/react";
import { useGetRateTimeBands } from "@/hooks/useRateTimeBandHooks";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type SchemaType = z.infer<typeof rateSchema>;

interface Props {
  defaultValues: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function StepRates({ defaultValues, onNext, onBack }: Props) {
  const { data: timeBands = [], isLoading } = useGetRateTimeBands();

  const form = useForm<SchemaType>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      shiftRates: defaultValues.shiftRates || [],
    },
  });

  // Initialize form when data loads if empty
  useEffect(() => {
    if (timeBands.length > 0 && form.getValues("shiftRates").length === 0) {
      const initial = timeBands.map((band) => ({
        rateTimeBandId: band._id,
        hourlyRate: "",
      }));
      form.reset({ shiftRates: initial });
    }
  }, [timeBands, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-montserrat-bold text-gray-900">Hourly Rates</h2>
          <p className="text-gray-500 text-sm">Set your rates for different time bands (Min $38).</p>
        </div>

        {isLoading ? (
           <div className="py-12 text-center text-gray-500">Loading rate bands...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeBands.map((band, index) => {
                // Determine if this specific card has a valid rate entered for visual styling
                const currentRate = form.watch(`shiftRates.${index}.hourlyRate`);
                const hasValue = currentRate && parseFloat(currentRate) >= 38;

                return (
                  <div key={band._id} className={cn("border-2 rounded-xl p-5 transition-all space-y-4", hasValue ? "border-primary-600 bg-primary-50/30" : "border-gray-200 bg-white")}>
                    
                    {/* Hidden ID Field */}
                    <input type="hidden" {...form.register(`shiftRates.${index}.rateTimeBandId`)} value={band._id} />

                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-montserrat-bold text-gray-900">{band.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{band.description}</p>
                            <Badge variant="outline" className="mt-2 text-[10px] bg-gray-100 border-gray-200">{band.startTime} - {band.endTime}</Badge>
                        </div>
                        {hasValue && <CheckCircle className="text-primary-600 w-6 h-6"/>}
                    </div>

                    <FormField
                      control={form.control}
                      name={`shiftRates.${index}.hourlyRate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-montserrat-bold text-gray-700">Hourly Rate ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                                <DollarMinimalistic className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>
                                <Input type="number" step="0.01" placeholder="38.00" className="pl-9 bg-white" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                );
            })}
          </div>
        )}

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onBack} className="w-32">
            <AltArrowLeft className="mr-2 w-4 h-4"/> Back
          </Button>
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700 w-32">
            Next <AltArrowRight className="ml-2 w-4 h-4"/>
          </Button>
        </div>
      </form>
    </Form>
  );
}