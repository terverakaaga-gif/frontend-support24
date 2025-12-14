import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supportNeedsSchema } from "../schemas";
import { z } from "zod";
import { Form, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Heart, AltArrowLeft, AltArrowRight } from "@solar-icons/react";
import { useGetActiveServiceTypes } from "@/hooks/useServiceTypeHooks"; // Note: Different hook from provider
import { cn } from "@/lib/utils";
import { useGetServiceCategories } from "@/hooks/useServiceCategoryHooks";

type SchemaType = z.infer<typeof supportNeedsSchema>;

interface Props {
  defaultValues: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function StepSupportNeeds({ defaultValues, onNext, onBack }: Props) {
  const { data: serviceCategories = [], isLoading } = useGetServiceCategories();
   const categories = useMemo(() => {
     if (!serviceCategories) return [];
     return Array.isArray(serviceCategories) ? [] : serviceCategories.categories.filter((cat) => cat.status === 'active').sort((a, b) => a.name.localeCompare(b.name));
   }, [serviceCategories]);

  const form = useForm<SchemaType>({
    resolver: zodResolver(supportNeedsSchema),
    defaultValues: {
      serviceCategories: defaultValues.serviceCategories || [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-montserrat-bold text-gray-900">Support Needs Category</h2>
          <p className="text-gray-500 text-sm">Select the services of needs.</p>
        </div>

        <FormField
          control={form.control}
          name="serviceCategories"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Support Types</FormLabel>
              {isLoading ? (
                <div className="py-12 text-center text-gray-500">Loading support types...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((item) => {
                    const isSelected = field.value.includes(item._id);
                    return (
                      <div
                        key={item._id}
                        onClick={() => {
                          const newValue = isSelected
                            ? field.value.filter((id) => id !== item._id)
                            : [...field.value, item._id];
                          field.onChange(newValue);
                        }}
                        className={cn(
                          "cursor-pointer p-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-3",
                          isSelected
                            ? "bg-primary-600 border-primary-600 text-white shadow-md"
                            : "border-gray-200 hover:border-primary-300 hover:bg-primary-50/50"
                        )}
                      >
                       
                        <span className="font-montserrat-semibold text-sm">{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

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