import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BellBing,
  Pen,
  TrashBinMinimalistic,
  Eye,
  Letter,
} from "@solar-icons/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock notifications data
const notificationsData = [
  {
    id: 1,
    type: "plan-expiry",
    sender: "Support24",
    senderAvatar: null,
    title: "Plan expiring in 90 days",
    description:
      "Stay informed with timely alerts as your plan approaches expiration in 90 days",
    date: "1 Nov, 2025",
    isRead: false,
  },
  {
    id: 2,
    type: "plan-expiry",
    sender: "Support24",
    senderAvatar: null,
    title: "Plan expiring in 90 days",
    description:
      "Stay informed with timely alerts as your plan approaches expiration in 90 days",
    date: "1 Nov, 2025",
    isRead: false,
  },
  {
    id: 3,
    type: "plan-expiry",
    sender: "Support24",
    senderAvatar: null,
    title: "Plan expiring in 90 days",
    description:
      "Stay informed with timely alerts as your plan approaches expiration in 90 days",
    date: "1 Nov, 2025",
    isRead: false,
  },
  {
    id: 4,
    type: "tender-submission",
    sender: "Matt M",
    senderAvatar: "/avatars/matt.jpg",
    title: "1 Tender Submissions",
    description:
      "You have received 1 new submission for ST24-001234",
    date: "1 Nov, 2025",
    isRead: false,
  },
  {
    id: 5,
    type: "tender-submission",
    sender: "Support24",
    senderAvatar: null,
    title: "3 Tender Submissions",
    description:
      "You have received 3 new submission for ST24-001234",
    date: "1 Nov, 2025",
    isRead: false,
  },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(notificationsData);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [participantFilter, setParticipantFilter] = useState("");

  const toggleNotificationSelection = (id: number) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id]
    );
  };

  const handleViewNotification = (id: number) => {
    navigate(`/support-coordinator/notifications/${id}`);
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedNotifications((prev) => prev.filter((nId) => nId !== id));
  };

  const selectedNotification =
    selectedNotifications.length === 1
      ? notifications.find((n) => n.id === selectedNotifications[0])
      : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-montserrat-bold text-gray-900 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600 font-montserrat">
            Manage all notifications
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification */}
          <Button variant="ghost" size="icon" className="relative">
            <BellBing className="h-6 w-6 text-gray-700" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Avatar */}
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src={user?.profileImage || undefined} />
            <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="plan-expiry">Plan Expiry</SelectItem>
            <SelectItem value="tender-submission">Tender Submission</SelectItem>
            <SelectItem value="alert">Alert</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Participant Filter */}
        <Select value={participantFilter} onValueChange={setParticipantFilter}>
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Participant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jane-doe">Jane Doe</SelectItem>
            <SelectItem value="john-smith">John Smith</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {notifications.map((notification) => {
          const isSelected = selectedNotifications.includes(notification.id);
          return (
            <div
              key={notification.id}
              className={`flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0 transition-colors ${
                isSelected ? "bg-primary-50" : "hover:bg-gray-50"
              }`}
            >
              {/* Checkbox */}
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleNotificationSelection(notification.id)}
                className="border-gray-300"
              />

              {/* Avatar/Logo */}
              {notification.senderAvatar ? (
                <Avatar className="h-12 w-12">
                  <AvatarImage src={notification.senderAvatar} />
                  <AvatarFallback className="bg-primary-100 text-primary-700 font-montserrat-semibold">
                    {notification.sender.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-montserrat-bold text-xs">S24</span>
                </div>
              )}

              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-montserrat-semibold text-gray-900 mb-1">
                      {notification.sender}
                    </p>
                    <p className="text-sm text-gray-600 font-montserrat">
                      <span className="font-montserrat-semibold text-gray-900">
                        {notification.title}
                      </span>{" "}
                      - {notification.description}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {notification.date}
                  </span>
                </div>
              </div>

              {/* Action Icons (shown only when selected) */}
              {isSelected && selectedNotifications.length === 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary-100"
                  >
                    <Pen className="h-4 w-4 text-gray-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-50"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <TrashBinMinimalistic className="h-4 w-4 text-gray-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary-100"
                    onClick={() => handleViewNotification(notification.id)}
                  >
                    <Eye className="h-4 w-4 text-gray-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary-100"
                  >
                    <Letter className="h-4 w-4 text-gray-700" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

