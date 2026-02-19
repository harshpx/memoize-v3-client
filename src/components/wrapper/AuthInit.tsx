import { useStore } from "@/context/store";
import { initialAuthRefresh } from "@/services/services";
import { useEffect, useRef } from "react";
import Loader from "../custom/Loader";

const AuthInit = ({ children }: { children: React.ReactNode }) => {
	// for app initialization
	const { init } = useStore();

	// Ref prevents double-execution in React Strict Mode (Development)
	const didRun = useRef(false);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		initialAuthRefresh();
	}, []);

	if (!init) return <Loader />;

	return <>{children}</>;
};

export default AuthInit;
