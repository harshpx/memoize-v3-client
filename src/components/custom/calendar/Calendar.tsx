import type { CalendarMonth, Event } from "@/lib/commonTypes";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import CustomizableButton from "../CustomizableButton";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import {
	getCalendarDaysForMonth,
	MONTHS,
	populateEventMapForCalendar,
} from "@/lib/utils";
import MonthGrid from "./MonthGrid";
import { events } from "@/lib/dummyData";

const Calendar = () => {
	const [currCalendarMonth, setCurrCalendarMonth] = useState<CalendarMonth>({
		month: dayjs().month(),
		year: dayjs().year(),
	});
	const [calendarDays, setCalendarDays] = useState<Dayjs[]>([]);
	const [eventsForMonth, setEventsForMonth] = useState<Record<string, Event[]>>(
		{},
	);

	useEffect(() => {
		const days = getCalendarDaysForMonth(
			currCalendarMonth.month,
			currCalendarMonth.year,
		);
		setCalendarDays(days);
		setEventsForMonth(populateEventMapForCalendar(events, days));
	}, [currCalendarMonth]);

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
			<div className="w-full shrink-0 h-[40px] border border-black dark:border-white rounded-xl flex items-center px-4 gap-4">
				<div className="flex items-center gap-2">
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
			<div className="w-full h-[calc(100%_-_40px)]">
				<MonthGrid
					calendarMonth={currCalendarMonth}
					dayList={calendarDays}
					eventMap={eventsForMonth}
				/>
			</div>
		</div>
	);
};

export default Calendar;
