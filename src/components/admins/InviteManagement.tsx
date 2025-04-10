import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
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
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  ChevronDown, 
  Filter, 
  Search, 
  Mail, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  UserCheck,
  UserX,
  Info
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserFullName } from "@/entities/User";
import { Invitation } from "@/entities/Invitation";
import { toast } from "@/hooks/use-toast";

// Mock data for invitations
const mockInvitations: Invitation[] = [
  {
    _id: "inv1",
    participant: {
      _id: "part1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com.au",
      profileImage: "https://i.pravatar.cc/150?img=1"
    },
    supportWorker: {
      _id: "sw1",
      firstName: "Olivia",
      lastName: "Thompson",
      email: "olivia.thompson@example.com.au",
      profileImage: "https://i.pravatar.cc/150?img=5"
    },
    status: "pending",
    createdAt: new Date("2025-03-15T09:30:00"),
    message: "I would like to connect with you for support services."
  },
  {
    _id: "inv2",
    participant: {
      _id: "part2",
      firstName: "Emma",
      lastName: "Wilson",
      email: "emma.wilson@example.com.au",
      profileImage: "https://i.pravatar.cc/150?img=3"
    },
    supportWorker: {
      _id: "sw2",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@example.com.au",
      profileImage: "https://i.pravatar.cc/150?img=6"
    },
    status: "accepted",
    createdAt: new Date("2025-03-10T14:15:00"),
    updatedAt: new Date("2025-03-11T10:45:00"),
    message: "I need assistance with daily activities."
  },
  {
    _id: "inv3",
    participant: {
      _id: "part3",
      firstName: "David",
      lastName: "Lee",
      email: "david.lee@example.com.au",
      profileImage: "https://i.pravatar.cc/150?img=4"
    },
    supportWorker: {
      _id: "sw3",
      firstName: "Jessica",
      lastName: "White",
      email: "jessica.white@example.com.au",
      profileImage: "https://i.pravatar.cc/150?img=7"
    },
    status: "declined",
    createdAt: new Date("2025-03-05T11:20:00"),
    updatedAt: new Date("2025-03-06T09:15:00"),
    message: "Looking for support with therapy sessions."
  }
];

export function InviteManagement() {
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);

  // Filter invitations based on search query and status filter
  const filteredInvitations = invitations.filter(invitation => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      getUserFullName(invitation.participant).toLowerCase().includes(searchLower) ||
      getUserFullName(invitation.supportWorker).toLowerCase().includes(searchLower) ||
      invitation.participant.email.toLowerCase().includes(searchLower) ||
      invitation.supportWorker.email.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter ? invitation.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleSendMessage = () => {
    if (!selectedInvitation || !messageText.trim()) return;
    
    toast({
      title: "Message Sent",
      description: `Message sent to ${getUserFullName(selectedInvitation.supportWorker)}`,
    });
    
    setMessageText("");
    
    // Log for debugging
    console.log(`Admin notification: Message sent to ${getUserFullName(selectedInvitation.supportWorker)}`);
  };

  const handleUpdateInvitationStatus = (invitationId: string, newStatus: "accepted" | "declined") => {
    setInvitations(prev => 
      prev.map(inv => 
        inv._id === invitationId 
          ? {...inv, status: newStatus, updatedAt: new Date()} 
          : inv
      )
    );

    const invitation = invitations.find(inv => inv._id === invitationId);
    if (invitation) {
      const actionText = newStatus === "accepted" ? "accepted" : "declined";
      toast({
        title: `Invitation ${actionText}`,
        description: `You've ${actionText} the invitation on behalf of ${getUserFullName(invitation.supportWorker)}`,
      });
      
      // Log for debugging
      console.log(`Admin notification: ${getUserFullName(invitation.supportWorker)}'s invitation ${actionText}`);
    }
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
            <Button variant="outline" size="sm" onClick={() => setInvitations(mockInvitations)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
                <TableRow key={invitation._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={invitation.participant.profileImage} />
                        <AvatarFallback>{invitation.participant.firstName.charAt(0)}{invitation.participant.lastName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{getUserFullName(invitation.participant)}</div>
                        <div className="text-sm text-muted-foreground">{invitation.participant.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={invitation.supportWorker.profileImage} />
                        <AvatarFallback>{invitation.supportWorker.firstName.charAt(0)}{invitation.supportWorker.lastName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{getUserFullName(invitation.supportWorker)}</div>
                        <div className="text-sm text-muted-foreground">{invitation.supportWorker.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                  <TableCell>
                    {new Date(invitation.createdAt).toLocaleDateString('en-AU', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8"
                            onClick={() => setSelectedInvitation(invitation)}
                          >
                            <Info className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Invitation Details</DialogTitle>
                            <DialogDescription>
                              Review the connection invitation details
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Participant</h4>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={invitation.participant.profileImage} />
                                  <AvatarFallback>{invitation.participant.firstName.charAt(0)}{invitation.participant.lastName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{getUserFullName(invitation.participant)}</div>
                                  <div className="text-sm text-muted-foreground">{invitation.participant.email}</div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Support Worker</h4>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={invitation.supportWorker.profileImage} />
                                  <AvatarFallback>{invitation.supportWorker.firstName.charAt(0)}{invitation.supportWorker.lastName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{getUserFullName(invitation.supportWorker)}</div>
                                  <div className="text-sm text-muted-foreground">{invitation.supportWorker.email}</div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Status</h4>
                              <div>{getStatusBadge(invitation.status)}</div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Dates</h4>
                              <div className="text-sm">
                                <div>
                                  <span className="text-muted-foreground">Created: </span>
                                  {new Date(invitation.createdAt).toLocaleString('en-AU')}
                                </div>
                                {invitation.updatedAt && (
                                  <div>
                                    <span className="text-muted-foreground">Updated: </span>
                                    {new Date(invitation.updatedAt).toLocaleString('en-AU')}
                                  </div>
                                )}
                              </div>
                            </div>
                            {invitation.message && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Message</h4>
                                <div className="text-sm bg-muted p-3 rounded-md">
                                  {invitation.message}
                                </div>
                              </div>
                            )}
                            {invitation.adminNotes && (
                              <div className="space-y-2">
                                <h4 className="font-medium">Admin Notes</h4>
                                <div className="text-sm bg-muted p-3 rounded-md">
                                  {invitation.adminNotes}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8"
                            onClick={() => setSelectedInvitation(invitation)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Message to Support Worker</DialogTitle>
                            <DialogDescription>
                              Notify {getUserFullName(invitation.supportWorker)} about this invitation
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                              <Avatar>
                                <AvatarImage src={invitation.supportWorker.profileImage} />
                                <AvatarFallback>{invitation.supportWorker.firstName.charAt(0)}{invitation.supportWorker.lastName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{getUserFullName(invitation.supportWorker)}</div>
                                <div className="text-sm text-muted-foreground">{invitation.supportWorker.email}</div>
                              </div>
                            </div>
                            <Textarea
                              placeholder="Write a message about this invitation..."
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              className="min-h-[120px]"
                            />
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                              onClick={handleSendMessage}
                              disabled={!messageText.trim()}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Send Message
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      {invitation.status === "pending" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50" 
                            onClick={() => handleUpdateInvitationStatus(invitation._id, "accepted")}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50" 
                            onClick={() => handleUpdateInvitationStatus(invitation._id, "declined")}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </>
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