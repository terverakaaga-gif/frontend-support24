import { 
  Target, Clock, Heart, MessageSquare, Calendar, Edit, Trash, Plus
} from "lucide-react";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { ChartSection } from "@/components/ChartSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ShiftManagement from "@/components/ShiftManagement";

// Mock data for charts
const activityData = [
  { day: "Mon", hours: 4, minutes: 3 },
  { day: "Tue", hours: 6, minutes: 4 },
  { day: "Wed", hours: 4, minutes: 3 },
  { day: "Thu", hours: 5, minutes: 4 },
  { day: "Fri", hours: 3, minutes: 2 },
  { day: "Sat", hours: 2, minutes: 2 },
  { day: "Sun", hours: 4, minutes: 3 },
];

const satisfactionData = [
  { week: "Week 1", score: 4.6 },
  { week: "Week 2", score: 4.8 },
  { week: "Week 3", score: 4.7 },
  { week: "Week 4", score: 4.9 },
];

// Mock care goals
const initialGoals = [
  {
    id: "1",
    title: "Improve Mobility",
    description: "Complete daily walking exercises and stretching routine",
    priority: "High",
    deadline: "2024-04-01",
    status: "In Progress",
    progress: 65
  },
  {
    id: "2",
    title: "Social Integration",
    description: "Participate in community activities twice a week",
    priority: "Medium",
    deadline: "2024-05-15",
    status: "In Progress",
    progress: 40
  }
];

// Mock recent updates
const recentUpdates = [
  {
    id: "1",
    worker: "Sarah Johnson",
    type: "Progress Note",
    time: "2 hours ago",
    content: "Great progress with physical therapy exercises. Completed all sets with improved form.",
    rating: 5
  },
  {
    id: "2",
    worker: "Michael Smith",
    type: "Activity Log",
    time: "5 hours ago",
    content: "Enjoyed community garden visit. Participated in planting new herbs.",
    rating: 4
  },
  {
    id: "3",
    worker: "Emma Wilson",
    type: "Medication Record",
    time: "Yesterday",
    content: "",
    rating: 5
  }
];

export default function GuardianDashboard() {
  const [goals, setGoals] = useState(initialGoals);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    status: "Not Started"
  });

  const handleSaveGoal = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const createdGoal = {
      ...newGoal,
      id,
      progress: 0
    };
    
    setGoals([...goals, createdGoal]);
    setShowAddGoal(false);
    setNewGoal({
      title: "",
      description: "",
      priority: "Medium",
      deadline: "",
      status: "Not Started"
    });
  };

  // Render star rating (filled stars based on rating)
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="text-yellow-400">
            {i < rating ? "★" : "☆"}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Guardian Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's how John is doing.</p>
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
          <Button variant="ghost" size="icon" className="relative">
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </div>
            <Bell className="h-5 w-5" />
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

      {/* Shift Management */}
      <div className="mb-8">
        <ShiftManagement />
      </div>

      {/* Care Goals Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-guardian/10 rounded-full">
              <Target className="h-5 w-5 text-guardian" />
            </div>
            <h2 className="text-xl font-bold">Care Goals</h2>
          </div>
          <Button onClick={() => setShowAddGoal(!showAddGoal)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {/* Add New Goal Form */}
        {showAddGoal && (
          <div className="mb-8 border p-4 rounded-lg bg-muted/30">
            <h3 className="text-lg font-medium mb-4">Add New Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input 
                  placeholder="Enter goal title" 
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea 
                  placeholder="Enter goal description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <Select 
                    value={newGoal.priority}
                    onValueChange={(value) => setNewGoal({...newGoal, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deadline</label>
                  <Input 
                    type="date" 
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select 
                    value={newGoal.status}
                    onValueChange={(value) => setNewGoal({...newGoal, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveGoal} className="bg-guardian hover:bg-guardian-dark">
                  Save Goal
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{goal.title}</h3>
                    <span 
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        goal.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {goal.priority} Priority
                    </span>
                    <span 
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        goal.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        goal.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {goal.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Deadline: {new Date(goal.deadline).toLocaleDateString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={goal.progress} className="h-2 flex-1 bg-gray-100" />
                  <span className="text-xs font-medium">{goal.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Recent Updates</CardTitle>
                <Button variant="link" className="text-sm p-0">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {recentUpdates.map((update) => (
                  <div key={update.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">{update.worker}</div>
                      <div className="flex items-center gap-1">
                        {renderRating(update.rating)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <FileText className="h-3 w-3" />
                      <span>{update.type}</span>
                      <span>•</span>
                      <span>{update.time}</span>
                    </div>
                    {update.content && <p className="text-sm">{update.content}</p>}
                    <div className="flex gap-3 mt-2">
                      <Button variant="ghost" size="sm">Reply</Button>
                      <Button variant="ghost" size="sm">Request Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Quick Communication</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex items-center gap-2 justify-center h-14">
                  <MessageSquare className="h-5 w-5 text-guardian" />
                  <span>Message Team</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2 justify-center h-14">
                  <Calendar className="h-5 w-5 text-guardian" />
                  <span>Schedule Change</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Additional Lucide icons used
function Bell(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function Download(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}
