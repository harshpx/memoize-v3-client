import { useStore } from "@/context/store";
import { initialAuthRefresh } from "@/services/services";
import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";

const OAuth2Redirect = () => {
	const didRun = useRef(false);

	const { user, accessToken } = useStore();

	const params = new URLSearchParams(window.location.search);
	const error = params.get("error");

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		if (error) {
			console.error("OAuth2 Error: ", error);
			window.alert("OAuth2 Error: " + error);
		} else {
			initialAuthRefresh();
		}
	}, []);

	if (!user || !accessToken) {
		return <Navigate to="/" replace />;
	}

	return <></>;
};

export default OAuth2Redirect;
