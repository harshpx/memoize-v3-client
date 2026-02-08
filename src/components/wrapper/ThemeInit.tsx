import { useStore } from "@/context/store";
import { useEffect, type ReactNode } from "react";

const ThemeInit = ({ children }: { children: ReactNode }) => {
	const { theme, accent } = useStore();
	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(theme);
		root.setAttribute("data-accent", accent);
	}, [theme, accent]);

	return <>{children}</>;
};

export default ThemeInit;
