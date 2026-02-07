import { useAuth } from "@/context/AuthProvider";
import { type ReactNode } from "react";
import Loader from "../custom/Loader";

const AuthInit = ({ children }: { children: ReactNode }) => {
	const { init } = useAuth();
	if (!init) {
		return <Loader />;
	}
	return children;
};

export default AuthInit;
