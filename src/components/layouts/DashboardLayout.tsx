// src/components/layouts/DashboardLayout.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useRouteMemory } from '@/hooks/useRouteMemory';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchSupportWorkers } from "@/components/SearchSupportWorkers";
import {
  ShareCircle,
  Buildings3,
  Calendar,
  ChatLine,
  ClipboardList,
  HamburgerMenu,
  Heart,
  Logout,
  HourglassLine,
  Scanner,
  Settings,
  ShieldUser,
  UsersGroupRounded,
  UsersGroupTwoRounded,
  Widget5,
  ShieldKeyholeMinimalistic,
} from "@solar-icons/react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  useRouteMemory(); // Add this hook

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
              icon={<Widget5 className="w-6 h-6" />}
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
                  icon={<ShieldKeyholeMinimalistic className="w-6 h-6" />}
                  label="Admins"
                  active={isActive("/admin/all-admin")}
                />
                <NavItem
                  to="/admin/participants"
                  icon={<UsersGroupTwoRounded className="w-6 h-6" />}
                  label="Participants"
                  active={isActive("/admin/participants")}
                />
                <NavItem
                  to="/admin/support-workers"
                  icon={<UsersGroupTwoRounded className="w-6 h-6" />}
                  label="Support Workers"
                  active={isActive("/admin/support-workers")}
                />
                <NavItem
                  to="/admin/invites"
                  icon={<ShareCircle className="w-6 h-6" />}
                  label="Invitations"
                  active={isActive("/admin/invites")}
                />
                <NavItem
                  to="/admin/service-types"
                  icon={<Settings className="w-6 h-6" />}
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
                  icon={<Calendar className="w-6 h-6" />}
                  label="Shifts"
                  active={isActive("/admin/shifts")}
                />
                <NavItem
                  to="/admin/timesheets"
                  icon={<ClipboardList className="w-6 h-6" />}
                  label="Timesheets"
                  active={isActive("/admin/timesheets")}
                />
                <NavItem
                  to="/admin/batch-invoices"
                  icon={<Scanner className="w-6 h-6" />}
                  label="Batch Invoices"
                  active={isActive("/admin/batch-invoices")}
                />
                <NavItem
                  to="/admin/rate-time-band"
                  icon={<HourglassLine className="w-6 h-6" />}
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
                  icon={<ShieldUser className="w-6 h-6" />}
                  label="Incidents"
                  active={isActive("/admin/incidents")}
                />
                <NavItem
                  to="/admin/chats"
                  icon={<ChatLine className="w-6 h-6" />}
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
              icon={<Heart className="w-6 h-6" />}
              label="Dashboard"
              active={isActive("/guardian")}
            />
            <NavItem
              to="/bookings"
              icon={<Calendar className="w-6 h-6" />}
              label="Bookings"
              active={isActive("/bookings")}
            />
            <NavItem
              to="/guardian/chats"
              icon={<ChatLine className="w-6 h-6" />}
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
              icon={<Widget5 className="w-6 h-6" />}
              label="Dashboard"
              active={isActive("/participant")}
            />
            <NavItem
              to="/participant/shifts"
              icon={<Calendar className="w-6 h-6" />}
              label="My Shifts"
              active={isActive("/participant/shifts")}
            />
            <NavItem
              to="/participant/organizations"
              icon={<Buildings3 className="w-6 h-6" />}
              label="Organizations"
              active={isActive("/participant/organizations")}
            />
            <NavItem
              to="/participant/find-support-workers"
              icon={<UsersGroupRounded className="w-6 h-6" />}
              label="Support Workers"
              active={isActive("/participant/find-support-workers")}
            />
            <NavItem
              to="/participant/timesheets"
              icon={<ClipboardList className="w-6 h-6" />}
              label="My Timesheets"
              active={isActive("/participant/timesheets")}
            />
            <NavItem
              to="/participant/incidents"
              icon={<ShieldUser className="w-6 h-6" />}
              label="Incidents"
              active={isActive("/participant/incidents")}
            />
            <NavItem
              to="/participant/chats"
              icon={<ChatLine className="w-6 h-6" />}
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
              icon={<Widget5 className="w-6 h-6" />}
              label="Dashboard"
              active={isActive("/support-worker")}
            />
            <NavItem
              to="/support-worker/shifts"
              icon={<Calendar className="w-6 h-6" />}
              label="Shifts"
              active={isActive("/support-worker/shifts")}
            />
            <NavItem
              to="/support-worker/organizations"
              icon={<Buildings3 className="w-6 h-6" />}
              label="Organizations"
              active={isActive("/support-worker/organizations")}
            />
            <NavItem
              to="/support-worker/timesheets"
              icon={<ClipboardList className="w-6 h-6" />}
              label="My Timesheets"
              active={isActive("/support-worker/timesheets")}
            />
            <NavItem
              to="/support-worker/incidents"
              icon={<ShieldUser className="w-6 h-6" />}
              label="Incidents"
              active={isActive("/support-worker/incidents")}
            />
            <NavItem
              to="/support-worker/chats"
              icon={<ChatLine className="w-6 h-6" />}
              label="Messages"
              active={isActive("/support-worker/chats")}
            />
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
          <div className="text-sm text-white font-montserrat-semibold truncate">
            {user.email}
          </div>
          <div className="text-xs text-primary-300 capitalize font-montserrat">
            {user.role === "supportWorker" ? "Support Worker" : user.role}
          </div>
          <Button
            className="w-full gap-2 items-center justify-center bg-primary-100 text-red-600/80 hover:text-red-600 hover:bg-primary-100 mt-3 font-montserrat-semibold"
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
      {/* Desktop Sidebar - Only show on large screens (1024px+) */}
      <aside className="hidden lg:block fixed left-0 top-0 z-30 h-screen w-64 border-r overflow-y-auto rounded-xl m-4 mb-0">
        <Sidebar />
      </aside>

      {/* Mobile & Tablet Sidebar - Show toggle button up to large screens */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
        variant="ghost"
        size="icon"
        className="lg:hidden absolute left-2 top-2 z-40 hover:bg-transparent hover:text-black p-2"
          >
        <HamburgerMenu className="w-10 h-10" />
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
      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-montserrat-semibold transition-colors relative",
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
