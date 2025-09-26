// src/components/layouts/DashboardLayout.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
	Clock,
	Menu,
	X,
	LogOut,
	ChevronRight,
	Building2,
	FileText,
	BarChart3,
	MessageCircle,
	FileStack,
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
import { Badge } from "@/components/ui/badge";
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
							<h2 className="mb-2 px-4 text-lg font-bold tracking-tight text-white/90 font-montserrat">
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
								<NavItem
									to="/admin/service-types"
									icon={<Settings size={20} />}
									label="Service Types"
									active={isActive("/admin/service-types")}
								/>
							</div>
						</div>

						<div className="px-3 py-2">
							<h2 className="mb-2 px-4 text-lg font-bold tracking-tight text-white/90 font-montserrat">
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
									to="/admin/batch-invoices"
									icon={<FileStack size={20} />}
									label="Batch Invoices"
									active={isActive("/admin/batch-invoices")}
								/>
								<NavItem
									to="/admin/rate-time-band"
									icon={<Clock size={20} />}
									label="Rate-Time-Band"
									active={isActive("/admin/rate-time-band")}
								/>
							</div>
						</div>

						<div className="px-3 py-2">
							<h2 className="mb-2 px-4 text-lg font-bold tracking-tight text-white/90 font-montserrat">
								Other
							</h2>
							<div className="space-y-1">
								<NavItem
									to="/admin/incidents"
									icon={<ShieldCheck size={20} />}
									label="Incidents"
									active={isActive("/admin/incidents")}
								/>
								<NavItem
									to="/admin/chats"
									icon={<MessageCircle size={20} />}
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
							icon={<MessageCircle size={20} />}
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
						<NavItem
							to="/participant/incidents"
							icon={<ShieldCheck size={20} />}
							label="Incidents"
							active={isActive("/participant/incidents")}
						/>
						<NavItem
							to="/participant/chats"
							icon={<MessageCircle size={20} />}
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
							icon={<BarChart3 size={20} />}
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
						<NavItem
							to="/support-worker/incidents"
							icon={<ShieldCheck size={20} />}
							label="Incidents"
							active={isActive("/support-worker/incidents")}
						/>
						<NavItem
							to="/support-worker/chats"
							icon={<MessageCircle size={20} />}
							label="Messages"
							active={isActive("/support-worker/chats")}
							badge={6}
						/>
						
						{/* Additional Support Worker Navigation Sections */}
						<div className="mt-8 space-y-1">
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
						</div>
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
					<img src="/logo.svg" alt="Support24 Logo"  />
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
			<div className="mt-auto p-4 border-t border-primary-700">
				<div className="bg-primary-600 rounded-lg p-4 text-center">
					<Avatar className="h-16 w-16 mx-auto mb-3">
						<AvatarImage
							src={user?.profileImage}
							alt={`${user?.firstName} ${user.lastName}`}
						/>
						<AvatarFallback className="bg-primary-600 text-white text-lg">
							{user?.firstName?.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div className="text-sm text-white font-semibold font-montserrat">
						{user.email}
					</div>
					<div className="text-xs text-primary-300 capitalize font-montserrat">
						{user.role === 'supportWorker' ? 'Support Worker' : user.role}
					</div>
					<Button
						variant="ghost"
						className="w-full justify-start gap-2 text-white/80 hover:text-white hover:bg-orange-700 mt-3 font-semibold font-montserrat"
						onClick={() => logout()}
					>
						<LogOut className="h-4 w-4" />
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
						className="lg:hidden fixed left-4 top-4 z-40"
						size="icon"
					>
						<Menu className="h-6 w-6" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-64 p-0">
					<Sidebar />
				</SheetContent>
			</Sheet>

			{/* Main Content */}
			<main className="flex-1 min-h-screen lg:pl-64 flex flex-col overflow-hidden">
				{/* Header Section */}
				<div className="bg-white border-b border-gray-200 px-6 py-6 flex-shrink-0">
					<div className="flex justify-between items-center">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 mb-1">
								{(() => {
									const hour = new Date().getHours();
									let greeting = "Good Evening";
									let emoji = "🌙";
									
									if (hour >= 5 && hour < 12) {
										greeting = "Good Morning";
										emoji = "🌅";
									} else if (hour >= 12 && hour < 17) {
										greeting = "Good Afternoon";
										emoji = "☀️";
									}
									
									return `${greeting} ${user?.firstName} ${emoji}`;
								})()}
							</h1>
							<p className="text-muted-foreground">
								{(() => {
									switch (user.role) {
										case "admin":
											return "Manage your platform, users, and oversee all operations";
										case "participant":
											return "Find support workers and manage your care services";
										case "guardian":
											return "Manage bookings and care for your loved ones";
										case "supportWorker":
											return "View your shifts and connect with participants";
										default:
											return "Welcome to your dashboard";
									}
								})()}
							</p>
						</div>
						
						<div className="flex items-center space-x-4">
							{/* Search Section - Role Specific */}
							{user.role === "participant" && (
								<div className="flex items-center space-x-2">
									<div className="relative">
										<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search support workers..."
											className="pl-10 w-64 border-primary/20 focus:border-primary"
											onClick={() => setSearchOpen(true)}
											readOnly
										/>
									</div>
									<Button 
										onClick={() => setSearchOpen(true)}
										className="bg-primary hover:bg-primary/90"
									>
										Find Support
									</Button>
								</div>
							)}
							
							{user.role === "admin" && (
								<div className="relative">
									<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search users, shifts, reports..."
										className="pl-10 w-64 border-primary/20 focus:border-primary"
										onChange={(e) => {
											const event = new CustomEvent('dashboardSearch', { 
												detail: { query: e.target.value } 
											});
											window.dispatchEvent(event);
										}}
									/>
								</div>
							)}
							
							{user.role === "guardian" && (
								<div className="relative">
									<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search bookings, care plans..."
										className="pl-10 w-64 border-primary/20 focus:border-primary"
										onChange={(e) => {
											const event = new CustomEvent('dashboardSearch', { 
												detail: { query: e.target.value } 
											});
											window.dispatchEvent(event);
										}}
									/>
								</div>
							)}
							
							{user.role === "supportWorker" && (
								<div className="relative">
									<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search shifts, participants..."
										className="pl-10 w-64 border-primary/20 focus:border-primary"
										onChange={(e) => {
											const event = new CustomEvent('dashboardSearch', { 
												detail: { query: e.target.value } 
											});
											window.dispatchEvent(event);
										}}
									/>
								</div>
							)}
							
							{/* Notifications - Role Specific */}
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="h-5 w-5" />
								{(() => {
									// Different notification counts based on role
									const notificationCount = user.role === "admin" ? 5 : 
																user.role === "participant" ? 2 :
																user.role === "supportWorker" ? 3 : 1;
									
									return notificationCount > 0 && (
										<Badge className="absolute -top-1 -right-1 bg-red-500 h-5 w-5 text-xs flex items-center justify-center p-0">
											{notificationCount}
										</Badge>
									);
								})()}
							</Button>
							
							{/* User Profile Dropdown */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-10 w-10 rounded-full"
									>
										<Avatar className="h-8 w-8">
											<AvatarImage
												src={user?.profileImage}
												alt={`${user?.firstName} ${user.lastName}`}
											/>
											<AvatarFallback className="bg-primary text-white">
												{user?.firstName?.charAt(0)}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel>
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
											<p className="text-xs text-muted-foreground capitalize">
												{user.role === 'supportWorker' ? 'Support Worker' : user.role}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									
									<DropdownMenuItem asChild>
										<Link to={getProfileRoute()}>
											<UserRound className="mr-2 h-4 w-4" />
											Profile
										</Link>
									</DropdownMenuItem>
									
									{/* Role-specific menu items */}
									{user.role === "admin" && (
										<>
											<DropdownMenuItem asChild>
												<Link to="/admin/settings">
													<Settings className="mr-2 h-4 w-4" />
													System Settings
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link to="/admin/reports">
													<BarChart3 className="mr-2 h-4 w-4" />
													Reports
												</Link>
											</DropdownMenuItem>
										</>
									)}
									
									{user.role === "participant" && (
										<>
											<DropdownMenuItem onClick={() => setSearchOpen(true)}>
												<Users className="mr-2 h-4 w-4" />
												Find Support Workers
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link to="/participant/care-plan">
													<Heart className="mr-2 h-4 w-4" />
													My Care Plan
												</Link>
											</DropdownMenuItem>
										</>
									)}
									
									{user.role === "guardian" && (
										<DropdownMenuItem asChild>
											<Link to="/guardian/dependents">
												<Users className="mr-2 h-4 w-4" />
												Manage Dependents
											</Link>
										</DropdownMenuItem>
									)}
									
									{user.role === "supportWorker" && (
										<>
											<DropdownMenuItem asChild>
												<Link to="/support-worker/availability">
													<Calendar className="mr-2 h-4 w-4" />
													Set Availability
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link to="/support-worker/certifications">
													<ShieldCheck className="mr-2 h-4 w-4" />
													Certifications
												</Link>
											</DropdownMenuItem>
										</>
									)}
									
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => logout()}>
										<LogOut className="mr-2 h-4 w-4" />
										Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>

				{/* Content rendered by children */}
				<div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
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
				? "bg-primary-600 text-white"
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