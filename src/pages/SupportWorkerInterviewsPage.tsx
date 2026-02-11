/**
 * SupportWorkerInterviewsPage
 * 
 * Page for support workers to view and manage their interview invitations.
 * Features:
 * - "New" tab: Shows pending interview invitations with accept/reject options
 * - "Accepted" tab: Shows accepted interviews with a "Join" button for video conference
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Magnifer,
  Calendar,
  ClockCircle,
  MapPoint,
  CheckCircle,
  CloseCircle,
  Videocamera,
  User
} from "@solar-icons/react";
import { DASHBOARD_PAGE_WRAPPER, PAGE_WRAPPER } from "@/lib/design-utils";
import { cn } from "@/lib/utils";
import { GAP, GRID_LAYOUTS, RADIUS } from "@/constants/design-system";
import { useAuth } from "@/contexts/AuthContext";

// UI Components
import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Types
interface InterviewInvitation {
  id: string;
  organizationName: string;
  organizationLogo: string;
  role: string;
  date: string;
  time: string;
  location: string;
  type: 'video' | 'in-person';
  status: 'pending' | 'accepted' | 'rejected';
  description: string;
  interviewerName: string;
  interviewerAvatar: string;
  requirements: string[];
}

// Mock Data
const MOCK_INTERVIEWS: InterviewInvitation[] = [
  {
    id: "1",
    organizationName: "Care Plus Organization",
    organizationLogo: "/logos/careplus.jpg",
    role: "Disability Support Worker",
    date: "2026-01-28",
    time: "10:00 AM - 10:30 AM",
    location: "Video Call",
    type: "video",
    status: "pending",
    description: "Initial screening interview to discuss your experience and assess your fit for our team. We'll cover your background, availability, and situational scenarios.",
    interviewerName: "Sarah Mitchell",
    interviewerAvatar: "/avatars/sarah.jpg",
    requirements: [
      "Valid First Aid Certificate",
      "NDIS Worker Screening Check",
      "Working with Children Check",
      "Driver License (preferred)"
    ]
  },
  {
    id: "2",
    organizationName: "Brimbank Care Services",
    organizationLogo: "/logos/brimbank.jpg",
    role: "Community Support Worker",
    date: "2026-01-30",
    time: "2:00 PM - 2:45 PM",
    location: "123 Main Street, Brimbank VIC",
    type: "in-person",
    status: "pending",
    description: "In-person interview to meet the team and tour our facility. Please bring your original documents for verification.",
    interviewerName: "Michael Chen",
    interviewerAvatar: "/avatars/michael.jpg",
    requirements: [
      "Police Check Certificate",
      "Professional References",
      "Resume/CV"
    ]
  },
  {
    id: "3",
    organizationName: "Sunshine Disability Services",
    organizationLogo: "/logos/sunshine.jpg",
    role: "Support Worker - Evening Shift",
    date: "2026-01-29",
    time: "3:00 PM - 3:30 PM",
    location: "Video Call",
    type: "video",
    status: "accepted",
    description: "Final round interview with the Operations Manager to discuss role expectations and compensation.",
    interviewerName: "Emma Wilson",
    interviewerAvatar: "/avatars/emma.jpg",
    requirements: [
      "Availability for evening shifts",
      "Own transport"
    ]
  },
];

export default function SupportWorkerInterviewsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // State
  const [activeTab, setActiveTab] = useState<"new" | "accepted">("new");
  const [interviews, setInterviews] = useState<InterviewInvitation[]>(MOCK_INTERVIEWS);
  const [selectedInterview, setSelectedInterview] = useState<InterviewInvitation | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<'accept' | 'reject' | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter interviews based on tab
  const filteredInterviews = interviews.filter(interview => {
    const matchesTab = activeTab === "new"
      ? interview.status === "pending"
      : interview.status === "accepted";
    const matchesSearch = interview.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handlers
  const handleAcceptInterview = () => {
    if (selectedInterview) {
      setInterviews(prev => prev.map(i =>
        i.id === selectedInterview.id ? { ...i, status: "accepted" } : i
      ));
      setShowConfirmDialog(null);
      setSelectedInterview(null);
      setActiveTab("accepted");
    }
  };

  const handleRejectInterview = () => {
    if (selectedInterview) {
      setInterviews(prev => prev.filter(i => i.id !== selectedInterview.id));
      setShowConfirmDialog(null);
      setSelectedInterview(null);
    }
  };

  const handleJoinCall = (interview: InterviewInvitation) => {
    setSelectedInterview(interview);
    setShowVideoCall(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={cn(DASHBOARD_PAGE_WRAPPER)}>
      {/* Header */}
      <GeneralHeader
        user={user}
        onLogout={logout}
        onViewProfile={() => navigate("/support-worker/profile")}
        title="My Interviews"
        subtitle="Manage your interview invitations and scheduled calls"
        rightComponent={
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Magnifer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search interviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 h-11 rounded-full bg-white border-gray-200"
              />
            </div>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b md:border-b-0 border-gray-100 pb-2 md:pb-0 w-full md:w-auto mt-6 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab("new")}
          className={cn(
            "px-4 h-6 rounded-full text-xs font-montserrat-semibold whitespace-nowrap",
            activeTab === 'new' ? "bg-primary text-white hover:bg-primary-700" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          New Invitations
          <Badge variant="secondary" className="ml-1 bg-white/20 text-inherit h-5 px-1.5">
            {interviews.filter(i => i.status === 'pending').length}
          </Badge>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab("accepted")}
          className={cn(
            "px-4 h-6 rounded-full text-xs font-montserrat-semibold whitespace-nowrap",
            activeTab === 'accepted' ? "bg-primary text-white hover:bg-primary-700" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          Accepted
          <Badge variant="secondary" className="ml-1 bg-white/20 text-inherit h-5 px-1.5">
            {interviews.filter(i => i.status === 'accepted').length}
          </Badge>
        </Button>
      </div>

      {/* Interview Cards Grid */}
      <div className={cn(GRID_LAYOUTS.responsive, GAP.responsive)}>
        {filteredInterviews.map((interview) => (
          <Card
            key={interview.id}
            className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedInterview(interview)}
          >
            {/* Organization Header */}
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-14 h-14 rounded-lg border border-gray-100">
                <AvatarImage src={interview.organizationLogo} alt={interview.organizationName} />
                <AvatarFallback className="rounded-lg bg-primary-100 text-primary-600 font-montserrat-bold">
                  {getInitials(interview.organizationName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-montserrat-bold text-gray-900 text-lg">{interview.organizationName}</h3>
                <p className="text-sm text-gray-500">{interview.role}</p>
              </div>
              <Badge
                className={cn(
                  "text-xs",
                  interview.type === 'video'
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-50"
                    : "bg-green-50 text-green-600 hover:bg-green-50"
                )}
              >
                {interview.type === 'video' ? 'Video' : 'In-Person'}
              </Badge>
            </div>

            {/* Interview Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{new Date(interview.date).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClockCircle className="w-4 h-4 text-gray-400" />
                <span>{interview.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPoint className="w-4 h-4 text-gray-400" />
                <span className="truncate">{interview.location}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
              {interview.status === 'pending' ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInterview(interview);
                      setShowConfirmDialog('reject');
                    }}
                  >
                    <CloseCircle className="w-4 h-4 mr-1" />
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInterview(interview);
                      setShowConfirmDialog('accept');
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinCall(interview);
                  }}
                >
                  <Videocamera className="w-4 h-4 mr-2" />
                  Join Interview
                </Button>
              )}
            </div>
          </Card>
        ))}

        {/* Empty State */}
        {filteredInterviews.length === 0 && (
          <Card className="col-span-full py-20 text-center text-gray-500 bg-white rounded-xl border-gray-200 border-dashed">
            <p className="font-montserrat-medium">
              {activeTab === 'new'
                ? "No new interview invitations at the moment."
                : "No accepted interviews scheduled."}
            </p>
          </Card>
        )}
      </div>

      {/* Interview Detail Modal */}
      <Dialog open={!!selectedInterview && !showConfirmDialog && !showVideoCall} onOpenChange={() => setSelectedInterview(null)}>
        {selectedInterview && (
          <DialogContent className={cn(RADIUS.lg, "max-w-lg p-0 overflow-hidden")}>
            {/* Header */}
            <div className="bg-primary-50 p-6 border-b border-primary-100">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 rounded-lg border-2 border-white shadow-sm">
                  <AvatarImage src={selectedInterview.organizationLogo} alt={selectedInterview.organizationName} />
                  <AvatarFallback className="rounded-lg bg-primary-600 text-white font-montserrat-bold">
                    {getInitials(selectedInterview.organizationName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-montserrat-bold text-gray-900 text-xl">{selectedInterview.organizationName}</h2>
                  <p className="text-primary-600 font-montserrat-medium">{selectedInterview.role}</p>
                  <Badge className="mt-2 bg-white text-primary-600 border border-primary-200">
                    {selectedInterview.type === 'video' ? 'Video Interview' : 'In-Person Interview'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Schedule Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-montserrat-semibold text-gray-900 text-sm">
                      {new Date(selectedInterview.date).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <ClockCircle className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-montserrat-semibold text-gray-900 text-sm">{selectedInterview.time}</p>
                  </div>
                </div>
              </div>

              {/* Interviewer */}
              <div>
                <h4 className="font-montserrat-bold text-gray-900 text-sm mb-3">Interviewer</h4>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedInterview.interviewerAvatar} />
                    <AvatarFallback>{getInitials(selectedInterview.interviewerName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-montserrat-semibold text-gray-900">{selectedInterview.interviewerName}</p>
                    <p className="text-xs text-gray-500">Hiring Manager</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-montserrat-bold text-gray-900 text-sm mb-2">About This Interview</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedInterview.description}</p>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="font-montserrat-bold text-gray-900 text-sm mb-2">Requirements</h4>
                <ul className="space-y-2">
                  {selectedInterview.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Actions */}
            <DialogFooter className="p-6 pt-0 gap-3">
              {selectedInterview.status === 'pending' ? (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setShowConfirmDialog('reject')}
                  >
                    Decline Invitation
                  </Button>
                  <Button
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                    onClick={() => setShowConfirmDialog('accept')}
                  >
                    Accept Invitation
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleJoinCall(selectedInterview)}
                >
                  <Videocamera className="w-4 h-4 mr-2" />
                  Join Interview Now
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirm Accept Dialog */}
      <Dialog open={showConfirmDialog === 'accept'} onOpenChange={() => setShowConfirmDialog(null)}>
        <DialogContent className="max-w-sm text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-montserrat-bold text-center">Accept Interview?</DialogTitle>
            <DialogDescription className="text-center">
              You're about to accept the interview invitation from <strong>{selectedInterview?.organizationName}</strong>.
              Make sure you're available on the scheduled date and time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-3 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirmDialog(null)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleAcceptInterview}>
              Confirm Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Reject Dialog */}
      <Dialog open={showConfirmDialog === 'reject'} onOpenChange={() => setShowConfirmDialog(null)}>
        <DialogContent className="max-w-sm text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CloseCircle className="w-8 h-8 text-red-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-montserrat-bold text-center">Decline Interview?</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to decline the interview invitation from <strong>{selectedInterview?.organizationName}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-3 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirmDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleRejectInterview}>
              Decline Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Conference Modal - Fullscreen */}
      <Dialog open={showVideoCall} onOpenChange={() => setShowVideoCall(false)}>
        <DialogContent className="max-w-none w-screen h-screen p-0 m-0 rounded-none border-none bg-gray-900">
          {/* Main Video Area - Interviewer */}
          <div className="relative w-full h-full">
            {/* Interviewer Main Video */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <Avatar className="w-40 h-40 border-4 border-gray-600">
                <AvatarImage src={selectedInterview?.interviewerAvatar} />
                <AvatarFallback className="text-5xl bg-primary-600 text-white font-montserrat-bold">
                  {selectedInterview ? getInitials(selectedInterview.interviewerName) : 'IN'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Interviewer Name Label */}
            <div className="absolute bottom-24 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl">
              <span className="text-white font-montserrat-semibold">{selectedInterview?.interviewerName}</span>
              <p className="text-white/70 text-xs">{selectedInterview?.organizationName}</p>
            </div>

            {/* Self View - Small Thumbnail Top Right */}
            <div className="absolute top-6 right-6 w-48 h-36 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700 bg-gradient-to-br from-primary-600 to-primary-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="w-16 h-16 border-2 border-white/30">
                  <AvatarFallback className="text-xl bg-white/20 text-white font-montserrat-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Self Label */}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
                <span className="text-white text-xs font-montserrat-medium">You</span>
              </div>
              {/* Camera indicator */}
              <div className="absolute top-2 right-2 bg-green-500 p-1.5 rounded-full">
                <Videocamera className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Top Left - Meeting Info & Live Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-4">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white font-montserrat-semibold text-sm">Interview Session</span>
                </div>
                <p className="text-white/60 text-xs mt-0.5">{selectedInterview?.organizationName}</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Live
              </Badge>
            </div>

            {/* Video Call Controls - Bottom Center */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl">
              <Button
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full bg-gray-700/80 border-gray-600 text-white hover:bg-gray-600 transition-all"
              >
                <Videocamera className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full bg-gray-700/80 border-gray-600 text-white hover:bg-gray-600 transition-all"
              >
                <User className="w-6 h-6" />
              </Button>
              <Button
                size="icon"
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all"
                onClick={() => setShowVideoCall(false)}
              >
                <CloseCircle className="w-7 h-7" />
              </Button>
            </div>

            {/* Duration Timer - Top Center */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl">
              <span className="text-white font-mono text-lg">00:05:32</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
