import { useAuth } from "@/context/AuthProvider";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { accessToken, user } = useAuth();
	if (!accessToken || !user) {
		return <Navigate to="/" replace />;
	}
	return children;
};

export default ProtectedRoute;
