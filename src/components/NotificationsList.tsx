import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Bell, Info } from "lucide-react";

interface Notification {
	id: string;
	type: "booking" | "message" | "update" | "reminder";
	title: string;
	description: string;
	time: string;
}

interface NotificationsListProps {
	notifications: Notification[];
	showViewAll?: boolean;
}

export function NotificationsList({
	notifications,
	showViewAll = true,
}: NotificationsListProps) {
	const getIcon = (type: "booking" | "message" | "update" | "reminder") => {
		switch (type) {
			case "booking":
				return <Calendar className="h-5 w-5 text-green-500" />;
			case "message":
				return <MessageSquare className="h-5 w-5 text-blue-500" />;
			case "update":
				return <Info className="h-5 w-5 text-yellow-500" />;
			case "reminder":
				return <Bell className="h-5 w-5 text-guardian" />;
			default:
				return <Bell className="h-5 w-5" />;
		}
	};

	const getBgColor = (type: "booking" | "message" | "update" | "reminder") => {
		switch (type) {
			case "booking":
				return "bg-green-100";
			case "message":
				return "bg-blue-100";
			case "update":
				return "bg-yellow-100";
			case "reminder":
				return "bg-guardian";
			default:
				return "bg-gray-100";
		}
	};

	return (
		<Card>
			<CardHeader className="pb-2 flex flex-row items-center justify-between">
				{/* <CardTitle className="text-lg font-medium">Notifications</CardTitle> */}
				{notifications.length > 0 && (
					<span className="text-xs font-medium bg-guardian text-white px-2 py-1 rounded-full">
						{notifications.filter((n) => n.time.includes("unread")).length}{" "}
						unread
					</span>
				)}
			</CardHeader>
			<CardContent className="pt-0">
				{notifications.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<Bell className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
						<p className="text-sm text-muted-foreground">
							No new notifications
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{notifications.map((notification) => (
							<div
								key={notification.id}
								className="flex items-start gap-3 p-3 rounded-lg bg-accent/50"
							>
								<div
									className={`p-2 rounded-full ${getBgColor(
										notification.type
									)}`}
								>
									{getIcon(notification.type)}
								</div>
								<div className="flex-1">
									<h4 className="text-sm font-medium">{notification.title}</h4>
									<p className="text-xs text-muted-foreground">
										{notification.description}
									</p>
								</div>
								<div className="text-xs text-muted-foreground">
									{notification.time}
								</div>
							</div>
						))}
						{showViewAll && (
							<button className="w-full text-center text-sm text-guardian hover:text-guardian-dark transition py-2">
								View All Notifications
							</button>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
