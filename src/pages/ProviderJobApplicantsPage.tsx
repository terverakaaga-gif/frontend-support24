import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AltArrowLeft,
  AltArrowRight,
  CheckCircle,
  CloseCircle,
  Eye,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { cn } from "@/lib/design-utils";
import { BG_COLORS, CONTAINER_PADDING } from "@/constants/design-system";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import ErrorDisplay from "@/components/ErrorDisplay";
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
import { useGetJobApplications, useUpdateApplicationStatus, useGetJobById } from "@/hooks/useJobHooks";
import Loader from "@/components/Loader";

type TabType = "pending" | "accepted" | "rejected";

export default function ProviderJobApplicantsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { jobId } = useParams();
  const [currentTab, setCurrentTab] = useState<TabType>("pending");
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [actionType, setActionType] = useState<ActionType>("accept");

  // Fetch job applications
  const { data: applicationsData, isLoading: isLoadingApplications, error: applicationsError } = useGetJobApplications(jobId || "");
  const { data: jobData, isLoading: isLoadingJob, error: jobError } = useGetJobById(jobId || "");
  const updateStatusMutation = useUpdateApplicationStatus();

  // Filter applications by status
  const filteredApplications = useMemo(() => {
    if (!applicationsData?.applications) return [];
    return applicationsData.applications.filter(app => app.status === currentTab);
  }, [applicationsData, currentTab]);

  // Pagination
  const totalPages = Math.ceil(
    filteredApplications.length / parseInt(entriesPerPage)
  );
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const paginatedApplicants = filteredApplications.slice(startIndex, endIndex);

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    setCurrentPage(1);
  };

  const openActionModal = (applicant: any, action: ActionType) => {
    setSelectedApplicant(applicant);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async (data: {
    entityId: number | string;
    reason?: string;
  }) => {
    if (!selectedApplicant) return;

    try {
      const newStatus = actionType === "accept" ? "accepted" : "rejected";
      
      await updateStatusMutation.mutateAsync({
        applicationId: selectedApplicant._id,
        status: newStatus,
      });

      toast.success(`Application ${newStatus} successfully`);
      setIsModalOpen(false);
      setSelectedApplicant(null);
    } catch (error) {
      console.error("Error processing action:", error);
      toast.error("Failed to process action. Please try again.");
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
  const getEntityData = (applicant: any): EntityData | null => {
    if (!applicant) return null;
    return {
      id: applicant._id,
      name: applicant.fullName || "Unknown",
      email: applicant.email || "",
      phone: applicant.phone || "",
      location: applicant.location || "",
      experience: "",
      skills: "",
      availability: "",
      avatar: applicant.applicantId?.profileImage || null,
      complianceStatus: [],
      attachments: applicant.attachments?.map((att: any) => ({ 
        name: att.fileName, 
        size: `${(att.fileSize / 1024).toFixed(0)} KB`, 
        url: att.fileUrl 
      })) || [],
    };
  };

  // Show loading state
  if (isLoadingApplications || isLoadingJob) {
    return (
      <Loader />
    );
  }

  // Show error state
  if (applicationsError || jobError) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", BG_COLORS.muted)}>
        <ErrorDisplay 
          message={applicationsError?.message || jobError?.message || "Failed to load applications"}
        />
      </div>
    );
  }

  const job = jobData;

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      <div className="">
        {/* Header */}
        <GeneralHeader
          showBackButton
          stickyTop={false}
          title={`Applicants - ${job?.job?.jobRole || "Job Listing"}`}
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
                onClick={() => handleTabChange("pending")}
                className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                  currentTab === "pending"
                    ? "hover:bg-primary"
                    : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
                }`}
              >
                New {applicationsData?.applications?.filter(a => a.status === "pending").length || 0}
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
                Accepted {applicationsData?.applications?.filter(a => a.status === "accepted").length || 0}
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
                Rejected {applicationsData?.applications?.filter(a => a.status === "rejected").length || 0}
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
                  paginatedApplicants.map((applicant) => {
                    const applicantName = applicant.fullName || "Unknown";
                    const applicantInitials = applicantName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                    const profileImage = applicant.applicantId?.profileImage || null;
                    
                    return (
                    <TableRow
                      key={applicant._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          {profileImage ? (
                            <img 
                              src={profileImage} 
                              alt={applicantName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex-shrink-0 flex items-center justify-center text-primary text-sm font-semibold">
                            {applicantInitials}
                          </div>
                          )}
                          <div>
                            <span className="text-sm font-semibold text-gray-900 block">
                              {applicantName}
                            </span>
                            <span className="text-xs text-gray-500 block">
                              {applicant.location || "Location not specified"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-600">
                          <p>{applicant.email || "N/A"}</p>
                          <p className="text-gray-400">{applicant.phone || "N/A"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        <p className="line-clamp-2 max-w-xs text-gray-600">
                          Application submitted
                        </p>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 hidden xl:table-cell">
                        <div className="text-sm text-gray-600">
                          {applicant.attachments && applicant.attachments.length > 0 ? (
                            <a href={applicant.attachments[0].fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              View Attachment
                            </a>
                          ) : (
                            "No attachments"
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {formatDate(applicant.createdAt)}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 hidden 2xl:table-cell">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          applicant.status === "accepted" ? "bg-green-100 text-green-800" :
                          applicant.status === "rejected" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          {currentTab === "pending" && (
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
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })
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
        isLoading={updateStatusMutation.isPending}
        contextTitle={job?.job?.jobRole || "Job Listing"}
      />
    </div>
  );
}