import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AltArrowLeft,
  AltArrowRight,
  CheckCircle,
  CloseCircle,
  ChatLine,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";
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

// Mock accommodation data
const mockAccommodation = {
  id: 1,
  title: "Ocean View Apartment",
  location: "123 Beach Road, Wollongong, NSW 2500",
};

// Define interested user type
interface InterestedUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  ndisNumber: string;
  message: string;
  avatar: string | null;
  submittedAt: string;
}

// Mock interested users data
const mockInterestedUsers: Record<string, InterestedUser[]> = {
  new: Array(8)
    .fill({
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@gmail.com",
      phone: "+61 4123 456 789",
      ndisNumber: "123456789",
      message:
        "I'm very interested in this property. It looks perfect for my needs.",
      avatar: null,
      submittedAt: "2025-11-15T10:30:00Z",
    })
    .map((p, i) => ({ ...p, id: i + 1, name: `Sarah Johnson ${i + 1}` })),
  approved: Array(12)
    .fill({
      id: 0,
      name: "Michael Chen",
      email: "michael.chen@gmail.com",
      phone: "+61 4987 654 321",
      ndisNumber: "987654321",
      message: "Looking for accessible housing close to public transport.",
      avatar: null,
      submittedAt: "2025-11-10T14:20:00Z",
    })
    .map((p, i) => ({ ...p, id: i + 100, name: `Michael Chen ${i + 1}` })),
  rejected: [
    {
      id: 300,
      name: "Emma Wilson",
      email: "emma.wilson@gmail.com",
      phone: "+61 4555 123 456",
      ndisNumber: "555123456",
      message: "Interested in short-term lease.",
      avatar: null,
      submittedAt: "2025-11-08T09:15:00Z",
    },
  ],
};

type TabType = "new" | "approved" | "rejected";

export default function ProviderAccommodationInterestedUsersPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { accommodationId } = useParams();
  const [currentTab, setCurrentTab] = useState<TabType>("new");
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<InterestedUser | null>(null);
  const [actionType, setActionType] = useState<ActionType>("accept");
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUsers = mockInterestedUsers[currentTab];

  // Pagination
  const totalPages = Math.ceil(currentUsers.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const paginatedUsers = currentUsers.slice(startIndex, endIndex);

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    setCurrentPage(1);
  };

  const openActionModal = (user: InterestedUser, action: ActionType) => {
    setSelectedUser(user);
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

      console.log(`${actionType} user:`, data);

      if (actionType === "accept") {
        toast.success(`${selectedUser?.name}'s enquiry has been approved`);
      } else {
        toast.success(`${selectedUser?.name}'s enquiry has been rejected`);
      }

      setIsModalOpen(false);
      setSelectedUser(null);

      // In real app, refetch data or update local state
    } catch (error) {
      console.error("Error processing action:", error);
      toast.error("Failed to process action. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContact = (userId: number) => {
    console.log("Contact user:", userId);
    // Navigate to chat or open message dialog
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Convert user to EntityData format for the modal
  const getEntityData = (user: InterestedUser | null): EntityData | null => {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      ndisNumber: user.ndisNumber,
      message: user.message,
      reasonForEnquiry: user.message,
      avatar: user.avatar,
    };
  };

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      <div className="">
        {/* Header */}
        <GeneralHeader
          showBackButton
          stickyTop={false}
          title={mockAccommodation.title}
          subtitle="Manage interested users"
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
                New Enquiries {mockInterestedUsers.new.length}
              </Button>
              <Button
                size="sm"
                onClick={() => handleTabChange("approved")}
                className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                  currentTab === "approved"
                    ? "hover:bg-white"
                    : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
                }`}
              >
                Approved {mockInterestedUsers.approved.length}
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
                Rejected {mockInterestedUsers.rejected.length}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-white">
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-montserrat-semibold text-black uppercase tracking-wider">
                    User
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-montserrat-semibold text-black uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-montserrat-semibold text-black uppercase tracking-wider hidden lg:table-cell">
                    NDIS Number
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-montserrat-semibold text-black uppercase tracking-wider hidden xl:table-cell">
                    Message
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-montserrat-semibold text-black uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-right text-xs font-montserrat-semibold text-black uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 bg-white">
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-4 md:px-6 py-12 text-center text-gray-500"
                    >
                      No {currentTab} enquiries found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user, index) => (
                    <TableRow
                      key={user.id + "-" + index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-gray-600 text-sm font-montserrat-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-montserrat-semibold text-gray-900 block">
                              {user.name}
                            </span>
                            <span className="text-xs text-gray-500 md:hidden">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-600">
                          <p>{user.email}</p>
                          <p className="text-gray-400">{user.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {user.ndisNumber}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">
                        <p className="line-clamp-2 max-w-xs">{user.message}</p>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {formatDate(user.submittedAt)}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleContact(user.id)}
                            title="Message"
                            className="p-1 hover:bg-gray-100 rounded-full h-auto w-auto"
                          >
                            <ChatLine className="h-5 w-5 text-primary" />
                          </Button>
                          {currentTab === "new" ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openActionModal(user, "accept")}
                                title="Approve"
                                className="p-1 hover:bg-green-50 rounded-full h-auto w-auto"
                              >
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openActionModal(user, "reject")}
                                title="Reject"
                                className="p-1 hover:bg-red-50 rounded-full h-auto w-auto"
                              >
                                <CloseCircle className="h-5 w-5 text-red-600" />
                              </Button>
                            </>
                          ) : currentTab === "approved" ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openActionModal(user, "reject")}
                              title="Remove"
                              className="p-1 hover:bg-red-50 rounded-full h-auto w-auto"
                            >
                              <CloseCircle className="h-5 w-5 text-red-600" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openActionModal(user, "accept")}
                              title="Approve"
                              className="p-1 hover:bg-green-50 rounded-full h-auto w-auto"
                            >
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {paginatedUsers.length > 0 && (
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
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmAction}
        entity={getEntityData(selectedUser)}
        entityType="accommodation-interest"
        actionType={actionType}
        isLoading={isProcessing}
        contextTitle={mockAccommodation.title}
      />
    </div>
  );
}