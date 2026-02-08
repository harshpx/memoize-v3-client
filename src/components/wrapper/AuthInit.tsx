import { useStore } from "@/context/store";
import { getUserInfo } from "@/services/apis";
import { retryWithRefresh } from "@/services/services";
import { useEffect, useRef } from "react";
import Loader from "../custom/Loader";

const AuthInit = ({ children }: { children: React.ReactNode }) => {
	const { init, setInit } = useStore();

	// Ref prevents double-execution in React Strict Mode (Development)
	const didRun = useRef(false);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;

		const bootstrapAuth = async () => {
			try {
				await retryWithRefresh(getUserInfo, []);
			} catch (err) {
				if (err instanceof Error) {
					console.error("Auth initialization failed:", err.message);
				} else {
					console.info("Auth: No session found on startup.");
				}
			} finally {
				setInit(true);
			}
		};

		bootstrapAuth();
	}, []);

	if (!init) return <Loader />;

	return <>{children}</>;
};

export default AuthInit;
