
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Home, UserRound, Users, Calendar, Settings, Bell, Search } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
      case 'support-worker':
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
            <NavLink to="/admin" icon={<Home size={20} />} text="Coordinator" active={true} />
            <NavLink to="/guardian" icon={<Heart size={20} />} text="Guardian" />
            <NavLink to="/worker" icon={<Calendar size={20} />} text="Worker" />
            <NavLink to="/support-workers" icon={<Users size={20} />} text="Support Workers" />
            <NavLink to="/bookings" icon={<Calendar size={20} />} text="Bookings" />
            <NavLink to="/admin-settings" icon={<Settings size={20} />} text="Admin" />
          </>
        );
      case 'guardian':
        return (
          <>
            <NavLink to="/guardian" icon={<Heart size={20} />} text="Guardian" active={true} />
            <NavLink to="/bookings" icon={<Calendar size={20} />} text="Bookings" />
          </>
        );
      case 'participant':
        return (
          <>
            <NavLink to="/participant" icon={<UserRound size={20} />} text="Participant" active={isActive('/participant')} />
            <NavLink to="/bookings" icon={<Calendar size={20} />} text="Bookings" active={isActive('/bookings')} />
          </>
        );
      case 'support-worker':
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
                  <AvatarFallback className="bg-guardian text-white">
                    {user?.avatar || user?.name?.charAt(0)}
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
