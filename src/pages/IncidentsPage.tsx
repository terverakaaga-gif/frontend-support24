import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import incidentService from "@/api/services/incidentService";
import shiftService from "@/api/services/shiftService";
import { toast } from "sonner";
import {
  AddCircle,
  Eye,
  Magnifer,
  CloseCircle,
  AltArrowLeft,
  AltArrowRight,
  CheckCircle,
} from "@solar-icons/react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Loader from "@/components/Loader";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Input } from "@/components/ui/input";
import { CreateIncidentDTO } from "@/types/incidents.types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GeneralHeader from "@/components/GeneralHeader";
import { pageTitles } from "@/constants/pageTitles";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const IncidentsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch incidents
  const {
    data: incidentsData,
    error: incidentsError,
    isLoading: isIncidentsLoading,
  } = useQuery({
    queryKey: ["incidents"],
    queryFn: () => incidentService.getIncidents(),
  });

  // Fetch shifts
  const { data: shifts, isLoading: isShiftsLoading } = useQuery({
    queryKey: ["shifts"],
    queryFn: () => shiftService.getShifts(),
  });

  // State management
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [severityFilter, setSeverityFilter] = useState("All Severity");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolvePreviewModalOpen, setResolvePreviewModalOpen] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftSearchTerm, setShiftSearchTerm] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  // Create incident form state
  const [incidentForm, setIncidentForm] = useState({
    title: "",
    description: "",
    severity: "",
    shiftId: "",
    reportedAgainst: "",
    urlLinks: [],
  });

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

  // Create incident mutation
  const createIncidentMutation = useMutation({
    mutationFn: (data: CreateIncidentDTO) =>
      incidentService.createIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success("Incident created successfully");
      setReviewModalOpen(false);
      setIncidentForm({
        title: "",
        description: "",
        severity: "",
        shiftId: "",
        reportedAgainst: "",
        urlLinks: [],
      });
    },
    onError: (error) => {
      toast.error("Failed to create incident");
      console.error("Error creating incident:", error);
    },
  });

  // Resolve incident mutation
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
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success("Incident resolved successfully");
      setResolvePreviewModalOpen(false);
      setResolveModalOpen(false);
      setResolutionNote("");
      setSelectedIncident(null);
    },
    onError: (error) => {
      toast.error("Failed to resolve incident");
      console.error("Error resolving incident:", error);
    },
  });

  // Filter incidents based on search and filters
  useEffect(() => {
    if (incidentsData?.incidents) {
      let filtered = [...incidentsData.incidents];

      if (searchTerm) {
        filtered = filtered.filter(
          (incident) =>
            incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incident.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter !== "All Status") {
        const filterMap = {
          Opened: "OPEN",
          Pending: "IN_REVIEW",
          Resolved: "RESOLVED",
        };
        filtered = filtered.filter(
          (incident) => incident.status === filterMap[statusFilter]
        );
      }
      if (severityFilter !== "All Severity") {
        filtered = filtered.filter(
          (incident) =>
            incident.severity.toLocaleUpperCase() ===
            severityFilter.toLocaleUpperCase()
        );
      }

      setFilteredIncidents(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, incidentsData, severityFilter]);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-gray-100 text-gray-600";
      case "IN_REVIEW":
        return "bg-orange-50 text-orange-600";
      case "RESOLVED":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getSeverityBadgeStyle = (severity) => {
    switch (severity) {
      case "LOW":
        return "bg-primary-50 text-primary-600";
      case "MEDIUM":
        return "bg-orange-50 text-orange-600";
      case "HIGH":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      OPEN: "Opened",
      IN_REVIEW: "Pending",
      RESOLVED: "Resolved",
      REJECTED: "Rejected",
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIncidents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

  const handleViewIncident = (incident) => {
    setSelectedIncident(incident);
    setViewModalOpen(true);
  };

  const handleResolveIncident = (incident) => {
    setSelectedIncident(incident);
    setResolutionNote("");
    setResolveModalOpen(true);
  };

  const handleCreateIncident = () => {
    setIncidentForm({
      title: "",
      description: "",
      severity: "",
      shiftId: "",
      reportedAgainst: "",
      urlLinks: [],
    });
    setCreateModalOpen(true);
  };

  const handleReviewIncident = () => {
    if (
      !incidentForm.title ||
      !incidentForm.description ||
      !incidentForm.severity ||
      !incidentForm.shiftId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setCreateModalOpen(false);
    setReviewModalOpen(true);
  };

  const handleSaveIncident = () => {
    const submitData = {
      title: incidentForm.title,
      description: incidentForm.description,
      severity: incidentForm.severity,
      shiftId: incidentForm.shiftId,
      urlLinks: incidentForm.urlLinks,
    };

    createIncidentMutation.mutate(submitData);
  };

  const handleReviewResolution = () => {
    if (!resolutionNote.trim()) {
      toast.error("Please provide resolution notes");
      return;
    }
    setResolveModalOpen(false);
    setResolvePreviewModalOpen(true);
  };

  const handleConfirmResolution = () => {
    if (selectedIncident && user?._id) {
      resolveIncidentMutation.mutate({
        id: selectedIncident._id,
        resolutionNote,
        resolvedBy: user._id,
      });
    }
  };

  const handleShiftSelect = (shift) => {
    setIncidentForm({ ...incidentForm, shiftId: shift.shiftId });
    setShowShiftModal(false);
  };

  const filteredShifts = shifts?.filter((shift) => {
    const searchLower = shiftSearchTerm.toLowerCase();
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
    return shifts?.find((shift) => shift.shiftId === incidentForm.shiftId);
  };

  if (isIncidentsLoading) {
    return <Loader />;
  }

  if (incidentsError) {
    return <ErrorDisplay message={"Error loading incidents"} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      {/* Header */}
      <GeneralHeader
        title={
          user.role === "supportWorker"
            ? pageTitles.supportWorker["/support-worker/incidents"].title
            : user.role === "participant"
            ? pageTitles.participant["/participant/incidents"].title
            : pageTitles.admin["/admin/incidents"].title
        }
        subtitle={
          user.role === "supportWorker"
            ? pageTitles.supportWorker["/support-worker/incidents"].subtitle
            : user.role === "participant"
            ? pageTitles.participant["/participant/incidents"].subtitle
            : pageTitles.admin["/admin/incidents"].subtitle
        }
        user={user}
        onViewProfile={() => {
          navigate(
            user.role === "supportWorker"
              ? "/support-worker/profile"
              : user.role === "participant"
              ? "/participant/profile"
              : "/admin/profile"
          );
        }}
        onLogout={logout}
        rightComponent={
          <>
            <div className="flex flex-wrap w-fit items-center gap-3 place-self-end">
              <div className="relative max-w-fit md:max-w-[250px]">
                <Magnifer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search incidents...."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent w-[220px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {user.role === "supportWorker" && (
                <Button
                  onClick={handleCreateIncident}
                  className="bg-primary hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <AddCircle className="h-8 w-8 white" />
                  <span>Create Incident</span>
                </Button>
              )}
            </div>
          </>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Status">All Status</SelectItem>
            <SelectItem value="Opened">Opened</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Severity">All Severity</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Table */}
      <div className="bg-white rounded-b-lg border border-gray-200 overflow-hidden my-3">
        <Table>
          <TableHeader>
            <TableRow className="font-montserrat-semibold">
              <TableHead className="px-6 py-3 text-left text-xs uppercase">
                INCIDENT REPORT
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs uppercase">
                REPORTED BY
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs uppercase">
                DATE
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs uppercase">
                TIME
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs uppercase">
                SEVERITY
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs uppercase">
                STATUS
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs uppercase">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((incident) => (
              <TableRow key={incident._id} className="hover:bg-gray-100">
                <TableCell className="flex flex-col px-6 py-4">
                  <div className="text-sm font-montserrat-bold text-gray-900">
                    {incident.title}
                  </div>
                  <div className="text-sm text-gray-1000">
                    {incident.description
                      .replace(/<[^>]*>/g, "")
                      .substring(0, 50)}
                    ...
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://i.pravatar.cc/32?img=${
                        Math.abs(parseInt(incident._id.slice(-4), 16)) % 10
                      }`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-900">
                      {incident.reportedBy.firstName}{" "}
                      {incident.reportedBy.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-1000">
                  {formatDate(incident.createdAt)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-1000">
                  {formatTime(incident.createdAt)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-montserrat-bold rounded-full ${getSeverityBadgeStyle(
                      incident.severity
                    )}`}
                  >
                    {incident.severity}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-montserrat-bold rounded-full ${getStatusBadgeStyle(
                      incident.status
                    )}`}
                  >
                    {getStatusLabel(incident.status)}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleViewIncident(incident)}
                      className="text-primary bg-white border border-primary hover:text-white hover:bg-primary flex items-center gap-2 text-sm font-montserrat-bold"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    {user.role === "admin" &&
                      incident.status !== "RESOLVED" && (
                        <Button
                          onClick={() => handleResolveIncident(incident)}
                          className="text-green-600 bg-white border border-green-600 hover:text-white hover:bg-green-600 flex items-center gap-2 text-sm font-montserrat-bold"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Resolve
                        </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-montserrat-bold">{itemsPerPage}</span>{" "}
              incidents
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <AltArrowLeft className="h-4 w-4" />
              </Button>
              {Array.from(
                { length: Math.min(totalPages, 5) },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-1 text-sm rounded ${
                    currentPage === page
                      ? "bg-primary-600 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Button>
              ))}
              <Button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <AltArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Incident Dialog */}
      {resolveModalOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-montserrat-semibold text-gray-900">
                Resolve Incident
              </h2>
              <Button
                variant="ghost"
                onClick={() => setResolveModalOpen(false)}
                className="text-black hover:bg-transparent hover:text-primary"
              >
                <CloseCircle size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Incident Summary */}
              <div className="bg-primary-100 rounded-lg p-4 border border-primary-200">
                <h3 className="text-sm font-medium text-primary-800 mb-3">
                  Incident Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-montserrat-semibold text-primary-900">
                      {selectedIncident.title}
                    </h4>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-montserrat-semibold rounded-full ${getSeverityBadgeStyle(
                        selectedIncident.severity
                      )}`}
                    >
                      {selectedIncident.severity}
                    </span>
                  </div>
                  <div className="text-sm text-primary-700 space-y-1">
                    <p>
                      <span className="font-medium">Reported By:</span>{" "}
                      {selectedIncident.reportedBy?.firstName}{" "}
                      {selectedIncident.reportedBy?.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Reported On:</span>{" "}
                      {formatDate(selectedIncident.createdAt)}
                    </p>
                    {selectedIncident.shiftId && (
                      <p>
                        <span className="font-medium">Shift ID:</span>{" "}
                        {selectedIncident.shiftId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Resolution Notes */}
              <div>
                <label className="block text-sm font-montserrat-bold text-gray-900 mb-2">
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

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                onClick={() => setResolveModalOpen(false)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-montserrat-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReviewResolution}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-montserrat-bold"
              >
                Review Resolution
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Preview Dialog */}
      {resolvePreviewModalOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-montserrat-bold text-gray-900">
                Review Resolution
              </h2>
              <Button
                variant="ghost"
                onClick={() => setResolvePreviewModalOpen(false)}
                className="text-black hover:text-primary-600 hover:bg-transparent"
              >
                <CloseCircle size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Incident Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Incident Being Resolved
                </h3>
                <div className="bg-gray-100 rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-montserrat-semibold text-gray-900">
                      {selectedIncident.title}
                    </h4>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-montserrat-semibold rounded-full ${getSeverityBadgeStyle(
                        selectedIncident.severity
                      )}`}
                    >
                      {selectedIncident.severity}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      Reported by {selectedIncident.reportedBy?.firstName}{" "}
                      {selectedIncident.reportedBy?.lastName}
                    </p>
                    <p>Reported on {formatDate(selectedIncident.createdAt)}</p>
                    {selectedIncident.shiftId && (
                      <p>Shift ID: {selectedIncident.shiftId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Resolution Notes Preview */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Resolution Notes
                </h3>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: resolutionNote }}
                  />
                </div>
              </div>

              {/* Resolver Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Resolver Information
                </h3>
                <div className="bg-gray-100 rounded-lg p-4 border">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10 rounded-full">
                      <AvatarImage
                        src={
                          user?.profileImage || `https://i.pravatar.cc/40?img=5`
                        }
                        alt="Resolver"
                      />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-montserrat-bold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-1000">({user?.role})</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Resolved on {formatDate(new Date().toISOString())},{" "}
                    {formatTime(new Date().toISOString())}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                onClick={() => {
                  setResolvePreviewModalOpen(false);
                  setResolveModalOpen(true);
                }}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-montserrat-bold"
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleConfirmResolution}
                disabled={resolveIncidentMutation.isPending}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-montserrat-bold disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {resolveIncidentMutation.isPending
                  ? "Resolving..."
                  : "Resolve Incident"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Incident Dialog */}
      {user.role === "supportWorker" && createModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 py-10 border-b border-gray-200">
              <h2 className="text-xl font-montserrat-semibold text-gray-900">
                Create Incident
              </h2>
              <Button
                variant="ghost"
                onClick={() => setCreateModalOpen(false)}
                className="text-black hover:bg-transparent hover:text-primary"
              >
                <CloseCircle size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-montserrat-bold text-gray-900 mb-2">
                  Title
                </label>
                <Input
                  type="text"
                  placeholder="Brief title of the incident"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={incidentForm.title}
                  onChange={(e) =>
                    setIncidentForm({ ...incidentForm, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-montserrat-bold text-gray-900 mb-2">
                  Description
                </label>
                <div className="quill-wrapper">
                  <ReactQuill
                    theme="snow"
                    value={incidentForm.description}
                    onChange={(content) =>
                      setIncidentForm({ ...incidentForm, description: content })
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Provide a detailed description of what happened. Use the formatting tools above to structure your report."
                    style={{ height: "200px", marginBottom: "50px" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-montserrat-bold text-gray-900 mb-2">
                    Severity
                  </label>
                  <Select
                    value={incidentForm.severity}
                    onValueChange={(value) =>
                      setIncidentForm({ ...incidentForm, severity: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-montserrat-bold text-gray-900 mb-2">
                    Shift
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      className="w-full px-4 py-2.5 border font-montserrat-semibold border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Select a shift"
                      value={incidentForm.shiftId}
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowShiftModal(true)}
                      className=" hover:bg-primary-700 px-4 py-2 transition-colors whitespace-nowrap"
                    >
                      Select Shift
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-montserrat-bold text-gray-900 mb-2">
                  Evidence (Optional)
                </label>
                <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-2 w-fit">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload Files
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        setIncidentForm({
                          ...incidentForm,
                          urlLinks: files.map((file) => file.name),
                        });
                      }
                    }}
                    multiple
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                onClick={() => setCreateModalOpen(false)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-montserrat-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReviewIncident}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-montserrat-bold"
              >
                Review Incident
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Shift Selection Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-montserrat-semibold text-gray-900">
                Select Shift
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowShiftModal(false)}
                className="text-black hover:text-primary hover:bg-transparent"
              >
                <CloseCircle size={24} />
              </Button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Magnifer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search shifts..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
                    value={shiftSearchTerm}
                    onChange={(e) => setShiftSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isShiftsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredShifts?.length ? (
                    filteredShifts.map((shift) => (
                      <div
                        key={shift._id}
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                          incidentForm.shiftId === shift.shiftId
                            ? "border-primary-600 bg-primary-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => handleShiftSelect(shift)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-montserrat-bold text-gray-900">
                              {typeof shift.participantId === "object" &&
                              shift.participantId !== null
                                ? `${shift.participantId.firstName} ${shift.participantId.lastName}`
                                : String(shift.participantId)}
                            </h3>
                            <p className="text-sm text-gray-1000">
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
                            <span className="font-montserrat-bold">
                              Shift ID:
                            </span>{" "}
                            {shift.shiftId}
                          </p>
                          <p>
                            <span className="font-montserrat-bold">Time:</span>{" "}
                            {new Date(shift.startTime).toLocaleString()} -{" "}
                            {new Date(shift.endTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-1000">
                      No shifts found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Incident Dialog */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-montserrat-bold text-gray-900">
                Review Incident
              </h2>
              <Button
                variant="ghost"
                onClick={() => setReviewModalOpen(false)}
                className="text-black hover:text-primary-600 hover:bg-transparent"
              >
                <CloseCircle size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title and Severity */}
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-montserrat-semibold text-gray-900">
                  {incidentForm.title}
                </h3>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-montserrat-semibold rounded-full ${getSeverityBadgeStyle(
                    incidentForm.severity
                  )}`}
                >
                  {incidentForm.severity}
                </span>
              </div>

              {/* Reported By */}
              <div>
                <h4 className="text-sm font-montserrat-bold text-gray-1000 mb-2">
                  Reported By
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10 rounded-full">
                      <AvatarImage
                        src={
                          user?.profileImage || `https://i.pravatar.cc/40?img=5`
                        }
                        alt="Reporter"
                        className="w-10 h-10 rounded-full"
                      />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-montserrat-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <span className="text-sm text-gray-1000 font-montserrat-semibold">
                    {formatDate(new Date().toISOString())},{" "}
                    {formatTime(new Date().toISOString())}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-100 rounded-lg p-4">
                <div
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: incidentForm.description }}
                />
              </div>

              {/* Details Grid */}
              <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs mb-1 text-gray-1000 font-montserrat-semibold">
                      Shift ID
                    </p>
                    <p className="text-sm font-montserrat-semibold text-gray-900">
                      {incidentForm.shiftId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                onClick={() => {
                  setReviewModalOpen(false);
                  setCreateModalOpen(true);
                }}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-montserrat-bold"
              >
                Edit
              </Button>
              <Button
                onClick={handleSaveIncident}
                disabled={createIncidentMutation.isPending}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-montserrat-bold disabled:opacity-50"
              >
                {createIncidentMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Incident Dialog */}
      {viewModalOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-montserrat-bold text-gray-900">
                View Incident
              </h2>
              <Button
                variant="ghost"
                onClick={() => setViewModalOpen(false)}
                className="text-black hover:text-primary-600 hover:bg-transparent"
              >
                <CloseCircle size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-montserrat-semibold text-gray-900">
                  {selectedIncident.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-montserrat-bold rounded-full ${getSeverityBadgeStyle(
                      selectedIncident.severity
                    )}`}
                  >
                    {selectedIncident.severity}
                  </span>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-montserrat-bold rounded-full ${getStatusBadgeStyle(
                      selectedIncident.status
                    )}`}
                  >
                    {getStatusLabel(selectedIncident.status)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 py-4 border-b border-gray-200">
                <Avatar className="w-10 h-10 rounded-full">
                  <AvatarImage
                    src={
                      selectedIncident.reportedBy.profileImage ||
                      `https://i.pravatar.cc/40?img=5`
                    }
                    alt="Reporter"
                    className="w-10 h-10 rounded-full"
                  />
                  <AvatarFallback>
                    {selectedIncident.reportedBy.firstName.charAt(0)}
                    {selectedIncident.reportedBy.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-gray-1000">Reported By</p>
                  <p className="text-sm font-montserrat-semibold text-gray-900">
                    {selectedIncident.reportedBy.firstName}{" "}
                    {selectedIncident.reportedBy.lastName}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm text-gray-1000">
                    {formatDate(selectedIncident.createdAt)},{" "}
                    {formatTime(selectedIncident.createdAt)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-1000 mb-1">
                      Reported Against
                    </p>
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://i.pravatar.cc/32?img=${
                          (Math.abs(
                            parseInt(selectedIncident._id.slice(-4), 16)
                          ) %
                            10) +
                          2
                        }`}
                        alt="Reported Against"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-montserrat-bold text-gray-900">
                          Michael Hishen
                        </p>
                        <p className="text-xs text-gray-1000">
                          Michaels Foundation
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-1000 mb-1">Shift ID</p>
                    <p className="text-sm font-montserrat-semibold text-gray-900">
                      {selectedIncident.shiftId || "SHIFT_68674636SV"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-montserrat-semibold text-gray-900 mb-2">
                  Description
                </h4>
                <div className="text-sm text-gray-700 leading-relaxed bg-gray-100 rounded-lg p-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedIncident.description,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
};

export default IncidentsPage;
