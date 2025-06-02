import { useState } from "react";
import {
  Target,
  Clock,
  Heart,
  Calendar,
  MessageSquare,
  Bell,
  Download,
  ChevronRight,
  ChevronLeft,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { ChartSection } from "@/components/ChartSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for charts
const activityData = [
  { day: "Mon", hours: 4 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 5 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 3 },
  { day: "Sun", hours: 1 },
];

const satisfactionData = [
  { week: "Week 1", score: 4.2 },
  { week: "Week 2", score: 4.5 },
  { week: "Week 3", score: 4.3 },
  { week: "Week 4", score: 4.8 },
];

// Mock data for upcoming shifts
const upcomingShifts = [
  {
    id: 1,
    worker: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
    },
    date: "2024-03-15",
    time: "09:00 AM - 12:00 PM",
    status: "confirmed",
  },
  {
    id: 2,
    worker: {
      name: "Michael Chen",
      avatar: "/avatars/michael.jpg",
    },
    date: "2024-03-16",
    time: "02:00 PM - 05:00 PM",
    status: "pending",
  },
];

// Mock data for goals
const initialGoals = [
  {
    id: 1,
    title: "Physical Exercise",
    description: "30 minutes of physical activity daily",
    progress: 75,
    status: "on-track",
  },
  {
    id: 2,
    title: "Social Interaction",
    description: "Participate in group activities twice a week",
    progress: 50,
    status: "needs-attention",
  },
  {
    id: 3,
    title: "Medication Adherence",
    description: "Take medications as prescribed",
    progress: 90,
    status: "on-track",
  },
];

// Shift Management Component
const ShiftManagement = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Upcoming Shifts</CardTitle>
          <Button variant="link" className="text-sm p-0">
            View Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingShifts.map((shift) => (
            <div
              key={shift.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={shift.worker.avatar} />
                  <AvatarFallback>{shift.worker.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{shift.worker.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {shift.date} • {shift.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    shift.status === "confirmed" ? "default" : "secondary"
                  }
                >
                  {shift.status === "confirmed" ? (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  ) : (
                    <Clock className="w-4 h-4 mr-1" />
                  )}
                  {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                </Badge>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Goals Management Component
const GoalsManagement = ({ goals, onUpdateGoal }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Care Goals</CardTitle>
          <Button variant="outline" size="sm">
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {goal.description}
                  </p>
                </div>
                <Badge
                  variant={
                    goal.status === "on-track" ? "default" : "destructive"
                  }
                >
                  {goal.status === "on-track" ? (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-1" />
                  )}
                  {goal.status === "on-track" ? "On Track" : "Needs Attention"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={goal.progress} className="flex-1" />
                <span className="text-sm font-medium">{goal.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function GuardianDashboard() {
  const [goals, setGoals] = useState(initialGoals);
  const { user } = useAuth();

  const handleUpdateGoal = (updatedGoal) => {
    setGoals(
      goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
    );
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Guardian Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's how {user?.firstName} is doing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Message Team
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button className="flex items-center gap-2 bg-guardian hover:bg-guardian-dark">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Weekly Goals Met"
          value="21/25"
          icon={<Target size={24} />}
          additionalText="84% completion rate"
        />
        <StatCard
          title="Support Hours"
          value="28h"
          icon={<Clock size={24} />}
          additionalText="This week"
        />
        <StatCard
          title="Well-being Score"
          value="4.8/5"
          icon={<Heart size={24} />}
          change={{ value: "+0.3 from last week", positive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartSection
          title="Weekly Activity Overview"
          data={activityData}
          type="bar"
          dataKey="hours"
          xAxisKey="day"
        />
        <ChartSection
          title="Satisfaction Trend"
          data={satisfactionData}
          type="line"
          dataKey="score"
          xAxisKey="week"
        />
      </div>

      {/* Goals and Shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalsManagement goals={goals} onUpdateGoal={handleUpdateGoal} />
        <ShiftManagement />
      </div>
    </div>
  );
}
