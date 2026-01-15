import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  useSupportWorkerProfile,
  useSendInvitationToSupportWorkers,
  useMyOrganizations,
} from "@/hooks/useParticipant";
import { IInvitationRequest } from "@/entities/Invitation";
import { toast } from "sonner";
import {
  AltArrowLeft,
  CheckCircle,
  DollarMinimalistic,
} from "@solar-icons/react";
import { SupportWorker } from "@/types/user.types";
import GeneralHeader from "@/components/GeneralHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/Spinner";

const inviteFormSchema = z.object({
  baseHourlyRate: z.number().min(1, "Base rate must be greater than 0"),
  distanceTravelRate: z.number().min(0, "Distance rate cannot be negative"),
  shiftRates: z.array(
    z.object({
      rateTimeBandId: z.string().min(1, "Shift type is required"),
      hourlyRate: z.number().min(1, "Shift rate must be greater than 0"),
    })
  ),
  notes: z.string().optional(),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

const SHIFT_TYPES = [
  { id: "681c6f750ab224ca6685d05c", name: "Morning Shift", defaultRate: 50.0 },
  {
    id: "681c6f750ab224ca6685d05d",
    name: "Afternoon Shift",
    defaultRate: 45.0,
  },
  { id: "681c6f750ab224ca6685d05e", name: "Night Shift", defaultRate: 60.0 },
  { id: "681c6f750ab224ca6685d05f", name: "Weekend Shift", defaultRate: 65.0 },
  {
    id: "681c6f750ab224ca6685d060",
    name: "Public Holiday Shift",
    defaultRate: 80.0,
  },
];

export default function SupportWorkerInvite() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [organizationId, setOrganizationId] = useState("");

  const {
    data: workerProfile,
    isLoading: profileLoading,
    isError: profileError,
  } = useSupportWorkerProfile(id || "", {
    enabled: !!id,
    queryKey: ["supportWorkerProfile", id],
  });

  const { data: organizations } = useMyOrganizations();

  const sendInvitationMutation =
    useSendInvitationToSupportWorkers(organizationId);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      baseHourlyRate: 40.0,
      distanceTravelRate: 1.75,
      shiftRates: SHIFT_TYPES.map((shift) => ({
        rateTimeBandId: shift.id,
        hourlyRate: shift.defaultRate,
      })),
      notes: "",
    },
  });

  useEffect(() => {
    if (organizations && organizations.length > 0) {
      setOrganizationId(organizations[0]._id);
    }
  }, [organizations]);

  useEffect(() => {
    console.debug("Invite Page API Responses:", {
      workerProfile,
      profileLoading,
      profileError,
      organizations,
      organizationId,
    });
  }, [
    workerProfile,
    profileLoading,
    profileError,
    organizations,
    organizationId,
  ]);

  const getWorkerFullName = (worker: SupportWorker) => {
    return `${worker?.firstName} ${worker?.lastName}`;
  };

  const sendInvite = async (data: InviteFormValues) => {
    if (!workerProfile || !organizationId) return;

    try {
      console.debug("Sending invitation with data:", {
        workerId: workerProfile.worker._id,
        organizationId,
        proposedRates: data,
      });

      const inviteData: IInvitationRequest = {
        workerId: workerProfile.worker._id,
        proposedRates: {
          baseHourlyRate: data.baseHourlyRate,
          distanceTravelRate: data.distanceTravelRate,
          shiftRates: data.shiftRates.map((rate) => ({
            rateTimeBandId: rate.rateTimeBandId!,
            hourlyRate: rate.hourlyRate!,
          })),
        },
        notes: data.notes || "",
      };

      await sendInvitationMutation.mutateAsync(inviteData);

      console.debug("Invitation sent successfully");
      toast.success(
        `Invitation sent to ${getWorkerFullName(workerProfile.worker)}!`
      );
      navigate(-1);
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast.error("Failed to send invitation. Please try again.");
    }
  };

  if (profileLoading) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <span className="text-primary font-montserrat-semibold">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !workerProfile) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <Card className="shadow-md bg-white">
          <CardContent className="p-12 text-center">
            <p className="text-red-600 font-montserrat-semibold mb-4">
              Failed to load worker profile
            </p>
            <Button onClick={() => navigate(-1)} className="gap-2">
              <AltArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      {/* Header */}
      <GeneralHeader
        showBackButton
        title={`Invite ${getWorkerFullName(workerProfile.worker)}`}
        subtitle=" Send an invitation to join your organization with custom rates"
        onViewProfile={() => {
          navigate("/participant/profile");
        }}
        user={user}
        onLogout={logout}
      />

      {/* Form Card */}
      <Card className="shadow-md bg-white">
        <CardContent className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(sendInvite)}
              className="space-y-6"
            >
              {/* Base Rates Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <DollarMinimalistic className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-montserrat-bold">Base Rates</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="baseHourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-montserrat-semibold">
                          Base Hourly Rate *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="40.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="distanceTravelRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-montserrat-semibold">
                          Distance Travel Rate (per km) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="1.75"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Shift Rates Section */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-montserrat-bold mb-4">
                  Shift Rates
                </h3>

                <div className="space-y-3">
                  {SHIFT_TYPES.map((shift, index) => (
                    <FormField
                      key={shift.id}
                      control={form.control}
                      name={`shiftRates.${index}.hourlyRate`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-4">
                            <FormLabel className="font-montserrat-semibold min-w-[200px]">
                              {shift.name}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder={shift.defaultRate.toFixed(2)}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                                className="max-w-[200px]"
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-2 pt-6 border-t">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat-semibold">
                        Special Instructions
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any specific requirements or notes for this worker..."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-600">
                        This will be included in the invitation message
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={sendInvitationMutation.isPending}
                >
                  <AltArrowLeft className="w-5 h-5 mr-2" />
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={sendInvitationMutation.isPending}
                  className="gap-2"
                >
                  {sendInvitationMutation.isPending ? (
                    <>
                      <Spinner />
                      <span className="ml-2">Sending Invitation...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
