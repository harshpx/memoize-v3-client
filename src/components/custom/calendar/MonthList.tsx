import type { CalendarMonth, Event } from "@/lib/commonTypes";
import dayjs, { Dayjs } from "dayjs";
import EventCard from "./EventCard";
import { cn } from "@/lib/utils";

interface MonthListProps {
	calendarMonth: CalendarMonth;
	eventMap: Record<string, Event[]>;
}

const MonthList = ({ calendarMonth, eventMap }: MonthListProps) => {
	let st = dayjs()
		.utc()
		.day(1)
		.month(calendarMonth.month)
		.year(calendarMonth.year)
		.startOf("month");
	const en = st.endOf("month");
	const dayList: Dayjs[] = [];
	while (!st.isAfter(en)) {
		dayList.push(st);
		st = st.add(1, "day");
	}

	return (
		<div className="flex h-full w-full p-4 overflow-auto">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full overflow-scroll">
				{dayList
					.filter(
						(day) =>
							Array.isArray(eventMap[day.toISOString()]) &&
							eventMap[day.toISOString()].length > 0,
					)
					.map((day) => {
						const key = day.toISOString();
						return (
							<div
								key={key}
								className={cn(
									"flex flex-col gap-2 p-2 rounded-xl backdrop-blur-sm w-full",
									"bg-neutral-500/10 dark:bg-neutral-400/10 backdrop-blur-sm",
									"border border-neutral-300 dark:border-neutral-700/50",
									"hover:bg-neutral-500/20 dark:hover:bg-neutral-400/20",
								)}>
								<div className="text-sm font-medium">
									{day.format("ddd DD MMM, YYYY")}
								</div>
								<div className="flex flex-col gap-2">
									{eventMap[key].map((event, idx) => (
										<EventCard
											key={event.id + idx}
											event={event}
											className="border border-neutral-300 dark:border-neutral-700/50"
										/>
									))}
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default MonthList;
