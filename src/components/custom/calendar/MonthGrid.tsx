import { cn, WEEKS } from "@/lib/utils";
import type { CalendarMonth, Event } from "@/lib/commonTypes";
import type { Dayjs } from "dayjs";
import { FaBirthdayCake, FaTasks } from "react-icons/fa";
import { MdEvent, MdMeetingRoom } from "react-icons/md";
import { TbDeviceUnknownFilled } from "react-icons/tb";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useMediaQuery from "@/hooks/useMediaQuery";
import { LuCalendar, LuClock } from "react-icons/lu";

interface MonthGridProps {
	calendarMonth: CalendarMonth;
	dayList: Dayjs[];
	eventMap: Record<string, Event[]>;
}

export const RenderEventIcon = ({
	eventType,
}: {
	eventType: Event["eventType"];
}) => {
	if (eventType === "BIRTHDAY") return <FaBirthdayCake />;
	else if (eventType === "EVENT") return <MdEvent />;
	else if (eventType === "MEETING") return <MdMeetingRoom />;
	else if (eventType === "TASK") return <FaTasks />;
	else return <TbDeviceUnknownFilled />;
};

const MonthGrid = ({ calendarMonth, dayList, eventMap }: MonthGridProps) => {
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
		<div className="flex flex-col gap-2 h-full w-full overflow-hidden">
			{/* Weekdays ribbon */}
			<div className="w-full h-[40px] border border-black dark:border-white rounded-xl flex shrink-0 gap-1 items-stretch">
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
				{dayList.map((day) => {
					const dayString = day.toISOString();
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
								today === dayString && "bg-accent-light dark:bg-accent-dark",
							)}>
							{day.date()}
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
							<span>No events for this date</span>
						) : (
							eventMap[selectedDate].map((event, idx) => (
								<div
									key={event.id + idx}
									className={cn(
										`rounded-xl bg-accent-light dark:bg-accent-dark p-2
											flex flex-col gap-2 max-w-[240px]`,
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
									<div className="flex flex-col">
										<span className="text-xs">Description:</span>
										<span className="text-xs italic text-wrap">
											{event.description}
										</span>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default MonthGrid;
