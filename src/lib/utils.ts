import type { Accent, Theme } from "@/context/ThemeProvider";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getAccentColor = (accent: Accent, theme: Theme) => {
	const root = document.documentElement;

	const prev = root.getAttribute("data-accent") || "default";
	root.setAttribute("data-accent", accent);

	const styles = getComputedStyle(root);
	const accentColor = styles.getPropertyValue(`--accent-${theme}`).trim();

	root.setAttribute("data-accent", prev);

	return accentColor;
};
