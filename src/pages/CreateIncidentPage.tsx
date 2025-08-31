import React, { useState, useRef, useCallback, useEffect } from "react";
import {
	Search,
	Upload,
	FileText,
	ChevronLeft,
	Check,
	X,
	ArrowLeft,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import shiftService from "@/api/services/shiftService";
import incidentService from "@/api/services/incidentService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreateIncidentDTO } from "@/types/incidents.types";

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

const CreateIncidentPage = () => {
	const [currentStep, setCurrentStep] = useState("form");
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		severity: "",
		shiftId: "",
		urlLinks: [],
	});
	const [showShiftModal, setShowShiftModal] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// ReactQuill configuration
	const quillModules = {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			["bold", "italic", "underline"],
			[{ list: "ordered" }, { list: "bullet" }],
			[{ align: [] }],
			["link"],
			["clean"],
		],
	};

	const quillFormats = [
		"header",
		"bold",
		"italic",
		"underline",
		"list",
		"bullet",
		"align",
		"link",
	];

	const {
		data: shifts,
		isLoading: isShiftsLoading,
		error: shiftsError,
	} = useQuery({
		queryKey: ["shifts"],
		queryFn: () => shiftService.getShifts(),
	});

	const createIncidentMutation = useMutation<
		CreateIncidentDTO, // Response type
		Error, // Error type
		IncidentFormData // Variables type (payload)
	>({
		mutationFn: async (data: IncidentFormData) =>
			await incidentService.createIncident(data as CreateIncidentDTO),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["incidents"] });
			toast.success("Incident created successfully");
			navigate(-1);
		},
		onError: (error) => {
			toast.error("Failed to create incident");
			console.error("Error creating incident:", error);
		},
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleDescriptionChange = (content: string) => {
		setFormData((prev) => ({ ...prev, description: content }));
	};

	const handleFileChange = (e) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			setSelectedFiles(files);
			setFormData((prev) => ({
				...prev,
				urlLinks: [...prev.urlLinks, ...files.map((file: File) => file.name)],
			}));
		}
	};

	const handleShiftSelect = (shift) => {
		setFormData((prev) => ({ ...prev, shiftId: shift.shiftId }));
		setShowShiftModal(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setCurrentStep("preview");
	};

	const handleConfirmSubmit = () => {
		if (!formData.shiftId) {
			toast.error("Please select a shift");
			return;
		}

		// Remove reportedBy from the data being sent - let backend handle it
		const submitData = {
			title: formData.title,
			description: formData.description,
			severity: formData.severity,
			shiftId: formData.shiftId,
			urlLinks: formData.urlLinks,
		};

		createIncidentMutation.mutate(submitData);
	};

	const handleGoBack = () => {
		navigate(-1); // This will navigate to the previous page in history
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
		<div className="max-w-6xl mx-10 p-6">
			<div className="bg-white rounded-lg shadow-sm border border-gray-200">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Create Incident
							</h1>
							<p className="text-gray-600 mt-1">
								Fill in the details below to report an incident
							</p>
						</div>
						<button
							onClick={handleGoBack}
							className="flex items-center text-[#008CFF] hover:text-[#1599D3] transition-colors"
						>
							<ArrowLeft className="h-5 w-5 mr-2" />
							Back
						</button>
					</div>
				</div>

				<div className="p-6">
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Title *
							</label>
							<input
								type="text"
								name="title"
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008CFF] focus:border-transparent"
								placeholder="Brief description of the incident"
								value={formData.title}
								onChange={handleChange}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description *
							</label>
							<div className="quill-wrapper">
								<ReactQuill
									theme="snow"
									value={formData.description}
									onChange={handleDescriptionChange}
									modules={quillModules}
									formats={quillFormats}
									placeholder="Provide a detailed description of what happened. Use the formatting tools above to structure your report."
									style={{ height: "200px", marginBottom: "50px" }}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Severity *
								</label>
								<select
									name="severity"
									required
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008CFF] focus:border-transparent"
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
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Shift *
								</label>
								<div className="flex gap-2">
									<input
										type="text"
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008CFF] focus:border-transparent"
										placeholder="Select a shift"
										value={formData.shiftId}
										readOnly
									/>
									<button
										type="button"
										onClick={() => setShowShiftModal(true)}
										className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
									>
										Select Shift
									</button>
								</div>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
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
								{selectedFiles.length > 0 && (
									<span className="text-sm text-gray-600">
										{selectedFiles.length} file(s) selected
									</span>
								)}
							</div>
							{selectedFiles.length > 0 && (
								<div className="mt-3 space-y-2">
									{selectedFiles.map((file, index) => (
										<div
											key={index}
											className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded"
										>
											<FileText className="h-4 w-4 text-gray-500" />
											<span>{file.name}</span>
											<span className="text-xs text-gray-400">
												{(file.size / 1024).toFixed(1)} KB
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					<div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
						<button
							type="button"
							onClick={handleGoBack}
							className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							className="bg-[#008CFF] text-white px-6 py-2 rounded-lg hover:bg-[#008CFF]/90 transition-colors"
						>
							Review Incident
						</button>
					</div>
				</div>
			</div>

			{/* Custom styles for ReactQuill */}
			<style>
				{`
				.quill-wrapper .ql-toolbar {
					border: 1px solid #d1d5db;
					border-bottom: none;
					border-top-left-radius: 0.5rem;
					border-top-right-radius: 0.5rem;
				}

				.quill-wrapper .ql-container {
					border: 1px solid #d1d5db;
					border-bottom-left-radius: 0.5rem;
					border-bottom-right-radius: 0.5rem;
				}

				.quill-wrapper .ql-editor {
					min-height: 120px;
				}

				.quill-wrapper .ql-editor.ql-blank::before {
					font-style: normal;
					color: #9ca3af;
				}

				.quill-wrapper .ql-toolbar.ql-snow {
					border-color: #d1d5db;
				}

				.quill-wrapper .ql-container.ql-snow {
					border-color: #d1d5db;
				}

				.quill-wrapper .ql-editor:focus {
					outline: none;
				}

				.quill-wrapper:focus-within .ql-toolbar,
				.quill-wrapper:focus-within .ql-container {
					border-color: #008cff;
					box-shadow: 0 0 0 2px rgba(0, 140, 255, 0.1);
				}
				`}
			</style>
		</div>
	);

	const renderPreviewStep = () => {
		const selectedShift = getSelectedShift();

		return (
			<div className="max-w-6xl mx-auto p-6">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200">
					<div className="p-6 border-b border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									Review Incident
								</h1>
								<p className="text-gray-600 mt-1">
									Please review your incident details before submitting
								</p>
							</div>
							<button
								onClick={() => setCurrentStep("form")}
								className="text-[#008CFF] hover:text-[#1599D3] flex items-center gap-1"
							>
								<ChevronLeft className="h-4 w-4" />
								Edit
							</button>
						</div>
					</div>

					<div className="p-6 space-y-6">
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								{formData.title}
							</h3>
							<div
								className="prose max-w-none text-gray-600 bg-gray-50 rounded-lg p-4"
								dangerouslySetInnerHTML={{ __html: formData.description }}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-500 mb-1">
									Severity
								</label>
								<span
									className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
										formData.severity === "LOW"
											? "bg-blue-100 text-blue-800"
											: formData.severity === "MEDIUM"
											? "bg-orange-100 text-orange-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{formData.severity}
								</span>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-500 mb-1">
									Shift ID
								</label>
								<p className="text-gray-900">{formData.shiftId}</p>
							</div>
						</div>

						{selectedShift && (
							<div>
								<label className="block text-sm font-medium text-gray-500 mb-1">
									Shift Details
								</label>
								<div className="bg-gray-50 rounded-lg p-3">
									<p className="text-sm font-medium text-gray-900">
										{typeof selectedShift.participantId === "object" &&
										selectedShift.participantId !== null
											? `${selectedShift.participantId.firstName} ${selectedShift.participantId.lastName}`
											: String(selectedShift.participantId)}
									</p>
									<p className="text-xs text-gray-500 mt-1">
										{new Date(selectedShift.startTime).toLocaleString()} -{" "}
										{new Date(selectedShift.endTime).toLocaleString()}
									</p>
									<p className="text-xs text-gray-500">
										{selectedShift.serviceType}
									</p>
								</div>
							</div>
						)}

						{selectedFiles.length > 0 && (
							<div>
								<label className="block text-sm font-medium text-gray-500 mb-1">
									Evidence Files
								</label>
								<div className="space-y-2">
									{selectedFiles.map((file, index) => (
										<div
											key={index}
											className="flex items-center gap-2 text-sm"
										>
											<FileText className="h-4 w-4 text-gray-500" />
											<span>{file.name}</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
						<button
							type="button"
							onClick={() => setCurrentStep("form")}
							className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
						>
							Back to Edit
						</button>
						<button
							type="button"
							onClick={handleConfirmSubmit}
							disabled={createIncidentMutation.isPending}
							className="bg-[#008CFF] text-white px-6 py-2 rounded-lg hover:bg-[#1599D3] transition-colors flex items-center gap-2 disabled:opacity-50"
						>
							<Check className="h-4 w-4" />
							{createIncidentMutation.isPending
								? "Submitting..."
								: "Submit Incident"}
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{currentStep === "form" && renderFormStep()}
			{currentStep === "preview" && renderPreviewStep()}

			{/* Shift Selection Modal */}
			{showShiftModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<h2 className="text-xl font-semibold text-gray-900">
								Select Shift
							</h2>
							<button
								onClick={() => setShowShiftModal(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								<X className="h-6 w-6" />
							</button>
						</div>

						<div className="p-6">
							<div className="mb-4">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<input
										type="text"
										placeholder="Search shifts..."
										className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008CFF] focus:border-transparent w-full"
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
												className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
													formData.shiftId === shift.shiftId
														? "border-[#008CFF] bg-blue-50"
														: "border-gray-200"
												}`}
												onClick={() => handleShiftSelect(shift)}
											>
												<div className="flex justify-between items-start">
													<div>
														<h3 className="font-medium text-gray-900">
															{typeof shift.participantId === "object" &&
															shift.participantId !== null
																? `${shift.participantId.firstName} ${shift.participantId.lastName}`
																: String(shift.participantId)}
														</h3>
														<p className="text-sm text-gray-500">
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
														<span className="font-medium">Shift ID:</span>{" "}
														{shift.shiftId}
													</p>
													<p>
														<span className="font-medium">Time:</span>{" "}
														{new Date(shift.startTime).toLocaleString()} -{" "}
														{new Date(shift.endTime).toLocaleString()}
													</p>
												</div>
											</div>
										))
									) : (
										<div className="text-center py-8 text-gray-500">
											No shifts found
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CreateIncidentPage;
