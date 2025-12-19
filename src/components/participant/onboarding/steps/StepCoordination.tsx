import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { coordinationSchema } from "../schemas";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AltArrowLeft, CheckCircle } from "@solar-icons/react";

type SchemaType = z.infer<typeof coordinationSchema>;

interface Props {
  defaultValues: any;
  onSubmit: (data: any) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function StepCoordination({ defaultValues, onSubmit, onBack, isSubmitting = false }: Props) {
  const form = useForm<SchemaType>({
    resolver: zodResolver(coordinationSchema),
    defaultValues: {
      planManager: defaultValues.planManager,
      coordinator: defaultValues.coordinator,
      behaviorSupportPractitioner: defaultValues.behaviorSupportPractitioner,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-montserrat-bold text-gray-900">Coordination</h2>
          <p className="text-gray-500 text-sm">Plan Manager & Support Coordinator details (Optional).</p>
        </div>

        <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <h3 className="font-montserrat-semibold text-gray-900">Plan Manager</h3>
                <FormField
                  control={form.control}
                  name="planManager.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input placeholder="Organization Name" {...field} className="bg-white" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="planManager.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="admin@example.com" {...field} className="bg-white" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <h3 className="font-montserrat-semibold text-gray-900">Support Coordinator</h3>
                <FormField
                  control={form.control}
                  name="coordinator.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input placeholder="Coordinator Name" {...field} className="bg-white" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coordinator.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="coordinator@example.com" {...field} className="bg-white" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <h3 className="font-montserrat-semibold text-gray-900">Behavior Support Practitioner</h3>
                <FormField
                  control={form.control}
                  name="behaviorSupportPractitioner.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input placeholder="Practitioner Name" {...field} className="bg-white" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="behaviorSupportPractitioner.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="practitioner@example.com" {...field} className="bg-white" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onBack} className="w-32" disabled={isSubmitting}>
            <AltArrowLeft className="mr-2 w-4 h-4"/> Back
          </Button>
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700 min-w-[120px]" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Finish"} {!isSubmitting && <CheckCircle className="ml-2 w-4 h-4"/>}
          </Button>
        </div>
      </form>
    </Form>
  );
}