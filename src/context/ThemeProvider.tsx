/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

export const ACCENTS = ["default", "teal", "yellow", "purple", "pink"] as const;

export type Accent = (typeof ACCENTS)[number];
export type Theme = "light" | "dark";

export const ThemeContext = createContext({
	theme: "dark" as Theme,
	setTheme: (_: Theme) => {},
	accent: "default" as Accent,
	setAccent: (_: Accent) => {},
});

const ThemeProvider = ({ children }: { children: ReactNode }): ReactNode => {
	const [theme, setTheme] = useState<Theme>("dark");
	const [accent, setAccent] = useState<Accent>("default");

	const modifyTheme = (newTheme: Theme) => {
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.remove("light", "dark");
		document.documentElement.classList.add(newTheme);
	};

	const modifyAccent = (newAccent: Accent) => {
		setAccent(newAccent);
		localStorage.setItem("accent", newAccent);
		document.documentElement.setAttribute("data-accent", newAccent);
	};

	useEffect(() => {
		const storedTheme = localStorage.getItem("theme");
		if (!!storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
			modifyTheme(storedTheme as Theme);
		} else {
			modifyTheme("dark");
		}

		const storedAccent = localStorage.getItem("accent");
		if (!!storedAccent && ACCENTS.includes(storedAccent as Accent)) {
			modifyAccent(storedAccent as Accent);
		} else {
			modifyAccent("default");
		}
	}, []);

	return (
		<ThemeContext.Provider
			value={{ theme, setTheme: modifyTheme, accent, setAccent: modifyAccent }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
