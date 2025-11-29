import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPoint,
  Eye,
  AltArrowLeft,
  AltArrowRight,
  AddCircle,
  Home,
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
import { Post, PostCard } from "@/components/provider/PostCard";

// Mock accommodations data
const mockAccommodations = [
  {
    id: 1,
    title: "Ocean View Apartment",
    location: "Wollongong, NSW",
    price: 350,
    priceUnit: "week",
    bedrooms: 2,
    bathrooms: 1,
    interested: 12,
    status: "Available" as const,
    image: null,
    type: "Apartment",
  },
  {
    id: 2,
    title: "Cozy Studio Near Beach",
    location: "Kiama, NSW",
    price: 250,
    priceUnit: "week",
    bedrooms: 1,
    bathrooms: 1,
    interested: 8,
    status: "Available" as const,
    image: null,
    type: "Studio",
  },
  {
    id: 3,
    title: "Family Home with Garden",
    location: "Shellharbour, NSW",
    price: 500,
    priceUnit: "week",
    bedrooms: 4,
    bathrooms: 2,
    interested: 5,
    status: "Occupied" as const,
    image: null,
    type: "House",
  },
  {
    id: 4,
    title: "Modern Unit CBD",
    location: "Wollongong, NSW",
    price: 400,
    priceUnit: "week",
    bedrooms: 2,
    bathrooms: 1,
    interested: 15,
    status: "Available" as const,
    image: null,
    type: "Unit",
  },
  {
    id: 5,
    title: "Accessible Ground Floor Unit",
    location: "Albion Park, NSW",
    price: 320,
    priceUnit: "week",
    bedrooms: 2,
    bathrooms: 1,
    interested: 10,
    status: "Pending" as const,
    image: null,
    type: "Unit",
  },
];

type FilterType = "all" | "available" | "occupied" | "pending";

export default function ProviderAccommodationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter accommodations based on status
  const filteredAccommodations = mockAccommodations.filter((accommodation) => {
    const matchesSearch = accommodation.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      currentFilter === "all" ||
      accommodation.status.toLowerCase() === currentFilter;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredAccommodations.length / parseInt(entriesPerPage)
  );
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentAccommodations = filteredAccommodations.slice(
    startIndex,
    endIndex
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <GeneralHeader
        stickyTop={true}
        title="Accommodations"
        subtitle="Manage all your accommodation listings here"
        user={user}
        onLogout={() => {}}
        onViewProfile={() => navigate("/provider/profile")}
        rightComponent={
          <div className="w-fit flex gap-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 md:w-64"
            />
            <Button
              onClick={() =>
                navigate("/participant/provider/accommodations/create")
              }
              className="bg-primary hover:bg-primary-700"
            >
              <AddCircle className="h-5 w-5 mr-2" />
              Create Accommodation
            </Button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="mb-8 md:mb-12 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "all"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => setCurrentFilter("all")}
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
              onClick={() => setCurrentFilter("available")}
            >
              Available
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "occupied"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => setCurrentFilter("occupied")}
            >
              Occupied
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-6 rounded-full text-xs font-montserrat-semibold ${
                currentFilter === "pending"
                  ? "hover:bg-white"
                  : "bg-gray-50 text-black hover:text-white hover:bg-primary border border-gray-200"
              }`}
              onClick={() => setCurrentFilter("pending")}
            >
              Pending
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentAccommodations.map((accommodation) => (
            <PostCard
              key={accommodation.id}
              post={{...accommodation, type: "accommodation"} as Post}
               basePath="/provider/accommodations"
              onDelete={()=>{}}
            />
          ))}
        </div>

        {currentAccommodations.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            <Home className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="font-semibold">No accommodations found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {currentAccommodations.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
