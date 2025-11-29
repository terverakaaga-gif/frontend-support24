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

// Mock job data
const mockJob = {
  id: 1,
  title: "Support Worker Position",
  workerName: "Sarah Johnson",
  location: "Sydney, NSW 2000",
  hourlyRate: 35,
  availability: "Full-time",
};

// Mock applicants data
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
    },
  ],
};

type TabType = "new" | "accepted" | "rejected";

export default function ProviderJobApplicantsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobId } = useParams();
  const [currentTab, setCurrentTab] = useState<TabType>("new");
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleAccept = (applicantId: number) => {
    console.log("Accept applicant:", applicantId);
    // Add your accept logic here
  };

  const handleReject = (applicantId: number) => {
    console.log("Reject applicant:", applicantId);
    // Add your reject logic here
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
                New {mockApplicants.new.length}
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
                Accepted {mockApplicants.accepted.length}
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
                Rejected {mockApplicants.rejected.length}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-white">
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Applicant Name
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden md:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden lg:table-cell">
                    Phone Number
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden xl:table-cell">
                    Experience
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden xl:table-cell">
                    Skills
                  </TableHead>
                  <TableHead className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider hidden 2xl:table-cell">
                    Availability
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
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-gray-600 text-sm font-semibold">
                            {applicant.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-900 block">
                              {applicant.name}
                            </span>
                            <span className="text-xs text-gray-500 md:hidden">
                              {applicant.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                        {applicant.email}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {applicant.phone}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">
                        {applicant.experience}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {applicant.skills.split(", ").slice(0, 2).map((skill, i) => (
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
                      <TableCell className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden 2xl:table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            applicant.availability === "Full-time"
                              ? "bg-blue-100 text-blue-800"
                              : applicant.availability === "Part-time"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {applicant.availability}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 text-right">
                        {currentTab === "new" ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleAccept(applicant.id)}
                              title="Accept"
                              className="p-1 hover:bg-green-50 rounded-full transition-colors"
                            >
                              <CheckCircle className="h-5 w-5 text-primary" />
                            </button>
                            <button
                              onClick={() => handleReject(applicant.id)}
                              title="Reject"
                              className="p-1 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <CloseCircle className="h-5 w-5 text-red-600" />
                            </button>
                          </div>
                        ) : currentTab === "accepted" ? (
                          <button
                            onClick={() => handleReject(applicant.id)}
                            title="Reject"
                            className="flex items-center justify-end p-1 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <CloseCircle className="h-5 w-5 text-red-600" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAccept(applicant.id)}
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
    </div>
  );
}