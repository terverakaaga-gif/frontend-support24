import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, UserCheck } from "lucide-react";
import { Invitation } from "@/entities/Invitation";
import { getUserFullName } from "@/entities/User";
import { toast } from "@/hooks/use-toast";

// Mock data for invitations
const mockInvitations: Invitation[] = [
  {
    _id: "inv4",
    participant: {
      _id: "part4",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@example.com.au",
      profileImage: "https://i.pravatar.cc/150?img=8"
    },
    supportWorker: {
      _id: "sw4",
      firstName: "Robert",
      lastName: "Davis",
      email: "robert.davis@example.com.au",
      profileImage: "https://i.pravatar.cc/150?img=9",
    },
    proposedRate: '$50',
    status: "accepted",
    createdAt: new Date("2025-03-20T10:30:00"),
    updatedAt: new Date("2025-03-21T09:15:00"),
    message: "I'm looking for assistance with community activities."
  },
  {
    _id: "inv5",
    participant: {
      _id: "part5",
      firstName: "Thomas",
      lastName: "Wilson",
      email: "thomas.wilson@example.com.au",
      profileImage: "https://i.pravatar.cc/150?img=10"
    },
    supportWorker: {
      _id: "sw4",
      firstName: "Robert",
      lastName: "Davis",
      email: "robert.davis@example.com.au",
      profileImage: "https://i.pravatar.cc/150?img=9"
    },
    proposedRate: '$80',
    status: "pending",
    createdAt: new Date("2025-03-22T14:45:00"),
    message: "I need help with transportation and social activities."
  }
];

export function ParticipantInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);

  const pendingInvitations = invitations.filter(inv => inv.status === "pending");
  const acceptedInvitations = invitations.filter(inv => inv.status === "accepted");

  const handleAcceptInvitation = (invitationId: string) => {
    setInvitations(prev => 
      prev.map(inv => 
        inv._id === invitationId 
          ? {...inv, status: "accepted" as const, updatedAt: new Date()} 
          : inv
      )
    );
    
    const invitation = invitations.find(inv => inv._id === invitationId);
    if (invitation) {
      toast({
        title: "Invitation Accepted",
        description: `You are now connected with ${getUserFullName(invitation.participant)}`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Network</CardTitle>
        <CardDescription>Manage your connections with participants</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {pendingInvitations.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Pending Invitations</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvitations.map(invitation => (
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
                      {new Date(invitation.createdAt).toLocaleDateString('en-AU', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate">
                        {invitation.message || "No message"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleAcceptInvitation(invitation._id)}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium mb-4">My Connections</h3>
          {acceptedInvitations.length === 0 ? (
            <div className="text-center py-8 bg-muted rounded-md">
              <p className="text-muted-foreground">You don't have any connections yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acceptedInvitations.map(invitation => (
                <Card key={invitation._id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={invitation.participant.profileImage} />
                        <AvatarFallback className="text-lg">{invitation.participant.firstName.charAt(0)}{invitation.participant.lastName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{getUserFullName(invitation.participant)}</h3>
                        <p className="text-sm text-muted-foreground">
                          Connected since {new Date(invitation.updatedAt || invitation.createdAt).toLocaleDateString('en-AU', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button variant="secondary" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button variant="secondary" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            View Bookings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}