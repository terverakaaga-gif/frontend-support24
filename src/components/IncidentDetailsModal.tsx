import { useState } from "react";
import { X, ExternalLink, Edit, User } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IIncident, TIncidentStatus } from "@/types/incidents.types";
import { useAuth } from "@/contexts/AuthContext";
import CreateIncidentModal from "./CreateIncidentModal";
import incidentService from "@/api/services/incidentService";

const IncidentDetailsModal = ({
	incident,
	onStatusUpdate,
	onResolve,
	onClose,
}: {
	incident: IIncident;
	onStatusUpdate: (
		id: string,
		status: TIncidentStatus,
		updatedBy: string
	) => void;
	onResolve: () => void;
	onClose: () => void;
}) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [openEditModal, setOpenEditModal] = useState(false);

	const editIncidentMutation = useMutation({
		mutationFn: (data: any) =>
			incidentService.updateIncident(incident._id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["incidents"] });
			toast.success("Incident edited successfully");
			setOpenEditModal(false);
		},
		onError: () => {
			toast.error("Failed to update incident");
		},
	});

	const handleEditIncident = (data: any) => {
		editIncidentMutation.mutate(data);
	};

	const getStatusColor = (status: string) => {
		const colors = {
			OPEN: "bg-red-100 text-red-800",
			IN_REVIEW: "bg-yellow-100 text-yellow-800",
			RESOLVED: "bg-green-100 text-green-800",
			REJECTED: "bg-gray-100 text-gray-800",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	};

	const getSeverityColor = (severity: string) => {
		const colors = {
			LOW: "bg-blue-100 text-blue-800",
			MEDIUM: "bg-orange-100 text-orange-800",
			HIGH: "bg-red-100 text-red-800",
		};
		return colors[severity] || "bg-gray-100 text-gray-800";
	};

	const formatDate = (dateString: string) =>
		new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	if (!incident) return null;

	return (
		<>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
				<Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
					<div className="flex items-center justify-between p-6 border-b border-gray-200">
						<Dialog.Title className="text-xl font-semibold text-gray-900">
							Incident Details
						</Dialog.Title>
						<Dialog.Close asChild>
							<button
								onClick={onClose}
								className="text-gray-400 hover:text-gray-600"
							>
								<X className="h-6 w-6" />
							</button>
						</Dialog.Close>
					</div>

					<div className="p-6 space-y-6">
						{/* Incident Content */}
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							{incident.title}
						</h3>
						<p className="text-gray-600">{incident.description}</p>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Status
								</label>
								<span
									className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
										incident.status
									)}`}
								>
									{incident.status.replace("_", " ")}
								</span>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Severity
								</label>
								<span
									className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(
										incident.severity
									)}`}
								>
									{incident.severity}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Reported By
								</label>
								<div className="flex items-center gap-2">
									<User className="h-4 w-4 text-gray-400" />
									<span className="text-sm text-gray-900">
										{incident.reportedBy.firstName}{" "}
										{incident.reportedBy.lastName}
									</span>
								</div>
								<p className="text-xs text-gray-500">
									{incident.reportedBy.email}
								</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Reported Against
								</label>
								<div className="flex items-center gap-2">
									<User className="h-4 w-4 text-gray-400" />
									<span className="text-sm text-gray-900">
										{incident.reportedAgainst.firstName}{" "}
										{incident.reportedAgainst.lastName}
									</span>
								</div>
								<p className="text-xs text-gray-500">
									{incident.reportedAgainst.email}
								</p>
							</div>
						</div>

						{incident.shift && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Shift Information
								</label>
								<div className="bg-gray-50 rounded-lg p-3">
									<p className="text-sm font-medium text-gray-900">
										{incident.shift.shiftId}
									</p>
									<p className="text-xs text-gray-500">
										{formatDate(incident.shift.startTime)} -{" "}
										{formatDate(incident.shift.endTime)}
									</p>
								</div>
							</div>
						)}

						{incident.urlLinks?.length > 0 && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Evidence Links
								</label>
								<div className="space-y-2">
									{incident.urlLinks.map((link, index) => (
										<a
											key={index}
											href={link}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-2 text-[#17AAEC] hover:text-[#1599D3] text-sm"
										>
											<ExternalLink className="h-4 w-4" />
											Evidence {index + 1}
										</a>
									))}
								</div>
							</div>
						)}

						{incident.status === "RESOLVED" && incident.resolutionNote && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Resolution
								</label>
								<div className="bg-green-50 border border-green-200 rounded-lg p-3">
									<p className="text-sm text-gray-900">
										{incident.resolutionNote}
									</p>
									{incident.resolvedBy && (
										<p className="text-xs text-gray-500 mt-2">
											Resolved by {incident.resolvedBy.firstName}{" "}
											{incident.resolvedBy.lastName} on{" "}
											{formatDate(incident.resolvedAt || incident.updatedAt)}
										</p>
									)}
								</div>
							</div>
						)}

						<div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
							<p>Created: {formatDate(incident.createdAt)}</p>
							<p>Last Updated: {formatDate(incident.updatedAt)}</p>
						</div>
					</div>

					<div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
						{user.role === "admin" && incident.status !== "RESOLVED" && (
							<Select.Root
								value={incident.status}
								onValueChange={(value) =>
									onStatusUpdate(
										incident._id,
										value as TIncidentStatus,
										user?._id
									)
								}
							>
								<Select.Trigger className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17AAEC] focus:border-transparent text-sm">
									<Select.Value />
									Change Status
								</Select.Trigger>
								<Select.Content className="bg-white py-3 px-2 rounded-lg shadow-lg border border-gray-200">
									<Select.Item value="OPEN">Open</Select.Item>
									<Select.Item value="IN_REVIEW">In Review</Select.Item>
									<Select.Item value="REJECTED">Rejected</Select.Item>
								</Select.Content>
							</Select.Root>
						)}

						{user.role === "supportWorker" &&
							incident.status === "OPEN" &&
							user._id === incident.reportedBy._id && (
								<button
									onClick={() => setOpenEditModal(true)}
									className="bg-[#17AAEC] text-white px-4 py-2 rounded-lg hover:bg-[#1599D3] transition-colors flex items-center gap-2"
								>
									<Edit className="h-4 w-4" />
									Edit Incident
								</button>
							)}

						<Dialog.Close asChild>
							<button
								onClick={onClose}
								className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
							>
								Close
							</button>
						</Dialog.Close>
					</div>
				</Dialog.Content>
			</Dialog.Portal>

			{/* Edit Incident Modal */}
			<Dialog.Root open={openEditModal} onOpenChange={setOpenEditModal}>
				<CreateIncidentModal
					isEditing={true}
					onClose={() => setOpenEditModal(false)}
					incident={incident}
					onSubmit={handleEditIncident}
				/>
			</Dialog.Root>
		</>
	);
};

export default IncidentDetailsModal;
