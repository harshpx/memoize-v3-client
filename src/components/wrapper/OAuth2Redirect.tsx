import { useStore } from "@/context/store";
import { initialAuthRefresh } from "@/services/services";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const OAuth2Redirect = () => {
	const didRun = useRef(false);

	const { user, accessToken } = useStore();

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		initialAuthRefresh();
	}, []);

	if (!user || !accessToken) {
		<Link to="/" replace />;
	}

	return <></>;
};

export default OAuth2Redirect;
