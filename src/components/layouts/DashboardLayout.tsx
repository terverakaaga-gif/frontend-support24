import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/design-utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useRouteMemory } from "@/hooks/useRouteMemory";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchSupportWorkers } from "@/components/SearchSupportWorkers";
import {
  ShareCircle,
  Buildings3,
  Calendar,
  CalendarDate,
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
  Home,
  SuitcaseTag,
  Bookmark,
  ShieldCheck,
  Star,
  Documents,
  ListArrowDown,
  ShopMinimalistic,
  CalendarMark,
  Videocamera,
} from "@solar-icons/react";
import { Nav } from "react-day-picker";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  useRouteMemory();

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
      path === "/support-worker" ||
      path === "/support-coordinator"
    ) {
      return location.pathname === path;
    }
    // For other routes, use the original logic
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const roleBasedLinks = () => {
    // Check if we're on the support-coordinator route
    if (location.pathname.startsWith("/support-coordinator")) {
      return (
        <>
          <NavItem
            to="/support-coordinator"
            icon={<Widget5 className="w-6 h-6" />}
            label="Dashboard"
            active={isActive("/support-coordinator")}
          />
          <NavItem
            to="/support-coordinator/participants"
            icon={<UsersGroupTwoRounded className="w-6 h-6" />}
            label="Participants"
            active={isActive("/support-coordinator/participants")}
          />
          <NavItem
            to="/support-coordinator/providers"
            icon={<Buildings3 className="w-6 h-6" />}
            label="Providers"
            active={isActive("/support-coordinator/providers")}
          />
          <NavItem
            to="/support-coordinator/support-workers"
            icon={<UsersGroupTwoRounded className="w-6 h-6" />}
            label="Support Workers"
            active={isActive("/support-coordinator/support-workers")}
          />
          <NavItem
            to="/support-coordinator/my-panel"
            icon={<Star className="w-6 h-6" />}
            label="My Panel"
            active={isActive("/support-coordinator/my-panel")}
          />
          <NavItem
            to="/support-coordinator/tender"
            icon={<Documents className="w-6 h-6" />}
            label="Tender"
            active={isActive("/support-coordinator/tender")}
          />
          <NavItem
            to="/support-coordinator/draft"
            icon={<ListArrowDown className="w-6 h-6" />}
            label="Draft"
            active={isActive("/support-coordinator/draft")}
          />

          <div className="my-4 border-t border-white/20"></div>

          <NavItem
            to="/support-coordinator/account-settings"
            icon={<Settings className="w-6 h-6" />}
            label="Account Settings"
            active={isActive("/support-coordinator/account-settings")}
          />
        </>
      );
    }

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
              <h2 className="mb-2 px-4 text-md font-montserrat-bold tracking-tight text-white/90">
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
                  to="/admin/service-categories"
                  icon={<Settings className="w-6 h-6" />}
                  label="Service Categories"
                  active={isActive("/admin/service-categories")}
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
              <h2 className="mb-2 px-4 text-md font-montserrat-bold tracking-tight text-white/90">
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
              <h2 className="mb-2 px-4 text-md font-montserrat-bold tracking-tight text-white/90">
                Others
              </h2>
              <div className="space-y-1">
                <NavItem
                  to="/admin/compliance"
                  icon={<ShieldCheck className="w-6 h-6" />}
                  label="Compliance"
                  active={isActive("/admin/compliance")}
                />
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
              to="/participant/events"
              icon={<CalendarDate className="w-6 h-6" />}
              label="Events"
              active={isActive("/participant/events")}
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

            <NavItem
              to={"/participant/jobs"}
              icon={<SuitcaseTag className="w-6 h-6" />}
              label="Jobs"
              active={isActive("/participant/jobs")}
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
              to="/support-worker/compliance"
              icon={<ShieldCheck className="w-6 h-6" />}
              label="Compliance"
              active={isActive("/support-worker/compliance")}
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
            <NavItem
              to="/support-worker/interviews"
              icon={<Videocamera className="w-6 h-6" />}
              label="Interviews"
              active={isActive("/support-worker/interviews")}
            />
            <NavItem
              to="/support-worker/jobs"
              icon={<SuitcaseTag className="w-6 h-6" />}
              label="Jobs"
              active={isActive("/support-worker/jobs")}
            />
            <NavItem
              to="/support-worker/saved-jobs"
              icon={<Bookmark className="w-6 h-6" />}
              label="Saved Jobs"
              active={isActive("/support-worker/saved-jobs")}
            />
          </>
        );

      case "provider":
        return (
          <>
            <NavItem
              to="/provider/"
              icon={<Widget5 className="w-6 h-6" />}
              label="Dashboard"
              active={isActive("/provider/")}
            />

            <NavItem
              to="/provider/find-support-workers"
              icon={<ShopMinimalistic className="w-6 h-6" />}
              label="Support Workers"
              active={isActive("/provider/find-support-workers")}
            />

            <NavItem
              to="/provider/interviews"
              icon={<Videocamera className="w-6 h-6" />}
              label="Interviews"
              active={isActive("/provider/interviews")}
            />

            <NavItem
              to="/provider/workforce"
              icon={<Buildings3 className="w-6 h-6" />}
              label="Workforce"
              active={isActive("/provider/workforce")}
            />

            <NavItem
              to="/provider/accommodations"
              icon={<Home className="w-6 h-6" />}
              label="Accommodations"
              active={isActive("/provider/accommodations")}
            />

            <NavItem
              to="/provider/events"
              icon={<CalendarDate className="w-6 h-6" />}
              label="Events"
              active={isActive("/provider/events")}
            />

            <NavItem
              to="/provider/jobs"
              icon={<SuitcaseTag className="w-6 h-6" />}
              label="Jobs"
              active={isActive("/provider/jobs")}
            />
            <NavItem
              to="/provider/chats"
              icon={<ChatLine className="w-6 h-6" />}
              label="Messages"
              active={isActive("/provider/chats")}
            />

            <NavItem
              to="/provider/shift-cancellation"
              icon={<CalendarMark className="w-6 h-6" />}
              label="Shift Cancellation"
              active={isActive("/provider/shift-cancellation")}
            />
          </>
        );
      default:
        return null;
    }
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-primary-900 rounded-xl overflow-hidden">
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
            {location.pathname.startsWith("/support-coordinator")
              ? "Support Coordinator"
              : user.role === "supportWorker"
                ? "Support Worker"
                : user.role}
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar - Only show on large screens (1024px+) */}
      <aside className="hidden lg:block fixed left-0 top-0 z-30 h-screen w-72 p-4">
        <Sidebar />
      </aside>

      {/* Mobile & Tablet Sidebar - Show toggle button up to large screens */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed left-4 top-4 z-50 bg-white hover:bg-gray-100 shadow-md rounded-lg h-10 w-10"
          >
            <HamburgerMenu className="h-6 w-6 text-gray-700" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 p-4 bg-transparent border-none shadow-none"
        >
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 min-h-screen lg:pl-72 flex flex-col overflow-hidden">
        {/* Content rendered by children */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
      "flex items-center gap-3 rounded-lg px-4 py-3 text-xs font-montserrat-semibold transition-colors relative",
      active
        ? "bg-primary text-white"
        : "text-white/80 hover:bg-primary-700 hover:text-white",
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
