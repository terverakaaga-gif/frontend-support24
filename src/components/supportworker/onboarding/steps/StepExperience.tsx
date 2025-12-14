
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema } from "../schemas"; // Import from schemas file
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomDatePicker } from "@/components/supportworker/CustomDatePicker";
import { TrashBinMinimalistic, AddCircle, AltArrowRight, AltArrowLeft, CheckCircle, CloseCircle } from "@solar-icons/react";

type SchemaType = z.infer<typeof experienceSchema>;

interface Props {
  defaultValues: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function StepExperience({ defaultValues, onNext, onBack }: Props) {
  const form = useForm<SchemaType>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experience: defaultValues.experience?.length ? defaultValues.experience : [{
        title: "",
        organization: "",
        startDate: undefined,
        endDate: undefined,
        description: "",
      }],
      resume: defaultValues.resume || undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const onSubmit = (data: SchemaType) => {
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-montserrat-bold text-primary-600">Work Experience</h2>
          <p className="text-gray-500 text-sm">Add your relevant work experience.</p>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => {
            // Watch start date to enforce min constraint on end date
            const startDate = form.watch(`experience.${index}.startDate`);

            return (
              <div key={field.id} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-montserrat-semibold text-sm italic text-gray-700">Experience {index + 1}</h4>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                      <TrashBinMinimalistic className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Job Title */}
                <FormField
                  control={form.control}
                  name={`experience.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat-semibold text-gray-900">Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Support Worker" className="h-12 bg-white rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Organization */}
                <FormField
                  control={form.control}
                  name={`experience.${index}.organization`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat-semibold text-gray-900">Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. NDIS Provider" className="h-12 bg-white rounded-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-montserrat-semibold text-gray-900">Start Date</FormLabel>
                        <CustomDatePicker
                          value={field.value}
                          onChange={field.onChange}
                          maxDate={new Date()} // Can't start in future
                          placeholder="dd/mm/yy"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`experience.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-montserrat-semibold text-gray-900">End Date</FormLabel>
                        <CustomDatePicker
                          value={field.value}
                          onChange={field.onChange}
                          minDate={startDate} // Constraint: End date > Start date
                          maxDate={new Date()}
                          placeholder="dd/mm/yy"
                          disabled={!startDate} // Disable if no start date picked
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat-semibold text-gray-900">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter job experience here..." 
                          className="min-h-[120px] bg-white rounded-lg resize-none p-4" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => append({ title: "", organization: "", startDate: undefined, description: "" })}
          className="flex items-center text-primary-600 font-montserrat-semibold text-sm hover:underline"
        >
          <AddCircle className="w-5 h-5 mr-2" /> Add Another Experience
        </button>

        {/* Resume Upload */}
        <div className="border-t pt-6">
          <FormField
            control={form.control}
            name="resume"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel className="font-montserrat-semibold text-gray-900">
                  Resume/CV
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      className="h-12 bg-white rounded-lg"
                      {...field}
                      value={undefined}
                    />
                    {value && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{value.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onChange(undefined)}
                          className="h-6 w-6 p-0"
                        >
                          <CloseCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Upload PDF, DOC, or DOCX (Max 5MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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