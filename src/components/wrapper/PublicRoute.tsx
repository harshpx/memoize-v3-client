import { useAuth } from "@/context/AuthProvider";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: ReactNode }) => {
	const { accessToken, user } = useAuth();
	if (accessToken && user) {
		return <Navigate to="/dashboard" replace />;
	}
	return children;
};

export default PublicRoute;
