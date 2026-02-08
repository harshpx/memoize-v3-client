import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "@/context/store";

const ProtectedRoute = () => {
	const accessToken = useStore((state) => state.accessToken);
	const user = useStore((state) => state.user);
	const init = useStore((state) => state.init);
	const location = useLocation();

	// If AuthInit hasn't finished checking the session, render nothing (or a small spinner)
	// This prevents the "flash" of the login page before the session is restored.
	if (!init) return null;

	if (!accessToken || !user) {
		// Redirect to home/login, but store the current location in state
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	// Outlet renders the child routes defined in your App.tsx
	return <Outlet />;
};

export default ProtectedRoute;
