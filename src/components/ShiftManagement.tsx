import { useState, useEffect } from 'react';
import { Calendar, Filter, List, MapPin, Plus, Search, User, Clock, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import useShiftStore, { ServiceCategory, ParticipantType } from '@/store/useShiftStore';

const serviceCategoryIcons: Record<ServiceCategory, React.ReactNode> = {
  'personal-care': <User className="h-5 w-5 text-blue-500" />,
  'transport': <MapPin className="h-5 w-5 text-green-500" />,
  'therapy': <User className="h-5 w-5 text-purple-500" />,
  'social-support': <User className="h-5 w-5 text-orange-500" />,
  'household': <User className="h-5 w-5 text-teal-500" />
};

const serviceCategoryNames: Record<ServiceCategory, string> = {
  'personal-care': 'Personal Care',
  'transport': 'Transport',
  'therapy': 'Therapy',
  'social-support': 'Social Support',
  'household': 'Household Tasks'
};

const availableWorkers = [
  { id: "1", name: "Sarah Johnson", role: "Physical Therapist", rating: 4.9, availability: true, distance: 2.3 },
  { id: "2", name: "Michael Smith", role: "Support Worker", rating: 4.8, availability: true, distance: 1.5 },
  { id: "3", name: "Emma Wilson", role: "Personal Care Assistant", rating: 4.7, availability: true, distance: 3.2 },
  { id: "4", name: "David Thompson", role: "Transport Assistant", rating: 4.6, availability: false, distance: 4.1 },
  { id: "5", name: "Jessica Parker", role: "Household Assistant", rating: 4.9, availability: true, distance: 2.7 }
];

const availableParticipants = [
  { id: "p1", name: "Emma Davis", type: "participant" as ParticipantType, contactNumber: "123-456-7890" },
  { id: "p2", name: "Robert Anderson", type: "participant" as ParticipantType, contactNumber: "234-567-8901" },
  { id: "p3", name: "Thomas Miller", type: "participant" as ParticipantType, contactNumber: "567-890-1234" },
  { id: "g1", name: "Jennifer Parker", type: "guardian" as ParticipantType, contactNumber: "345-678-9012" },
  { id: "g2", name: "William Brooks", type: "guardian" as ParticipantType, contactNumber: "456-789-0123" }
];

const ShiftManagement = () => {
  const {
    filteredShifts,
    currentView,
    searchQuery,
    isBookingModalOpen,
    bookingStep,
    currentBooking,
    setView,
    setSearchQuery,
    toggleBookingModal,
    setBookingStep,
    updateCurrentBooking,
    resetCurrentBooking,
    addShift
  } = useShiftStore();

  const handleCreateShift = () => {
    if (!currentBooking.serviceCategory || !currentBooking.date || !currentBooking.workerId || !currentBooking.participantId) {
      return;
    }

    const selectedWorker = availableWorkers.find(w => w.id === currentBooking.workerId);
    const selectedParticipant = availableParticipants.find(p => p.id === currentBooking.participantId);
    if (!selectedWorker || !selectedParticipant) return;

    const formattedDate = format(currentBooking.date, 'yyyy-MM-dd');
    
    addShift({
      workerId: currentBooking.workerId,
      worker: {
        name: selectedWorker.name,
        role: selectedWorker.role,
      },
      participantId: currentBooking.participantId,
      participant: {
        name: selectedParticipant.name,
        type: selectedParticipant.type,
        contactNumber: selectedParticipant.contactNumber
      },
      date: formattedDate,
      timeStart: currentBooking.timeStart,
      timeEnd: currentBooking.timeEnd,
      location: "Home",
      status: "scheduled",
      serviceCategory: currentBooking.serviceCategory,
      notes: currentBooking.notes
    });

    resetCurrentBooking();
    toggleBookingModal();
  };

  const shiftDates = filteredShifts.map(shift => new Date(shift.date));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [shiftsOnSelectedDate, setShiftsOnSelectedDate] = useState(filteredShifts);

  useEffect(() => {
    if (selectedDate) {
      const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
      const filtered = filteredShifts.filter(shift => shift.date === formattedSelectedDate);
      setShiftsOnSelectedDate(filtered);
    } else {
      setShiftsOnSelectedDate(filteredShifts);
    }
  }, [selectedDate, filteredShifts]);

  const renderBookingStep = () => {
    switch (bookingStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Service Category</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(serviceCategoryNames).map(([key, name]) => (
                <button
                  key={key}
                  className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center hover:border-primary ${
                    currentBooking.serviceCategory === key ? 'border-2 border-primary bg-primary/10' : 'border-muted'
                  }`}
                  onClick={() => updateCurrentBooking({ serviceCategory: key as ServiceCategory })}
                >
                  <div className="mb-2 rounded-full bg-primary/10 p-2">
                    {serviceCategoryIcons[key as ServiceCategory]}
                  </div>
                  <div className="font-medium">{name}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 text-right">
              <Button 
                onClick={() => setBookingStep(2)}
                disabled={!currentBooking.serviceCategory}
                className="bg-guardian hover:bg-guardian-dark"
              >
                Next: Choose Date & Time
              </Button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Date & Time</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <CalendarComponent 
                  mode="single" 
                  selected={currentBooking.date || undefined}
                  onSelect={(date) => date && updateCurrentBooking({ date })} 
                  className="border rounded-md pointer-events-auto"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <Select 
                    value={currentBooking.timeStart}
                    onValueChange={(value) => updateCurrentBooking({ timeStart: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <Select 
                    value={currentBooking.timeEnd}
                    onValueChange={(value) => updateCurrentBooking({ timeEnd: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'].map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setBookingStep(1)}>Back</Button>
              <Button 
                onClick={() => setBookingStep(3)}
                disabled={!currentBooking.date}
                className="bg-guardian hover:bg-guardian-dark"
              >
                Next: Choose Support Worker
              </Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Support Worker</h3>
            
            <div className="mb-4 flex space-x-2">
              <Button variant="outline" className="w-1/2">List View</Button>
              <Button variant="outline" className="w-1/2">Map View</Button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-auto pr-2">
              {availableWorkers.map((worker) => (
                <div 
                  key={worker.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                    currentBooking.workerId === worker.id ? 'border-2 border-primary bg-primary/10' : ''
                  }`}
                  onClick={() => updateCurrentBooking({ workerId: worker.id })}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-guardian/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-guardian" />
                    </div>
                    <div>
                      <h3 className="font-medium">{worker.name}</h3>
                      <div className="text-xs text-muted-foreground">{worker.role}</div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-medium">{worker.rating} ★</div>
                    <div className="text-muted-foreground">{worker.distance} km away</div>
                    <div className={`${worker.availability ? 'text-green-600' : 'text-red-600'} font-medium`}>
                      {worker.availability ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setBookingStep(2)}>Back</Button>
              <Button 
                onClick={() => setBookingStep(4)}
                disabled={!currentBooking.workerId}
                className="bg-guardian hover:bg-guardian-dark"
              >
                Next: Select Participant
              </Button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Participant</h3>
            
            <div className="space-y-4 max-h-[400px] overflow-auto pr-2">
              {availableParticipants.map((participant) => (
                <div 
                  key={participant.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                    currentBooking.participantId === participant.id ? 'border-2 border-primary bg-primary/10' : ''
                  }`}
                  onClick={() => updateCurrentBooking({ participantId: participant.id })}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-guardian/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-guardian" />
                    </div>
                    <div>
                      <h3 className="font-medium">{participant.name}</h3>
                      <div className="text-xs text-muted-foreground capitalize">{participant.type}</div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-muted-foreground">{participant.contactNumber}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setBookingStep(3)}>Back</Button>
              <Button 
                onClick={() => setBookingStep(5)}
                disabled={!currentBooking.participantId}
                className="bg-guardian hover:bg-guardian-dark"
              >
                Next: Confirm Details
              </Button>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Confirm Booking Details</h3>
            
            <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Service:</span>
                <span className="text-sm">
                  {currentBooking.serviceCategory ? serviceCategoryNames[currentBooking.serviceCategory] : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Date:</span>
                <span className="text-sm">
                  {currentBooking.date ? format(currentBooking.date, 'EEEE, MMMM d, yyyy') : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Time:</span>
                <span className="text-sm">
                  {currentBooking.timeStart} - {currentBooking.timeEnd}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Support Worker:</span>
                <span className="text-sm">
                  {availableWorkers.find(w => w.id === currentBooking.workerId)?.name || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Participant:</span>
                <span className="text-sm">
                  {availableParticipants.find(p => p.id === currentBooking.participantId)?.name || '-'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Additional Notes</label>
              <Textarea 
                placeholder="Add any special instructions or requirements..."
                value={currentBooking.notes}
                onChange={(e) => updateCurrentBooking({ notes: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setBookingStep(4)}>Back</Button>
              <Button 
                onClick={handleCreateShift}
                className="bg-guardian hover:bg-guardian-dark"
              >
                Complete Booking
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-guardian/10 rounded-full">
            <Calendar className="h-5 w-5 text-guardian" />
          </div>
          <h2 className="text-xl font-bold">Shift Management</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
          <Button 
            size="sm" 
            className="bg-guardian hover:bg-guardian-dark"
            onClick={toggleBookingModal}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Shift
          </Button>
        </div>
      </div>

      {currentView === 'list' && (
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
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                  </span>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {currentView === 'calendar' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
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
          </div>
          <div className="col-span-1 md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'All Shifts'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {shiftsOnSelectedDate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-t">
                    {selectedDate 
                      ? 'No shifts scheduled for this date.' 
                      : 'Select a date to view scheduled shifts.'}
                  </div>
                ) : (
                  <div className="space-y-4 p-6 pt-0">
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
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={isBookingModalOpen} onOpenChange={toggleBookingModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-guardian" />
              New Shift Booking
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4"
              onClick={toggleBookingModal}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          {renderBookingStep()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftManagement;
