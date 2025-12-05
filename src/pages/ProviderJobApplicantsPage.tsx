import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AltArrowLeft,
  AltArrowRight,
  CheckCircle,
  CloseCircle,
  Eye,
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

// Mock job data
const mockJob = {
  id: 1,
  title: "Support Worker Position",
  workerName: "Sarah Johnson",
  location: "Sydney, NSW 2000",
  hourlyRate: 35,
  availability: "Full-time",
};

// Mock applicants data (participants who want to hire)
const mockApplicants = {
  new: [
    {
      id: 1,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+61 412 345 678",
      location: "Parramatta, NSW",
      experience: "3 years",
      skills: "Personal Care, Transport, Meal Prep",
      availability: "Full-time",
      avatar: null,
      bio: "Looking for reliable support with daily activities and community access.",
      appliedAt: "2025-11-20T10:30:00Z",
      complianceStatus: [
        { label: "NDIS Plan Active", valid: true },
        { label: "Identity Verified", valid: true },
        { label: "Service Agreement", valid: true },
        { label: "Emergency Contact", valid: true },
      ],
      attachments: [
        { name: "NDIS_Plan_Summary.pdf", size: "156 KB", url: "#" },
        { name: "Support_Requirements.pdf", size: "89 KB", url: "#" },
      ],
    },
    {
      id: 2,
      name: "Emma Williams",
      email: "emma.w@email.com",
      phone: "+61 423 456 789",
      location: "Bondi, NSW",
      experience: "5 years",
      skills: "Mobility Assistance, Community Access",
      availability: "Part-time",
      avatar: null,
      bio: "Seeking support for weekly outings and mobility assistance.",
      appliedAt: "2025-11-19T14:20:00Z",
      complianceStatus: [
        { label: "NDIS Plan Active", valid: true },
        { label: "Identity Verified", valid: true },
        { label: "Service Agreement", valid: false },
        { label: "Emergency Contact", valid: true },
      ],
      attachments: [
        { name: "Care_Plan.pdf", size: "234 KB", url: "#" },
      ],
    },
    {
      id: 3,
      name: "David Brown",
      email: "d.brown@email.com",
      phone: "+61 434 567 890",
      location: "Chatswood, NSW",
      experience: "2 years",
      skills: "Personal Care, Medication Support",
      availability: "Casual",
      avatar: null,
      bio: "Need occasional support for personal care and medication management.",
      appliedAt: "2025-11-18T09:15:00Z",
      complianceStatus: [
        { label: "NDIS Plan Active", valid: true },
        { label: "Identity Verified", valid: true },
        { label: "Service Agreement", valid: true },
        { label: "Emergency Contact", valid: true },
      ],
      attachments: [
        { name: "Medical_Summary.pdf", size: "178 KB", url: "#" },
        { name: "Medication_Schedule.pdf", size: "45 KB", url: "#" },
      ],
    },
  ],
  accepted: [
    {
      id: 100,
      name: "Lisa Anderson",
      email: "lisa.a@email.com",
      phone: "+61 445 678 901",
      location: "Sydney CBD, NSW",
      experience: "7 years",
      skills: "Behavior Support, Therapy Support",
      availability: "Full-time",
      avatar: null,
      bio: "Currently receiving support and looking to expand my care team.",
      appliedAt: "2025-11-15T11:00:00Z",
      complianceStatus: [
        { label: "NDIS Plan Active", valid: true },
        { label: "Identity Verified", valid: true },
        { label: "Service Agreement", valid: true },
        { label: "Emergency Contact", valid: true },
      ],
      attachments: [
        { name: "Support_Plan.pdf", size: "312 KB", url: "#" },
      ],
    },
    {
      id: 101,
      name: "James Wilson",
      email: "j.wilson@email.com",
      phone: "+61 456 789 012",
      location: "Inner West, NSW",
      experience: "4 years",
      skills: "Personal Care, Transport, Household Tasks",
      availability: "Part-time",
      avatar: null,
      bio: "Seeking reliable part-time support for various daily activities.",
      appliedAt: "2025-11-14T16:30:00Z",
      complianceStatus: [
        { label: "NDIS Plan Active", valid: true },
        { label: "Identity Verified", valid: true },
        { label: "Service Agreement", valid: true },
        { label: "Emergency Contact", valid: true },
      ],
      attachments: [
        { name: "NDIS_Plan.pdf", size: "267 KB", url: "#" },
      ],
    },
  ],
  rejected: [
    {
      id: 200,
      name: "Sarah Miller",
      email: "s.miller@email.com",
      phone: "+61 467 890 123",
      location: "North Shore, NSW",
      experience: "1 year",
      skills: "Social Support",
      availability: "Casual",
      avatar: null,
      bio: "Looking for social support and companionship.",
      appliedAt: "2025-11-12T08:45:00Z",
      complianceStatus: [
        { label: "NDIS Plan Active", valid: false },
        { label: "Identity Verified", valid: true },
        { label: "Service Agreement", valid: false },
        { label: "Emergency Contact", valid: false },
      ],
      attachments: [],
    },
  ],
};

type TabType = "new" | "accepted" | "rejected";

// Define applicant type
interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string;
  availability: string;
  avatar: string | null;
  bio: string;
  appliedAt: string;
  complianceStatus: Array<{ label: string; valid: boolean }>;
  attachments: Array<{ name: string; size: string; url: string }>;
}

