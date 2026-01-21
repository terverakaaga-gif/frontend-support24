import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Magnifer, BellBing, Letter, Star, Refresh } from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompareModal } from "@/components/my-panel/CompareModal";

interface PanelMember {
  id: number;
  name: string;
  type: "Provider" | "Support Worker";
  status: "Active" | "Inactive";
  rating: number;
  distance: number;
  price: number;
  logo: string | null;
  isFavorite: boolean;
}

// Mock data
const mockPanelMembers: PanelMember[] = [
  {
    id: 1,
    name: "Hope Care Services Ltd",
    type: "Provider",
    status: "Active",
    rating: 4.5,
    distance: 42,
    price: 40,
    logo: null,
    isFavorite: true,
  },
  {
    id: 2,
    name: "Hope Care Services Ltd",
    type: "Provider",
    status: "Active",
    rating: 4.5,
    distance: 42,
    price: 40,
    logo: null,
    isFavorite: true,
  },
  {
    id: 3,
    name: "Hope Care Services Ltd",
    type: "Provider",
    status: "Active",
    rating: 4.5,
    distance: 42,
    price: 40,
    logo: null,
    isFavorite: true,
  },
];

export default function MyPanelPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [panelMembers, setPanelMembers] = useState<PanelMember[]>(mockPanelMembers);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const toggleFavorite = (id: number) => {
    setPanelMembers(
      panelMembers.map((member) =>
        member.id === id ? { ...member, isFavorite: !member.isFavorite } : member
        )
      );
  };

  const handleRemove = (id: number) => {
    setPanelMembers(panelMembers.filter((member) => member.id !== id));
  };

  const handleCompareClick = () => {
    if (selectedForComparison.length > 0) {
      setShowCompareModal(true);
    }
  };

  const handleCompare = () => {
    const selectedMembers = panelMembers.filter((m) =>
      selectedForComparison.includes(m.id)
    );
    navigate("/support-coordinator/comparison", { state: { members: selectedMembers } });
  };

  const toggleSelection = (id: number) => {
    setSelectedForComparison((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">My Panel</h1>
          <p className="text-gray-600 font-montserrat">
            Manage all trusted and pre-providers and support workers
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Compare Button */}
          <Button
            onClick={handleCompareClick}
            disabled={selectedForComparison.length === 0}
            className="bg-primary-600 hover:bg-primary-700 text-white font-montserrat-semibold gap-2"
          >
            <Refresh className="h-5 w-5" />
            Compare
          </Button>

          {/* Notification */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/support-coordinator/notifications")}
          >
            <BellBing className="h-6 w-6 text-gray-700" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Avatar */}
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src={user?.profileImage || undefined} />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search by provider or  support workers name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
          <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Service Type Filter */}
        <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal-care">Personal Care</SelectItem>
            <SelectItem value="sil">SIL</SelectItem>
            <SelectItem value="community-support">Community Support</SelectItem>
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sydney">Sydney</SelectItem>
            <SelectItem value="melbourne">Melbourne</SelectItem>
            <SelectItem value="brisbane">Brisbane</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Panel Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {panelMembers.map((member) => (
          <Card
            key={member.id}
            className={`p-5 border rounded-xl hover:shadow-lg transition-all bg-white relative cursor-pointer ${
              selectedForComparison.includes(member.id)
                ? "ring-2 ring-primary-600 border-primary-600"
                : "border-gray-200"
            }`}
            onClick={() => toggleSelection(member.id)}
          >
            {/* Favorite Star */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(member.id);
              }}
              className="absolute top-4 right-4 z-10"
            >
              <Star
                className={`h-6 w-6 ${
                  member.isFavorite
                    ? "text-primary-600 fill-primary-600"
                    : "text-gray-400"
                }`}
              />
            </button>

            {/* Header with Logo and Info */}
            <div className="flex items-start gap-3 mb-4">
              {member.type === "Provider" ? (
                <div className="h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <img
                    src="/tdesign_logo-cnb-filled.png"
                    alt="Provider logo"
                    className="h-8 w-8"
                />
                </div>
              ) : (
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.logo || undefined} />
                  <AvatarFallback className="bg-red-100 text-red-700 font-montserrat-semibold">
                    GL
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-montserrat-bold text-gray-900 mb-1 truncate">
                  {member.name}
                </h4>
                <Badge className="bg-green-100 text-green-700 text-xs font-montserrat-semibold">
                  {member.status}
                </Badge>
              </div>
            </div>

            {/* Type */}
            <p className="text-sm text-gray-600 font-montserrat mb-3">{member.type}</p>

            {/* Stats */}
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                <span className="font-montserrat">{member.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-montserrat">📍 {member.distance} km</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-montserrat">💰 ${member.price}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-lg hover:bg-primary-50"
              >
                <Letter className="h-5 w-5 text-primary-600" />
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 font-montserrat-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(member.id);
                }}
              >
                {member.type === "Provider" ? "Remove" : "Remove from my Panel"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Compare Modal */}
      <CompareModal
        open={showCompareModal}
        onOpenChange={setShowCompareModal}
        selectedMembers={panelMembers.filter((m) =>
          selectedForComparison.includes(m.id)
        )}
        onCompare={handleCompare}
      />
    </div>
  );
}
