import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  User, 
  Calendar, 
  FileText, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// User interfaces
export type UserRole = 'admin' | 'participant' | 'supportWorker' | 'guardian';
export type UserStatus = 'active' | 'pending' | 'suspended' | 'inactive';
export type Gender = 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not-to-say';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  profileImage?: string;
  bio?: string;
  
  // Helper virtual property not stored in database
  get fullName(): string;
}

export interface Participant extends User {
  supportNeeds: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

// Mock data for participants
const mockParticipants: Participant[] = [
  {
    _id: "p1",
    email: "emma.wilson@example.com.au",
    firstName: "Emma",
    lastName: "Wilson",
    role: "participant",
    status: "active",
    profileImage: "https://i.pravatar.cc/150?img=1",
    phone: "+61412345678",
    gender: "female",
    dateOfBirth: new Date("1995-05-15"),
    supportNeeds: ["mobility-assistance", "personal-care", "social-support"],
    emergencyContact: {
      name: "James Wilson",
      relationship: "Father",
      phone: "+61487654321"
    },
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  },
  {
    _id: "p2",
    email: "noah.parker@example.com.au",
    firstName: "Noah",
    lastName: "Parker",
    role: "participant",
    status: "active",
    profileImage: "https://i.pravatar.cc/150?img=2",
    phone: "+61423456789",
    gender: "male",
    dateOfBirth: new Date("1988-11-20"),
    supportNeeds: ["therapy", "community-access", "transport"],
    emergencyContact: {
      name: "Sarah Parker",
      relationship: "Sister",
      phone: "+61498765432"
    },
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  },
  {
    _id: "p3",
    email: "olivia.smith@example.com.au",
    firstName: "Olivia",
    lastName: "Smith",
    role: "participant",
    status: "active",
    profileImage: "https://i.pravatar.cc/150?img=3",
    phone: "+61434567890",
    gender: "female",
    dateOfBirth: new Date("2001-04-12"),
    supportNeeds: ["skills-development", "education-support", "social-support"],
    emergencyContact: {
      name: "David Smith",
      relationship: "Father",
      phone: "+61409876543"
    },
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  },
  {
    _id: "p4",
    email: "liam.jones@example.com.au",
    firstName: "Liam",
    lastName: "Jones",
    role: "participant",
    status: "active",
    profileImage: "https://i.pravatar.cc/150?img=4",
    phone: "+61445678901",
    gender: "male",
    dateOfBirth: new Date("1992-08-25"),
    supportNeeds: ["therapy", "personal-care", "household-tasks"],
    emergencyContact: {
      name: "Michelle Jones",
      relationship: "Mother",
      phone: "+61410987654"
    },
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  },
  {
    _id: "p5",
    email: "ava.thompson@example.com.au",
    firstName: "Ava",
    lastName: "Thompson",
    role: "participant",
    status: "active",
    profileImage: "https://i.pravatar.cc/150?img=5",
    phone: "+61456789012",
    gender: "female",
    dateOfBirth: new Date("1997-02-18"),
    supportNeeds: ["community-access", "social-support", "transport"],
    emergencyContact: {
      name: "John Thompson",
      relationship: "Brother",
      phone: "+61421098765"
    },
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  },
  {
    _id: "p6",
    email: "ethan.brown@example.com.au",
    firstName: "Ethan",
    lastName: "Brown",
    role: "participant",
    status: "active",
    profileImage: "https://i.pravatar.cc/150?img=6",
    phone: "+61467890123",
    gender: "male",
    dateOfBirth: new Date("1990-10-05"),
    supportNeeds: ["therapy", "skills-development", "household-tasks"],
    emergencyContact: {
      name: "Lisa Brown",
      relationship: "Wife",
      phone: "+61432109876"
    },
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  }
];

export function SupportWorkersList() {
  const [participants] = useState<Participant[]>(mockParticipants);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [filterSupport, setFilterSupport] = useState("");

  // Filter participants based on search query and support need filter
  const filteredParticipants = participants.filter(participant => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      participant.firstName.toLowerCase().includes(searchLower) ||
      participant.lastName.toLowerCase().includes(searchLower) ||
      participant.email.toLowerCase().includes(searchLower) ||
      (participant.phone && participant.phone.includes(searchQuery));
    
    const matchesFilter = filterSupport === "all" || 
      (participant.supportNeeds && participant.supportNeeds.includes(filterSupport));
    
    return matchesSearch && matchesFilter;
  });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParticipants = filteredParticipants.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination controls
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatSupportNeeds = (supportNeeds: string[] | undefined) => {
    if (!supportNeeds || supportNeeds.length === 0) return "No support needs listed";
    
    return supportNeeds.map(need => {
      const formattedNeed = need.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      return (
        <Badge key={need} variant="outline" className="mr-1 mb-1">
          {formattedNeed}
        </Badge>
      );
    });
  };

  // Format date to a readable string
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dob: Date | undefined) => {
    if (!dob) return "Not specified";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return `${age} years`;
  };

  // Get all unique support needs for filtering
  const allSupportNeeds = Array.from(
    new Set(
      participants.flatMap(p => p.supportNeeds || [])
    )
  ).sort();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Support Workers</CardTitle>
            <CardDescription>View and manage support workers' profiles</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search participants..."
                className="pl-9 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* <Select value={filterSupport} onValueChange={setFilterSupport}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by support need" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All support needs</SelectItem>
                {allSupportNeeds.map(need => (
                  <SelectItem key={need} value={need}>
                    {need.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentParticipants.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No participants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {currentParticipants.map(participant => (
              <Card key={participant._id} className="overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="flex items-start p-4 gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={participant.profileImage} />
                      <AvatarFallback className="text-lg">{participant.firstName.charAt(0)}{participant.lastName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{participant.fullName}</h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {participant._id}
                      </p>
                      <div className="flex flex-wrap mt-2">
                        {formatSupportNeeds(participant.supportNeeds)}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="font-medium">Age:</span> {calculateAge(participant.dateOfBirth)}
                      </div>
                      <div>
                        <span className="font-medium">Gender:</span> {participant.gender ? 
                          participant.gender.charAt(0).toUpperCase() + participant.gender.slice(1) : 
                          "Not specified"}
                      </div>
                      <div>
                        <span className="font-medium">Role:</span> {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {
                          <Badge variant={participant.status === "active" ? "default" : "destructive"} className="ml-1">
                            {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                          </Badge>
                        }
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Emergency Contact:</span> {
                          participant.emergencyContact ? 
                          `${participant.emergencyContact.name} (${participant.emergencyContact.relationship})` : 
                          "Not specified"
                        }
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Address:</span> {
                          participant.address ? 
                          `${participant.address.city}, ${participant.address.state}` : 
                          "Not specified"
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 mt-auto">
                    <Link to={`/participant/profile/${participant._id}`}>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                    <div className="flex gap-2">
                      <Link to={`/participant/schedule/${participant._id}`}>
                        <Button variant="secondary" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </Link>
                      <Link to={`/participant/notes/${participant._id}`}>
                        <Button variant="secondary" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Notes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Showing {filteredParticipants.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredParticipants.length)} of {filteredParticipants.length} participants
          </p>
          {/* <Select value={itemsPerPage.toString()} onValueChange={(value) => {
            setItemsPerPage(parseInt(value));
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="items" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="12">12</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}