export default function ProviderJobApplicantsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { jobId } = useParams();
  const [currentTab, setCurrentTab] = useState<TabType>("new");
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [actionType, setActionType] = useState<ActionType>("accept");
  const [isProcessing, setIsProcessing] = useState(false);

  // Get current applicants based on tab
  const currentApplicants = mockApplicants[currentTab];

  // Pagination
  const totalPages = Math.ceil(
    currentApplicants.length / parseInt(entriesPerPage)
  );
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const paginatedApplicants = currentApplicants.slice(startIndex, endIndex);

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    setCurrentPage(1);
  };

  const openActionModal = (applicant: Applicant, action: ActionType) => {
    setSelectedApplicant(applicant);
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

      console.log(`${actionType} applicant:`, data);

      if (actionType === "accept") {
        toast.success(`${selectedApplicant?.name} has been accepted`);
      } else {
        toast.success(`${selectedApplicant?.name} has been rejected`);
      }

      setIsModalOpen(false);
      setSelectedApplicant(null);

      // In real app, refetch data or update local state
    } catch (error) {
      console.error("Error processing action:", error);
      toast.error("Failed to process action. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Convert applicant to EntityData format for the modal
  const getEntityData = (applicant: Applicant | null): EntityData | null => {
    if (!applicant) return null;
    return {
      id: applicant.id,
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      location: applicant.location,
      experience: applicant.experience,
      skills: applicant.skills,
      availability: applicant.availability,
      avatar: applicant.avatar,
      complianceStatus: applicant.complianceStatus,
      attachments: applicant.attachments,
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="">
        {/* Header */}
        <GeneralHeader
          showBackButton
          stickyTop={false}
          title={`Applicants - ${mockJob.title}`}
          subtitle=""
          user={user}
          onLogout={logout}
          onViewProfile={() => navigate("/participant/provider/profile")}
        />

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                onClick={() => handleTabChange("new")}
                className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                  currentTab === "new"
                    ? "hover:bg-primary"
                    : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
                }`}
              >
                New {mockApplicants.new.length}
              </Button>
              <Button
                size="sm"
                onClick={() => handleTabChange("accepted")}
                className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                  currentTab === "accepted"
                    ? "hover:bg-primary"
                    : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
                }`}
              >
                Accepted {mockApplicants.accepted.length}
              </Button>
              <Button
                size="sm"
                onClick={() => handleTabChange("rejected")}
                className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                  currentTab === "rejected"
                    ? "hover:bg-primary"
                    : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
                }`}
              >
                Rejected {mockApplicants.rejected.length}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-white">
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Participant
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden lg:table-cell">
                    Support Needs
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden xl:table-cell">
                    Services Required
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden lg:table-cell">
                    Applied
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden 2xl:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 bg-white">
                {paginatedApplicants.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="px-4 md:px-6 py-12 text-center text-gray-500"
                    >
                      No {currentTab} applicants found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApplicants.map((applicant) => (
                    <TableRow
                      key={applicant.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex-shrink-0 flex items-center justify-center text-primary text-sm font-semibold">
                            {applicant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-900 block">
                              {applicant.name}
                            </span>
                            <span className="text-xs text-gray-500 block">
                              {applicant.location}
                            </span>
                            <span
                              className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                applicant.availability === "Full-time"
                                  ? "bg-primary-100 text-primary-800"
                                  : applicant.availability === "Part-time"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {applicant.availability}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-600">
                          <p>{applicant.email}</p>
                          <p className="text-gray-400">{applicant.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        <p className="line-clamp-2 max-w-xs text-gray-600">
                          {applicant.bio}
                        </p>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {applicant.skills
                            .split(", ")
                            .slice(0, 2)
                            .map((skill, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          {applicant.skills.split(", ").length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{applicant.skills.split(", ").length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {formatDate(applicant.appliedAt)}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 hidden 2xl:table-cell">
                        <div className="flex items-center gap-1">
                          {applicant.complianceStatus
                            .slice(0, 3)
                            .map((status, i) => (
                              <div
                                key={i}
                                title={status.label}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  status.valid
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {status.valid ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <CloseCircle className="h-4 w-4" />
                                )}
                              </div>
                            ))}
                          {applicant.complianceStatus.length > 3 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +{applicant.complianceStatus.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openActionModal(applicant, "accept")}
                            title="View Details"
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Eye className="h-5 w-5 text-gray-600" />
                          </button>
                          {currentTab === "new" ? (
                            <>
                              <button
                                onClick={() =>
                                  openActionModal(applicant, "accept")
                                }
                                title="Accept"
                                className="p-1 hover:bg-green-50 rounded-full transition-colors"
                              >
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </button>
                              <button
                                onClick={() =>
                                  openActionModal(applicant, "reject")
                                }
                                title="Reject"
                                className="p-1 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <CloseCircle className="h-5 w-5 text-red-600" />
                              </button>
                            </>
                          ) : currentTab === "accepted" ? (
                            <button
                              onClick={() =>
                                openActionModal(applicant, "reject")
                              }
                              title="Remove"
                              className="p-1 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <CloseCircle className="h-5 w-5 text-red-600" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                openActionModal(applicant, "accept")
                              }
                              title="Accept"
                              className="p-1 hover:bg-green-50 rounded-full transition-colors"
                            >
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </button>
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
          {paginatedApplicants.length > 0 && (
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
          setSelectedApplicant(null);
        }}
        onConfirm={handleConfirmAction}
        entity={getEntityData(selectedApplicant)}
        entityType="job-application"
        actionType={actionType}
        isLoading={isProcessing}
        contextTitle={mockJob.title}
      />
    </div>
  );
}