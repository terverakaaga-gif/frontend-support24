
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, User, FileText } from "lucide-react";
import useShiftStore from "@/store/useShiftStore";

export default function ShiftDetails() {
  const { shiftId } = useParams();
  const navigate = useNavigate();
  const { shifts } = useShiftStore();
  
  // Find the shift with the matching ID
  const shift = shifts.find((s) => s.id === shiftId);

  if (!shift) {
    return (
      <div className="container py-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Shift Not Found</h2>
              <p className="text-muted-foreground mt-2">The shift you're looking for doesn't exist or has been removed.</p>
              <Button className="mt-6 bg-guardian hover:bg-guardian-dark" onClick={() => navigate("/support-worker/shifts")}>
                View All Shifts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Shift Details</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Appointment Information</CardTitle>
              <Badge className={`
                ${shift.status === 'scheduled' ? 'bg-blue-500' : 
                  shift.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}
              `}>
                {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="p-2 rounded-full bg-guardian/10">
                <Calendar className="h-5 w-5 text-guardian" />
              </div>
              <div>
                <h3 className="font-medium">Date & Time</h3>
                <div className="text-sm text-muted-foreground">
                  {new Date(shift.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{shift.timeStart} - {shift.timeEnd}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="p-2 rounded-full bg-guardian/10">
                <MapPin className="h-5 w-5 text-guardian" />
              </div>
              <div>
                <h3 className="font-medium">Location</h3>
                <div className="text-sm text-muted-foreground">{shift.location}</div>
              </div>
            </div>

            {shift.notes && (
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="p-2 rounded-full bg-guardian/10">
                  <FileText className="h-5 w-5 text-guardian" />
                </div>
                <div>
                  <h3 className="font-medium">Notes</h3>
                  <div className="text-sm text-muted-foreground">{shift.notes}</div>
                </div>
              </div>
            )}
            
            {shift.serviceCategory && (
              <div className="flex items-center gap-2 mt-4">
                <Badge className="bg-guardian">
                  {shift.serviceCategory.replace('-', ' ')}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{shift.participant.type === 'participant' ? 'Participant' : 'Guardian'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-guardian/10 flex items-center justify-center">
                <User className="h-6 w-6 text-guardian" />
              </div>
              <div>
                <h3 className="font-medium">{shift.participant.name}</h3>
                <p className="text-sm text-muted-foreground">{shift.participant.type.charAt(0).toUpperCase() + shift.participant.type.slice(1)}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button className="w-full bg-guardian hover:bg-guardian-dark">
                Contact {shift.participant.type === 'participant' ? 'Participant' : 'Guardian'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
