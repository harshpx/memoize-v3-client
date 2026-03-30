import type { Accent, Entity, Theme } from "@/context/store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Event, Note } from "./commonTypes";
import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(customParseFormat);

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
	id: "",
	content: `{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":null}}]}`,
	preview: "<p></p>",
	createdAt: "",
	updatedAt: "",
	isArchived: false,
	isDeleted: false,
	deletedAt: "",
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

export const entityTypeToName = (
	entityType: keyof Entity,
	firstCaps = false,
	plural = true,
) => {
	let value = entityType.toString().toLowerCase();
	if (value.charAt(value.length - 1) === "s") value = value.slice(0, -1);
	if (firstCaps) value = value.slice(0, 1).toUpperCase() + value.slice(1);
	if (plural) value += "s";
	return value;
};

export const getTimeOfDayGreeting = () => {
	const currentHour = new Date().getHours();
	if (currentHour < 12) {
		return "Good morning";
	} else if (currentHour < 18) {
		return "Good afternoon";
	} else {
		return "Good evening";
	}
};

export const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export const WEEKS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export const getCalendarDaysForMonth = (month: number, year: number) => {
	const curr = dayjs.utc().month(month).year(year).startOf("day");
	const startOfMonth = curr.startOf("month");
	const endOfMonth = curr.endOf("month");

	const start = startOfMonth.subtract(startOfMonth.day(), "day");
	const end = endOfMonth.add(6 - endOfMonth.day(), "day");

	const arr: Dayjs[] = [];
	let current = start;

	while (!current.isAfter(end)) {
		arr.push(current);
		current = current.add(1, "day");
	}
	return arr;
};

export const populateEventMapForCalendar = (
	events: Event[],
	calendarDays: Dayjs[],
) => {
	const eventMap: Record<string, Event[]> = {};
	calendarDays.forEach(
		(day) => (eventMap[day.utc().startOf("day").toISOString()] = []),
	);
	const rangeStart = calendarDays[0].utc().startOf("day");
	const rangeEnd = calendarDays[calendarDays.length - 1].utc().endOf("day");

	const pushToDays = (start: Dayjs, end: Dayjs, event: Event) => {
		const startUTC = start.utc();
		const endUTC = end.utc();
		const clampedStart = startUTC.isBefore(rangeStart) ? rangeStart : startUTC;
		const clampedEnd = endUTC.isAfter(rangeEnd) ? rangeEnd : endUTC;
		let curr = clampedStart.startOf("day");
		while (!curr.isAfter(clampedEnd)) {
			const key = curr.toISOString();
			eventMap[key]?.push(event);
			curr = curr.add(1, "day");
		}
	};

	for (const event of events) {
		const eventStart = dayjs.utc(event.start);
		const eventEnd = dayjs.utc(event.end);
		const eventDurationMs = eventEnd.diff(eventStart, "millisecond");

		if (event.eventRepeat === "YEARLY") {
			for (let year = rangeStart.year() - 1; year <= rangeEnd.year(); year++) {
				const start = eventStart.year(year);
				const end = start.add(eventDurationMs, "millisecond");
				if (!start.isAfter(rangeEnd) && !end.isBefore(rangeStart)) {
					pushToDays(start, end, event);
				}
			}
		} else if (event.eventRepeat === "MONTHLY") {
			let curr = rangeStart.startOf("month").subtract(1, "month");
			while (curr.isBefore(rangeEnd)) {
				const daysInMonth = curr.daysInMonth();
				const start = eventStart
					.year(curr.year())
					.month(curr.month())
					.date(Math.min(eventStart.date(), daysInMonth));
				const end = start.add(eventDurationMs, "millisecond");
				if (!start.isAfter(rangeEnd) && !end.isBefore(rangeStart)) {
					pushToDays(start, end, event);
				}
				curr = curr.add(1, "month");
			}
		} else if (event.eventRepeat === "WEEKLY") {
			let curr = rangeStart.startOf("week").subtract(1, "week");
			while (curr.isBefore(rangeEnd)) {
				const start = curr
					.startOf("week")
					.add(eventStart.day(), "day")
					.hour(eventStart.hour())
					.minute(eventStart.minute())
					.second(eventStart.second());
				const end = start.add(eventDurationMs, "millisecond");

				if (!start.isAfter(rangeEnd) && !end.isBefore(rangeStart)) {
					pushToDays(start, end, event);
				}
				curr = curr.add(1, "week");
			}
		} else {
			if (!eventStart.isAfter(rangeEnd) && !eventEnd.isBefore(rangeStart)) {
				pushToDays(eventStart, eventEnd, event);
			}
		}
	}
	return eventMap;
};

// comment to trigger build
// another comment to trigger build
