import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "@/context/store";

const PublicRoute = () => {
	const accessToken = useStore((state) => state.accessToken);
	const user = useStore((state) => state.user);
	const init = useStore((state) => state.init);
	const location = useLocation();

	// If AuthInit hasn't finished checking the session, render nothing (or a small spinner)
	// This prevents the "flash" of the login page before the session is restored.
	if (!init) return null;

	// We only want to redirect if they are actually authenticated
	// AND trying to access the public entry points (like "/" or "/auth")
	const isAuthPath = location.pathname === "/" || location.pathname === "/auth";

	if (accessToken && user && isAuthPath) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
};

export default PublicRoute;
