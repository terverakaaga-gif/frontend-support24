import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  Home,
  UserRound,
  Users,
  Calendar,
  ShieldCheck,
  Settings,
  Bell,
  ReceiptText,
  Search,
  BellRing,
  ChevronDown,
  CalendarSync,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Building2,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchSupportWorkers } from "@/components/SearchSupportWorkers";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) return null;

  const isActive = (path: string) => {
    // For exact dashboard routes, only match exactly
    if (
      path === "/participant" ||
      path === "/admin" ||
      path === "/guardian" ||
      path === "/support-worker"
    ) {
      return location.pathname === path;
    }
    // For other routes, use the original logic
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // Helper function to get the profile route based on user role
  const getProfileRoute = () => {
    switch (user.role) {
      case "participant":
        return "/participant/profile";
      case "supportWorker":
        return "/support-worker/profile";
      case "guardian":
        return "/guardian/profile";
      case "admin":
        return "/admin/profile";
      default:
        return "/";
    }
  };

  const roleBasedLinks = () => {
    switch (user.role) {
      case "admin":
        return (
          <>
            <NavItem
              to="/admin"
              icon={<Home size={20} />}
              label="Dashboard"
              active={isActive("/admin")}
            />

            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Management
              </h2>
              <div className="space-y-1">
                <NavItem
                  to="/admin/all-admin"
                  icon={<Users size={20} />}
                  label="Admins"
                  active={isActive("/admin/all-admin")}
                />
                <NavItem
                  to="/admin/participants"
                  icon={<Heart size={20} />}
                  label="Participants"
                  active={isActive("/admin/participants")}
                />
                <NavItem
                  to="/admin/support-workers"
                  icon={<Users size={20} />}
                  label="Support Workers"
                  active={isActive("/admin/support-workers")}
                />
                <NavItem
                  to="/admin/invites"
                  icon={<BellRing size={20} />}
                  label="Invitations"
                  active={isActive("/admin/invites")}
                />
              </div>
            </div>

            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Bookings
              </h2>
              <div className="space-y-1">
                <NavItem
                  to="/admin/shifts"
                  icon={<Calendar size={20} />}
                  label="Shifts"
                  active={isActive("/admin/shifts")}
                />
                <NavItem
                  to="/admin/timesheets"
                  icon={<ReceiptText size={20} />}
                  label="Timesheets"
                  active={isActive("/admin/timesheets")}
                />
                <NavItem
                  to="/admin/rate-time-band"
                  icon={<CalendarSync size={20} />}
                  label="Rate-Time-Band"
                  active={isActive("/admin/rate-time-band")}
                />
              </div>
            </div>

            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Other
              </h2>
              <div className="space-y-1">
                <NavItem
                  to="/incidents"
                  icon={<ShieldCheck size={20} />}
                  label="Incidents"
                  active={isActive("/incidents")}
                />
                <NavItem
                  to="/invoices"
                  icon={<ReceiptText size={20} />}
                  label="Invoices"
                  active={isActive("/invoices")}
                />
                <NavItem
                  to="/events"
                  icon={<Calendar size={20} />}
                  label="Events"
                  active={isActive("/events")}
                />
              </div>
            </div>
          </>
        );
      case "guardian":
        return (
          <>
            <NavItem
              to="/guardian"
              icon={<Heart size={20} />}
              label="Dashboard"
              active={isActive("/guardian")}
            />
            <NavItem
              to="/bookings"
              icon={<Calendar size={20} />}
              label="Bookings"
              active={isActive("/bookings")}
            />
          </>
        );
      case "participant":
        return (
          <>
            <NavItem
              to="/participant"
              icon={<UserRound size={20} />}
              label="Dashboard"
              active={isActive("/participant")}
            />
            <NavItem
              to="/participant/shifts"
              icon={<Calendar size={20} />}
              label="My Shifts"
              active={isActive("/participant/shifts")}
            />
            <NavItem
              to="/participant/organizations"
              icon={<Building2 size={20} />}
              label="Organizations"
              active={isActive("/participant/organizations")}
            />
            <NavItem
              to="/participant/timesheets"
              icon={<FileText size={20} />}
              label="My Timesheets"
              active={isActive("/participant/timesheets")}
            />
            {/* <NavItem
              to="/bookings"
              icon={<Calendar size={20} />}
              label="Bookings"
              active={isActive("/bookings")}
            /> */}
          </>
        );
      case "supportWorker":
        return (
          <>
            <NavItem
              to="/support-worker"
              icon={<Users size={20} />}
              label="Dashboard"
              active={isActive("/support-worker")}
            />
            <NavItem
              to="/support-worker/shifts"
              icon={<Calendar size={20} />}
              label="Shifts"
              active={isActive("/support-worker/shifts")}
            />
            <NavItem
              to="/support-worker/organizations"
              icon={<Building2 size={20} />}
              label="Organizations"
              active={isActive("/support-worker/organizations")}
            />
            <NavItem
              to="/support-worker/timesheets"
              icon={<FileText size={20} />}
              label="My Timesheets"
              active={isActive("/support-worker/timesheets")}
            />
          </>
        );
      default:
        return null;
    }
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="px-6 py-6 mb-4">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-guardian" />
            <span className="text-xl font-bold bg-gradient-to-r from-guardian to-guardian-dark bg-clip-text text-transparent">
              Guardian Care Pro
            </span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Overview
              </h2>
              <div className="space-y-1">{roleBasedLinks()}</div>
            </div>
          </div>
        </ScrollArea>
      </div>
      <div className="mt-auto p-6 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 z-30 h-screen w-72 border-r bg-gradient-to-b from-background to-muted/20">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="lg:hidden fixed left-4 top-4 z-40"
            size="icon"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 min-h-screen lg:pl-72">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          <div className="flex flex-1 items-center justify-end space-x-4">
            {user.role === "participant" && (
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

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      src={user?.profileImage}
                      alt={`${user?.firstName} ${user.lastName}`}
                    />
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
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1">{children}</div>
      </main>

      {/* Support Worker Search Dialog */}
      <SearchSupportWorkers open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ to, icon, label, active = false }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-gradient-to-r from-guardian/10 to-guardian-dark/10 text-guardian"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    )}
  >
    {icon}
    {label}
  </Link>
);
