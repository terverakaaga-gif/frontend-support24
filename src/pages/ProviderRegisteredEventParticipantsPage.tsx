import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AltArrowLeft,
  AltArrowRight,
  CheckCircle,
  CloseCircle,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
  ApprovalActionModal,
  ActionType,
  EntityData,
} from "@/components/provider/ApprovalActionModal";
import { toast } from "sonner";

// Mock event data
const mockEvent = {
  id: 1,
  title: "Local City Tour, 2025",
  date: "22nd Nov - 29 Nov, 2025",
  time: "8:00 AM - 12:00 PM",
  location: "Albion Park, AU",
};

// Define participant type
interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  reason: string;
  avatar: string | null;
}

// Mock participants data
const mockParticipants: Record<string, Participant[]> = {
  new: Array(12)
    .fill({
      id: 1,
      name: "John Doe Singh",
      email: "johndoe@gmail.com",
      phone: "+61 8654245534",
      location: "Albion Park, AU",
      reason: "I wanna tour round the city, it's my first time",
      avatar: null,
    })
    .map((p, i) => ({ ...p, id: i + 1, name: `${p.name} ${i + 1}` })),
  accepted: Array(19)
    .fill({
      id: 0,
      name: "John Doe Singh",
      email: "johndoe@gmail.com",
      phone: "+61 8654245534",
      location: "Albion Park, AU",
      reason: "I wanna tour round the city, it's my first time",
      avatar: null,
    })
    .map((p, i) => ({ ...p, id: i + 100, name: `${p.name} ${i + 1}` })),
  rejected: [
    {
      id: 300,
      name: "John Doe Singh",
      email: "johndoe@gmail.com",
      phone: "+61 8654245534",
      location: "Albion Park, AU",
      reason: "I wanna tour round the city, it's my first time",
      avatar: null,
    },
  ],
};

type TabType = "new" | "accepted" | "rejected";

export default function ProviderRegisteredEventParticipantsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { eventId } = useParams();
  const [currentTab, setCurrentTab] = useState<TabType>("new");
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [actionType, setActionType] = useState<ActionType>("accept");
  const [isProcessing, setIsProcessing] = useState(false);

  // Get current participants based on tab
  const currentParticipants = mockParticipants[currentTab];

  // Pagination
  const totalPages = Math.ceil(
    currentParticipants.length / parseInt(entriesPerPage)
  );
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const paginatedParticipants = currentParticipants.slice(startIndex, endIndex);

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    setCurrentPage(1);
  };

  const openActionModal = (participant: Participant, action: ActionType) => {
    setSelectedParticipant(participant);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async (data: {
    entityId: number | string;
    reason?: string;
  }) => {
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log(`${actionType} participant:`, data);

      if (actionType === "accept") {
        toast.success(`${selectedParticipant?.name} has been accepted`);
      } else {
        toast.success(`${selectedParticipant?.name} has been rejected`);
      }

      setIsModalOpen(false);
      setSelectedParticipant(null);

      // In real app, refetch data or update local state
    } catch (error) {
      console.error("Error processing action:", error);
      toast.error("Failed to process action. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert participant to EntityData format for the modal
  const getEntityData = (participant: Participant | null): EntityData | null => {
    if (!participant) return null;
    return {
      id: participant.id,
      name: participant.name,
      email: participant.email,
      phone: participant.phone,
      location: participant.location,
      reason: participant.reason,
      avatar: participant.avatar,
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="">
        {/* Header */}
        <GeneralHeader
          showBackButton
          stickyTop={false}
          title={mockEvent.title}
          subtitle=""
          user={user}
          onLogout={logout}
          onViewProfile={() => navigate("/provider/profile")}
        />

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                onClick={() => handleTabChange("new")}
                className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                  currentTab === "new"
                    ? "hover:bg-white"
                    : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
                }`}
              >
                New {mockParticipants.new.length}
              </Button>
              <Button
                size="sm"
                onClick={() => handleTabChange("accepted")}
                className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                  currentTab === "accepted"
                    ? "hover:bg-white"
                    : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
                }`}
              >
                Accepted {mockParticipants.accepted.length}
              </Button>
              <Button
                size="sm"
                onClick={() => handleTabChange("rejected")}
                className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                  currentTab === "rejected"
                    ? "hover:bg-white"
                    : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
                }`}
              >
                Rejected {mockParticipants.rejected.length}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-white">
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Participant Name
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden md:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden lg:table-cell">
                    Phone Number
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden xl:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden xl:table-cell">
                    Reason for Attending
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 bg-white">
                {paginatedParticipants.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-4 md:px-6 py-12 text-center text-gray-500"
                    >
                      No {currentTab} participants found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedParticipants.map((participant, index) => (
                    <TableRow
                      key={participant.id + "-" + index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-gray-600 text-sm font-semibold">
                            {participant.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-900 block">
                              {participant.name}
                            </span>
                            <span className="text-xs text-gray-500 md:hidden">
                              {participant.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                        {participant.email}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {participant.phone}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">
                        {participant.location}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">
                        <p className="line-clamp-2">{participant.reason}</p>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-right">
                        {currentTab === "new" ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => openActionModal(participant, "accept")}
                              title="Accept"
                              className="p-1 hover:bg-green-50 rounded-full transition-colors"
                            >
                              <CheckCircle className="h-5 w-5 text-primary" />
                            </button>
                            <button
                              onClick={() => openActionModal(participant, "reject")}
                              title="Reject"
                              className="p-1 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <CloseCircle className="h-5 w-5 text-red-600" />
                            </button>
                          </div>
                        ) : currentTab === "accepted" ? (
                          <button
                            onClick={() => openActionModal(participant, "reject")}
                            title="Reject"
                            className="flex items-center justify-end p-1 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <CloseCircle className="h-5 w-5 text-red-600" />
                          </button>
                        ) : (
                          <button
                            onClick={() => openActionModal(participant, "accept")}
                            title="Accept"
                            className="flex items-center justify-end p-1 hover:bg-green-50 rounded-full transition-colors"
                          >
                            <CheckCircle className="h-5 w-5 text-primary" />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {paginatedParticipants.length > 0 && (
            <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Showing</span>
                <Select
                  value={entriesPerPage}
                  onValueChange={(value) => {
                    setEntriesPerPage(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <span>entries</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 h-9 w-9"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <AltArrowLeft className="h-4 w-4" />
                </Button>
                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 ${
                      currentPage === page
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 h-9 w-9"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <AltArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approval Action Modal */}
      <ApprovalActionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedParticipant(null);
        }}
        onConfirm={handleConfirmAction}
        entity={getEntityData(selectedParticipant)}
        entityType="event-participant"
        actionType={actionType}
        isLoading={isProcessing}
        contextTitle={mockEvent.title}
      />
    </div>
  );
}