import type { Event } from "@/lib/commonTypes";
import { cn, WEEKS } from "@/lib/utils";
import dayjs from "dayjs";
import { FaBirthdayCake, FaTasks } from "react-icons/fa";
import { LuCalendar, LuClock } from "react-icons/lu";
import { MdEvent, MdMeetingRoom } from "react-icons/md";
import { TbDeviceUnknownFilled } from "react-icons/tb";

interface EventCardProps {
	event: Event;
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

const EventCard = ({ event }: EventCardProps) => {
	return (
		<div
			className={cn(
				"rounded-xl bg-accent-light dark:bg-accent-dark p-2",
				"flex flex-col gap-2 w-full grow text-white",
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
												(${dayjs.utc(event.end).startOf("day").diff(dayjs.utc(event.start).startOf("day"), "day") + 1} day)`}
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
				<span className="text-xs italic text-wrap">{event.description}</span>
			</div>
		</div>
	);
};

export default EventCard;
