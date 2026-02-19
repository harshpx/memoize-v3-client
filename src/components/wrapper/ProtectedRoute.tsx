import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "@/context/store";

const ProtectedRoute = () => {
	const accessToken = useStore((state) => state.accessToken);
	const user = useStore((state) => state.user);
	const init = useStore((state) => state.init);

	// If AuthInit hasn't finished checking the session, render nothing
	// This prevents the "flash" of the login page before the session is restored.
	if (!init) return null;

	if (!accessToken || !user) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
