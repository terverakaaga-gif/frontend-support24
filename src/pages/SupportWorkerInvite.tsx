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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	useSupportWorkerProfile,
	useSendInvitationToSupportWorkers,
	useMyOrganizations,
} from "@/hooks/useParticipant";
import { IInvitationRequest } from "@/entities/Invitation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { SupportWorker } from "@/types/user.types";

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
			navigate(-1); // Go back to previous page
		} catch (error) {
			console.error("Failed to send invitation:", error);
			toast.error("Failed to send invitation. Please try again.");
		}
	};

	if (profileLoading) {
		return (
			<div className="container mx-auto py-8">
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<span className="ml-2 text-primary">Loading...</span>
				</div>
			</div>
		);
	}

	if (profileError || !workerProfile) {
		return (
			<div className="container mx-auto py-8">
				<div className="text-center py-12">
					<p className="text-red-600 font-medium">
						Failed to load worker profile
					</p>
					<Button onClick={() => navigate(-1)} className="mt-4">
						Go Back
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 max-w-2xl">
			<Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
				<ArrowLeft className="h-4 w-4 mr-2" />
				Back to Profile
			</Button>

			<div className="bg-white rounded-lg shadow-md p-6">
				<h1 className="text-2xl font-montserrat-bold mb-2">
					Invite {getWorkerFullName(workerProfile.worker)}
				</h1>
				<p className="text-muted-foreground mb-6">
					Send an invitation to join your organization with custom rates.
				</p>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(sendInvite)} className="space-y-6">
						<FormField
							control={form.control}
							name="baseHourlyRate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Base Hourly Rate</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
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
									<FormLabel>Distance Travel Rate (per km)</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
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

						<div className="space-y-4">
							<FormLabel>Shift Rates</FormLabel>
							{SHIFT_TYPES.map((shift, index) => (
								<FormField
									key={shift.id}
									control={form.control}
									name={`shiftRates.${index}.hourlyRate`}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-sm">{shift.name}</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
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
							))}
						</div>

						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Notes (Optional)</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Add any specific requirements or notes for this worker..."
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This will be included in the invitation message.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate(-1)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={sendInvitationMutation.isPending}>
								{sendInvitationMutation.isPending ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Sending...
									</>
								) : (
									"Send Invitation"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
