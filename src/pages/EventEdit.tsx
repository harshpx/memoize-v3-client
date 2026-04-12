import DateTimePicker from "@/components/custom/calendar/DateTimePicker";
import CustomizableButton from "@/components/custom/CustomizableButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import type { Event, EventModifyRequest } from "@/lib/commonTypes";
import { cn, deepCompareObjects, toSentenceCase } from "@/lib/utils";
import {
	eventCreateHandler,
	eventDeleteHandler,
	eventUpdateHandler,
} from "@/services/services";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FaBirthdayCake, FaTasks } from "react-icons/fa";
import { MdEvent, MdMeetingRoom } from "react-icons/md";
import { TbDeviceUnknownFilled } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";

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

interface EventNavData {
	event?: Event;
}

const EventEdit = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const pageRef = useRef<HTMLDivElement>(null);
	const startDatePickerRef = useRef<HTMLDivElement>(null);
	const endDatePickerRef = useRef<HTMLDivElement>(null);

	useOutsideClick([pageRef, startDatePickerRef, endDatePickerRef], () => {
		navigate(-1);
	});

	const navData = (location.state as EventNavData) ?? {};
	const event = navData.event;

	const initialData: EventModifyRequest = event
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
				start: dayjs().utc().startOf("day").startOf("minute").toISOString(),
				end: dayjs().utc().endOf("day").startOf("minute").toISOString(),
				eventType: "EVENT",
				eventRepeat: "NONE",
				description: "",
				location: "",
			};

	const [eventData, setEventData] = useState<EventModifyRequest>(initialData);

	const [saveEnabled, setSaveEnabled] = useState(false);

	const isValidEventModifyRequest = (data: EventModifyRequest): boolean => {
		if (!data.title.trim()) return false;
		if (dayjs.utc(data.end).isBefore(dayjs.utc(data.start))) return false;
		return true;
	};

	useEffect(() => {
		if (
			!deepCompareObjects(eventData, initialData) &&
			isValidEventModifyRequest(eventData)
		) {
			setSaveEnabled(true);
		} else {
			setSaveEnabled(false);
		}
	}, [eventData]);

	const handleSave = async () => {
		if (!saveEnabled) return;
		navigate(-1);
		if (event) {
			await eventUpdateHandler(event.id, eventData);
		} else {
			await eventCreateHandler(eventData);
		}
	};

	const handleDelete = async () => {
		if (!event) return;
		navigate(-1);
		await eventDeleteHandler(event.id);
	};

	return (
		<div
			ref={pageRef}
			className="p-4 flex flex-col gap-2 bg-white dark:bg-black rounded-xl shadow-xl border-2 h-full w-full sm:h-auto sm:w-auto">
			<div className="flex flex-col gap-0">
				{/* Title */}
				<Input
					id="title"
					value={eventData?.title}
					onInput={(e) =>
						setEventData({ ...eventData, title: e.currentTarget.value })
					}
					className={cn(
						"h-10 leading-12 !text-xl font-medium !bg-transparent",
						"p-0 border-none outline-none ring-0",
						"focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none",
						"focus-within:outline-none focus-within:ring-0 shadow-none",
					)}
					placeholder="Title"
				/>
				{/* Description */}
				<Input
					id="description"
					value={eventData?.description}
					onInput={(e) =>
						setEventData({
							...eventData,
							description: e.currentTarget.value,
						})
					}
					className={cn(
						"!text-muted-foreground italic !text-sm font-medium !bg-transparent",
						"p-0 border-none outline-none ring-0",
						"focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none",
						"focus-within:outline-none focus-within:ring-0 shadow-none",
					)}
					placeholder="Description (optional)"
				/>
			</div>
			{/* Start Date */}
			<div className="flex gap-2 items-center">
				<span className="w-14 text-sm">Start:</span>
				<DateTimePicker
					ref={startDatePickerRef}
					date={dayjs.utc(eventData.start)}
					setDate={(date) =>
						setEventData((prev) => ({ ...prev, start: date.toISOString() }))
					}
				/>
			</div>
			{/* End Date */}
			<div className="flex gap-2 items-center">
				<span className="w-14 text-sm">End:</span>
				<DateTimePicker
					ref={endDatePickerRef}
					date={dayjs.utc(eventData.end)}
					setDate={(date) =>
						setEventData((prev) => ({ ...prev, end: date.toISOString() }))
					}
				/>
			</div>
			{/* Full day event */}
			<div className="flex items-center gap-2 text-sm h-9">
				<Checkbox
					className="cursor-pointer"
					checked={
						dayjs
							.utc(eventData.start)
							.isSame(dayjs.utc(eventData.start).startOf("day"), "minute") &&
						dayjs
							.utc(eventData.end)
							.isSame(dayjs.utc(eventData.start).endOf("day"), "minute")
					}
					onCheckedChange={(checked) => {
						if (checked) {
							setEventData((prev) => ({
								...prev,
								start: dayjs
									.utc(prev.start)
									.startOf("day")
									.startOf("minute")
									.toISOString(),
								end: dayjs
									.utc(prev.start)
									.endOf("day")
									.startOf("minute")
									.toISOString(),
							}));
						}
					}}
				/>
				<span>Full day event</span>
			</div>
			{/* Repeat */}
			<div className="flex flex-col gap-1 text-sm">
				<span>Repeat:</span>
				<div className="flex flex-wrap items-center gap-1">
					{["NONE", "WEEKLY", "MONTHLY", "YEARLY"].map((repeat) => (
						<CustomizableButton
							key={repeat}
							onClick={() =>
								setEventData((prev) => ({
									...prev,
									eventRepeat: repeat as Event["eventRepeat"],
								}))
							}
							className={cn(
								"text-xs border-2",
								eventData.eventRepeat === repeat &&
									"border-accent-light dark:border-accent-dark bg-accent-light dark:bg-accent-dark text-white",
							)}>
							{toSentenceCase(repeat)}
						</CustomizableButton>
					))}
				</div>
			</div>
			{/* Event type */}
			<div className="flex flex-col gap-1 text-sm">
				<span className="w-14">Type:</span>
				<div className="flex flex-wrap items-center gap-1">
					{["EVENT", "MEETING", "TASK", "BIRTHDAY", "OTHER"].map((type) => (
						<CustomizableButton
							key={type}
							onClick={() =>
								setEventData((prev) => ({
									...prev,
									eventType: type as Event["eventType"],
								}))
							}
							className={cn(
								"text-xs border-2",
								eventData.eventType === type &&
									"border-accent-light dark:border-accent-dark bg-accent-light dark:bg-accent-dark text-white",
							)}>
							{toSentenceCase(type)}
						</CustomizableButton>
					))}
				</div>
			</div>
			{/* buttons */}
			<div className="mt-10 w-full flex gap-2 items-center justify-end text-xs">
				{saveEnabled && (
					<CustomizableButton
						onClick={handleSave}
						className={cn(
							"cursor-pointer bg-accent-light dark:bg-accent-dark",
						)}>
						Save
					</CustomizableButton>
				)}
				<CustomizableButton onClick={() => navigate(-1)} className="bg-muted">
					Cancel
				</CustomizableButton>
				{event && (
					<CustomizableButton
						onClick={handleDelete}
						className="bg-destructive text-white">
						Delete
					</CustomizableButton>
				)}
			</div>
		</div>
	);
};

export default EventEdit;
