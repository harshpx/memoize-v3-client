import type { Accent, Theme } from "@/context/store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Note } from "./commonTypes";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const ACCENTS = ["default", "teal", "yellow", "purple", "pink"] as const;

export const getAccentColor = (accent: Accent, theme: Theme) => {
	const root = document.documentElement;

	const prev = root.getAttribute("data-accent") || "default";
	root.setAttribute("data-accent", accent);

	const styles = getComputedStyle(root);
	const accentColor = styles.getPropertyValue(`--accent-${theme}`).trim();

	root.setAttribute("data-accent", prev);

	return accentColor;
};

export const formatDate = (dateString: string) => {
	const date = new Date(dateString);

	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	}).format(date);
};

export const safeParseForEditor = (jsonString: string) => {
	let result;
	try {
		result = JSON.parse(jsonString);
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
		}
		console.log("Parsing error");
		result = {
			type: "doc",
			content: [
				{
					type: "paragraph",
					attrs: {
						textAlign: null,
					},
					content: [
						{
							type: "text",
							text: `${jsonString}`,
						},
					],
				},
			],
		};
	}
	return result;
};

export const emptyNoteTemplate: Note = {
	content: `{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null}}]}`,
	preview: "<p></p>",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepCompareObjects = (obj1: any, obj2: any): boolean => {
	if (obj1 === obj2) return true;
	if (obj1 === null || obj2 === null || typeof obj1 !== typeof obj2)
		return false;
	if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
	if (Array.isArray(obj1)) {
		if (obj1.length !== obj2.length) return false;
		return obj1.every((item, idx) => deepCompareObjects(item, obj2[idx]));
	}
	if (typeof obj1 === "object") {
		const keys1: string[] = Object.keys(obj1);
		const keys2: string[] = Object.keys(obj2);
		if (keys1.length !== keys2.length) return false;
		return keys1.every(
			(key) =>
				Object.prototype.hasOwnProperty.call(obj2, key) &&
				deepCompareObjects(obj1[key], obj2[key]),
		);
	}
	return false;
};
