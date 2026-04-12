import type { Event } from "@/lib/commonTypes";
import { cn, WEEKS } from "@/lib/utils";
import dayjs from "dayjs";
import { FaBirthdayCake, FaTasks } from "react-icons/fa";
import { LuCalendar, LuCalendarPlus, LuClock } from "react-icons/lu";
import { MdEvent, MdMeetingRoom } from "react-icons/md";
import { TbDeviceUnknownFilled } from "react-icons/tb";
import CustomizableButton from "../CustomizableButton";
import { useNavigate } from "react-router-dom";

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
	const navigate = useNavigate();

	return (
		<div
			onClick={() =>
				navigate("/home/events/editor", { state: { event: event } })
			}>
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
					{event.description && (
						<div className="flex flex-col text-xs">
							<span>Description:</span>
							<span className="italic text-wrap">{event.description}</span>
						</div>
					)}
				</div>
			) : (
				<CustomizableButton
					className={cn(
						"flex-nowrap bg-accent-light/80 dark:bg-accent-dark/70 gap-1 truncate",
					)}>
					<LuCalendarPlus size={16} className="shrink-0" />
					<span className="text-[12px] truncate text-nowrap">Add Event</span>
				</CustomizableButton>
			)}
		</div>
	);
};

export default EventCard;
