import { useState, useEffect } from "react";
import { X, Search, Upload, FileText, ChevronLeft, Check } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import shiftService from "@/api/services/shiftService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Shift {
	_id: string;
	shiftId: string;
	participantId: {
		firstName: string;
		lastName: string;
	};
	startTime: string;
	endTime: string;
	serviceType: string;
	status: string;
}

interface IncidentFormData {
	title: string;
	description: string;
	severity: string;
	shiftId: string;
	urlLinks: string[];
}

type FormStep = "form" | "preview" | "confirmation";

const CreateIncidentModal = ({
	onSubmit,
	isEditing = false,
	incident,
	onClose,
}: {
	onSubmit: (data: any) => void;
	isEditing?: boolean;
	incident?: any;
	onClose: () => void;
}) => {
	const [currentStep, setCurrentStep] = useState<FormStep>("form");
	const [formData, setFormData] = useState<IncidentFormData>({
		title: "",
		description: "",
		severity: "",
		shiftId: "",
		urlLinks: [],
	});
	const [showShiftModal, setShowShiftModal] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	// Initialize form data based on editing mode
	useEffect(() => {
		if (isEditing && incident) {
			setFormData({
				title: incident.title || "",
				description: incident.description || "",
				severity: incident.severity || "",
				shiftId: incident.shift?.shiftId || "",
				urlLinks: incident.urlLinks || [],
			});
		}
	}, [isEditing, incident]);

	const {
		data: shifts,
		isLoading: isShiftsLoading,
		error: shiftsError,
	} = useQuery({
		queryKey: ["shifts"],
		queryFn: () => shiftService.getShifts(),
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			setSelectedFiles(files);
			setFormData((prev) => ({
				...prev,
				urlLinks: [...prev.urlLinks, ...files.map((file) => file.name)],
			}));
		}
	};

	const handleShiftSelect = (shift: Shift) => {
		setFormData((prev) => ({ ...prev, shiftId: shift.shiftId }));
		setShowShiftModal(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentStep("preview");
	};

	const handleConfirmSubmit = async () => {
		if (!formData.shiftId) {
			toast.error("Please select a shift");
			return;
		}

		try {
			if (isEditing) {
				await onSubmit({
					description: formData.description,
					severity: formData.severity,
					title: formData.title,
					urlLinks: formData.urlLinks,
					// ...(isEditing && incident && { _id: incident._id }),
				});
			} else {
				await onSubmit({
					...formData,
				});
			}

			onClose(); // close after successful submit
		} catch (err) {
			toast.error("Failed to submit incident");
		}
	};

	const filteredShifts = shifts?.filter((shift) => {
		const searchLower = searchTerm.toLowerCase();
		const participant = shift.participantId;
		const hasFirstName =
			typeof participant === "object" &&
			participant !== null &&
			"firstName" in participant;
		const hasLastName =
			typeof participant === "object" &&
			participant !== null &&
			"lastName" in participant;

		return (
			shift.shiftId.toLowerCase().includes(searchLower) ||
			(hasFirstName &&
				participant.firstName.toLowerCase().includes(searchLower)) ||
			(hasLastName &&
				participant.lastName.toLowerCase().includes(searchLower)) ||
			shift.serviceType.toLowerCase().includes(searchLower)
		);
	});

	const getSelectedShift = () => {
		return shifts?.find((shift) => shift.shiftId === formData.shiftId);
	};

	const renderFormStep = () => (
		<form onSubmit={handleSubmit}>
			<div className="p-6 space-y-4">
				<div>
					<label className="block text-sm font-montserrat-semibold text-gray-700 mb-2">
						Title *
					</label>
					<input
						type="text"
						name="title"
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17AAEC] focus:border-transparent"
						placeholder="Brief description of the incident"
						value={formData.title}
						onChange={handleChange}
					/>
				</div>

				<div>
					<label className="block text-sm font-montserrat-semibold text-gray-700 mb-2">
						Description *
					</label>
					<textarea
						name="description"
						required
						rows={4}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17AAEC] focus:border-transparent"
						placeholder="Detailed description of what happened..."
						value={formData.description}
						onChange={handleChange}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-montserrat-semibold text-gray-700 mb-2">
							Severity *
						</label>
						<select
							name="severity"
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17AAEC] focus:border-transparent"
							value={formData.severity}
							onChange={handleChange}
						>
							<option value="">Select severity</option>
							<option value="LOW">Low</option>
							<option value="MEDIUM">Medium</option>
							<option value="HIGH">High</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-montserrat-semibold text-gray-700 mb-2">
							Shift *
						</label>
						<div className="flex gap-2">
							<input
								type="text"
								className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17AAEC] focus:border-transparent ${
									isEditing && "cursor-not-allowed"
								}`}
								placeholder="Select a shift"
								value={formData.shiftId}
								readOnly
								disabled={isEditing}
							/>
							<button
								disabled={isEditing}
								type="button"
								onClick={() => setShowShiftModal(true)}
								className={`bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors ${
									isEditing && "cursor-not-allowed"
								}`}
							>
								Select
							</button>
						</div>
					</div>
				</div>

				<div>
					<label className="block text-sm font-montserrat-semibold text-gray-700 mb-2">
						Evidence (Optional)
					</label>
					<div className="flex items-center gap-4">
						<label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
							<Upload className="h-4 w-4" />
							Upload Files
							<input
								type="file"
								className="hidden"
								onChange={handleFileChange}
								multiple
							/>
						</label>
						{(selectedFiles.length > 0 || formData.urlLinks.length > 0) && (
							<span className="text-sm text-gray-600">
								{selectedFiles.length + formData.urlLinks.length} file(s)
								selected
							</span>
						)}
					</div>
					{(selectedFiles.length > 0 || formData.urlLinks.length > 0) && (
						<div className="mt-2 space-y-2">
							{selectedFiles.map((file, index) => (
								<div
									key={`new-${index}`}
									className="flex items-center gap-2 text-sm"
								>
									<FileText className="h-4 w-4 text-gray-1000" />
									<span>{file.name}</span>
									<span className="text-xs text-gray-400">
										{(file.size / 1024).toFixed(1)} KB
									</span>
								</div>
							))}
							{isEditing &&
								formData.urlLinks.map((link, index) => (
									<div
										key={`existing-${index}`}
										className="flex items-center gap-2 text-sm"
									>
										<FileText className="h-4 w-4 text-gray-1000" />
										<span>{link}</span>
									</div>
								))}
						</div>
					)}
				</div>
			</div>

			<div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
				<Dialog.Close>
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
					>
						Cancel
					</button>
				</Dialog.Close>
				<button
					type="submit"
					className="bg-[#17AAEC] text-white px-4 py-2 rounded-lg hover:bg-[#1599D3] transition-colors"
				>
					{isEditing ? "Review Update" : "Create Incident"}
				</button>
			</div>
		</form>
	);

	const renderPreviewStep = () => {
		const selectedShift = getSelectedShift();

		return (
			<div className="p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-montserrat-semibold text-gray-900">
						{isEditing ? "Review Incident Update" : "Review Incident Details"}
					</h2>
					<button
						onClick={() => setCurrentStep("form")}
						className="text-[#17AAEC] hover:text-[#1599D3] flex items-center gap-1"
					>
						<ChevronLeft className="h-4 w-4" />
						Edit
					</button>
				</div>

				<div className="space-y-6">
					<div className="bg-gray-100 rounded-lg p-4">
						<h3 className="font-montserrat-semibold text-gray-900">{formData.title}</h3>
						<p className="text-gray-600 mt-2">{formData.description}</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-montserrat-semibold text-gray-1000 mb-1">
								Severity
							</label>
							<span
								className={`inline-flex px-2 py-1 text-xs font-montserrat-semibold rounded-full ${
									formData.severity === "LOW"
										? "bg-primary-100 text-primary-800"
										: formData.severity === "MEDIUM"
										? "bg-orange-100 text-orange-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{formData.severity}
							</span>
						</div>

						<div>
							<label className="block text-sm font-montserrat-semibold text-gray-1000 mb-1">
								Shift ID
							</label>
							<p className="text-gray-900">{formData.shiftId}</p>
						</div>
					</div>

					{selectedShift && (
						<div>
							<label className="block text-sm font-montserrat-semibold text-gray-1000 mb-1">
								Shift Details
							</label>
							<div className="bg-gray-100 rounded-lg p-3">
								<p className="text-sm font-montserrat-semibold text-gray-900">
									{typeof selectedShift.participantId === "object" &&
									selectedShift.participantId !== null
										? `${selectedShift.participantId.firstName} ${selectedShift.participantId.lastName}`
										: String(selectedShift.participantId)}
								</p>
								<p className="text-xs text-gray-1000 mt-1">
									{new Date(selectedShift.startTime).toLocaleString()} -{" "}
									{new Date(selectedShift.endTime).toLocaleString()}
								</p>
							</div>
						</div>
					)}

					{(selectedFiles.length > 0 || formData.urlLinks.length > 0) && (
						<div>
							<label className="block text-sm font-montserrat-semibold text-gray-1000 mb-1">
								Evidence Files
							</label>
							<div className="space-y-2">
								{selectedFiles.map((file, index) => (
									<div
										key={`preview-new-${index}`}
										className="flex items-center gap-2 text-sm"
									>
										<FileText className="h-4 w-4 text-gray-1000" />
										<span>{file.name}</span>
									</div>
								))}
								{isEditing &&
									formData.urlLinks.map((link, index) => (
										<div
											key={`preview-existing-${index}`}
											className="flex items-center gap-2 text-sm"
										>
											<FileText className="h-4 w-4 text-gray-1000" />
											<span>{link}</span>
										</div>
									))}
							</div>
						</div>
					)}
				</div>

				<div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
					<Dialog.Close>
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
						>
							Cancel
						</button>
					</Dialog.Close>
					<button
						type="button"
						onClick={handleConfirmSubmit}
						className="bg-[#17AAEC] text-white px-4 py-2 rounded-lg hover:bg-[#1599D3] transition-colors flex items-center gap-2"
					>
						<Check className="h-4 w-4" />
						{isEditing ? "Confirm Update" : "Confirm Incident"}
					</button>
				</div>
			</div>
		);
	};

	const renderConfirmationStep = () => (
		<div className="p-6 text-center">
			<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
				<Check className="h-6 w-6 text-green-600" />
			</div>
			<h3 className="text-lg font-montserrat-semibold text-gray-900 mb-2">
				{isEditing
					? "Incident Updated Successfully"
					: "Incident Created Successfully"}
			</h3>
			<p className="text-sm text-gray-1000 mb-6">
				{isEditing
					? "Your incident has been updated."
					: "Your incident has been submitted for review."}
			</p>
			<button
				onClick={onClose}
				className="bg-[#17AAEC] text-white px-4 py-2 rounded-lg hover:bg-[#1599D3] transition-colors"
			>
				Close
			</button>
		</div>
	);

	return (
		<Dialog.Portal>
			<Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-[100]" />
			<Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto z-[101]">
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<Dialog.Title className="text-xl font-montserrat-semibold text-gray-900">
						{isEditing ? "Review" : "Create"} Incident
					</Dialog.Title>
				</div>
				{currentStep === "form" && renderFormStep()}
				{currentStep === "preview" && renderPreviewStep()}
				{/* {currentStep === "confirmation" && renderConfirmationStep()} */}
			</Dialog.Content>

			{/* Shift Selection Modal */}
			{showShiftModal && (
				<Dialog.Root open={showShiftModal} onOpenChange={setShowShiftModal}>
					<Dialog.Portal>
						<Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-[102]" />
						<Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto z-[103]">
							<div className="flex items-center justify-between p-6 border-b border-gray-200">
								<Dialog.Title className="text-xl font-montserrat-semibold text-gray-900">
									Select Shift
								</Dialog.Title>
								<Dialog.Close asChild>
									<button className="text-gray-400 hover:text-gray-600">
										<X className="h-6 w-6" />
									</button>
								</Dialog.Close>
							</div>

							<div className="p-6">
								<div className="mb-4">
									<div className="relative">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
										<input
											type="text"
											placeholder="Search shifts..."
											className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17AAEC] focus:border-transparent w-full"
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
									</div>
								</div>

								{isShiftsLoading ? (
									<div className="flex justify-center py-8">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
									</div>
								) : shiftsError ? (
									<div className="text-red-500 py-8 text-center">
										Error loading shifts
									</div>
								) : (
									<div className="space-y-4">
										{filteredShifts?.length ? (
											filteredShifts.map((shift) => (
												<div
													key={shift._id}
													className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-100 ${
														formData.shiftId === shift.shiftId
															? "border-[#17AAEC] bg-primary-100"
															: "border-gray-200"
													}`}
													onClick={() => handleShiftSelect(shift as Shift)}
												>
													<div className="flex justify-between items-start">
														<div>
															<h3 className="font-montserrat-semibold text-gray-900">
																{typeof shift.participantId === "object" &&
																shift.participantId !== null
																	? `${shift.participantId.firstName} ${shift.participantId.lastName}`
																	: String(shift.participantId)}
															</h3>
															<p className="text-sm text-gray-1000">
																{shift.serviceType}
															</p>
														</div>
														<span
															className={`px-2 py-1 text-xs rounded-full ${
																shift.status === "completed"
																	? "bg-green-100 text-green-800"
																	: shift.status === "pending"
																	? "bg-yellow-100 text-yellow-800"
																	: "bg-gray-100 text-gray-800"
															}`}
														>
															{shift.status}
														</span>
													</div>
													<div className="mt-2 text-sm">
														<p>
															<span className="font-montserrat-semibold">Shift ID:</span>{" "}
															{shift.shiftId}
														</p>
														<p>
															<span className="font-montserrat-semibold">Time:</span>{" "}
															{new Date(shift.startTime).toLocaleString()} -{" "}
															{new Date(shift.endTime).toLocaleString()}
														</p>
													</div>
												</div>
											))
										) : (
											<div className="text-center py-8 text-gray-1000">
												No shifts found
											</div>
										)}
									</div>
								)}
							</div>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			)}
		</Dialog.Portal>
	);
};

export default CreateIncidentModal;
