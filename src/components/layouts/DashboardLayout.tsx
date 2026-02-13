import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/design-utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useRouteMemory } from "@/hooks/useRouteMemory";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarSeparator,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

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
  Suitcase,
  Bookmark,
  ShieldCheck,
  Star,
  Documents,
  ListArrowDown,
  ShopMinimalistic,
  CalendarMark,
  Videocamera,
  Logout2,
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

          <SidebarSeparator className="my-4 bg-white/20" />

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

            <div className="px-3 py-2 space-y-1">
              <SidebarGroupLabel className="px-4 text-white/90 font-montserrat-bold text-md h-auto mb-2">
                Management
              </SidebarGroupLabel>
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

            <div className="px-3 py-2 space-y-1">
              <SidebarGroupLabel className="px-4 text-white/90 font-montserrat-bold text-md h-auto mb-2">
                Bookings
              </SidebarGroupLabel>
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

            <div className="px-3 py-2 space-y-1">
              <SidebarGroupLabel className="px-4 text-white/90 font-montserrat-bold text-md h-auto mb-2">
                Others
              </SidebarGroupLabel>
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
              icon={<Suitcase className="w-6 h-6" />}
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
              icon={<Suitcase className="w-6 h-6" />}
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
              icon={<Suitcase className="w-6 h-6" />}
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100 w-full font-montserrat">
        {/* Sidebar Component */}
        <Sidebar collapsible="icon" className="border-none">
          {/* Logo Section */}
          <SidebarHeader className="px-8 py-4 flex flex-row items-center justify-between group-data-[collapsible=icon]:pl-4">
            <Link to="/" className="flex items-center space-x-2 group-data-[collapsible=icon]:hidden">
              <img src="/new-res/support24logo-blk.svg" className="w-32" alt="Support24 Logo" />
            </Link>
            <SidebarTrigger className="hidden lg:flex" />
          </SidebarHeader>

          {/* Navigation */}
          <SidebarContent className="px-6 overflow-x-hidden no-scrollbar group-data-[collapsible=icon]:pl-4">
            <SidebarMenu className="space-y-1 py-4">
              {roleBasedLinks()}
            </SidebarMenu>
          </SidebarContent>

          {/* User Profile Section */}
          <SidebarFooter className="p-0 border-t border-white/10">
            {/* Logout Button */}
            <div className="px-6 py-2 flex justify-center group-data-[collapsible=icon]:px-0">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-2 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-white/10 font-medium h-auto group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:aspect-square"
                onClick={() => logout()}
                title="Logout"
              >
                <Logout2 className="w-4 h-4" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </Button>
            </div>

            {/* User Profile */}
            <div className="px-8 py-4 border-t border-white/10 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
                <Avatar className="h-9 w-9 bg-[#0D2BEC] shrink-0">
                  <AvatarImage
                    src={user?.profileImage}
                    alt={`${user?.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback className="bg-[#0D2BEC] text-white text-xs font-bold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  <p className="text-xs text-white/50 capitalize truncate font-montserrat">
                    {location.pathname.startsWith("/support-coordinator")
                      ? "Support Coordinator"
                      : user.role === "supportWorker"
                        ? "Support Worker"
                        : user.role}
                  </p>
                </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 min-h-screen flex flex-col overflow-hidden relative">
          {/* Mobile Toggle Button */}
          <div className="lg:hidden fixed left-4 top-4 z-50">
            <SidebarTrigger className="bg-white hover:bg-gray-100 shadow-md rounded-lg h-10 w-10 text-gray-700 hover:text-gray-900" />
          </div>

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
    </SidebarProvider>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}

const NavItem = ({ to, icon, label, active = false, badge }: NavItemProps) => {
  const { setOpenMobile, isMobile } = useSidebar();

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-2 py-2 h-auto text-sm transition-colors relative group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center",
          active
            ? "bg-primary text-white font-montserrat-semibold"
            : "text-white/80 hover:bg-white/10 hover:text-white font-montserrat",
        )}
      >
        <Link to={to}>
          {icon}
          <span className="group-data-[collapsible=icon]:hidden">{label}</span>
          {badge && (
            <Badge className="ml-auto bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0 group-data-[collapsible=icon]:hidden">
              {badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
