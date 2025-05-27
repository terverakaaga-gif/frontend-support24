import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  List,
  Search,
  Filter,
  User,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useShiftStore from "@/store/useShiftStore";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ShiftsPage() {
  const navigate = useNavigate();
  const {
    filteredShifts,
    currentView,
    searchQuery,
    setView,
    setSearchQuery,
    filterShifts,
  } = useShiftStore();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [shiftsOnSelectedDate, setShiftsOnSelectedDate] =
    useState(filteredShifts);

  // Get dates with shifts for calendar highlighting
  const shiftDates = filteredShifts.map((shift) => new Date(shift.date));

  // Update shifts when date is selected
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedSelectedDate = format(date, "yyyy-MM-dd");
      const filtered = filteredShifts.filter(
        (shift) => shift.date === formattedSelectedDate
      );
      setShiftsOnSelectedDate(filtered);
    } else {
      setShiftsOnSelectedDate(filteredShifts);
    }
  };

  // Handle view shift details
  const handleViewShiftDetails = (shiftId: string) => {
    navigate(`/support-worker/shifts/${shiftId}`);
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1e3b93]">
            Shifts
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your schedule and view upcoming assignments
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#1e3b93]/60" />
            <Input
              placeholder="Search shifts..."
              className="pl-10 border-[#1e3b93]/20 focus:border-[#1e3b93] focus-visible:ring-[#1e3b93]/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-[#1e3b93]/20 hover:bg-[#1e3b93]/10 hover:border-[#1e3b93]/40"
          >
            <Filter className="h-4 w-4 mr-2 text-[#1e3b93]" />
            <span className="text-[#1e3b93]">Filter</span>
          </Button>
          <div className="flex items-center rounded-lg border border-[#1e3b93]/20 overflow-hidden bg-white shadow-sm">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setView("list")}
              className={cn(
                "rounded-none border-0",
                currentView === "list"
                  ? "bg-[#1e3b93] text-white hover:bg-[#1e3b93]/90"
                  : "text-[#1e3b93] hover:bg-[#1e3b93]/10"
              )}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setView("calendar")}
              className={cn(
                "rounded-none border-0",
                currentView === "calendar"
                  ? "bg-[#1e3b93] text-white hover:bg-[#1e3b93]/90"
                  : "text-[#1e3b93] hover:bg-[#1e3b93]/10"
              )}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* List View */}
      {currentView === "list" && (
        <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="border-b border-[#1e3b93]/10">
            <CardTitle className="text-[#1e3b93]">Your Assignments</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {filteredShifts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-[#1e3b93]/10 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="w-6 h-6 text-[#1e3b93]/60" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    No shifts found
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or check back later for new
                    assignments
                  </p>
                </div>
              ) : (
                filteredShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between p-4 border border-[#1e3b93]/10 rounded-lg hover:bg-[#1e3b93]/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#1e3b93]/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-[#1e3b93]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {shift.worker.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>
                              {new Date(shift.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {shift.timeStart} - {shift.timeEnd}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{shift.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={cn("font-medium", {
                          "bg-[#1e3b93] text-white":
                            shift.status === "scheduled",
                          "bg-green-100 text-green-700 border-green-200":
                            shift.status === "completed",
                          "bg-red-100 text-red-700 border-red-200":
                            shift.status === "cancelled",
                        })}
                        variant={
                          shift.status === "scheduled" ? "default" : "outline"
                        }
                      >
                        {shift.status.charAt(0).toUpperCase() +
                          shift.status.slice(1)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewShiftDetails(shift.id)}
                        className="border-[#1e3b93]/20 text-[#1e3b93] hover:bg-[#1e3b93]/10"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {currentView === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="border-b border-[#1e3b93]/10">
                <CardTitle className="text-[#1e3b93]">Select Date</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="border border-[#1e3b93]/20 rounded-lg pointer-events-auto w-full"
                  modifiers={{
                    hasShift: (date) =>
                      shiftDates.some(
                        (shiftDate) =>
                          shiftDate.getDate() === date.getDate() &&
                          shiftDate.getMonth() === date.getMonth() &&
                          shiftDate.getFullYear() === date.getFullYear()
                      ),
                  }}
                  modifiersStyles={{
                    hasShift: {
                      fontWeight: "bold",
                      backgroundColor: "rgba(30, 59, 147, 0.1)",
                      color: "#1e3b93",
                      borderRadius: "50%",
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <Card className="border-[#1e3b93]/10 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="border-b border-[#1e3b93]/10">
                <CardTitle className="text-[#1e3b93]">
                  {selectedDate
                    ? format(selectedDate, "EEEE, MMMM d, yyyy")
                    : "All Shifts"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {shiftsOnSelectedDate.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-[#1e3b93]/10 rounded-full flex items-center justify-center mb-4">
                      <CalendarIcon className="w-6 h-6 text-[#1e3b93]/60" />
                    </div>
                    <p className="text-muted-foreground text-lg">
                      {selectedDate
                        ? "No shifts scheduled for this date"
                        : "Select a date to view scheduled shifts"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedDate
                        ? "Check other dates or contact your coordinator"
                        : "Click on a date in the calendar to see your assignments"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {shiftsOnSelectedDate.map((shift) => (
                      <div
                        key={shift.id}
                        className="flex items-center justify-between p-4 border border-[#1e3b93]/10 rounded-lg hover:bg-[#1e3b93]/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#1e3b93]/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-[#1e3b93]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {shift.worker.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {shift.timeStart} - {shift.timeEnd}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{shift.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            className={cn("font-medium", {
                              "bg-[#1e3b93] text-white":
                                shift.status === "scheduled",
                              "bg-green-100 text-green-700 border-green-200":
                                shift.status === "completed",
                              "bg-red-100 text-red-700 border-red-200":
                                shift.status === "cancelled",
                            })}
                            variant={
                              shift.status === "scheduled"
                                ? "default"
                                : "outline"
                            }
                          >
                            {shift.status.charAt(0).toUpperCase() +
                              shift.status.slice(1)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewShiftDetails(shift.id)}
                            className="border-[#1e3b93]/20 text-[#1e3b93] hover:bg-[#1e3b93]/10"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
