import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceCategoriesSchema } from "../schemas";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Heart, AltArrowLeft, AltArrowRight } from "@solar-icons/react";
import { useGetServiceTypes } from "@/hooks/useServiceTypeHooks";
import { cn } from "@/lib/utils";
import { useGetServiceCategories } from "@/hooks/useServiceCategoryHooks";

type SchemaType = z.infer<typeof serviceCategoriesSchema>;

interface Props {
  defaultValues: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function StepServices({ defaultValues, onNext, onBack }: Props) {
  const { data: serviceCategories = [], isLoading } = useGetServiceCategories();
  const categories = useMemo(() => {
    if (!serviceCategories) return [];
    return Array.isArray(serviceCategories) ? [] : serviceCategories.categories.filter((cat) => cat.status === 'active').sort((a, b) => a.name.localeCompare(b.name));
  }, [serviceCategories]);

  const form = useForm<SchemaType>({
    resolver: zodResolver(serviceCategoriesSchema),
    defaultValues: {
      serviceCategories: defaultValues.serviceCategories || [],
    },
  });

  if (isLoading) {
    return (
      <div>
        <div className="py-12 text-center text-gray-500">Loading skills...</div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-montserrat-bold text-gray-900">
            What services can you provide?
          </h2>
          <p className="text-gray-500 text-sm">
            Select the services you can provide.
          </p>
        </div>

        <FormField
          control={form.control}
          name="serviceCategories"
          render={({ field }) => (
            <FormItem>
              {isLoading ? (
                <div className="py-12 text-center text-gray-500">
                  Loading skills...
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories!.map((type) => {
                      const isSelected = field.value.includes(type._id);
                      return (
                        <div
                          key={type._id}
                          onClick={() => {
                            const newValue = isSelected
                              ? field.value.filter((id) => id !== type._id)
                              : [...field.value, type._id];
                            field.onChange(newValue);
                          }}
                          className={cn(
                            "cursor-pointer p-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-3",
                            isSelected
                              ? "bg-primary-600 border-primary-600 text-white shadow-md"
                              : "border-gray-200 hover:border-primary-300 hover:bg-primary-50/50"
                          )}
                        >
                          <div>
                            <p className="font-montserrat-semibold text-sm">
                              {type.name}
                            </p>
                            <p
                              className={cn(
                                "text-xs mt-1",
                                isSelected
                                  ? "text-primary-100"
                                  : "text-gray-400"
                              )}
                            >
                              {type.status}
                            </p>
                          </div>
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
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-32"
          >
            <AltArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          <Button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 w-32"
          >
            Next <AltArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
