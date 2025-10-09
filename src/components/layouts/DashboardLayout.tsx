// src/components/layouts/DashboardLayout.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchSupportWorkers } from "@/components/SearchSupportWorkers";
import { Bell, Buildings3, Calendar, ChatLine, ClipboardList, HamburgerMenu, Heart, Logout, Safe2, Scanner, Settings, ShieldUser, UsersGroupRounded, UsersGroupTwoRounded, Widget, Widget5 } from "@solar-icons/react";

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

 

  const roleBasedLinks = () => {
    switch (user.role) {
      case "admin":
        return (
          <>
            <NavItem
              to="/admin"
              icon={<Widget5 size={20} />}
              label="Dashboard"
              active={isActive("/admin")}
            />

            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-montserrat-bold tracking-tight text-white/90">
                Management
              </h2>
              <div className="space-y-1">
                <NavItem
                  to="/admin/all-admin"
                  icon={<UsersGroupTwoRounded size={20} />}
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
                  icon={<UsersGroupRounded size={20} />}
                  label="Support Workers"
                  active={isActive("/admin/support-workers")}
                />
                <NavItem
                  to="/admin/invites"
                  icon={<Bell size={20} />}
                  label="Invitations"
                  active={isActive("/admin/invites")}
                />
                <NavItem
                  to="/admin/service-types"
                  icon={<Settings size={20} />}
                  label="Service Types"
                  active={isActive("/admin/service-types")}
                />
              </div>
            </div>

            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-montserrat-bold tracking-tight text-white/90">
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
                  icon={<ClipboardList size={20} />}
                  label="Timesheets"
                  active={isActive("/admin/timesheets")}
                />
                <NavItem
                  to="/admin/batch-invoices"
                  icon={<Scanner size={20} />}
                  label="Batch Invoices"
                  active={isActive("/admin/batch-invoices")}
                />
                <NavItem
                  to="/admin/rate-time-band"
                  icon={<Safe2 size={20} />}
                  label="Rate-Time-Band"
                  active={isActive("/admin/rate-time-band")}
                />
              </div>
            </div>

            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-montserrat-bold tracking-tight text-white/90">
                Other
              </h2>
              <div className="space-y-1">
                <NavItem
                  to="/admin/incidents"
                  icon={<ShieldUser size={20} />}
                  label="Incidents"
                  active={isActive("/admin/incidents")}
                />
                <NavItem
                  to="/admin/chats"
                  icon={<ChatLine size={20} />}
                  label="Messages"
                  active={isActive("/admin/chats")}
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
            <NavItem
              to="/guardian/chats"
              icon={<ChatLine size={20} />}
              label="Messages"
              active={isActive("/guardian/chats")}
            />
          </>
        );
      case "participant":
        return (
          <>
            <NavItem
              to="/participant"
              icon={<Widget5 size={20} />}
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
              icon={<Buildings3 size={20} />}
              label="Organizations"
              active={isActive("/participant/organizations")}
            />
            <NavItem
              to="/participant/timesheets"
              icon={<ClipboardList size={20} />}
              label="My Timesheets"
              active={isActive("/participant/timesheets")}
            />
            <NavItem
              to="/participant/incidents"
              icon={<ShieldUser size={20} />}
              label="Incidents"
              active={isActive("/participant/incidents")}
            />
            <NavItem
              to="/participant/chats"
              icon={<ChatLine size={20} />}
              label="Messages"
              active={isActive("/participant/chats")}
            />
          </>
        );
      case "supportWorker":
        return (
          <>
            <NavItem
              to="/support-worker"
              icon={<Widget5 size={20} />}
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
              icon={<Buildings3 size={20} />}
              label="Organizations"
              active={isActive("/support-worker/organizations")}
            />
            <NavItem
              to="/support-worker/timesheets"
              icon={<ClipboardList size={20} />}
              label="My Timesheets"
              active={isActive("/support-worker/timesheets")}
            />
            <NavItem
              to="/support-worker/incidents"
              icon={<ShieldUser size={20} />}
              label="Incidents"
              active={isActive("/support-worker/incidents")}
            />
            <NavItem
              to="/support-worker/chats"
              icon={<ChatLine size={20} />}
              label="Messages"
              active={isActive("/support-worker/chats")}
            />

            {/* Additional Support Worker Navigation Sections */}
            {/* <div className="mt-8 space-y-1">
              <NavItem
                to="/support-worker/analytics"
                icon={<BarChart3 size={20} />}
                label="Analytics"
                active={isActive("/support-worker/analytics")}
              />
              <NavItem
                to="/support-worker/settings"
                icon={<Settings size={20} />}
                label="Account Settings"
                active={isActive("/support-worker/settings")}
              />
            </div> */}
          </>
        );
      default:
        return null;
    }
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-primary-900">
      {/* Logo Section */}
      <div className="px-6 py-6">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/new-res/support24logo-blk.svg" alt="Support24 Logo" />
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          <div className="space-y-1 font-montserrat-semibold">
            {roleBasedLinks()}
          </div>
        </div>
      </ScrollArea>

      {/* User Profile Section */}
      <div className="mt-auto p-4">
        <div className="bg-primary rounded-lg p-4 text-center">
          <Avatar className="h-16 w-16 mx-auto mb-3">
            <AvatarImage
              src={user?.profileImage}
              alt={`${user?.firstName} ${user.lastName}`}
            />
            <AvatarFallback className="bg-primary text-white text-lg">
              {user?.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm text-white font-montserrat-semibold">
            {user.email}
          </div>
          <div className="text-xs text-primary-300 capitalize font-montserrat">
            {user.role === "supportWorker" ? "Support Worker" : user.role}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-white/80 hover:text-white hover:bg-orange-700 mt-3 font-montserrat-semibold"
            onClick={() => logout()}
          >
            <Logout />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 z-30 h-screen w-64 border-r overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
        variant="ghost"
        className="lg:hidden fixed left-4 top-6 z-40"
        size="icon"
          >
        <HamburgerMenu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 min-h-screen lg:pl-64 flex flex-col overflow-hidden">
      

        {/* Content rendered by children */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
          {children}
        </div>
      </main>

      {/* Support Worker Search Dialog */}
      {user.role === "participant" && (
        <SearchSupportWorkers open={searchOpen} onOpenChange={setSearchOpen} />
      )}
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}

const NavItem = ({ to, icon, label, active = false, badge }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors relative",
      active
        ? "bg-primary text-white"
        : "text-white/80 hover:bg-primary-700 hover:text-white"
    )}
  >
    {icon}
    {label}
    {badge && (
      <Badge className="ml-auto bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0">
        {badge}
      </Badge>
    )}
  </Link>
);
