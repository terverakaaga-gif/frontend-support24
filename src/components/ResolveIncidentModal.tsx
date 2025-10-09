import { useAuth } from "@/contexts/AuthContext";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";

const ResolveIncidentModal = ({
	incidentId,
	onResolve,
	onClose,
}: {
	incidentId: string;
	onResolve: (id: string, resolutionNote: string, resolvedBy: string) => void;
	onClose: () => void;
}) => {
	const [resolutionNote, setResolutionNote] = useState("");
	const { user } = useAuth();

	return (
		<Dialog.Portal>
			<Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
			<Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg max-w-md w-full">
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<Dialog.Title className="text-xl font-montserrat-semibold text-gray-900">
						Resolve Incident
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

				<form
					onSubmit={(e) => {
						e.preventDefault();
						onResolve(incidentId, resolutionNote, user?._id);
					}}
				>
					<div className="p-6">
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Resolution Notes *
							</label>
							<textarea
								name="resolutionNote"
								required
								rows={4}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#17AAEC] focus:border-transparent"
								placeholder="Describe how this incident was resolved..."
								value={resolutionNote}
								onChange={(e) => setResolutionNote(e.target.value)}
							/>
						</div>
					</div>

					<div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
						<Dialog.Close asChild>
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
							className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
						>
							Resolve Incident
						</button>
					</div>
				</form>
			</Dialog.Content>
		</Dialog.Portal>
	);
};

export default ResolveIncidentModal;
