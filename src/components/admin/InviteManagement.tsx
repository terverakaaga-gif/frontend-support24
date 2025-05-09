import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  ChevronDown, 
  Filter, 
  Search, 
  RefreshCw,
  Info,
  Send
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Define interfaces based on API response
interface RateTimeBand {
  _id: string;
  name: string;
  code: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}

interface ShiftRate {
  rateTimeBandId: RateTimeBand;
  hourlyRate: number;
  _id: string;
}

interface ProposedRates {
  baseHourlyRate: number;
  shiftRates: ShiftRate[];
}

interface Invite {
  inviteId: string;
  workerId: string;
  workerName: string;
  inviteDate: string;
  proposedRates: ProposedRates;
  notes: string;
}

interface OrganizationInvites {
  organizationId: string;
  organizationName: string;
  participantId: string;
  participantName: string;
  invites: Invite[];
}

// Actual API data from the provided JSON
const mockApiResponse: OrganizationInvites[] = [
  {
    organizationId: "681cbad118cb004b3456b169",
    organizationName: "Michael's Organization",
    participantId: "681cbad018cb004b3456b166",
    participantName: "Michael Hishen",
    invites: [
      {
        inviteId: "681cbff42481ff70cf87ae9a",
        workerId: "6813df5a4d13ec4234a33960",
        workerName: "Priscilla Friday",
        inviteDate: "2025-05-08T14:30:12.827Z",
        proposedRates: {
          baseHourlyRate: 35,
          shiftRates: [
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05c",
                name: "Morning Shift",
                code: "MORNING",
                startTime: "06:00",
                endTime: "14:00",
                isActive: true
              },
              hourlyRate: 35,
              _id: "681cbff42481ff70cf87ae9b"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05d",
                name: "Afternoon Shift",
                code: "AFTERNOON",
                startTime: "14:00",
                endTime: "22:00",
                isActive: true
              },
              hourlyRate: 40,
              _id: "681cbff42481ff70cf87ae9c"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05e",
                name: "Night Shift",
                code: "NIGHT",
                startTime: "22:00",
                endTime: "06:00",
                isActive: true
              },
              hourlyRate: 45,
              _id: "681cbff42481ff70cf87ae9d"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05f",
                name: "Weekend Shift",
                code: "WEEKEND",
                isActive: true
              },
              hourlyRate: 50,
              _id: "681cbff42481ff70cf87ae9e"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d060",
                name: "Public Holiday Shift",
                code: "HOLIDAY",
                isActive: true
              },
              hourlyRate: 65,
              _id: "681cbff42481ff70cf87ae9f"
            }
          ]
        },
        notes: "Looking for regular support 3 days per week, primarily morning shifts with occasional weekend help."
      }
    ]
  },
  {
    organizationId: "681cc78768061d1d6cb4b670",
    organizationName: "Adams's Organization",
    participantId: "681cc78668061d1d6cb4b66d",
    participantName: "Adams Ben",
    invites: [
      {
        inviteId: "681cc85968061d1d6cb4b67c",
        workerId: "68148b23f8b7c8445a42a932",
        workerName: "John Doe",
        inviteDate: "2025-05-08T15:06:01.095Z",
        proposedRates: {
          baseHourlyRate: 30,
          shiftRates: [
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05c",
                name: "Morning Shift",
                code: "MORNING",
                startTime: "06:00",
                endTime: "14:00",
                isActive: true
              },
              hourlyRate: 30,
              _id: "681cc85968061d1d6cb4b67d"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05d",
                name: "Afternoon Shift",
                code: "AFTERNOON",
                startTime: "14:00",
                endTime: "22:00",
                isActive: true
              },
              hourlyRate: 35,
              _id: "681cc85968061d1d6cb4b67e"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05e",
                name: "Night Shift",
                code: "NIGHT",
                startTime: "22:00",
                endTime: "06:00",
                isActive: true
              },
              hourlyRate: 40,
              _id: "681cc85968061d1d6cb4b67f"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05f",
                name: "Weekend Shift",
                code: "WEEKEND",
                isActive: true
              },
              hourlyRate: 45,
              _id: "681cc85968061d1d6cb4b680"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d060",
                name: "Public Holiday Shift",
                code: "HOLIDAY",
                isActive: true
              },
              hourlyRate: 60,
              _id: "681cc85968061d1d6cb4b681"
            }
          ]
        },
        notes: "Looking for regular support 3 days per week, primarily morning shifts with occasional weekend help."
      },
      {
        inviteId: "681d8f0c68061d1d6cb4b6d0",
        workerId: "6813df5a4d13ec4234a33960",
        workerName: "Priscilla Friday",
        inviteDate: "2025-05-09T05:13:48.065Z",
        proposedRates: {
          baseHourlyRate: 30,
          shiftRates: [
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05c",
                name: "Morning Shift",
                code: "MORNING",
                startTime: "06:00",
                endTime: "14:00",
                isActive: true
              },
              hourlyRate: 30,
              _id: "681d8f0c68061d1d6cb4b6d1"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05d",
                name: "Afternoon Shift",
                code: "AFTERNOON",
                startTime: "14:00",
                endTime: "22:00",
                isActive: true
              },
              hourlyRate: 35,
              _id: "681d8f0c68061d1d6cb4b6d2"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05e",
                name: "Night Shift",
                code: "NIGHT",
                startTime: "22:00",
                endTime: "06:00",
                isActive: true
              },
              hourlyRate: 40,
              _id: "681d8f0c68061d1d6cb4b6d3"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05f",
                name: "Weekend Shift",
                code: "WEEKEND",
                isActive: true
              },
              hourlyRate: 45,
              _id: "681d8f0c68061d1d6cb4b6d4"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d060",
                name: "Public Holiday Shift",
                code: "HOLIDAY",
                isActive: true
              },
              hourlyRate: 60,
              _id: "681d8f0c68061d1d6cb4b6d5"
            }
          ]
        },
        notes: "Looking for regular support 3 days per week, primarily morning shifts with occasional weekend help."
      },
      {
        inviteId: "681d916268061d1d6cb4b712",
        workerId: "68147c5fc76eca4fd2ec3efa",
        workerName: "Samson Adaramola",
        inviteDate: "2025-05-09T05:23:46.302Z",
        proposedRates: {
          baseHourlyRate: 30,
          shiftRates: [
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05c",
                name: "Morning Shift",
                code: "MORNING",
                startTime: "06:00",
                endTime: "14:00",
                isActive: true
              },
              hourlyRate: 30,
              _id: "681d916268061d1d6cb4b713"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05d",
                name: "Afternoon Shift",
                code: "AFTERNOON",
                startTime: "14:00",
                endTime: "22:00",
                isActive: true
              },
              hourlyRate: 35,
              _id: "681d916268061d1d6cb4b714"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05e",
                name: "Night Shift",
                code: "NIGHT",
                startTime: "22:00",
                endTime: "06:00",
                isActive: true
              },
              hourlyRate: 40,
              _id: "681d916268061d1d6cb4b715"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d05f",
                name: "Weekend Shift",
                code: "WEEKEND",
                isActive: true
              },
              hourlyRate: 45,
              _id: "681d916268061d1d6cb4b716"
            },
            {
              rateTimeBandId: {
                _id: "681c6f750ab224ca6685d060",
                name: "Public Holiday Shift",
                code: "HOLIDAY",
                isActive: true
              },
              hourlyRate: 60,
              _id: "681d916268061d1d6cb4b717"
            }
          ]
        },
        notes: "Looking for regular support 3 days per week, primarily morning shifts with occasional weekend help."
      }
    ]
  }
];

