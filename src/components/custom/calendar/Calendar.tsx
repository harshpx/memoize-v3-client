import type { CalendarMonth, Event } from "@/lib/commonTypes";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import CustomizableButton from "../CustomizableButton";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import {
	cn,
	getCalendarMonthRange,
	MONTHS,
	populateEventsInRange,
} from "@/lib/utils";
import MonthGrid from "./MonthGrid";
import MonthList from "./MonthList";
import { useStore } from "@/context/store";

const Calendar = () => {
	const events = useStore((state) => state.events);
	const [calendarView, setCalendarView] = useState<"GRID" | "LIST">(
		localStorage.getItem("calendarView") === "LIST" ? "LIST" : "GRID",
	);
	const [currCalendarMonth, setCurrCalendarMonth] = useState<CalendarMonth>({
		month: dayjs().month(),
		year: dayjs().year(),
	});
	const [dateEventMap, setDateEventMap] = useState<Record<string, Event[]>>({});

	const changeCalendarView = (view: "GRID" | "LIST") => {
		localStorage.setItem("calendarView", view);
		setCalendarView(view);
	};

	useEffect(() => {
		const days = getCalendarMonthRange(
			currCalendarMonth.month,
			currCalendarMonth.year,
		);
		setDateEventMap(populateEventsInRange(events, days));
	}, [currCalendarMonth, events]);

	const nextMonth = () => {
		setCurrCalendarMonth((prev) => {
			const nextMonth = (prev.month + 1) % 12;
			const nextYear = prev.year + (prev.month === 11 ? 1 : 0);
			return { month: nextMonth, year: nextYear };
		});
	};

	const prevMonth = () => {
		setCurrCalendarMonth((prev) => {
			const prevMonth = (prev.month - 1 + 12) % 12;
			const prevYear = prev.year - (prev.month === 0 ? 1 : 0);
			return { month: prevMonth, year: prevYear };
		});
	};

	return (
		<div className="w-full h-full flex flex-col gap-1">
			<div className="w-full shrink-0 h-[40px] border border-accent-light dark:border-accent-dark rounded-xl flex items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<div className="flex items-center">
						<CustomizableButton onClick={prevMonth}>
							<LuChevronLeft />
						</CustomizableButton>
						<CustomizableButton onClick={nextMonth}>
							<LuChevronRight />
						</CustomizableButton>
					</div>
					<div>
						{MONTHS[currCalendarMonth.month]}, {currCalendarMonth.year}
					</div>
				</div>
				<div className="flex items-stretch text-sm">
					<CustomizableButton
						className={cn(
							calendarView === "GRID" && "bg-accent-light dark:bg-accent-dark",
						)}
						onClick={() => changeCalendarView("GRID")}>
						Grid
					</CustomizableButton>
					<CustomizableButton
						className={cn(
							calendarView === "LIST" && "bg-accent-light dark:bg-accent-dark",
						)}
						onClick={() => changeCalendarView("LIST")}>
						List
					</CustomizableButton>
				</div>
			</div>
			<div className="w-full h-[calc(100%_-_40px)]">
				{calendarView === "GRID" ? (
					<MonthGrid
						calendarMonth={currCalendarMonth}
						eventMap={dateEventMap}
					/>
				) : (
					<MonthList
						calendarMonth={currCalendarMonth}
						eventMap={dateEventMap}
					/>
				)}
			</div>
		</div>
	);
};

export default Calendar;
