import { cn, WEEKS } from "@/lib/utils";
import type { CalendarMonth, Event } from "@/lib/commonTypes";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useMediaQuery from "@/hooks/useMediaQuery";
import EventCard, { RenderEventIcon } from "./EventCard";

interface MonthGridProps {
	calendarMonth: CalendarMonth;
	eventMap: Record<string, Event[]>;
}

const MonthGrid = ({ calendarMonth, eventMap }: MonthGridProps) => {
	const isMobile = useMediaQuery("(max-width: 400px)");
	const today = dayjs().utc().startOf("day").toISOString();
	const [selectedDate, setSelectedDate] = useState<string>(
		dayjs().utc().startOf("day").toISOString(),
	);

	useEffect(() => {
		const currentDay = dayjs().utc().startOf("day");
		if (
			currentDay.month() === calendarMonth.month &&
			currentDay.year() === calendarMonth.year
		) {
			setSelectedDate(currentDay.toISOString());
		} else {
			setSelectedDate(
				dayjs()
					.utc()
					.date(1)
					.month(calendarMonth.month)
					.year(calendarMonth.year)
					.startOf("month")
					.toISOString(),
			);
		}
	}, [calendarMonth]);

	return (
		<div className="flex flex-col h-full w-full overflow-hidden">
			{/* Weekdays ribbon */}
			<div className="w-full h-[40px] rounded-xl flex shrink-0 gap-1 items-stretch">
				{WEEKS.map((week) => (
					<div
						key={week}
						className="w-full flex justify-center items-center text-xs sm:text-sm">
						{week.slice(0, 3)}
					</div>
				))}
			</div>
			{/* Calendar grid */}
			<div
				className={cn("w-full h-[400px] grid grid-cols-7 auto-rows-fr gap-1")}>
				{Object.keys(eventMap)
					.sort((a, b) => dayjs.utc(a).diff(dayjs.utc(b)))
					.map((dayString) => {
						const dayObj = dayjs.utc(dayString);
						return (
							<div
								onClick={() => setSelectedDate(dayString)}
								key={dayString}
								className={cn(
									`w-full h-full overflow-hidden
									box-border border-2 border-neutral-200 dark:border-neutral-800 rounded-xl 
									flex flex-col p-1 sm:p-2 gap-1 cursor-pointer`,
									selectedDate === dayString &&
										"border-accent-light dark:border-accent-dark",
									today === dayString &&
										"bg-accent-light dark:bg-accent-dark text-white",
								)}>
								{dayObj.date()}
								<div className="flex flex-wrap gap-1 items-center text-xs sm:text-sm md:text-base">
									{[
										...new Set(
											eventMap[dayString].map((event) => event.eventType),
										),
									]
										.slice(0, isMobile ? 2 : Infinity)
										.map((eventType, idx) => (
											<RenderEventIcon
												key={eventType + idx}
												eventType={eventType}
											/>
										))}
								</div>
							</div>
						);
					})}
			</div>
			{/* Selected date agenda items */}
			{selectedDate && eventMap[selectedDate] && (
				<div className="flex flex-col flex-1 min-h-0 gap-1 mt-2 overflow-hidden">
					<div className="text-lg">{`Agendas (${dayjs.utc(selectedDate).format("DD MMM YYYY")})`}</div>
					<div className="w-full flex min-h-0 flex-wrap items-stretch gap-2 overflow-y-auto">
						{eventMap[selectedDate]?.length === 0 ? (
							<span className="text-neutral-600 dark:text-neutral-400 text-[12px] leading-[1.5rem] truncate">
								No events for this date
							</span>
						) : (
							eventMap[selectedDate].map((event, idx) => (
								<EventCard key={event.id + idx} event={event} />
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default MonthGrid;
