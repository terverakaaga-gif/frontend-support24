import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	ArrowLeft,
	Save,
	Plus,
	X,
	Loader2,
	AlertCircle,
	User,
	Briefcase,
	Clock,
	DollarSign,
	Languages,
	MapPin,
	Shield,
	Calendar,
	Heart,
	CreditCard,
	Building,
	Star,
} from "lucide-react";
import { Participant, SupportWorker, EUserRole } from "@/types/user.types";
import { UpdateProfileData } from "@/api/services/userService";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetActiveServiceTypes } from "@/hooks/useServiceTypeHooks";

// Helper functions
const deepEqual = (a: unknown, b: unknown): boolean => {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (typeof a !== typeof b) return false;

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((item, index) => deepEqual(item, b[index]));
	}

	if (typeof a === "object" && typeof b === "object") {
		const keysA = Object.keys(a as object);
		const keysB = Object.keys(b as object);
		if (keysA.length !== keysB.length) return false;
		return keysA.every((key) => deepEqual((a as any)[key], (b as any)[key]));
	}

	return false;
};

const getChangedFields = (original: unknown, updated: unknown) => {
	const changes = {};

	Object.keys(updated as object).forEach((key) => {
		const originalValue = (original as any)?.[key];
		const updatedValue = (updated as any)?.[key];

		if (!deepEqual(originalValue, updatedValue)) {
			if (
				typeof updatedValue === "string" &&
				updatedValue.trim() === "" &&
				!originalValue
			) {
				return;
			}
			if (
				Array.isArray(updatedValue) &&
				updatedValue.length === 0 &&
				(!originalValue || originalValue.length === 0)
			) {
				return;
			}

			changes[key] = updatedValue;
		}
	});

	return changes;
};

// Validation function
const validateProfileData = (
	data: unknown,
	userRole: string
): { isValid: boolean; errors: string[] } => {
	const errors: string[] = [];
	const profileData = data as any;

	// Common required fields
	if (!profileData.firstName?.trim()) errors.push("First name is required");
	if (!profileData.lastName?.trim()) errors.push("Last name is required");

	// Email validation for nested objects
	if (
		profileData.planManager?.email &&
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.planManager.email)
	) {
		errors.push("Plan manager email must be valid");
	}
	if (
		profileData.coordinator?.email &&
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.coordinator.email)
	) {
		errors.push("Coordinator email must be valid");
	}

	// Role-specific validation
	if (userRole === EUserRole.Participant) {
		if (
			profileData.emergencyContact &&
			profileData.emergencyContact.name &&
			!profileData.emergencyContact.phone
		) {
			errors.push("Emergency contact phone is required when name is provided");
		}
		if (
			profileData.ndisNumber &&
			profileData.ndisNumber.length > 0 &&
			profileData.ndisNumber.length < 9
		) {
			errors.push("NDIS number must be at least 9 characters");
		}
	}

	if (userRole === EUserRole.SupportWorker) {
		if (
			profileData.abn &&
			!/^\d{11}$/.test(profileData.abn.replace(/\s/g, ""))
		) {
			errors.push("ABN must be 11 digits");
		}
		if (
			profileData.hourlyRate?.baseRate &&
			profileData.hourlyRate.baseRate < 0
		) {
			errors.push("Base rate cannot be negative");
		}
		if (profileData.experience) {
			profileData.experience.forEach((exp: any, index: number) => {
				if (
					exp.endDate &&
					exp.startDate &&
					new Date(exp.endDate) < new Date(exp.startDate)
				) {
					errors.push(
						`Experience ${index + 1}: End date cannot be before start date`
					);
				}
			});
		}
	}

	return { isValid: errors.length === 0, errors };
};

// Default availability structure
const getDefaultAvailability = () => ({
	weekdays: [
		{ day: "monday", available: false, slots: [] },
		{ day: "tuesday", available: false, slots: [] },
		{ day: "wednesday", available: false, slots: [] },
		{ day: "thursday", available: false, slots: [] },
		{ day: "friday", available: false, slots: [] },
		{ day: "saturday", available: false, slots: [] },
		{ day: "sunday", available: false, slots: [] },
	],
	unavailableDates: [],
});