// Helper function to generate an avatar placeholder
const getAvatarPlaceholder = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`;
  }
  return name.substring(0, 2).toUpperCase();
};

// Flatten invites for table display
const flattenInvites = (orgs: OrganizationInvites[]) => {
  const result: {
    inviteId: string;
    workerId: string;
    workerName: string;
    organizationName: string;
    organizationId: string;
    participantId: string;
    participantName: string;
    inviteDate: string;
    proposedRates: ProposedRates;
    notes: string;
    status: string; // All will be "pending" as requested
  }[] = [];
  
  orgs.forEach(org => {
    org.invites.forEach(invite => {
      result.push({
        ...invite,
        organizationName: org.organizationName,
        organizationId: org.organizationId,
        participantId: org.participantId,
        participantName: org.participantName,
        status: "pending" // All invites set to pending as requested
      });
    });
  });
  
  return result;
};

// Format currency
const formatCurrency = (amount: number) => {
  return `$${amount}`;
};

export function InviteManagement() {
  const [apiData, setApiData] = useState<OrganizationInvites[]>(mockApiResponse);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [flattenedInvites, setFlattenedInvites] = useState<any[]>([]);
  
  // Process and flatten the invites when apiData changes
  useEffect(() => {
    const flattened = flattenInvites(apiData);
    setFlattenedInvites(flattened);
    console.log("Total invites:", flattened.length); // Debug log
  }, [apiData]);
  
  // Filter invitations based on search query and status filter
  const filteredInvitations = flattenedInvites.filter(invite => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      invite.participantName.toLowerCase().includes(searchLower) ||
      invite.workerName.toLowerCase().includes(searchLower) ||
      invite.organizationName.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter ? invite.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleMakeInvitationAvailable = (inviteId: string) => {
    // Just update the UI state to reflect action was taken
    toast({
      title: "Invitation Made Available",
      description: `Invitation is now available to the support worker`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Accepted</Badge>;
      case "declined":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Connection Invitations</CardTitle>
            <CardDescription>Manage participant-to-support worker connection requests</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search invitations..."
                className="w-[250px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter ? `Status: ${statusFilter}` : "All statuses"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("accepted")}>
                  Accepted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("declined")}>
                  Declined
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={() => setApiData(mockApiResponse)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground mb-2">
          Total Invitations: {flattenedInvites.length}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Support Worker</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No invitations found
                </TableCell>
              </TableRow>
            ) : (
              filteredInvitations.map((invitation) => (
                <TableRow key={invitation.inviteId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getAvatarPlaceholder(invitation.participantName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{invitation.participantName}</div>
                        <div className="text-sm text-muted-foreground">{invitation.organizationName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getAvatarPlaceholder(invitation.workerName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{invitation.workerName}</div>
                        <div className="text-sm text-muted-foreground">
                          Proposed Rate: {formatCurrency(invitation.proposedRates.baseHourlyRate)}/hr
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                  <TableCell>
                    {new Date(invitation.inviteDate).toLocaleDateString('en-AU', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/invites/${invitation.inviteId}/details`}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8"
                        >
                          <Info className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </Link>
                      
                      {/* Chat button linking to the AdminChat page */}
                      <Link to={`/admin/chat/${invitation.workerId}`}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </Link>
                      
                      {invitation.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                          onClick={() => handleMakeInvitationAvailable(invitation.inviteId)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Make Available
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}