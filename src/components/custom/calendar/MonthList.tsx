import type { CalendarMonth, Event } from "@/lib/commonTypes";
import { cn, WEEKS } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import { RenderEventIcon } from "./MonthGrid";
import { LuCalendar, LuClock } from "react-icons/lu";

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
										<div
											key={event.id + idx}
											className={cn(
												`rounded-xl bg-accent-light dark:bg-accent-dark p-2
                        flex flex-col gap-2`,
											)}>
											<div className="flex gap-1 items-center">
												<RenderEventIcon eventType={event.eventType} />
												<span className="font-bold">{event.title}</span>
											</div>
											<div className="flex flex-col gap-1">
												<div className="text-xs flex gap-1 items-center">
													<LuClock />
													<span>
														{`${dayjs.utc(event.start).format("hh:mm a")} - ${dayjs.utc(event.end).format("hh:mm a")}
                            (${dayjs.utc(event.end).startOf("day").diff(dayjs.utc(event.start).startOf("day"), "day") + 1} day(s))`}
													</span>
												</div>
												<div className="text-xs flex gap-1 items-center">
													<LuCalendar />
													<span>
														{event.eventRepeat === "YEARLY"
															? `${dayjs.utc(event.start).format("DD MMM")} (every year)`
															: event.eventRepeat === "MONTHLY"
																? `Starts ${dayjs.utc(event.start).format("DD")}th of every month`
																: event.eventRepeat === "WEEKLY"
																	? `Starts every ${WEEKS[dayjs.utc(event.start).day()]}`
																	: `${dayjs.utc(event.start).format("DD MMM YY")} - ${dayjs.utc(event.end).format("DD MMM YY")}`}
													</span>
												</div>
											</div>
											{/* <div className="flex flex-col">
											<span className="text-xs">Description:</span>
											<span className="text-xs italic text-wrap">
												{event.description}
											</span>
										</div> */}
										</div>
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
