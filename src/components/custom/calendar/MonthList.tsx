import type { CalendarMonth, Event } from "@/lib/commonTypes";
import dayjs, { Dayjs } from "dayjs";
import EventCard from "./EventCard";

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
		<div className="flex h-full w-full p-4 overflow-hidden">
			<div className="flex flex-wrap gap-2 w-full overflow-scroll">
				{dayList
					.filter(
						(day) =>
							Array.isArray(eventMap[day.toISOString()]) &&
							eventMap[day.toISOString()].length > 0,
					)
					.map((day) => {
						const key = day.toISOString();
						return (
							<div key={key} className="flex flex-col gap-1 w-[240px]">
								<div className="w-full">{day.format("ddd DD MMM, YYYY")}</div>
								<div className="flex flex-col gap-1">
									{eventMap[key].map((event, idx) => (
										<EventCard key={event.id + idx} event={event} />
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
