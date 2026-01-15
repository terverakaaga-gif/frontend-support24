import { useNavigate } from "react-router-dom";
import { Calendar, MapPoint, ClockSquare, } from "@solar-icons/react";
import { cn } from "@/lib/design-utils";
import { 
  CARD_INTERACTIVE, 
  CARD_CONTENT, 
  BUTTON_PRIMARY, 
  BADGE_BASE
} from "@/lib/design-utils"; // Assuming design-utils exports these
import { GAP, SHADOW,
    TEXT_STYLES,

 } from "@/constants/design-system";
import { Event } from "@/api/services/eventService";

interface EventCardProps {
  event: Event;
  basePath?: string;
}

export default function EventCard({ event, basePath = "/participant/events" }: EventCardProps) {
  const navigate = useNavigate();

  return (
    <div className={cn(CARD_INTERACTIVE, "flex flex-col h-full")}>
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <img
          src={event.eventImage || "/placeholder-event.jpg"}
          alt={event.eventName}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
           <span className="sr-only">Bookmark</span>
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Content Section */}
      <div className={cn(CARD_CONTENT, "flex flex-col flex-grow gap-4")}>
        <div className="flex justify-between items-start">
          <h3 className="font-montserrat-bold text-lg text-gray-900 line-clamp-1">
            {event.eventName}
          </h3>
          <div className="flex items-center text-gray-500 text-xs">
            <MapPoint className="w-4 h-4 mr-1" />
            <span className="truncate max-w-[100px]">{event.eventLocation}</span>
          </div>
        </div>

        <p className={cn(TEXT_STYLES.bodySecondary, "line-clamp-2")}>
          {event.eventDescr}
        </p>

        <div className={cn("space-y-2 mt-auto")}>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{new Date(event.eventStartDate).toLocaleDateString()} - {new Date(event.eventEndDate).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <ClockSquare className="w-4 h-4 mr-2 text-gray-400" />
            <span>{event.eventStartTime} - {event.eventEndTime}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center -space-x-2 overflow-hidden">
             {/* Participant Avatars Simulation */}
             {[1,2,3].map(i => (
               <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200" />
             ))}
             <span className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 text-xs text-gray-500 font-medium">
               +20
             </span>
          </div>

          <button
            onClick={() => navigate(`${basePath}/${event._id}`)}
            className={cn(BUTTON_PRIMARY, "px-4 py-2 text-sm")}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}