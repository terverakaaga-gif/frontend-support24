import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Home, UserRound, Users, Calendar, ShieldCheck, Settings, Bell, ReceiptText, Search, BellRing, ChevronDown, CalendarSync } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "react-router-dom";
import { SearchSupportWorkers } from "@/components/SearchSupportWorkers";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Helper function to get the profile route based on user role
  const getProfileRoute = () => {
    switch (user.role) {
      case 'participant':
        return '/participant/profile';
      case 'supportWorker':
        return '/support-worker/profile';
      case 'guardian':
        return '/guardian/profile';
      case 'admin':
        return '/admin/profile';
      default:
        return '/';
    }
  };

  const roleBasedLinks = () => {
    switch (user.role) {
      case 'admin':
        return (
          <>
            {/* Specialist dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/admin') ? "text-guardian" : "text-muted-foreground hover:text-foreground"
              }`}>
                <div className="flex items-center gap-2">
                  <Home size={20} />
                  <span>Specialists</span>
                  <ChevronDown size={16} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/admin/coordinators" className="w-full">Coordinators</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/therapists" className="w-full">Therapists</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/counselors" className="w-full">Counselors</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/specialists" className="w-full">All Specialists</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Booking dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/admin') ? "text-guardian" : "text-muted-foreground hover:text-foreground"
              }`}>
                <div className="flex items-center gap-2">
                  <Calendar size={20} />
                  <span>Bookings</span>
                  <ChevronDown size={16} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/admin/shifts" className="w-full">Shifts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/timesheets" className="w-full">Timesheets</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/rate-time-band" className="w-full">Rate-Time-Band</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* <NavLink to="/admin/participants" icon={<Heart size={20} />} text="Participants" active={isActive('/admin/participants')} />
            <NavLink to="/admin/support-workers" icon={<Users size={20} />} text="Support Workers" active={isActive('/admin/support-workers')} /> */}
            <NavLink to="/admin/invites" icon={<BellRing size={20} />} text="Invitations" active={isActive('/admin/invites')} />
            {/* <NavLink to="/admin/rate-time-band" icon={<CalendarSync size={20} />} text="Rate-Time-Band" active={isActive('/admin/rate-time-band')} /> */}
            {/* <NavLink to="/bookings" icon={<Calendar size={20} />} text="Bookings" active={isActive('/bookings')} /> */}
            <NavLink to="/incidents" icon={<ShieldCheck size={20} />} text="Incidents" active={isActive('/incidents')} />
            <NavLink to="/invoices" icon={<ReceiptText size={20} />} text="Invoices" active={isActive('/invoices')} />
            <NavLink to="/events" icon={<Calendar size={20} />} text="Events" active={isActive('/events')} />
          </>
        );
      case 'guardian':
        return (
          <>
            <NavLink to="/guardian" icon={<Heart size={20} />} text="Guardian" active={isActive('/guardian')} />
            <NavLink to="/bookings" icon={<Calendar size={20} />} text="Bookings" active={isActive('/bookings')} />
          </>
        );
      case 'participant':
        return (
          <>
            <NavLink to="/participant" icon={<UserRound size={20} />} text="Participant" active={isActive('/participant')} />
            <NavLink to="/bookings" icon={<Calendar size={20} />} text="Bookings" active={isActive('/bookings')} />
          </>
        );
      case 'supportWorker':
        return (
          <>
            <NavLink to="/support-worker" icon={<Users size={20} />} text="Worker" active={isActive('/support-worker')} />
            <NavLink to="/support-worker/shifts" icon={<Calendar size={20} />} text="Shifts" active={isActive('/support-worker/shifts')} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-guardian" />
            <span className="text-xl font-bold">Guardian Care Pro</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {roleBasedLinks()}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user.role === 'participant' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex items-center gap-2"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span>Find Support Workers</span>
            </Button>
          )}
          
          {user.role === 'participant' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                <AvatarImage src={user?.profileImage} alt={`${user?.firstName} ${user.lastName}`}/>
                  <AvatarFallback className="bg-guardian text-white">
                    {user?.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={getProfileRoute()}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Support Worker Search Dialog */}
      <SearchSupportWorkers 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
      />
    </header>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, text, active = false }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
      active ? "text-guardian" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {icon}
    {text}
  </Link>
);