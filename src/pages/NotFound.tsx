import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "@solar-icons/react";

export default function NotFound() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<div className="flex items-center gap-2 mb-6">
				<Heart className="h-8 w-8 text-guardian" />
				<span className="text-2xl font-montserrat-bold">Support 24</span>
			</div>

			<h1 className="text-4xl font-montserrat-bold mb-4">404 - Page Not Found</h1>
			<p className="text-lg text-muted-foreground mb-8">
				The page you are looking for doesn't exist or has been moved.
			</p>

			<Link to="/">
				<Button className="bg-guardian hover:bg-guardian-dark">
					Back to Home
				</Button>
			</Link>
		</div>
	);
}
