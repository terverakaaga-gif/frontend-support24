import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AltArrowLeft,
  AltArrowRight,
  CheckCircle,
  ClockCircle,
  CloseCircle,
  DocumentText,
  Eye,
  Magnifer,
  Shield,
  UsersGroupRounded,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  ICompliance,
  ComplianceStatus,
  DOCUMENT_TYPE_LABELS,
  COMPLIANCE_QUESTION_LABELS,
  IComplianceAnswers,
} from "@/types/compliance.types";
import {
  useGetComplianceStatistics,
  useGetPendingCompliances,
  useGetComplianceById,
  useReviewCompliance,
} from "@/hooks/useComplianceHooks";

const REJECTION_REASONS = [
  "Missing or incomplete documents",
  "Documents are expired",
  "Poor document quality / unreadable",
  "Information mismatch",
  "Documents not authenticated",
  "Missing required certifications",
  "Failed background check verification",
  "Other",
];

export default function ComplianceManagementPage() {
  const { user, logout } = useAuth();

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Detail dialog
  const [selectedComplianceId, setSelectedComplianceId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Review dialog
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<"approved" | "rejected">("approved");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [adminNotes, setAdminNotes] = useState("");

  // React Query hooks
  const { data: statistics, isLoading: isLoadingStats } = useGetComplianceStatistics();
  
  const { data: compliancesData, isLoading: isLoadingList } = useGetPendingCompliances({
    status: statusFilter === "all" ? undefined : statusFilter as ComplianceStatus,
    page: currentPage,
    limit: itemsPerPage,
  });

  const { data: selectedCompliance, isLoading: isLoadingDetail } = useGetComplianceById(
    selectedComplianceId || undefined
  );

  const reviewMutation = useReviewCompliance();

  // Derived data
  const compliances = compliancesData?.compliances || [];
  const totalItems = compliancesData?.totalResults || 0;
  const isLoading = isLoadingStats;

  // Filter compliances by search query
  const filteredCompliances = useMemo(() => {
    if (!searchQuery) return compliances;
    const query = searchQuery.toLowerCase();
    return compliances.filter((c: ICompliance) => 
      c.workerId?.firstName?.toLowerCase().includes(query) ||
      c.workerId?.lastName?.toLowerCase().includes(query) ||
      c.workerId?.email?.toLowerCase().includes(query)
    );
  }, [compliances, searchQuery]);

  const handleViewDetails = (compliance: ICompliance) => {
    setSelectedComplianceId(compliance._id);
    setIsDetailOpen(true);
  };

  const handleOpenReview = () => {
    setReviewDecision("approved");
    setSelectedReasons([]);
    setAdminNotes("");
    setIsReviewOpen(true);
  };

  const handleToggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmitReview = () => {
    if (!selectedComplianceId) return;

    if (reviewDecision === "rejected" && selectedReasons.length === 0) {
      toast.error("Please select at least one rejection reason");
      return;
    }

    reviewMutation.mutate(
      {
        complianceId: selectedComplianceId,
        data: {
          decision: reviewDecision,
          rejectionReasons: reviewDecision === "rejected" ? selectedReasons : undefined,
          adminNotes: adminNotes || undefined,
        },
      },
      {
        onSuccess: () => {
          setIsReviewOpen(false);
          setIsDetailOpen(false);
          setSelectedComplianceId(null);
        },
      }
    );
  };

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case ComplianceStatus.APPROVED:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case ComplianceStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case ComplianceStatus.REJECTED:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case ComplianceStatus.DRAFT:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-8">
      <GeneralHeader
        title="Compliance Management"
        subtitle="Review and approve worker compliance submissions"
        user={user}
        onLogout={logout}
        onViewProfile={() => {}}
      />

      <div className="">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <UsersGroupRounded className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-16" /> : statistics?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <ClockCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : statistics?.pending || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : statistics?.approved || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <CloseCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : statistics?.rejected || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingList ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-10" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredCompliances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      No compliance submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompliances.map((compliance) => (
                    <TableRow key={compliance._id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewDetails(compliance)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={compliance.workerId?.profileImage} />
                            <AvatarFallback>
                              {compliance.workerId?.firstName?.[0] || "?"}{compliance.workerId?.lastName?.[0] || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {compliance.workerId?.firstName || "Unknown"} {compliance.workerId?.lastName || "Worker"}
                            </p>
                            <p className="text-sm text-gray-500">{compliance.workerId?.email || "No email"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(compliance.status)}</TableCell>
                      <TableCell>{compliance.documents?.length || 0}</TableCell>
                      <TableCell>
                        {compliance.submittedAt 
                          ? format(new Date(compliance.submittedAt), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewDetails(compliance); }}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <AltArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <AltArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              Compliance Details
            </DialogTitle>
            <DialogDescription>
              Review the worker's compliance submission
            </DialogDescription>
          </DialogHeader>

          {selectedCompliance && (
            <div className="space-y-6">
              {/* Worker Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={selectedCompliance.workerId?.profileImage} />
                  <AvatarFallback>
                    {selectedCompliance.workerId?.firstName?.[0] || "?"}{selectedCompliance.workerId?.lastName?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">
                    {selectedCompliance.workerId?.firstName || "Unknown"} {selectedCompliance.workerId?.lastName || "Worker"}
                  </p>
                  <p className="text-gray-500">{selectedCompliance.workerId?.email || "No email"}</p>
                </div>
                <div className="ml-auto">
                  {getStatusBadge(selectedCompliance.status)}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <DocumentText className="h-4 w-4" />
                  Uploaded Documents ({selectedCompliance.documents?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedCompliance.documents?.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{DOCUMENT_TYPE_LABELS[doc.type] || doc.type}</p>
                        {doc.expiryDate && (
                          <p className="text-sm text-gray-500">
                            Expires: {format(new Date(doc.expiryDate), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Answers */}
              <div>
                <h4 className="font-semibold mb-3">Compliance Answers</h4>
                <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                  {selectedCompliance.complianceAnswers && Object.entries(selectedCompliance.complianceAnswers).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm text-gray-700 flex-1 pr-4">
                        {COMPLIANCE_QUESTION_LABELS[key as keyof IComplianceAnswers] || key}
                      </span>
                      <Badge className={value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                        {value ? "Yes" : "No"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection info if rejected */}
              {selectedCompliance.status === ComplianceStatus.REJECTED && selectedCompliance.rejectionReasons && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Rejection Reasons</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {selectedCompliance.rejectionReasons.map((reason, idx) => (
                      <li key={idx}>• {reason}</li>
                    ))}
                  </ul>
                  {selectedCompliance.adminNotes && (
                    <p className="text-sm text-red-600 mt-2">
                      <strong>Notes:</strong> {selectedCompliance.adminNotes}
                    </p>
                  )}
                </div>
              )}

              {/* Actions for pending */}
              {selectedCompliance.status === ComplianceStatus.PENDING && (
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={handleOpenReview}>
                    Review Submission
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Compliance</DialogTitle>
            <DialogDescription>
              Approve or reject this compliance submission
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                variant={reviewDecision === "approved" ? "default" : "outline"}
                className={reviewDecision === "approved" ? "flex-1 bg-green-600 hover:bg-green-700" : "flex-1"}
                onClick={() => setReviewDecision("approved")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant={reviewDecision === "rejected" ? "default" : "outline"}
                className={reviewDecision === "rejected" ? "flex-1 bg-red-600 hover:bg-red-700" : "flex-1"}
                onClick={() => setReviewDecision("rejected")}
              >
                <CloseCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>

            {reviewDecision === "rejected" && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Rejection Reasons <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-lg p-3">
                  {REJECTION_REASONS.map((reason) => (
                    <div key={reason} className="flex items-center gap-2">
                      <Checkbox
                        id={reason}
                        checked={selectedReasons.includes(reason)}
                        onCheckedChange={() => handleToggleReason(reason)}
                      />
                      <label htmlFor={reason} className="text-sm cursor-pointer">
                        {reason}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">
                Admin Notes (optional)
              </label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={reviewMutation.isPending}
              className={reviewDecision === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {reviewMutation.isPending ? "Submitting..." : `Confirm ${reviewDecision === "approved" ? "Approval" : "Rejection"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