export default function ProfileEditForm() {
	const navigate = useNavigate();
	const { data: profileData, isLoading } = useProfile();
	const { data: serviceTypes, isLoading: serviceTypesLoading } =
		useGetActiveServiceTypes();
	const updateProfileMutation = useUpdateProfile();

	const [formData, setFormData] = useState<Partial<UpdateProfileData>>({});
	const [originalData, setOriginalData] = useState<Partial<UpdateProfileData>>(
		{}
	);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	// Dynamic input states
	const [selectedServiceType, setSelectedServiceType] = useState("");
	const [newLanguage, setNewLanguage] = useState("");
	const [newSupportNeed, setNewSupportNeed] = useState("");
	const [newServiceArea, setNewServiceArea] = useState("");
	const [newPreferredGender, setNewPreferredGender] = useState("");
	const [newPreferredLanguage, setNewPreferredLanguage] = useState("");
	const [newQualification, setNewQualification] = useState({
		title: "",
		issuer: "",
		issueDate: "",
		expiryDate: "",
		verified: false,
	});

	// Initialize form data
	useEffect(() => {
		if (profileData?.user) {
			const user = profileData.user;
			let userData: UpdateProfileData = {};

			if (user.role === EUserRole.Participant) {
				const participant = user as Participant;
				userData = {
					// Base User fields
					firstName: participant.firstName || "",
					lastName: participant.lastName || "",
					phone: participant.phone || "",
					gender: participant.gender || "",
					dateOfBirth: participant.dateOfBirth || null,
					address: participant.address || {
						street: "",
						city: "",
						state: "",
						postalCode: "",
						country: "",
					},
					notificationPreferences: participant.notificationPreferences,

					// Participant specific fields
					supportNeeds:
						participant.supportNeeds?.map((need: any) => need.name) || [],
					emergencyContact: participant.emergencyContact || {
						name: "",
						relationship: "",
						phone: "",
					},
					planManager: participant.planManager || {
						name: "",
						email: "",
					},
					coordinator: participant.coordinator || {
						name: "",
						email: "",
					},
					preferredLanguages: participant.preferredLanguages || [],
					preferredGenders: participant.preferredGenders || [],
					notes: participant.notes || "",
					ndisNumber: participant.ndisNumber || "",
					requiresSupervision: participant.requiresSupervision || false,
					onboardingComplete: participant.onboardingComplete || false,
				};
			} else if (user.role === EUserRole.SupportWorker) {
				const worker = user as SupportWorker;
				userData = {
					// Base User fields
					firstName: worker.firstName || "",
					lastName: worker.lastName || "",
					phone: worker.phone || "",
					gender: worker.gender || "",
					dateOfBirth: worker.dateOfBirth || null,
					address: worker.address || {
						street: "",
						city: "",
						state: "",
						postalCode: "",
						country: "",
					},
					notificationPreferences: worker.notificationPreferences,

					// Support Worker specific fields
					skills: worker.skills || [], // Keep as ServiceType objects
					bio: worker.bio || "",
					qualifications: worker.qualifications || [],
					experience: worker.experience || [],
					hourlyRate: worker.hourlyRate || {
						baseRate: 0,
						weekendRate: 0,
						holidayRate: 0,
						overnightRate: 0,
					},
					shiftRates: worker.shiftRates || [],
					availability: worker.availability || getDefaultAvailability(),
					serviceAreas: worker.serviceAreas || [],
					languages: worker.languages || [],
					abn: worker.abn || "",
					bankDetails: worker.bankDetails || {
						accountName: "",
						bsb: "",
						accountNumber: "",
					},
					verificationStatus: worker.verificationStatus || {
						profileSetupComplete: false,
						identityVerified: false,
						policeCheckVerified: false,
						ndisWorkerScreeningVerified: false,
						onboardingComplete: false,
						onboardingFeeReceived: false,
					},
				};
			}

			setFormData(userData);
			setOriginalData(JSON.parse(JSON.stringify(userData)));
		}
	}, [profileData]);

	const isParticipant = profileData?.user.role === EUserRole.Participant;
	const isSupportWorker = profileData?.user.role === EUserRole.SupportWorker;
	const themeColor = isSupportWorker ? "guardian" : "[#008CFF]";

	// Event handlers
	const handleInputChange = (field: string, value: unknown) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (validationErrors.length > 0) setValidationErrors([]);
	};

	const handleNestedChange = (
		parentField: string,
		field: string,
		value: unknown
	) => {
		setFormData((prev) => ({
			...prev,
			[parentField]: {
				...(prev[parentField as keyof UpdateProfileData] as object),
				[field]: value,
			},
		}));
	};

	const handleAddressChange = (field: string, value: string) => {
		handleNestedChange("address", field, value);
	};

	const handleEmergencyContactChange = (field: string, value: string) => {
		handleNestedChange("emergencyContact", field, value);
	};

	const handlePlanManagerChange = (field: string, value: string) => {
		handleNestedChange("planManager", field, value);
	};

	const handleCoordinatorChange = (field: string, value: string) => {
		handleNestedChange("coordinator", field, value);
	};

	const handleHourlyRateChange = (field: string, value: number) => {
		handleNestedChange("hourlyRate", field, value);
	};

	const handleBankDetailsChange = (field: string, value: string) => {
		handleNestedChange("bankDetails", field, value);
	};

	// Array manipulation helpers
	const addItem = (field: string, value: string) => {
		if (value.trim()) {
			setFormData((prev) => ({
				...prev,
				[field]: [...((prev as any)[field] || []), value.trim()],
			}));
		}
	};

	const removeItem = (field: string, index: number) => {
		setFormData((prev) => ({
			...prev,
			[field]: (prev as any)[field]?.filter(
				(_: unknown, i: number) => i !== index
			),
		}));
	};

	// Specific item handlers
	const addSupportNeed = () => {
		if (newSupportNeed.trim()) {
			addItem("supportNeeds", newSupportNeed);
			setNewSupportNeed("");
		}
	};

	// Updated skill handler to use ServiceType objects
	const addSkill = () => {
		if (selectedServiceType && serviceTypes) {
			const serviceType = serviceTypes.find(
				(st: any) => st._id === selectedServiceType
			);
			if (serviceType) {
				const existingSkills = (formData.skills as any[]) || [];
				const skillExists = existingSkills.some(
					(skill: any) => skill._id === serviceType._id
				);

				if (!skillExists) {
					setFormData((prev) => ({
						...prev,
						skills: [...existingSkills, serviceType],
					}));
				}
				setSelectedServiceType("");
			}
		}
	};

	const removeSkill = (index: number) => {
		setFormData((prev) => ({
			...prev,
			skills: ((prev as any).skills || []).filter(
				(_: unknown, i: number) => i !== index
			),
		}));
	};

	const addLanguage = () => {
		if (newLanguage.trim()) {
			addItem("languages", newLanguage);
			setNewLanguage("");
		}
	};

	const addPreferredLanguage = () => {
		if (newPreferredLanguage.trim()) {
			addItem("preferredLanguages", newPreferredLanguage);
			setNewPreferredLanguage("");
		}
	};

	const addServiceArea = () => {
		if (newServiceArea.trim()) {
			addItem("serviceAreas", newServiceArea);
			setNewServiceArea("");
		}
	};

	const addPreferredGender = () => {
		if (newPreferredGender.trim()) {
			addItem("preferredGenders", newPreferredGender);
			setNewPreferredGender("");
		}
	};

	// Experience handlers
	const addExperience = () => {
		setFormData((prev) => ({
			...prev,
			experience: [
				...((prev as any).experience || []),
				{
					title: "",
					organization: "",
					startDate: new Date(),
					endDate: undefined,
					description: "",
				},
			],
		}));
	};

	const removeExperience = (index: number) => {
		setFormData((prev) => ({
			...prev,
			experience: ((prev as any).experience || []).filter(
				(_: unknown, i: number) => i !== index
			),
		}));
	};

	const updateExperience = (index: number, field: string, value: unknown) => {
		setFormData((prev) => ({
			...prev,
			experience: ((prev as any).experience || []).map((exp: any, i: number) =>
				i === index ? { ...exp, [field]: value } : exp
			),
		}));
	};

	// Qualification handlers
	const addQualification = () => {
		if (
			newQualification.title &&
			newQualification.issuer &&
			newQualification.issueDate
		) {
			setFormData((prev) => ({
				...prev,
				qualifications: [
					...((prev as any).qualifications || []),
					{
						title: newQualification.title,
						issuer: newQualification.issuer,
						issueDate: new Date(newQualification.issueDate),
						expiryDate: newQualification.expiryDate
							? new Date(newQualification.expiryDate)
							: undefined,
						verified: newQualification.verified,
					},
				],
			}));
			setNewQualification({
				title: "",
				issuer: "",
				issueDate: "",
				expiryDate: "",
				verified: false,
			});
		}
	};

	const removeQualification = (index: number) => {
		setFormData((prev) => ({
			...prev,
			qualifications: ((prev as any).qualifications || []).filter(
				(_: unknown, i: number) => i !== index
			),
		}));
	};

	// Initialize availability if it doesn't exist
	const ensureAvailability = () => {
		if (!(formData as any).availability) {
			setFormData((prev) => ({
				...prev,
				availability: getDefaultAvailability(),
			}));
		}
	};

	// Availability handlers
	const toggleAvailability = (dayIndex: number) => {
		ensureAvailability();
		setFormData((prev) => {
			const availability =
				(prev as any).availability || getDefaultAvailability();
			const updatedWeekdays = [...(availability.weekdays || [])];
			if (updatedWeekdays[dayIndex]) {
				updatedWeekdays[dayIndex] = {
					...updatedWeekdays[dayIndex],
					available: !updatedWeekdays[dayIndex].available,
					slots: !updatedWeekdays[dayIndex].available
						? []
						: updatedWeekdays[dayIndex].slots,
				};
			}
			return {
				...prev,
				availability: {
					...availability,
					weekdays: updatedWeekdays,
				},
			};
		});
	};

	const addTimeSlot = (dayIndex: number) => {
		ensureAvailability();
		setFormData((prev) => {
			const availability =
				(prev as any).availability || getDefaultAvailability();
			const updatedWeekdays = [...(availability.weekdays || [])];
			if (updatedWeekdays[dayIndex]) {
				updatedWeekdays[dayIndex] = {
					...updatedWeekdays[dayIndex],
					slots: [
						...(updatedWeekdays[dayIndex].slots || []),
						{ start: "09:00", end: "17:00" },
					],
				};
			}
			return {
				...prev,
				availability: {
					...availability,
					weekdays: updatedWeekdays,
				},
			};
		});
	};

	const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
		setFormData((prev) => {
			const availability =
				(prev as any).availability || getDefaultAvailability();
			const updatedWeekdays = [...(availability.weekdays || [])];
			if (updatedWeekdays[dayIndex]) {
				updatedWeekdays[dayIndex] = {
					...updatedWeekdays[dayIndex],
					slots: (updatedWeekdays[dayIndex].slots || []).filter(
						(_: unknown, i: number) => i !== slotIndex
					),
				};
			}
			return {
				...prev,
				availability: {
					...availability,
					weekdays: updatedWeekdays,
				},
			};
		});
	};

	const updateTimeSlot = (
		dayIndex: number,
		slotIndex: number,
		field: string,
		value: string
	) => {
		setFormData((prev) => {
			const availability =
				(prev as any).availability || getDefaultAvailability();
			const updatedWeekdays = [...(availability.weekdays || [])];
			if (updatedWeekdays[dayIndex]?.slots?.[slotIndex]) {
				const updatedSlots = [...updatedWeekdays[dayIndex].slots];
				updatedSlots[slotIndex] = {
					...updatedSlots[slotIndex],
					[field]: value,
				};
				updatedWeekdays[dayIndex] = {
					...updatedWeekdays[dayIndex],
					slots: updatedSlots,
				};
			}
			return {
				...prev,
				availability: {
					...availability,
					weekdays: updatedWeekdays,
				},
			};
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const { isValid, errors } = validateProfileData(
			formData,
			profileData?.user.role || ""
		);

		if (!isValid) {
			setValidationErrors(errors);
			return;
		}

		const changedFields = getChangedFields(originalData, formData);

		if (Object.keys(changedFields).length === 0) {
			navigate(-1);
			return;
		}

		try {
			await updateProfileMutation.mutateAsync(changedFields);
			navigate(-1);
		} catch (error) {
			console.error("Failed to update profile:", error);
			setValidationErrors(["Failed to update profile. Please try again."]);
		}
	};

	const hasChanges =
		Object.keys(getChangedFields(originalData, formData)).length > 0;

	if (isLoading || serviceTypesLoading) {
		return (
			<div className="container py-6 space-y-6">
				<div className="flex items-center justify-center h-64">
					<Loader2 className="h-8 w-8 animate-spin text-[#008CFF]" />
				</div>
			</div>
		);
	}

	if (!profileData) {
		return (
			<div className="container py-6 space-y-6">
				<Card className="border-red-200 bg-red-50">
					<CardContent className="pt-6">
						<div className="text-center">
							<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
							<p className="text-red-700 mb-4">Failed to load profile data</p>
							<Button onClick={() => navigate(-1)} variant="outline">
								Back to Profile
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const availableServiceTypes =
		serviceTypes?.filter(
			(serviceType: any) =>
				!((formData as any).skills || []).some(
					(skill: any) => skill._id === serviceType._id
				)
		) || [];

	return (
		<div className="container py-6 space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="outline" size="icon" onClick={() => navigate(-1)}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1
						className={`text-3xl font-bold tracking-tight text-${themeColor}`}
					>
						Edit Profile
					</h1>
					<p className="text-muted-foreground mt-2">
						Update your personal information and preferences
						{hasChanges && (
							<span className="text-orange-600 ml-2">(Unsaved changes)</span>
						)}
					</p>
				</div>
			</div>

			{/* Validation Errors */}
			{validationErrors.length > 0 && (
				<Card className="border-red-200 bg-red-50">
					<CardContent className="pt-6">
						<div className="flex items-start">
							<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
							<div>
								<h3 className="text-red-800 font-medium">
									Please fix the following errors:
								</h3>
								<ul className="mt-2 text-red-700 text-sm list-disc list-inside">
									{validationErrors.map((error, index) => (
										<li key={index}>{error}</li>
									))}
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Information */}
				<Card className={`border-${themeColor}/10`}>
					<CardHeader className={`border-b border-${themeColor}/10`}>
						<CardTitle className={`text-${themeColor} flex items-center`}>
							<User className="mr-2 h-5 w-5" />
							Basic Information
						</CardTitle>
						<CardDescription>
							Your personal details and contact information
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 pt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name *</Label>
								<Input
									id="firstName"
									value={(formData as any).firstName || ""}
									onChange={(e) =>
										handleInputChange("firstName", e.target.value)
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name *</Label>
								<Input
									id="lastName"
									value={(formData as any).lastName || ""}
									onChange={(e) =>
										handleInputChange("lastName", e.target.value)
									}
									required
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="phone">Phone Number</Label>
								<Input
									id="phone"
									type="tel"
									value={(formData as any).phone || ""}
									onChange={(e) => handleInputChange("phone", e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="gender">Gender</Label>
								<Select
									value={(formData as any).gender || ""}
									onValueChange={(value) => handleInputChange("gender", value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select gender" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="male">Male</SelectItem>
										<SelectItem value="female">Female</SelectItem>
										<SelectItem value="non-binary">Non-binary</SelectItem>
										<SelectItem value="prefer-not-to-say">
											Prefer not to say
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="dateOfBirth">Date of Birth</Label>
							<Input
								id="dateOfBirth"
								type="date"
								value={
									(formData as any).dateOfBirth
										? new Date((formData as any).dateOfBirth)
												.toISOString()
												.split("T")[0]
										: ""
								}
								onChange={(e) =>
									handleInputChange(
										"dateOfBirth",
										e.target.value ? new Date(e.target.value) : null
									)
								}
							/>
						</div>

						{/* Bio - only for Support Workers */}
						{isSupportWorker && (
							<div className="space-y-2">
								<Label htmlFor="bio">Bio</Label>
								<Textarea
									id="bio"
									placeholder="Tell participants about yourself..."
									value={(formData as any).bio || ""}
									onChange={(e) => handleInputChange("bio", e.target.value)}
									className="min-h-[100px]"
									maxLength={500}
								/>
								<p className="text-sm text-muted-foreground">
									{((formData as any).bio || "").length}/500 characters
								</p>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="notificationPreferences">
								Notification Preferences
							</Label>
							<Select
								value={(formData as any).notificationPreferences || ""}
								onValueChange={(value) =>
									handleInputChange("notificationPreferences", value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select notification preference" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="email">Email</SelectItem>
									<SelectItem value="sms">SMS</SelectItem>
									<SelectItem value="emailAndSms">Both Email & SMS</SelectItem>
									<SelectItem value="emailAndPush">
										Email & Push Notification
									</SelectItem>
									<SelectItem value="none">None</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Address Information */}
				<Card className={`border-${themeColor}/10`}>
					<CardHeader className={`border-b border-${themeColor}/10`}>
						<CardTitle className={`text-${themeColor} flex items-center`}>
							<MapPin className="mr-2 h-5 w-5" />
							Address Information
						</CardTitle>
						<CardDescription>Your residential address</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 pt-6">
						<div className="space-y-2">
							<Label htmlFor="street">Street Address</Label>
							<Input
								id="street"
								value={(formData as any).address?.street || ""}
								onChange={(e) => handleAddressChange("street", e.target.value)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="city">City</Label>
								<Input
									id="city"
									value={(formData as any).address?.city || ""}
									onChange={(e) => handleAddressChange("city", e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="state">State</Label>
								<Input
									id="state"
									value={(formData as any).address?.state || ""}
									onChange={(e) => handleAddressChange("state", e.target.value)}
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="postalCode">Postal Code</Label>
								<Input
									id="postalCode"
									value={(formData as any).address?.postalCode || ""}
									onChange={(e) =>
										handleAddressChange("postalCode", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="country">Country</Label>
								<Input
									id="country"
									value={(formData as any).address?.country || ""}
									onChange={(e) =>
										handleAddressChange("country", e.target.value)
									}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Participant Specific Fields */}
				{isParticipant && (
					<>
						{/* Support Needs */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<Heart className="mr-2 h-5 w-5" />
									Support Needs
								</CardTitle>
								<CardDescription>Types of support you require</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<div className="flex flex-wrap gap-2">
									{((formData as any).supportNeeds || []).map(
										(need: string, index: number) => (
											<Badge key={index} variant="secondary" className="pr-1">
												{need}
												<Button
													variant="ghost"
													size="sm"
													className="h-auto p-0 ml-1"
													onClick={() => removeItem("supportNeeds", index)}
												>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										)
									)}
								</div>
								<div className="flex gap-2">
									<Input
										placeholder="Add support need"
										value={newSupportNeed}
										onChange={(e) => setNewSupportNeed(e.target.value)}
										onKeyPress={(e) =>
											e.key === "Enter" &&
											(e.preventDefault(), addSupportNeed())
										}
									/>
									<Button type="button" onClick={addSupportNeed}>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* NDIS & Care Information */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<Shield className="mr-2 h-5 w-5" />
									NDIS & Care Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<div className="space-y-2">
									<Label htmlFor="ndisNumber">NDIS Number</Label>
									<Input
										id="ndisNumber"
										value={(formData as any).ndisNumber || ""}
										onChange={(e) =>
											handleInputChange("ndisNumber", e.target.value)
										}
										placeholder="Enter NDIS number"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="notes">Notes</Label>
									<Textarea
										id="notes"
										placeholder="Additional notes about your care needs"
										value={(formData as any).notes || ""}
										onChange={(e) => handleInputChange("notes", e.target.value)}
										className="min-h-[80px]"
									/>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="requiresSupervision"
										checked={(formData as any).requiresSupervision || false}
										onCheckedChange={(checked) =>
											handleInputChange("requiresSupervision", checked)
										}
									/>
									<Label htmlFor="requiresSupervision">
										Requires Supervision
									</Label>
								</div>
							</CardContent>
						</Card>

						{/* Emergency Contact */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<AlertCircle className="mr-2 h-5 w-5" />
									Emergency Contact
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="emergencyContactName">Name</Label>
										<Input
											id="emergencyContactName"
											value={(formData as any).emergencyContact?.name || ""}
											onChange={(e) =>
												handleEmergencyContactChange("name", e.target.value)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="emergencyContactRelationship">
											Relationship
										</Label>
										<Input
											id="emergencyContactRelationship"
											value={
												(formData as any).emergencyContact?.relationship || ""
											}
											onChange={(e) =>
												handleEmergencyContactChange(
													"relationship",
													e.target.value
												)
											}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="emergencyContactPhone">Phone Number</Label>
									<Input
										id="emergencyContactPhone"
										type="tel"
										value={(formData as any).emergencyContact?.phone || ""}
										onChange={(e) =>
											handleEmergencyContactChange("phone", e.target.value)
										}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Plan Manager */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<Building className="mr-2 h-5 w-5" />
									Plan Manager
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="planManagerName">Name</Label>
										<Input
											id="planManagerName"
											value={(formData as any).planManager?.name || ""}
											onChange={(e) =>
												handlePlanManagerChange("name", e.target.value)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="planManagerEmail">Email</Label>
										<Input
											id="planManagerEmail"
											type="email"
											value={(formData as any).planManager?.email || ""}
											onChange={(e) =>
												handlePlanManagerChange("email", e.target.value)
											}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Coordinator */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<User className="mr-2 h-5 w-5" />
									Coordinator
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="coordinatorName">Name</Label>
										<Input
											id="coordinatorName"
											value={(formData as any).coordinator?.name || ""}
											onChange={(e) =>
												handleCoordinatorChange("name", e.target.value)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="coordinatorEmail">Email</Label>
										<Input
											id="coordinatorEmail"
											type="email"
											value={(formData as any).coordinator?.email || ""}
											onChange={(e) =>
												handleCoordinatorChange("email", e.target.value)
											}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Preferences */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<Star className="mr-2 h-5 w-5" />
									Preferences
								</CardTitle>
								<CardDescription>
									Your preferred languages and worker genders
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								{/* Preferred Languages */}
								<div className="space-y-2">
									<Label>Preferred Languages</Label>
									<div className="flex flex-wrap gap-2 mb-2">
										{((formData as any).preferredLanguages || []).map(
											(lang: string, index: number) => (
												<Badge key={index} variant="secondary" className="pr-1">
													{lang}
													<Button
														variant="ghost"
														size="sm"
														className="h-auto p-0 ml-1"
														onClick={() =>
															removeItem("preferredLanguages", index)
														}
													>
														<X className="h-3 w-3" />
													</Button>
												</Badge>
											)
										)}
									</div>
									<div className="flex gap-2">
										<Input
											placeholder="Add preferred language"
											value={newPreferredLanguage}
											onChange={(e) => setNewPreferredLanguage(e.target.value)}
											onKeyPress={(e) =>
												e.key === "Enter" &&
												(e.preventDefault(), addPreferredLanguage())
											}
										/>
										<Button type="button" onClick={addPreferredLanguage}>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
								</div>

								{/* Preferred Genders */}
								<div className="space-y-2">
									<Label>Preferred Worker Genders</Label>
									<div className="flex flex-wrap gap-2 mb-2">
										{((formData as any).preferredGenders || []).map(
											(gender: string, index: number) => (
												<Badge key={index} variant="secondary" className="pr-1">
													{gender}
													<Button
														variant="ghost"
														size="sm"
														className="h-auto p-0 ml-1"
														onClick={() =>
															removeItem("preferredGenders", index)
														}
													>
														<X className="h-3 w-3" />
													</Button>
												</Badge>
											)
										)}
									</div>
									<div className="flex gap-2">
										<Input
											placeholder="Add preferred gender"
											value={newPreferredGender}
											onChange={(e) => setNewPreferredGender(e.target.value)}
											onKeyPress={(e) =>
												e.key === "Enter" &&
												(e.preventDefault(), addPreferredGender())
											}
										/>
										<Button type="button" onClick={addPreferredGender}>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</>
				)}

				{/* Support Worker Specific Fields */}
				{isSupportWorker && (
					<>
						{/* Skills & Expertise - Updated to use ServiceTypes */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<Briefcase className="mr-2 h-5 w-5" />
									Skills & Expertise
								</CardTitle>
								<CardDescription>
									Select the services you can provide from our available service
									types
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<div className="space-y-2">
									<Label>Selected Skills</Label>
									{((formData as any).skills || []).length === 0 ? (
										<p className="text-muted-foreground text-sm">
											No skills selected yet. Add skills from the service types
											below.
										</p>
									) : (
										<div className="flex flex-wrap gap-2 mb-2">
											{((formData as any).skills || []).map(
												(skill: any, index: number) => (
													<Badge
														key={index}
														variant="secondary"
														className="pr-1"
													>
														{skill.name}
														{skill.description && (
															<span className="text-xs text-muted-foreground ml-1">
																- {skill.description}
															</span>
														)}
														<Button
															variant="ghost"
															size="sm"
															className="h-auto p-0 ml-1"
															onClick={() => removeSkill(index)}
														>
															<X className="h-3 w-3" />
														</Button>
													</Badge>
												)
											)}
										</div>
									)}
								</div>

								{/* Add new skill from service types */}
								{availableServiceTypes.length > 0 && (
									<div className="space-y-2">
										<Label>Add Skill</Label>
										<div className="flex gap-2">
											<Select
												value={selectedServiceType}
												onValueChange={setSelectedServiceType}
											>
												<SelectTrigger className="flex-1">
													<SelectValue placeholder="Select a service type to add as skill" />
												</SelectTrigger>
												<SelectContent>
													{availableServiceTypes.map((serviceType: any) => (
														<SelectItem
															key={serviceType._id}
															value={serviceType._id}
														>
															<div className="flex flex-col">
																<span className="font-medium">
																	{serviceType.name}
																</span>
																{serviceType.description && (
																	<span className="text-xs text-muted-foreground">
																		{serviceType.description}
																	</span>
																)}
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Button
												type="button"
												onClick={addSkill}
												disabled={!selectedServiceType}
											>
												<Plus className="h-4 w-4" />
											</Button>
										</div>
									</div>
								)}

								{availableServiceTypes.length === 0 && serviceTypes && (
									<p className="text-muted-foreground text-sm">
										All available service types have been added to your skills.
									</p>
								)}
							</CardContent>
						</Card>

						{/* Languages */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<Languages className="mr-2 h-5 w-5" />
									Languages
								</CardTitle>
								<CardDescription>
									Languages you can communicate in
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<div className="flex flex-wrap gap-2 mb-2">
									{((formData as any).languages || []).map(
										(language: string, index: number) => (
											<Badge key={index} variant="secondary" className="pr-1">
												{language}
												<Button
													variant="ghost"
													size="sm"
													className="h-auto p-0 ml-1"
													onClick={() => removeItem("languages", index)}
												>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										)
									)}
								</div>
								<div className="flex gap-2">
									<Input
										placeholder="Add language"
										value={newLanguage}
										onChange={(e) => setNewLanguage(e.target.value)}
										onKeyPress={(e) =>
											e.key === "Enter" && (e.preventDefault(), addLanguage())
										}
									/>
									<Button type="button" onClick={addLanguage}>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Service Areas */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<MapPin className="mr-2 h-5 w-5" />
									Service Areas
								</CardTitle>
								<CardDescription>
									Postcodes and regions where you provide services
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<div className="flex flex-wrap gap-2 mb-2">
									{((formData as any).serviceAreas || []).map(
										(area: string, index: number) => (
											<Badge key={index} variant="secondary" className="pr-1">
												{area}
												<Button
													variant="ghost"
													size="sm"
													className="h-auto p-0 ml-1"
													onClick={() => removeItem("serviceAreas", index)}
												>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										)
									)}
								</div>
								<div className="flex gap-2">
									<Input
										placeholder="Add service area (e.g., 3000, Melbourne CBD)"
										value={newServiceArea}
										onChange={(e) => setNewServiceArea(e.target.value)}
										onKeyPress={(e) =>
											e.key === "Enter" &&
											(e.preventDefault(), addServiceArea())
										}
									/>
									<Button type="button" onClick={addServiceArea}>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Hourly Rates */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<DollarSign className="mr-2 h-5 w-5" />
									Hourly Rates
								</CardTitle>
								<CardDescription>
									Set your hourly rates for different times
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="baseRate">Base Rate ($/hour)</Label>
										<Input
											id="baseRate"
											type="number"
											min="0"
											step="0.01"
											value={(formData as any).hourlyRate?.baseRate || ""}
											onChange={(e) =>
												handleHourlyRateChange(
													"baseRate",
													parseFloat(e.target.value) || 0
												)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="weekendRate">Weekend Rate ($/hour)</Label>
										<Input
											id="weekendRate"
											type="number"
											min="0"
											step="0.01"
											value={(formData as any).hourlyRate?.weekendRate || ""}
											onChange={(e) =>
												handleHourlyRateChange(
													"weekendRate",
													parseFloat(e.target.value) || 0
												)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="holidayRate">Holiday Rate ($/hour)</Label>
										<Input
											id="holidayRate"
											type="number"
											min="0"
											step="0.01"
											value={(formData as any).hourlyRate?.holidayRate || ""}
											onChange={(e) =>
												handleHourlyRateChange(
													"holidayRate",
													parseFloat(e.target.value) || 0
												)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="overnightRate">
											Overnight Rate ($/hour)
										</Label>
										<Input
											id="overnightRate"
											type="number"
											min="0"
											step="0.01"
											value={(formData as any).hourlyRate?.overnightRate || ""}
											onChange={(e) =>
												handleHourlyRateChange(
													"overnightRate",
													parseFloat(e.target.value) || 0
												)
											}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Qualifications */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<Shield className="mr-2 h-5 w-5" />
									Qualifications
								</CardTitle>
								<CardDescription>
									Your professional qualifications and certifications
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								{/* Existing Qualifications */}
								{((formData as any).qualifications || []).map(
									(qual: any, index: number) => (
										<Card
											key={index}
											className="border-2 border-dashed border-gray-200"
										>
											<CardContent className="pt-4">
												<div className="flex justify-between items-start mb-3">
													<div className="flex-1">
														<p className="font-medium">{qual.title}</p>
														<p className="text-sm text-muted-foreground">
															{qual.issuer} •{" "}
															{new Date(qual.issueDate).getFullYear()}
															{qual.expiryDate &&
																` - ${new Date(qual.expiryDate).getFullYear()}`}
														</p>
														{qual.verified && (
															<Badge variant="outline" className="mt-1">
																<Shield className="h-3 w-3 mr-1" />
																Verified
															</Badge>
														)}
													</div>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => removeQualification(index)}
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											</CardContent>
										</Card>
									)
								)}

								{/* Add New Qualification */}
								<Card className="border-2 border-dashed border-gray-300">
									<CardContent className="pt-4">
										<div className="space-y-3">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
												<Input
													placeholder="Qualification title"
													value={newQualification.title}
													onChange={(e) =>
														setNewQualification((prev) => ({
															...prev,
															title: e.target.value,
														}))
													}
												/>
												<Input
													placeholder="Issuing organization"
													value={newQualification.issuer}
													onChange={(e) =>
														setNewQualification((prev) => ({
															...prev,
															issuer: e.target.value,
														}))
													}
												/>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
												<div className="space-y-1">
													<Label className="text-sm">Issue Date</Label>
													<Input
														type="date"
														value={newQualification.issueDate}
														onChange={(e) =>
															setNewQualification((prev) => ({
																...prev,
																issueDate: e.target.value,
															}))
														}
													/>
												</div>
												<div className="space-y-1">
													<Label className="text-sm">
														Expiry Date (optional)
													</Label>
													<Input
														type="date"
														value={newQualification.expiryDate}
														onChange={(e) =>
															setNewQualification((prev) => ({
																...prev,
																expiryDate: e.target.value,
															}))
														}
													/>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-2">
													<Checkbox
														id="qualificationVerified"
														checked={newQualification.verified}
														onCheckedChange={(checked) =>
															setNewQualification((prev) => ({
																...prev,
																verified: Boolean(checked),
															}))
														}
													/>
													<Label htmlFor="qualificationVerified">
														Verified
													</Label>
												</div>
												<Button type="button" onClick={addQualification}>
													<Plus className="h-4 w-4 mr-2" />
													Add Qualification
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</CardContent>
						</Card>

						{/* Work Experience */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<Briefcase className="mr-2 h-5 w-5" />
									Work Experience
								</CardTitle>
								<CardDescription>Your relevant work experience</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								{/* Existing Experience */}
								{((formData as any).experience || []).map(
									(exp: any, index: number) => (
										<Card
											key={index}
											className="border-2 border-dashed border-gray-200"
										>
											<CardContent className="pt-4">
												<div className="space-y-3">
													<div className="flex justify-between items-start">
														<div className="flex-1 space-y-3">
															<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
																<div className="space-y-1">
																	<Label className="text-sm">Job Title</Label>
																	<Input
																		value={exp.title || ""}
																		onChange={(e) =>
																			updateExperience(
																				index,
																				"title",
																				e.target.value
																			)
																		}
																	/>
																</div>
																<div className="space-y-1">
																	<Label className="text-sm">
																		Organization
																	</Label>
																	<Input
																		value={exp.organization || ""}
																		onChange={(e) =>
																			updateExperience(
																				index,
																				"organization",
																				e.target.value
																			)
																		}
																	/>
																</div>
															</div>
															<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
																<div className="space-y-1">
																	<Label className="text-sm">Start Date</Label>
																	<Input
																		type="date"
																		value={
																			exp.startDate
																				? new Date(exp.startDate)
																						.toISOString()
																						.split("T")[0]
																				: ""
																		}
																		onChange={(e) =>
																			updateExperience(
																				index,
																				"startDate",
																				e.target.value
																					? new Date(e.target.value)
																					: new Date()
																			)
																		}
																	/>
																</div>
																<div className="space-y-1">
																	<Label className="text-sm">
																		End Date (optional)
																	</Label>
																	<Input
																		type="date"
																		value={
																			exp.endDate
																				? new Date(exp.endDate)
																						.toISOString()
																						.split("T")[0]
																				: ""
																		}
																		onChange={(e) =>
																			updateExperience(
																				index,
																				"endDate",
																				e.target.value
																					? new Date(e.target.value)
																					: undefined
																			)
																		}
																	/>
																</div>
															</div>
															<div className="space-y-1">
																<Label className="text-sm">Description</Label>
																<Textarea
																	placeholder="Describe your role and responsibilities"
																	value={exp.description || ""}
																	onChange={(e) =>
																		updateExperience(
																			index,
																			"description",
																			e.target.value
																		)
																	}
																	className="min-h-[80px]"
																/>
															</div>
														</div>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => removeExperience(index)}
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									)
								)}

								<Button
									type="button"
									variant="outline"
									onClick={addExperience}
									className="w-full"
								>
									<Plus className="h-4 w-4 mr-2" />
									Add Experience
								</Button>
							</CardContent>
						</Card>

						{/* Availability - Updated to handle empty/undefined state */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<Clock className="mr-2 h-5 w-5" />
									Availability
								</CardTitle>
								<CardDescription>
									Set your weekly availability schedule
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								{!(formData as any).availability?.weekdays && (
									<div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
										<Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<p className="text-muted-foreground mb-4">
											No availability schedule set up yet
										</p>
										<Button
											type="button"
											onClick={ensureAvailability}
											variant="outline"
										>
											<Plus className="h-4 w-4 mr-2" />
											Set Up Availability
										</Button>
									</div>
								)}

								{(formData as any).availability?.weekdays &&
									((formData as any).availability?.weekdays || []).map(
										(day: any, dayIndex: number) => (
											<Card key={day.day} className="border border-gray-200">
												<CardContent className="pt-4">
													<div className="space-y-3">
														<div className="flex items-center justify-between">
															<div className="flex items-center space-x-2">
																<Checkbox
																	id={`${day.day}-available`}
																	checked={day.available}
																	onCheckedChange={() =>
																		toggleAvailability(dayIndex)
																	}
																/>
																<Label
																	htmlFor={`${day.day}-available`}
																	className="capitalize font-medium"
																>
																	{day.day}
																</Label>
															</div>
															{day.available && (
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={() => addTimeSlot(dayIndex)}
																>
																	<Plus className="h-3 w-3 mr-1" />
																	Add Slot
																</Button>
															)}
														</div>

														{day.available &&
															day.slots &&
															day.slots.length > 0 && (
																<div className="space-y-2 pl-6">
																	{day.slots.map(
																		(slot: any, slotIndex: number) => (
																			<div
																				key={slotIndex}
																				className="flex items-center gap-2"
																			>
																				<Input
																					type="time"
																					value={slot.start}
																					onChange={(e) =>
																						updateTimeSlot(
																							dayIndex,
																							slotIndex,
																							"start",
																							e.target.value
																						)
																					}
																					className="w-32"
																				/>
																				<span className="text-muted-foreground">
																					to
																				</span>
																				<Input
																					type="time"
																					value={slot.end}
																					onChange={(e) =>
																						updateTimeSlot(
																							dayIndex,
																							slotIndex,
																							"end",
																							e.target.value
																						)
																					}
																					className="w-32"
																				/>
																				<Button
																					type="button"
																					variant="ghost"
																					size="sm"
																					onClick={() =>
																						removeTimeSlot(dayIndex, slotIndex)
																					}
																				>
																					<X className="h-3 w-3" />
																				</Button>
																			</div>
																		)
																	)}
																</div>
															)}

														{day.available &&
															(!day.slots || day.slots.length === 0) && (
																<div className="pl-6">
																	<p className="text-sm text-muted-foreground mb-2">
																		No time slots set for this day
																	</p>
																	<Button
																		type="button"
																		variant="outline"
																		size="sm"
																		onClick={() => addTimeSlot(dayIndex)}
																	>
																		<Plus className="h-3 w-3 mr-1" />
																		Add Time Slot
																	</Button>
																</div>
															)}
													</div>
												</CardContent>
											</Card>
										)
									)}
							</CardContent>
						</Card>

						{/* Business Information */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<Building className="mr-2 h-5 w-5" />
									Business Information
								</CardTitle>
								<CardDescription>Your ABN and payment details</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<div className="space-y-2">
									<Label htmlFor="abn">Australian Business Number (ABN)</Label>
									<Input
										id="abn"
										value={(formData as any).abn || ""}
										onChange={(e) => handleInputChange("abn", e.target.value)}
										placeholder="11 digit ABN"
										maxLength={11}
									/>
								</div>

								<Separator />

								<div className="space-y-4">
									<Label className="text-base">Bank Details</Label>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="accountName">Account Name</Label>
											<Input
												id="accountName"
												value={(formData as any).bankDetails?.accountName || ""}
												onChange={(e) =>
													handleBankDetailsChange("accountName", e.target.value)
												}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="bsb">BSB</Label>
											<Input
												id="bsb"
												value={(formData as any).bankDetails?.bsb || ""}
												onChange={(e) =>
													handleBankDetailsChange("bsb", e.target.value)
												}
												placeholder="000-000"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="accountNumber">Account Number</Label>
										<Input
											id="accountNumber"
											value={(formData as any).bankDetails?.accountNumber || ""}
											onChange={(e) =>
												handleBankDetailsChange("accountNumber", e.target.value)
											}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Verification Status (Read-only) */}
						<Card className={`border-${themeColor}/10`}>
							<CardHeader className={`border-b border-${themeColor}/10`}>
								<CardTitle className={`text-${themeColor} flex items-center`}>
									<Shield className="mr-2 h-5 w-5" />
									Verification Status
								</CardTitle>
								<CardDescription>
									Your verification status (managed by administrators)
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3 pt-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-center space-x-2">
										<div
											className={`h-3 w-3 rounded-full ${
												(formData as any).verificationStatus
													?.profileSetupComplete
													? "bg-green-500"
													: "bg-gray-300"
											}`}
										/>
										<span className="text-sm">Profile Setup Complete</span>
									</div>
									<div className="flex items-center space-x-2">
										<div
											className={`h-3 w-3 rounded-full ${
												(formData as any).verificationStatus?.identityVerified
													? "bg-green-500"
													: "bg-gray-300"
											}`}
										/>
										<span className="text-sm">Identity Verified</span>
									</div>
									<div className="flex items-center space-x-2">
										<div
											className={`h-3 w-3 rounded-full ${
												(formData as any).verificationStatus
													?.policeCheckVerified
													? "bg-green-500"
													: "bg-gray-300"
											}`}
										/>
										<span className="text-sm">Police Check Verified</span>
									</div>
									<div className="flex items-center space-x-2">
										<div
											className={`h-3 w-3 rounded-full ${
												(formData as any).verificationStatus
													?.ndisWorkerScreeningVerified
													? "bg-green-500"
													: "bg-gray-300"
											}`}
										/>
										<span className="text-sm">NDIS Worker Screening</span>
									</div>
									<div className="flex items-center space-x-2">
										<div
											className={`h-3 w-3 rounded-full ${
												(formData as any).verificationStatus?.onboardingComplete
													? "bg-green-500"
													: "bg-gray-300"
											}`}
										/>
										<span className="text-sm">Onboarding Complete</span>
									</div>
									<div className="flex items-center space-x-2">
										<div
											className={`h-3 w-3 rounded-full ${
												(formData as any).verificationStatus
													?.onboardingFeeReceived
													? "bg-green-500"
													: "bg-gray-300"
											}`}
										/>
										<span className="text-sm">Onboarding Fee Received</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</>
				)}

				{/* Action Buttons */}
				<div className="flex gap-4 justify-end pt-6">
					<Button
						type="button"
						variant="outline"
						onClick={() => navigate(-1)}
						disabled={updateProfileMutation.isPending}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={updateProfileMutation.isPending || !hasChanges}
						className={`bg-${themeColor} hover:bg-${themeColor}/90`}
					>
						{updateProfileMutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Save Changes
								{hasChanges &&
									` (${
										Object.keys(getChangedFields(originalData, formData)).length
									} fields)`}
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
