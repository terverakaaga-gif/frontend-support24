import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";

const Index = () => {
	const { user, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoading) return;

		if (!user) {
			navigate("/login");
			return;
		}

		// Redirect based on user role
		switch (user.role) {
			case "admin":
				navigate("/admin");
				break;
			case "guardian":
				navigate("/guardian");
				break;
			case "participant":
				navigate("/participant");
				break;
			case "supportWorker":
				navigate("/support-worker");
				break;
			case "coordinator":
				navigate("/support-coordinator");
				break;
			case "provider":
				navigate("/provider");
				break;
			default:
				navigate("/login");
		}
	}, [user, isLoading, navigate]);

	return <Loader />;
};

export default Index;
