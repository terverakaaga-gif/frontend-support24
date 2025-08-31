import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import incidentService from "@/api/services/incidentService";
import { IIncident } from "@/types/incidents.types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
	ArrowLeft,
	CheckCircle,
	ChevronLeft,
	User,
	Calendar,
	FileText,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const ResolveIncidentPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [currentStep, setCurrentStep] = useState("form");
	const [resolutionNote, setResolutionNote] = useState("");

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
		data: incident,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["incident", id],
		queryFn: () => incidentService.getIncidentById(id),
	});

	const resolveIncidentMutation = useMutation({
		mutationFn: ({
			id,
			resolutionNote,
			resolvedBy,
		}: {
			id: string;
			resolutionNote: string;
			resolvedBy: string;
		}) => incidentService.resolveIncident(id, { resolutionNote, resolvedBy }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["incident", id] });
			queryClient.invalidateQueries({ queryKey: ["incidents"] });
			toast.success("Incident resolved successfully");
			navigate(-1);
		},
		onError: (error) => {
			toast.error("Failed to resolve incident");
			console.error("Error resolving incident:", error);
		},
	});

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!resolutionNote.trim()) {
			toast.error("Please provide resolution notes");
			return;
		}
		setCurrentStep("preview");
	};

	const handleConfirmSubmit = () => {
		if (incident) {
			resolveIncidentMutation.mutate({
				id: incident._id,
				resolutionNote,
				resolvedBy: user?._id,
			});
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getSeverityColor = (severity: string) => {
		const colors = {
			LOW: "bg-blue-100 text-blue-800",
			MEDIUM: "bg-orange-100 text-orange-800",
			HIGH: "bg-red-100 text-red-800",
		};
		return colors[severity] || "bg-gray-100 text-gray-800";
	};

	const renderFormStep = () => (
		<div className="max-w-6xl mx-10 p-6">
			<div className="bg-white rounded-lg shadow-sm border border-gray-200">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Resolve Incident
							</h1>
							<p className="text-gray-600 mt-1">
								Provide resolution details for the incident
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
						{/* Incident Summary */}
						{incident && (
							<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
								<h3 className="text-sm font-medium text-blue-800 mb-3">
									Incident Summary
								</h3>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<h4 className="font-semibold text-blue-900">
											{incident.title}
										</h4>
										<span
											className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(
												incident.severity
											)}`}
										>
											{incident.severity}
										</span>
									</div>
									<div className="text-sm text-blue-700 space-y-1">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4" />
											<span>
												<span className="font-medium">Reported By:</span>{" "}
												{incident.reportedBy?.firstName}{" "}
												{incident.reportedBy?.lastName}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4" />
											<span>
												<span className="font-medium">Reported On:</span>{" "}
												{formatDate(incident.createdAt)}
											</span>
										</div>
										{incident.shiftId && (
											<p>
												<span className="font-medium">Shift ID:</span>{" "}
												{incident.shiftId}
											</p>
										)}
									</div>
								</div>
							</div>
						)}

						{/* Resolution Notes */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Resolution Notes *
							</label>
							<div className="quill-wrapper">
								<ReactQuill
									theme="snow"
									value={resolutionNote}
									onChange={setResolutionNote}
									modules={quillModules}
									formats={quillFormats}
									placeholder="Describe how this incident was resolved, steps taken, and any follow-up actions. Use the formatting tools above to structure your resolution notes."
									style={{ height: "200px", marginBottom: "50px" }}
								/>
							</div>
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
							Review Resolution
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

	const renderPreviewStep = () => (
		<div className="max-w-6xl mx-10 p-6">
			<div className="bg-white rounded-lg shadow-sm border border-gray-200">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Review Resolution
							</h1>
							<p className="text-gray-600 mt-1">
								Please review your resolution details before submitting
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
					{/* Incident Details */}
					{incident && (
						<div>
							<h3 className="text-lg font-medium text-gray-900 mb-3">
								Incident Being Resolved
							</h3>
							<div className="bg-gray-50 rounded-lg p-4 border">
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-semibold text-gray-900">
										{incident.title}
									</h4>
									<span
										className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(
											incident.severity
										)}`}
									>
										{incident.severity}
									</span>
								</div>
								<div className="text-sm text-gray-600 space-y-1">
									<div className="flex items-center gap-2">
										<User className="h-4 w-4" />
										<span>
											Reported by {incident.reportedBy?.firstName}{" "}
											{incident.reportedBy?.lastName}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4" />
										<span>Reported on {formatDate(incident.createdAt)}</span>
									</div>
									{incident.shiftId && <p>Shift ID: {incident.shiftId}</p>}
								</div>
							</div>
						</div>
					)}

					{/* Resolution Notes Preview */}
					<div>
						<h3 className="text-lg font-medium text-gray-900 mb-3">
							Resolution Notes
						</h3>
						<div className="bg-green-50 rounded-lg p-4 border border-green-200">
							<div
								className="ql-editor-preview prose prose-sm max-w-none text-gray-700
									prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2
									prose-h1:text-xl prose-h1:font-bold prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-2
									prose-h2:text-lg prose-h2:font-semibold
									prose-h3:text-base prose-h3:font-medium
									prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-3
									prose-strong:text-gray-900 prose-strong:font-semibold
									prose-em:text-gray-600 prose-em:italic
									prose-ul:text-gray-700 prose-ul:my-3 prose-ul:pl-6
									prose-ol:text-gray-700 prose-ol:my-3 prose-ol:pl-6
									prose-li:text-gray-700 prose-li:my-1 prose-li:leading-relaxed
									prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
								"
								dangerouslySetInnerHTML={{ __html: resolutionNote }}
							/>
						</div>
					</div>

					{/* Resolver Information */}
					<div>
						<h3 className="text-lg font-medium text-gray-900 mb-3">
							Resolver Information
						</h3>
						<div className="bg-gray-50 rounded-lg p-4 border">
							<div className="flex items-center gap-2">
								<User className="h-5 w-5 text-gray-400" />
								<span className="text-gray-900">
									{user?.firstName} {user?.lastName}
								</span>
								<span className="text-sm text-gray-500">({user?.role})</span>
							</div>
							<div className="flex items-center gap-2 mt-1">
								<Calendar className="h-5 w-5 text-gray-400" />
								<span className="text-gray-600">
									Resolved on{" "}
									{new Date().toLocaleDateString("en-US", {
										year: "numeric",
										month: "short",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</div>
						</div>
					</div>
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
						disabled={resolveIncidentMutation.isPending}
						className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
					>
						<CheckCircle className="h-4 w-4" />
						{resolveIncidentMutation.isPending
							? "Resolving..."
							: "Resolve Incident"}
					</button>
				</div>
			</div>

			{/* Add ReactQuill-specific CSS for proper content display */}
			<style>{`
				.ql-editor-preview {
					padding: 0;
					border: none;
					outline: none;
				}
				
				.ql-editor-preview .ql-ui {
					display: none !important;
				}
				
				.ql-editor-preview ol {
					counter-reset: list-0 list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
					padding-left: 1.5rem;
				}
				
				.ql-editor-preview ol > li {
					list-style-type: none;
					counter-increment: list-0;
					position: relative;
				}
				
				.ql-editor-preview ol > li:before {
					content: counter(list-0, decimal) ". ";
					position: absolute;
					left: -1.5rem;
					color: #374151;
					font-weight: normal;
				}
				
				.ql-editor-preview ul {
					padding-left: 1.5rem;
				}
				
				.ql-editor-preview ul > li {
					list-style-type: disc;
				}
				
				.ql-editor-preview h1, .ql-editor-preview h2, .ql-editor-preview h3 {
					color: #111827;
				}
				
				.ql-editor-preview p {
					margin-bottom: 0.75rem;
					line-height: 1.6;
				}
				
				.ql-editor-preview strong {
					font-weight: 600;
				}
				
				.ql-editor-preview em {
					font-style: italic;
				}
				
				.ql-editor-preview a {
					color: #2563eb;
					text-decoration: underline;
				}
			`}</style>
		</div>
	);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-6xl mx-10 p-6">
					<div className="mb-6">
						<button
							onClick={handleGoBack}
							className="flex items-center text-[#008CFF] hover:text-[#1599D3]"
						>
							<ArrowLeft className="h-5 w-5 mr-2" />
							Back to Incident
						</button>
					</div>
					<div className="flex items-center justify-center py-12">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008CFF]"></div>
						<span className="ml-2 text-gray-600">
							Loading incident details...
						</span>
					</div>
				</div>
			</div>
		);
	}

	if (error || !incident) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-6xl mx-10 p-6">
					<div className="mb-6">
						<button
							onClick={handleGoBack}
							className="flex items-center text-[#008CFF] hover:text-[#1599D3]"
						>
							<ArrowLeft className="h-5 w-5 mr-2" />
							Back to Incident
						</button>
					</div>
					<div className="flex flex-col items-center justify-center py-12 space-y-4">
						<div className="text-red-500 text-center">
							Error loading incident details
						</div>
						<button
							onClick={handleGoBack}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{currentStep === "form" && renderFormStep()}
			{currentStep === "preview" && renderPreviewStep()}
		</div>
	);
};

export default ResolveIncidentPage;
