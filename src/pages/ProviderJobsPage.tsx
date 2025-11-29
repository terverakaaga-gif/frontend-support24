import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AltArrowLeft,
  AltArrowRight,
  AddCircle,
  SuitcaseTag,
  Star,
  MapPoint,
  DollarMinimalistic,
} from "@solar-icons/react";
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { PostCard, Post } from "@/components/provider/PostCard";

// Mock jobs/support workers data
const mockJobs: Post[] = [
  {
    type: "job",
    id: 1,
    title: "Support Worker Position",
    workerName: "Sarah Johnson",
    skills: ["Personal Care", "Mobility Assistance", "Meal Prep", "Transport"],
    hourlyRate: 35,
    availability: "Full-time",
    location: "Sydney, NSW",
    applicants: 8,
    status: "Available",
    rating: 4.8,
    experience: "5 years",
    image: null,
  },
  {
    type: "job",
    id: 2,
    title: "Care Assistant",
    workerName: "Michael Chen",
    skills: ["Transport", "Social Support", "Household Tasks"],
    hourlyRate: 32,
    availability: "Part-time",
    location: "Melbourne, VIC",
    applicants: 5,
    status: "Available",
    rating: 4.5,
    experience: "3 years",
    image: null,
  },
  {
    type: "job",
    id: 3,
    title: "Disability Support",
    workerName: "Emma Williams",
    skills: ["Behavior Support", "Therapy Support", "Community Access"],
    hourlyRate: 40,
    availability: "Casual",
    location: "Brisbane, QLD",
    applicants: 12,
    status: "Available",
    rating: 4.9,
    experience: "7 years",
    image: null,
  },
  {
    type: "job",
    id: 4,
    title: "Personal Care Worker",
    workerName: "David Brown",
    skills: ["Personal Care", "Medication Support", "Mobility Assistance"],
    hourlyRate: 38,
    availability: "Full-time",
    location: "Perth, WA",
    applicants: 3,
    status: "Unavailable",
    rating: 4.6,
    experience: "4 years",
    image: null,
  },
  {
    type: "job",
    id: 5,
    title: "Community Support Worker",
    workerName: "Lisa Anderson",
    skills: ["Community Access", "Social Support", "Transport"],
    hourlyRate: 33,
    availability: "Part-time",
    location: "Adelaide, SA",
    applicants: 7,
    status: "Available",
    rating: 4.7,
    experience: "2 years",
    image: null,
  },
  {
    type: "job",
    id: 6,
    title: "Senior Care Specialist",
    workerName: "James Wilson",
    skills: ["Personal Care", "Meal Prep", "Medication Support", "Mobility Assistance"],
    hourlyRate: 45,
    availability: "Full-time",
    location: "Canberra, ACT",
    applicants: 15,
    status: "Available",
    rating: 5.0,
    experience: "10 years",
    image: null,
  },
];

type FilterType = "all" | "available" | "unavailable";
type AvailabilityType = "all" | "full-time" | "part-time" | "casual";

export default function ProviderJobsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityType>("all");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter jobs based on status and availability
  const filteredJobs = mockJobs.filter((job) => {
    if (job.type !== "job") return false;
    
    const matchesSearch = 
      job.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus =
      currentFilter === "all" ||
      job.status.toLowerCase() === currentFilter;
    
    const matchesAvailability =
      availabilityFilter === "all" ||
      job.availability.toLowerCase() === availabilityFilter;
    
    return matchesSearch && matchesStatus && matchesAvailability;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handleDelete = (id: number | string) => {
    console.log("Delete job listing:", id);
    // Add delete confirmation dialog and logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <GeneralHeader
        stickyTop={true}
        title="Support Workers"
        subtitle="Browse and manage support worker listings"
        user={user}
        onLogout={() => {}}
        onViewProfile={() => navigate("/provider/profile")}
        rightComponent={
          <div className="w-fit flex gap-2">
            <Input
              placeholder="Search by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 md:w-64"
            />
            <Button
              onClick={() => navigate("/provider/jobs/create")}
              className="bg-primary hover:bg-primary-700"
            >
              <AddCircle className="h-5 w-5 mr-2" />
              Create Jobs
            </Button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="mb-8 md:mb-12 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {/* Status Filters */}
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "all"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setCurrentFilter("all");
                setCurrentPage(1);
              }}
            >
              All
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "available"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setCurrentFilter("available");
                setCurrentPage(1);
              }}
            >
              Available
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "unavailable"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setCurrentFilter("unavailable");
                setCurrentPage(1);
              }}
            >
              Unavailable
            </Button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Availability Type Filters */}
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                availabilityFilter === "all"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setAvailabilityFilter("all");
                setCurrentPage(1);
              }}
            >
              All Types
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                availabilityFilter === "full-time"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setAvailabilityFilter("full-time");
                setCurrentPage(1);
              }}
            >
              Full-time
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                availabilityFilter === "part-time"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setAvailabilityFilter("part-time");
                setCurrentPage(1);
              }}
            >
              Part-time
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                availabilityFilter === "casual"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => {
                setAvailabilityFilter("casual");
                setCurrentPage(1);
              }}
            >
              Casual
            </Button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentJobs.map((job) => (
            <PostCard
              key={job.id}
              post={job}
              basePath="/provider/jobs"
              onDelete={handleDelete}
            />
          ))}
        </div>

        {currentJobs.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            <SuitcaseTag className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="font-semibold">No support workers found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {currentJobs.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-lg">
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
        )}
      </div>
    </div>
  );
}