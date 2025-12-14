import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emergencyContactSchema } from "../schemas";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AltArrowLeft, AltArrowRight } from "@solar-icons/react";

type SchemaType = z.infer<typeof emergencyContactSchema>;

interface Props {
  defaultValues: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function StepEmergencyContact({ defaultValues, onNext, onBack }: Props) {
  const form = useForm<SchemaType>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      emergencyContact: defaultValues.emergencyContact,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-montserrat-bold text-gray-900">Emergency Contact</h2>
          <p className="text-gray-500 text-sm">Who should we contact in an emergency?</p>
        </div>

        <div className="space-y-4">
            <FormField
              control={form.control}
              name="emergencyContact.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl><Input placeholder="e.g. Sarah Johnson" {...field} className="bg-white" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContact.relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <FormControl><Input placeholder="e.g. Mother" {...field} className="bg-white" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContact.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input placeholder="+61..." {...field} className="bg-white" /></FormControl>
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