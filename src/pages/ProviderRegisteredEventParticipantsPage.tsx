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

// Mock event data
const mockEvent = {
  id: 1,
  title: "Local City Tour, 2025",
  date: "22nd Nov - 29 Nov, 2025",
  time: "8:00 AM - 12:00 PM",
  location: "Albion Park, AU",
  image: null,
  description: `Discover the beauty, culture, and hidden gems of your city in an unforgettable experience designed to connect you with your surroundings. The Local City Tour offers participants the opportunity to visit key landmarks, historic sites, and entertainment hotspots while engaging with local guides who share stories, traditions, and facts that bring the city to life.

This tour is perfect for residents who want to rediscover their home, newcomers eager to explore, or travelers seeking an authentic city adventure. Expect a blend of sightseeing, cultural immersion, photo opportunities, and fun group activities along the way.

Participants will enjoy stops at major attractions, local markets, art districts, and recreational centers. Light refreshments and breaks are included to ensure comfort throughout the journey.

Whether you're joining solo or with friends, the Local City Tour promises an exciting, social, and educational day out that helps you see your city from a fresh perspective.`,
  highlights: [
    "Enjoy a fun and informative tour led by local experts who share fascinating stories about the city's history and culture.",
    "Visit iconic attractions as well as lesser-known spots that showcase the city's unique charm.",
    "Immerse yourself in the local lifestyle through art, music, markets, and street food.",
    "Immerse yourself in the local lifestyle through art, music, markets, and street food.",
  ],
};

// Mock participants data
const mockParticipants = {
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
    .map((p, i) => ({ ...p, id: i + 1 })),
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
    .map((p, i) => ({ ...p, id: i + 100 })),
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
  const { user } = useAuth();
  const { eventId } = useParams(); // will be used to fetch real data
  const [currentTab, setCurrentTab] = useState<TabType>("accepted");
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleAccept = (participantId: number) => {
    console.log("Accept participant:", participantId);
    // Add your accept logic here
  };

  const handleReject = (participantId: number) => {
    console.log("Reject participant:", participantId);
    // Add your reject logic here
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
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200 bg-white">
                {paginatedParticipants.map((participant, index) => (
                  <TableRow
                    key={participant.id + index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <span className="text-sm font-semibold text-gray-900">
                          {participant.name}
                        </span>
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
                      {participant.reason}
                    </TableCell>
                    <TableCell className="px-4 md:px-6 py-4 text-right">
                      {currentTab === "new" ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleAccept(participant.id)}
                            title="Accept"
                          >
                            <CheckCircle className="h-5 w-5 text-primary" />
                          </button>
                          <button
                            onClick={() => handleReject(participant.id)}
                            title="Reject"
                          >
                            <CloseCircle className="h-5 w-5 text-red-600" />
                          </button>
                        </div>
                      ) : currentTab === "accepted" ? (
                        <button
                          onClick={() => handleReject(participant.id)}
                          title="Reject"
                          className="flex items-center justify-end"
                        >
                          <CloseCircle className="h-5 w-5 text-red-600" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAccept(participant.id)}
                          title="Accept"
                          className="flex items-center justify-end"
                        >
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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
