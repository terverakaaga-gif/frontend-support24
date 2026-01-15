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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  useGetJobById, 
  useGetJobApplications, 
  useUpdateApplicationStatus 
} from "@/hooks/useJobHooks";
import { JobApplication } from "@/api/services/jobService";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import {
  ApprovalActionModal,
  ActionType,
  EntityData,
} from "@/components/provider/ApprovalActionModal";

type TabType = "pending" | "accepted" | "rejected";

export default function ParticipantJobApplicantsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { jobId } = useParams<{ jobId: string }>();
  const [currentTab, setCurrentTab] = useState<TabType>("pending");
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplication | null>(null);
  const [actionType, setActionType] = useState<ActionType>("accept");

  // Fetch job details
  const { 
    data: jobData, 
    isLoading: isLoadingJob, 
    error: jobError 
  } = useGetJobById(jobId);

  // Fetch applications
  const { 
    data: applicationsData, 
    isLoading: isLoadingApplications, 
    error: applicationsError 
  } = useGetJobApplications(jobId);

  // Update application status mutation
  const updateStatusMutation = useUpdateApplicationStatus();

  // Filter applications by status
  const filteredApplications = useMemo(() => {
    if (!applicationsData?.applications) return [];

    return applicationsData.applications.filter((app) => {
      if (currentTab === "pending") {
        return app.status === "pending" || app.status === "reviewed" || app.status === "shortlisted";
      }
      return app.status === currentTab;
    });
  }, [applicationsData, currentTab]);

  // Count applications by status
  const applicationCounts = useMemo(() => {
    if (!applicationsData?.applications) return { pending: 0, accepted: 0, rejected: 0 };

    return applicationsData.applications.reduce((acc, app) => {
      if (app.status === "pending" || app.status === "reviewed" || app.status === "shortlisted") {
        acc.pending++;
      } else if (app.status === "accepted") {
        acc.accepted++;
      } else if (app.status === "rejected") {
        acc.rejected++;
      }
      return acc;
    }, { pending: 0, accepted: 0, rejected: 0 });
  }, [applicationsData]);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const paginatedApplicants = filteredApplications.slice(startIndex, endIndex);

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    setCurrentPage(1);
  };

  const openActionModal = (applicant: JobApplication, action: ActionType) => {
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
      const newStatus: JobApplication['status'] = actionType === "accept" ? "accepted" : "rejected";
      
      await updateStatusMutation.mutateAsync({
        applicationId: selectedApplicant._id,
        status: newStatus,
      });

      const applicantName = selectedApplicant.applicantId 
        ? `${selectedApplicant.applicantId.firstName} ${selectedApplicant.applicantId.lastName}`
        : selectedApplicant.fullName;

      toast.success(`${applicantName} has been ${newStatus}`);
      setIsModalOpen(false);
      setSelectedApplicant(null);
    } catch (error) {
      console.error("Error processing action:", error);
      // Error toast is already shown by the mutation
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Convert application to EntityData format for the modal
  const getEntityData = (application: JobApplication | null): EntityData | null => {
    if (!application) return null;

    const applicantName = application.applicantId 
      ? `${application.applicantId.firstName} ${application.applicantId.lastName}`
      : application.fullName;

    const applicantEmail = application.applicantId?.email || application.email;
    const applicantAvatar = application.applicantId?.profileImage || null;

    return {
      id: application._id,
      name: applicantName,
      email: applicantEmail,
      phone: application.phone,
      location: application.location,
      avatar: applicantAvatar,
      attachments: application.attachments.map(att => ({
        name: att.fileName,
        size: `${(att.fileSize / 1024).toFixed(0)} KB`,
        url: att.fileUrl,
      })),
    };
  };

  // Loading and error states
  if (isLoadingJob || isLoadingApplications) {
    return <Loader />;
  }

  if (jobError || applicationsError) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <ErrorDisplay message="Failed to load job applications" />
      </div>
    );
  }

  const job = jobData?.job;
  if (!job) {
    return (
      <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
        <ErrorDisplay message="Job not found" />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", BG_COLORS.muted, CONTAINER_PADDING.responsive)}>
      <div className="">
        {/* Header */}
        <GeneralHeader
          showBackButton
          stickyTop={false}
          title={`Applicants - ${job.jobRole}`}
          subtitle=""
          user={user}
          onLogout={logout}
          onViewProfile={() => navigate("/participant/profile")}
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
                New {applicationCounts.pending}
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
                Accepted {applicationCounts.accepted}
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
                Rejected {applicationCounts.rejected}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-white">
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Support Worker
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden lg:table-cell">
                    Applied
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden xl:table-cell">
                    Attachments
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
                      colSpan={6}
                      className="px-4 md:px-6 py-12 text-center text-gray-500"
                    >
                      No {currentTab === "pending" ? "new" : currentTab} applicants found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApplicants.map((application) => {
                    const applicantName = application.applicantId 
                      ? `${application.applicantId.firstName} ${application.applicantId.lastName}`
                      : application.fullName;
                    
                    const applicantAvatar = application.applicantId?.profileImage;
                    const initials = applicantName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <TableRow
                        key={application._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-3">
                            {applicantAvatar ? (
                              <img
                                src={applicantAvatar}
                                alt={applicantName}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex-shrink-0 flex items-center justify-center text-primary text-sm font-semibold">
                                {initials}
                              </div>
                            )}
                            <div>
                              <span className="text-sm font-semibold text-gray-900 block">
                                {applicantName}
                              </span>
                              <span
                                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                  application.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : application.status === "reviewed"
                                    ? "bg-blue-100 text-blue-800"
                                    : application.status === "shortlisted"
                                    ? "bg-purple-100 text-purple-800"
                                    : application.status === "accepted"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {application.status}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 md:px-6 py-4 hidden md:table-cell">
                          <div className="text-sm text-gray-600">
                            <p>{application.email}</p>
                            <p className="text-gray-400">{application.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                          {application.location}
                        </TableCell>
                        <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                          {formatDate(application.createdAt)}
                        </TableCell>
                        <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">
                          {application.attachments.length > 0 ? (
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {application.attachments.length} {application.attachments.length === 1 ? 'file' : 'files'}
                            </span>
                          ) : (
                            <span className="text-gray-400">No files</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 md:px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => openActionModal(application, "accept")}
                              title="View Details"
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Eye className="h-5 w-5 text-gray-600" />
                            </button>
                            {currentTab === "pending" ? (
                              <>
                                <button
                                  onClick={() => openActionModal(application, "accept")}
                                  title="Accept"
                                  className="p-1 hover:bg-green-50 rounded-full transition-colors"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                </button>
                                <button
                                  onClick={() => openActionModal(application, "reject")}
                                  title="Reject"
                                  className="p-1 hover:bg-red-50 rounded-full transition-colors"
                                >
                                  <CloseCircle className="h-5 w-5 text-red-600" />
                                </button>
                              </>
                            ) : currentTab === "accepted" ? (
                              <button
                                onClick={() => openActionModal(application, "reject")}
                                title="Remove"
                                className="p-1 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <CloseCircle className="h-5 w-5 text-red-600" />
                              </button>
                            ) : (
                              <button
                                onClick={() => openActionModal(application, "accept")}
                                title="Accept"
                                className="p-1 hover:bg-green-50 rounded-full transition-colors"
                              >
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </button>
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
        contextTitle={job.jobRole}
      />
    </div>
  );
}