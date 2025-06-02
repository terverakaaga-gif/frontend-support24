import { useState } from "react";
import { Search, X, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// Sample Australian support worker data
const mockSupportWorkers = [
  {
    id: "sw1",
    name: "Olivia Thompson",
    avatar: "OT",
    location: "Sydney, NSW",
    skills: ["personal-care", "transport", "social-support"],
    experience: "5 years",
    rate: "$38/hr",
    bio: "Experienced support worker from Bondi with a passion for helping others live their best lives.",
  },
  {
    id: "sw2",
    name: "Liam Wilson",
    avatar: "LW",
    location: "Melbourne, VIC",
    skills: ["therapy", "household", "medication-management"],
    experience: "3 years",
    rate: "$35/hr",
    bio: "Qualified support worker specialized in therapy assistance and household management.",
  },
  {
    id: "sw3",
    name: "Charlotte Davis",
    avatar: "CD",
    location: "Brisbane, QLD",
    skills: ["personal-care", "first-aid", "meal-preparation"],
    experience: "7 years",
    rate: "$42/hr",
    bio: "Brisbane-based carer with first aid certification and extensive experience in personal care.",
  },
  {
    id: "sw4",
    name: "Mason Johnson",
    avatar: "MJ",
    location: "Perth, WA",
    skills: ["transport", "behavior-support", "social-support"],
    experience: "2 years",
    rate: "$32/hr",
    bio: "Support worker focused on community integration and behavior support strategies.",
  },
  {
    id: "sw5",
    name: "Isabella Smith",
    avatar: "IS",
    location: "Adelaide, SA",
    skills: ["communication", "household", "meal-preparation"],
    experience: "4 years",
    rate: "$36/hr",
    bio: "Adelaide native specializing in communication support and independent living skills.",
  },
];

interface SearchSupportWorkersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchSupportWorkers({
  open,
  onOpenChange,
}: SearchSupportWorkersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(mockSupportWorkers);
  const [pendingInvites, setPendingInvites] = useState<Record<string, boolean>>(
    {}
  );
  const [loadingInvites, setLoadingInvites] = useState<Record<string, boolean>>(
    {}
  );
  const [alertOpen, setAlertOpen] = useState(false);
  const [currentInvite, setCurrentInvite] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchResults(mockSupportWorkers);
      return;
    }

    const filtered = mockSupportWorkers.filter(
      (worker) =>
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        worker.bio.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
  };

  const sendInvite = (workerId: string, workerName: string) => {
    // Set loading state for this specific worker
    setLoadingInvites((prev) => ({ ...prev, [workerId]: true }));

    // Simulate API call delay
    setTimeout(() => {
      setLoadingInvites((prev) => ({ ...prev, [workerId]: false }));
      setPendingInvites((prev) => ({ ...prev, [workerId]: true }));

      // Set current invite for alert dialog
      setCurrentInvite({ id: workerId, name: workerName });
      setAlertOpen(true);

      // In a real application, this would trigger an API call to notify the admin
      console.log(
        `Admin notification: Participant invited ${workerName} (ID: ${workerId}) to their network`
      );
    }, 2000); // 2 second loading time
  };

  const handleViewProfile = (workerId: string) => {
    onOpenChange(false); // Close the search dialog
    navigate(`/support-worker/profile/${workerId}`);
  };

  const renderSkillBadge = (skill: string) => {
    const skillMap: Record<string, { label: string; color: string }> = {
      "personal-care": {
        label: "Personal Care",
        color: "bg-[#1e3b93]/10 text-[#1e3b93] border-[#1e3b93]/20",
      },
      transport: {
        label: "Transport",
        color: "bg-blue-50 text-blue-700 border-blue-200",
      },
      therapy: {
        label: "Therapy",
        color: "bg-purple-50 text-purple-700 border-purple-200",
      },
      "social-support": {
        label: "Social Support",
        color: "bg-green-50 text-green-700 border-green-200",
      },
      household: {
        label: "Household",
        color: "bg-amber-50 text-amber-700 border-amber-200",
      },
      communication: {
        label: "Communication",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      },
      "behavior-support": {
        label: "Behavior Support",
        color: "bg-red-50 text-red-700 border-red-200",
      },
      "medication-management": {
        label: "Medication",
        color: "bg-teal-50 text-teal-700 border-teal-200",
      },
      "meal-preparation": {
        label: "Meal Prep",
        color: "bg-orange-50 text-orange-700 border-orange-200",
      },
      "first-aid": {
        label: "First Aid",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
    };

    const { label, color } = skillMap[skill] || {
      label: skill,
      color: "bg-gray-50 text-gray-700 border-gray-200",
    };

    return (
      <span
        key={skill}
        className={`text-xs px-2 py-1 rounded-full border ${color} inline-block mr-1 mb-1 font-medium`}
      >
        {label}
      </span>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-[#1e3b93]/10">
          <DialogHeader className="border-b border-[#1e3b93]/10 pb-4">
            <DialogTitle className="text-xl font-semibold text-[#1e3b93]">
              Find Support Workers
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Search for qualified support workers across Australia to add to
              your care network.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <form onSubmit={handleSearch} className="flex space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1e3b93]/60" />
                <Input
                  type="search"
                  placeholder="Search by name, location, or skills..."
                  className="pl-10 border-[#1e3b93]/20 focus:border-[#1e3b93] focus-visible:ring-[#1e3b93]/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults(mockSupportWorkers);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1e3b93]/60 hover:text-[#1e3b93] transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                className="bg-[#1e3b93] hover:bg-[#1e3b93]/90 px-6"
              >
                Search
              </Button>
            </form>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-[#1e3b93]/10 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-[#1e3b93]/60" />
                </div>
                <p className="text-muted-foreground text-lg">
                  No support workers found matching your search.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search terms or browse all workers.
                </p>
              </div>
            ) : (
              searchResults.map((worker) => (
                <div
                  key={worker.id}
                  className="border border-[#1e3b93]/10 rounded-lg p-5 hover:shadow-md hover:border-[#1e3b93]/20 transition-all duration-200 bg-white"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <Avatar className="h-16 w-16 border-2 border-[#1e3b93]/10">
                        <AvatarFallback className="bg-[#1e3b93] text-white text-xl font-semibold">
                          {worker.avatar}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {worker.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {worker.location}
                          </p>
                          <div className="flex items-center gap-3 text-sm mb-3">
                            <span className="font-semibold text-[#1e3b93]">
                              {worker.rate}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              {worker.experience}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {worker.bio}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {worker.skills
                              .slice(0, 3)
                              .map((skill) => renderSkillBadge(skill))}
                            {worker.skills.length > 3 && (
                              <span className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700 border-gray-200 inline-block font-medium">
                                +{worker.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 md:flex-col lg:flex-row md:items-end lg:items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProfile(worker.id)}
                            className="border-[#1e3b93]/20 text-[#1e3b93] hover:bg-[#1e3b93]/10 hover:border-[#1e3b93]/40"
                          >
                            View Profile
                          </Button>
                          {pendingInvites[worker.id] ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="bg-green-50 border-green-200 text-green-700"
                            >
                              <Check size={16} className="mr-1" />
                              Pending
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => sendInvite(worker.id, worker.name)}
                              disabled={loadingInvites[worker.id]}
                              className="bg-[#1e3b93] hover:bg-[#1e3b93]/90"
                            >
                              {loadingInvites[worker.id] ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  Inviting...
                                </>
                              ) : (
                                "Invite"
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for successful invite */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="border-[#1e3b93]/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1e3b93]">
              Invitation Sent
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentInvite && (
                <>
                  Your invitation has been sent to{" "}
                  <span className="font-medium text-[#1e3b93]">
                    {currentInvite.name}
                  </span>
                  . You will be notified when they accept your request.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-[#1e3b93] hover:bg-[#1e3b93]/90">
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
