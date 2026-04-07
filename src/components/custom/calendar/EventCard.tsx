import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Event, EventModifyRequest } from "@/lib/commonTypes";
import { cn, deepCompareObjects, toSentenceCase, WEEKS } from "@/lib/utils";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaBirthdayCake, FaTasks } from "react-icons/fa";
import { LuCalendar, LuCalendarPlus, LuClock } from "react-icons/lu";
import { MdEvent, MdMeetingRoom } from "react-icons/md";
import { TbDeviceUnknownFilled } from "react-icons/tb";
import DateTimePicker from "./DateTimePicker";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Checkbox } from "@/components/ui/checkbox";
import CustomizableButton from "../CustomizableButton";
import {
	eventCreateHandler,
	eventDeleteHandler,
	eventUpdateHandler,
} from "@/services/services";

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

	const isMobile = useMediaQuery("(max-width: 420px)");
	const [dialogOpen, setDialogOpen] = useState(false);

	const [eventData, setEventData] = useState<EventModifyRequest>(initialData);

	const [saveEnabled, setSaveEnabled] = useState(false);

	useEffect(() => {
		if (dialogOpen) {
			setEventData(initialData);
		}
	}, [dialogOpen]);

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
		setDialogOpen(false);
		if (event) {
			await eventUpdateHandler(event.id, eventData);
		} else {
			await eventCreateHandler(eventData);
		}
	};

	const handleDelete = async () => {
		if (!event) return;
		setDialogOpen(false);
		await eventDeleteHandler(event.id);
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
			</DialogTrigger>
			<DialogContent
				className={cn("w-full sm:max-w-lg", isMobile && "top-auto bottom-4")}>
				<DialogHeader>
					<DialogTitle>
						{/* Title */}
						<Input
							id="title"
							value={eventData?.title}
							autoFocus
							onSelect={(e) => {
								const target = e.currentTarget;
								// We only want to do this once when it first gets focus
								if (
									target.selectionStart === 0 &&
									target.selectionEnd === target.value.length
								) {
									target.setSelectionRange(
										target.value.length,
										target.value.length,
									);
								}
							}}
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
							onSelect={(e) => {
								const target = e.currentTarget;
								if (
									target.selectionStart === 0 &&
									target.selectionEnd === target.value.length
								) {
									target.setSelectionRange(
										target.value.length,
										target.value.length,
									);
								}
							}}
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
					</DialogTitle>
					<DialogDescription className="hidden">
						Add or edit event
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-2">
					{/* Start Date */}
					<div className="flex gap-2 items-center">
						<span className="w-14 text-sm">Start:</span>
						<DateTimePicker
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
							date={dayjs.utc(eventData.end)}
							setDate={(date) =>
								setEventData((prev) => ({ ...prev, end: date.toISOString() }))
							}
						/>
					</div>
					{/* Full day event */}
					<div className="flex items-center gap-2 text-sm h-9">
						<Checkbox
							checked={
								dayjs
									.utc(eventData.start)
									.isSame(
										dayjs.utc(eventData.start).startOf("day"),
										"minute",
									) &&
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
					<div className="mt-10 w-full flex gap-2 items-center justify-end text-xs">
						<CustomizableButton
							onClick={handleSave}
							className={cn(
								saveEnabled
									? "cursor-pointer bg-accent-light dark:bg-accent-dark"
									: "cursor-not-allowed bg-muted",
							)}>
							Save
						</CustomizableButton>
						<CustomizableButton
							onClick={() => setDialogOpen(false)}
							className="bg-muted">
							Cancel
						</CustomizableButton>
						{event && (
							<CustomizableButton
								onClick={handleDelete}
								className="bg-destructive">
								Delete
							</CustomizableButton>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EventCard;
