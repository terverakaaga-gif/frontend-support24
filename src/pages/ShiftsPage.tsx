
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, List, Search, Filter, User, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useShiftStore from "@/store/useShiftStore";
import { format } from "date-fns";

export default function ShiftsPage() {
  const navigate = useNavigate();
  const { 
    filteredShifts, 
    currentView, 
    searchQuery, 
    setView, 
    setSearchQuery,
    filterShifts
  } = useShiftStore();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [shiftsOnSelectedDate, setShiftsOnSelectedDate] = useState(filteredShifts);

  // Get dates with shifts for calendar highlighting
  const shiftDates = filteredShifts.map(shift => new Date(shift.date));

  // Update shifts when date is selected
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedSelectedDate = format(date, 'yyyy-MM-dd');
      const filtered = filteredShifts.filter(shift => shift.date === formattedSelectedDate);
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
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Shifts</h1>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
          <div className="relative flex-1 md:flex-none md:w-60">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search shifts..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <div className="flex items-center rounded-md border overflow-hidden">
            <Button 
              size="sm" 
              variant={currentView === 'list' ? 'default' : 'ghost'}
              onClick={() => setView('list')}
              className={currentView === 'list' ? 'bg-guardian hover:bg-guardian-dark' : ''}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button 
              size="sm" 
              variant={currentView === 'calendar' ? 'default' : 'ghost'}
              onClick={() => setView('calendar')}
              className={currentView === 'calendar' ? 'bg-guardian hover:bg-guardian-dark' : ''}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* List View */}
      {currentView === 'list' && (
        <Card>
          <CardHeader>
            <CardTitle>Your Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredShifts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No shifts found. Try adjusting your search.
                </div>
              ) : (
                filteredShifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-guardian/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-guardian" />
                      </div>
                      <div>
                        <h3 className="font-medium">{shift.worker.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(shift.date).toLocaleDateString('en-US', {
                            month: 'numeric',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                          <Clock className="h-3 w-3 ml-1" />
                          <span>{shift.timeStart} - {shift.timeEnd}</span>
                          <MapPin className="h-3 w-3 ml-1" />
                          <span>{shift.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`
                        ${shift.status === 'scheduled' ? 'bg-blue-500' : 
                          shift.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}
                      `}>
                        {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewShiftDetails(shift.id)}
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
      {currentView === 'calendar' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="border rounded-md pointer-events-auto"
                  modifiers={{
                    hasShift: (date) => shiftDates.some(
                      shiftDate => 
                        shiftDate.getDate() === date.getDate() && 
                        shiftDate.getMonth() === date.getMonth() && 
                        shiftDate.getFullYear() === date.getFullYear()
                    )
                  }}
                  modifiersStyles={{
                    hasShift: { 
                      fontWeight: 'bold', 
                      backgroundColor: 'rgba(155, 135, 245, 0.1)',
                      color: '#9b87f5',
                      borderRadius: '50%'
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'All Shifts'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {shiftsOnSelectedDate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {selectedDate 
                      ? 'No shifts scheduled for this date.' 
                      : 'Select a date to view scheduled shifts.'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {shiftsOnSelectedDate.map((shift) => (
                      <div key={shift.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-guardian/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-guardian" />
                          </div>
                          <div>
                            <h3 className="font-medium">{shift.worker.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{shift.timeStart} - {shift.timeEnd}</span>
                              <MapPin className="h-3 w-3 ml-1" />
                              <span>{shift.location}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewShiftDetails(shift.id)}
                        >
                          View Details
                        </Button>
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
