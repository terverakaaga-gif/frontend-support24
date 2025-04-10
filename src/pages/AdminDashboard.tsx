import { useState } from "react";
import { 
  Users, Clock, DollarSign, Calendar, Search, Filter, Download,
  ArrowRight, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/StatCard";
import { ChartSection } from "@/components/ChartSection";
import { NotificationsList } from "@/components/NotificationsList";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

// Mock data for charts
const bookingTrendsData = [
  { month: "Jan", bookings: 120 },
  { month: "Feb", bookings: 140 },
  { month: "Mar", bookings: 160 },
  { month: "Apr", bookings: 175 },
  { month: "May", bookings: 195 },
  { month: "Jun", bookings: 220 },
];

const revenueData = [
  { month: "Jan", revenue: 50000 },
  { month: "Feb", revenue: 55000 },
  { month: "Mar", revenue: 60000 },
  { month: "Apr", revenue: 65000 },
  { month: "May", revenue: 70000 },
  { month: "Jun", revenue: 75000 },
];

// Mock notifications - fixed type values to match the allowed types
const notifications = [
  {
    id: "1",
    type: "booking" as const,
    title: "New Booking Request",
    description: "John Smith requested a booking for tomorrow",
    time: "5 minutes ago"
  },
  {
    id: "2",
    type: "message" as const,
    title: "New Message",
    description: "Sarah Johnson sent you a message",
    time: "1 hour ago"
  },
  {
    id: "3",
    type: "update" as const,
    title: "System Update",
    description: "New features available in the admin panel",
    time: "2 hours ago"
  }
];

// Mock bookings data
const bookingsData = [
  {
    id: "1",
    date: "2024-03-15",
    timeStart: "09:00 AM",
    timeEnd: "01:00 PM",
    guardian: "John Smith",
    worker: "Sarah Johnson",
    hours: 4,
    status: "Confirmed",
    type: "Personal Care"
  },
  {
    id: "2",
    date: "2024-03-15",
    timeStart: "02:00 PM",
    timeEnd: "06:00 PM",
    guardian: "Emma Wilson",
    worker: "Michael Brown",
    hours: 4,
    status: "In Progress",
    type: "Community Access"
  },
  {
    id: "3",
    date: "2024-03-16",
    timeStart: "10:00 AM",
    timeEnd: "03:00 PM",
    guardian: "David Lee",
    worker: "Jessica White",
    hours: 5,
    status: "Pending",
    type: "Therapy Support"
  }
];

// Mock stakeholders data
const stakeholders = [
  {
    type: "Guardians",
    count: 450,
    active: 380,
    pending: 15,
    growth: "+12%",
    progress: 75
  },
  {
    type: "Support Workers",
    count: 320,
    active: 280,
    pending: 25,
    growth: "+8%",
    progress: 65
  },
  {
    type: "Coordinators",
    count: 45,
    active: 42,
    pending: 3,
    growth: "+5%",
    progress: 85
  }
];

export default function AdminDashboard() {
  const [currentMonth, setCurrentMonth] = useState("Mar 2024");

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            {currentMonth}
          </Button>
          <Button variant="default" className="bg-guardian hover:bg-guardian-dark">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value="1,234"
          icon={<Users size={24} />}
          change={{ value: "+12% from last month", positive: true }}
        />
        <StatCard
          title="Total Hours"
          value="8,560"
          icon={<Clock size={24} />}
          change={{ value: "+8% from last month", positive: true }}
        />
        <StatCard
          title="Revenue"
          value="$375,000"
          icon={<DollarSign size={24} />}
          change={{ value: "+15% from last month", positive: true }}
        />
        <StatCard
          title="Active Bookings"
          value="342"
          icon={<Calendar size={24} />}
          additionalText="28 pending approval"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartSection 
          title="Booking Trends" 
          data={bookingTrendsData} 
          type="bar" 
          dataKey="bookings"
          xAxisKey="month"
        />
        <ChartSection 
          title="Revenue Overview" 
          data={revenueData} 
          type="line" 
          dataKey="revenue"
          xAxisKey="month"
        />
      </div>

      {/* Bookings Table & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Bookings Management</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search bookings..."
                    className="pl-9 w-[250px]"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="secondary" size="sm">
                  Export
                </Button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 pl-0">
                      <Checkbox />
                    </th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Guardian</th>
                    <th className="pb-3 font-medium">Worker</th>
                    <th className="pb-3 font-medium">Hours</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsData.map((booking) => (
                    <tr key={booking.id} className="border-b last:border-0">
                      <td className="py-4 pl-0">
                        <Checkbox />
                      </td>
                      <td className="py-4">
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </td>
                      <td className="py-4">
                        {booking.timeStart} - {booking.timeEnd}
                      </td>
                      <td className="py-4">{booking.guardian}</td>
                      <td className="py-4">{booking.worker}</td>
                      <td className="py-4">{booking.hours}</td>
                      <td className="py-4">
                        <span className={`
                          status-badge 
                          ${booking.status === 'Confirmed' ? 'status-confirmed' : 
                            booking.status === 'Pending' ? 'status-pending' :
                            'status-progress'}
                        `}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4">{booking.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-muted-foreground">
                Showing 1 to 3 of 3 entries
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="default" size="sm" className="bg-guardian hover:bg-guardian-dark">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notifications Section */}
          <NotificationsList notifications={notifications} />

          {/* Stakeholders Overview */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Stakeholder Overview</h2>
              <Button variant="outline" size="sm">
                Add New
              </Button>
            </div>
            <div className="space-y-6">
              {stakeholders.map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-guardian/10 rounded-full">
                        <Users className="h-5 w-5 text-guardian" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.type}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.active} active ��� {item.pending} pending
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{item.count}</span>
                      <span className="text-xs text-green-600">{item.growth} this month</span>
                    </div>
                  </div>
                  <Progress value={item.progress} className="h-2 bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
