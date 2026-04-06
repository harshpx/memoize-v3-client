import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Event, EventModifyRequest } from "@/lib/commonTypes";
import { cn, WEEKS } from "@/lib/utils";
import dayjs from "dayjs";
import { useState } from "react";
import { FaBirthdayCake, FaTasks } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { LuCalendar, LuClock } from "react-icons/lu";
import { MdEvent, MdMeetingRoom } from "react-icons/md";
import { TbDeviceUnknownFilled } from "react-icons/tb";
import DateTimePicker from "./DateTimePicker";

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

const EventCard = ({
	event,
	className = "",
}: {
	event?: Event;
	className?: string;
}) => {
	const [eventData, setEventData] = useState<EventModifyRequest>(
		event
			? {
					title: event.title,
					start: event.start,
					end: event.end,
					eventType: event.eventType,
					eventRepeat: event.eventRepeat,
					description: event.description,
					location: event.location,
				}
			: {
					title: "",
					start: "",
					end: "",
					eventType: "EVENT",
					eventRepeat: "NONE",
					description: "",
					location: "",
				},
	);

	return (
		<Dialog>
			<DialogTrigger asChild>
				{event ? (
					<div
						className={cn(
							"rounded-xl bg-accent-light dark:bg-accent-dark p-2",
							"flex flex-col gap-2 text-white cursor-pointer",
							className,
						)}>
						<div className="flex gap-1 items-center">
							<RenderEventIcon eventType={event.eventType} />
							<span className="font-bold truncate text-nowrap">
								{event.title}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<div className="text-xs flex items-start gap-1">
								<LuClock />
								<div className="flex flex-wrap gap-x-1">
									<span>{`${dayjs.utc(event.start).format("hh:mm a")} - ${dayjs.utc(event.end).format("hh:mm a")}`}</span>
									<span>{`(${dayjs.utc(event.end).startOf("day").diff(dayjs.utc(event.start).startOf("day"), "day") + 1} day)`}</span>
								</div>
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
						<div className="flex flex-col text-xs">
							<span>Description:</span>
							<span className="italic text-wrap">{event.description}</span>
						</div>
					</div>
				) : (
					<div
						className={cn(
							"rounded-xl p-2 flex items-center justify-center cursor-pointer aspect-square",
							"bg-accent-light dark:bg-accent-dark",
							"border-2 border-white dark:border-black",
						)}>
						<FaPlus className="text-white size-6" />
					</div>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="mt-4">
						<Input
							value={eventData?.title}
							onInput={(e) =>
								setEventData({ ...eventData, title: e.currentTarget.value })
							}
							placeholder="Title"
						/>
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					<div className="flex gap-2 items-center">
						<span>Start:</span>
						<DateTimePicker />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EventCard;
