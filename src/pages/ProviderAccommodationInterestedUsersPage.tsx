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

// Mock accommodation data
const mockAccommodation = {
  id: 1,
  title: "Ocean View Apartment",
  location: "123 Beach Road, Wollongong, NSW 2500",
};

// Mock interested users data
const mockInterestedUsers = {
  new: Array(8)
    .fill({
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@gmail.com",
      phone: "+61 4123 456 789",
      ndisNumber: "123456789",
      message: "I'm very interested in this property. It looks perfect for my needs.",
      avatar: null,
      submittedAt: "2025-11-15T10:30:00Z",
    })
    .map((p, i) => ({ ...p, id: i + 1 })),
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
    .map((p, i) => ({ ...p, id: i + 100 })),
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
  const { user } = useAuth();
  const { accommodationId } = useParams();
  const [currentTab, setCurrentTab] = useState<TabType>("new");
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleApprove = (userId: number) => {
    console.log("Approve user:", userId);
  };

  const handleReject = (userId: number) => {
    console.log("Reject user:", userId);
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="">
        {/* Header */}
        <GeneralHeader
          showBackButton
          stickyTop={false}
          title={mockAccommodation.title}
          subtitle="Manage interested users"
          user={user}
          onLogout={() => {}}
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
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    User
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden lg:table-cell">
                    NDIS Number
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden xl:table-cell">
                    Message
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 bg-white">
                {paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user.id + index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <span className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </span>
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
                        <button
                          onClick={() => handleContact(user.id)}
                          title="Message"
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChatLine className="h-5 w-5 text-primary" />
                        </button>
                        {currentTab === "new" ? (
                          <>
                            <button
                              onClick={() => handleApprove(user.id)}
                              title="Approve"
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleReject(user.id)}
                              title="Reject"
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <CloseCircle className="h-5 w-5 text-red-600" />
                            </button>
                          </>
                        ) : currentTab === "approved" ? (
                          <button
                            onClick={() => handleReject(user.id)}
                            title="Remove"
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <CloseCircle className="h-5 w-5 text-red-600" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(user.id)}
                            title="Approve"
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {paginatedUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>No {currentTab} enquiries found.</p>
            </div>
          )}

          {/* Pagination */}
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
                disabled={currentPage === totalPages}
              >
                <AltArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}