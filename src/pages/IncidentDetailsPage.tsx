import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import incidentService from "@/api/services/incidentService";
import { IIncident, TIncidentStatus } from "@/types/incidents.types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle,
  User,
  Calendar,
  FileText,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import Papa from "papaparse";

const IncidentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: incident,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["incident-details", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("No incident ID provided");
      }

      try {
        const result = await incidentService.getIncidentById(id);

        if (!result) {
          throw new Error("Incident not found");
        }

        return result;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      if (
        error?.message?.includes("404") ||
        (typeof error === "object" &&
          error !== null &&
          "response" in error &&
          // @ts-expect-error this
          // this is not typed properly
          error.response?.status === 404)
      ) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      updatedBy,
    }: {
      id: string;
      status: TIncidentStatus;
      updatedBy: string;
    }) => incidentService.updateIncidentStatus(id, { status, updatedBy }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incident-details", id] });
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success("Incident status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update incident status");
      console.error("Error updating status:", error);
    },
  });

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
      LOW: "bg-primary-100 text-primary-800",
      MEDIUM: "bg-orange-100 text-orange-800",
      HIGH: "bg-red-100 text-red-800",
    };
    return colors[severity] || "bg-gray-100 text-gray-800";
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

  const handleStatusUpdate = (newStatus: TIncidentStatus) => {
    if (incident && user?._id) {
      updateStatusMutation.mutate({
        id: incident._id,
        status: newStatus,
        updatedBy: user._id,
      });
    }
  };

  const stripHtmlTags = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  const exportToPDF = () => {
    if (!incident) return;

    const doc = new jsPDF();
    const margin = 20;
    let yPosition = margin;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Incident Report", margin, yPosition);
    yPosition += 20;

    // Basic Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Title: `, margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(incident.title, margin + 25, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "bold");
    doc.text(`Status: `, margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(incident.status.replace("_", " "), margin + 30, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "bold");
    doc.text(`Severity: `, margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(incident.severity, margin + 35, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "bold");
    doc.text(`Reported By: `, margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${incident.reportedBy?.firstName || "Unknown"} ${
        incident.reportedBy?.lastName || ""
      }`,
      margin + 45,
      yPosition
    );
    yPosition += 10;

    doc.setFont("helvetica", "bold");
    doc.text(`Reported On: `, margin, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(incident.createdAt), margin + 45, yPosition);
    yPosition += 20;

    // Description
    doc.setFont("helvetica", "bold");
    doc.text("Description:", margin, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    const description = stripHtmlTags(incident.description);
    const splitDescription = doc.splitTextToSize(description, 170);
    doc.text(splitDescription, margin, yPosition);
    yPosition += splitDescription.length * 5 + 10;

    // Resolution (if resolved)
    if (incident.resolutionNote) {
      doc.setFont("helvetica", "bold");
      doc.text("Resolution:", margin, yPosition);
      yPosition += 10;

      doc.setFont("helvetica", "normal");
      const splitResolution = doc.splitTextToSize(incident.resolutionNote, 170);
      doc.text(splitResolution, margin, yPosition);
    }

    doc.save(`incident-${incident._id}.pdf`);
    toast.success("Incident exported to PDF");
  };

  const exportToCSV = () => {
    if (!incident) return;

    const csvData = [
      {
        ID: incident._id,
        Title: incident.title,
        Status: incident.status,
        Severity: incident.severity,
        "Reported By": `${incident.reportedBy?.firstName || "Unknown"} ${
          incident.reportedBy?.lastName || ""
        }`,
        "Reported On": formatDate(incident.createdAt),
        "Shift ID": incident.shiftId || "",
        Description: stripHtmlTags(incident.description),
        "Resolution Note": incident.resolutionNote || "",
        "Resolved By": incident.resolvedBy
          ? `${incident.resolvedBy.firstName} ${incident.resolvedBy.lastName}`
          : "",
        "Resolved On": incident.resolvedAt
          ? formatDate(incident.resolvedAt)
          : "",
        "Evidence Files": incident.urlLinks ? incident.urlLinks.join("; ") : "",
      },
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `incident-${incident._id}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Incident exported to CSV");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#008CFF] hover:text-[#1599D3]"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Incidents
          </button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008CFF]"></div>
          <span className="ml-2 text-gray-600">
            Loading incident details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#008CFF] hover:text-[#1599D3]"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Incidents
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-red-500 text-center">
            {error?.message || "Incident not found"}
          </div>
          {!error && !incident && (
            <p className="text-gray-1000 text-center">
              The incident with ID "{id}" does not exist or has been deleted.
            </p>
          )}
          <button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["incident-details", id],
              })
            }
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-montserrat-bold text-gray-900">
                Incident Details
              </h1>
              <p className="text-gray-600 mt-1">
                Review incident information and take actions
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Export Dropdown */}
              <div className="relative group">
                <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={exportToPDF}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>

              {user?.role === "admin" && incident.status !== "RESOLVED" && (
                <Link
                  to={`/admin/incidents/${incident._id}/resolve`}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Resolve Incident
                </Link>
              )}

              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-[#008CFF] hover:text-[#1599D3] transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Status Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-montserrat-semibold text-gray-900">
              {incident.title}
            </h2>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex px-2 py-1 text-xs font-montserrat-semibold rounded-full ${getStatusColor(
                  incident.status
                )}`}
              >
                {incident.status.replace("_", " ")}
              </span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-montserrat-semibold rounded-full ${getSeverityColor(
                  incident.severity
                )}`}
              >
                {incident.severity}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description with Rich Text Preview */}
          <div>
            <h3 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
              Description
            </h3>
            <div className="bg-gray-100 rounded-lg p-4 border">
              <div
                className="ql-editor-preview prose prose-sm max-w-none text-gray-700
										prose-headings:text-gray-900 prose-headings:font-montserrat-semibold prose-headings:mt-4 prose-headings:mb-2
										prose-h1:text-xl prose-h1:font-montserrat-bold prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-2
										prose-h2:text-lg prose-h2:font-montserrat-semibold
										prose-h3:text-base prose-h3:font-montserrat-semibold
										prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-3
										prose-strong:text-gray-900 prose-strong:font-montserrat-semibold
										prose-em:text-gray-600 prose-em:italic
										prose-ul:text-gray-700 prose-ul:my-3 prose-ul:pl-6
										prose-ol:text-gray-700 prose-ol:my-3 prose-ol:pl-6
										prose-li:text-gray-700 prose-li:my-1 prose-li:leading-relaxed
										prose-a:text-primary prose-a:underline hover:prose-a:text-primary-800
										prose-blockquote:text-gray-600 prose-blockquote:border-l-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
										prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
									"
                dangerouslySetInnerHTML={{ __html: incident.description }}
              />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-montserrat-semibold text-gray-1000 mb-2">
                Reported By
              </h4>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">
                  {incident.reportedBy?.firstName || "Unknown"}{" "}
                  {incident.reportedBy?.lastName || ""}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-montserrat-semibold text-gray-1000 mb-2">
                Reported On
              </h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">
                  {formatDate(incident.createdAt)}
                </span>
              </div>
            </div>

            {incident.shiftId && (
              <div>
                <h4 className="text-sm font-montserrat-semibold text-gray-1000 mb-2">
                  Shift ID
                </h4>
                <p className="text-gray-900">{incident.shiftId}</p>
              </div>
            )}

            {incident.reportedAgainst && (
              <div>
                <h4 className="text-sm font-montserrat-semibold text-gray-1000 mb-2">
                  Reported Against
                </h4>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">
                    {incident.reportedAgainst.firstName}{" "}
                    {incident.reportedAgainst.lastName}
                  </span>
                </div>
              </div>
            )}

            {incident.resolvedBy && (
              <div>
                <h4 className="text-sm font-montserrat-semibold text-gray-1000 mb-2">
                  Resolved By
                </h4>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">
                    {incident.resolvedBy.firstName}{" "}
                    {incident.resolvedBy.lastName}
                  </span>
                </div>
              </div>
            )}

            {incident.resolvedAt && (
              <div>
                <h4 className="text-sm font-montserrat-semibold text-gray-1000 mb-2">
                  Resolved On
                </h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">
                    {formatDate(incident.resolvedAt)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Resolution Note */}
          {incident.resolutionNote && (
            <div>
              <h3 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                Resolution Notes
              </h3>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div
                  className="ql-editor-preview prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: incident.resolutionNote,
                  }}
                />
              </div>
            </div>
          )}

          {/* Evidence */}
          {incident.urlLinks && incident.urlLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                Evidence Files
              </h3>
              <div className="space-y-2">
                {incident.urlLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm bg-gray-100 p-3 rounded-lg border"
                  >
                    <FileText className="h-4 w-4 text-gray-1000 flex-shrink-0" />
                    <span className="text-gray-700 break-all">{link}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Update (Admin only) */}
          {user?.role === "admin" && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-montserrat-semibold text-gray-900 mb-3">
                Update Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {incident.status !== "IN_REVIEW" && (
                  <button
                    onClick={() => handleStatusUpdate("IN_REVIEW")}
                    disabled={updateStatusMutation.isPending}
                    className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-md text-sm hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateStatusMutation.isPending
                      ? "Updating..."
                      : "Mark as In Review"}
                  </button>
                )}
                {incident.status !== "REJECTED" && (
                  <button
                    onClick={() => handleStatusUpdate("REJECTED")}
                    disabled={updateStatusMutation.isPending}
                    className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateStatusMutation.isPending
                      ? "Updating..."
                      : "Reject Incident"}
                  </button>
                )}
                {incident.status !== "OPEN" && (
                  <button
                    onClick={() => handleStatusUpdate("OPEN")}
                    disabled={updateStatusMutation.isPending}
                    className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateStatusMutation.isPending
                      ? "Updating..."
                      : "Re-open Incident"}
                  </button>
                )}
              </div>
            </div>
          )}
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
				
				.ql-editor-preview h1 {
					font-size: 1.5rem;
					line-height: 1.3;
					margin-top: 1rem;
					margin-bottom: 0.75rem;
				}
				
				.ql-editor-preview h2 {
					font-size: 1.25rem;
					line-height: 1.4;
					margin-top: 0.875rem;
					margin-bottom: 0.625rem;
				}
				
				.ql-editor-preview h3 {
					font-size: 1.125rem;
					line-height: 1.4;
					margin-top: 0.75rem;
					margin-bottom: 0.5rem;
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
				
				.ql-editor-preview a:hover {
					color: #1d4ed8;
				}
			`}</style>
    </div>
  );
};

export default IncidentDetailsPage;
