import EventCard from "@/components/custom/calendar/EventCard";
import CustomizableButton from "@/components/custom/CustomizableButton";
import {
	EventsLoadingSkeletonItem,
	NotesLoadingSkeletonItem,
} from "@/components/custom/LoadingSkeletons";
import NoteListItem from "@/components/custom/NoteListItem";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useStore } from "@/context/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import type { Event, Note } from "@/lib/commonTypes";
import { cn, getTimeOfDayGreeting, populateEventsInRange } from "@/lib/utils";
import { eventsFetchHandler, notesFetchHandler } from "@/services/services";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { LuCalendarPlus, LuNotebookPen } from "react-icons/lu";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
	const user = useStore((state) => state.user);

	const activeNotes = useStore((state) => state.notes.active);
	const notesLoading = useStore((state) => state.notesLoading);

	const events = useStore((state) => state.events);
	const eventsLoading = useStore((state) => state.eventsLoading);
	const [upcomingEvents, setUpcomingEvents] = useState<Record<string, Event[]>>(
		{},
	);

	const navigate = useNavigate();
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const ismobile = useMediaQuery("(max-width: 420px)");

	const didRun = useRef(false);

	const [recentNotesSectionOpen, setRecentNotesSectionOpen] = useState(true);
	const [upcomingEventsSectionOpen, setUpcomingEventsSectionOpen] =
		useState(true);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		if (activeNotes.pageNumber === -1) {
			notesFetchHandler("active");
		}
		if (events.length === 0) {
			eventsFetchHandler();
		}
	}, []);

	useEffect(() => {
		const start = dayjs().utc().startOf("day");
		const end = start.add(7, "day").endOf("day");
		const eventMap = populateEventsInRange(events, { start, end });
		setUpcomingEvents(eventMap);
	}, [events]);

	return (
		<div
			className={cn(
				"grow h-full w-full flex flex-col overflow-scroll gap-1",
				isDesktop ? "p-4" : "p-1",
			)}>
			<div className="flex flex-col w-full items-start justify-center gap-2">
				<div className="flex flex-col gap-0 items-start">
					<span className="text-2xl">{getTimeOfDayGreeting()}</span>
					<span className="text-3xl">{`${user?.name?.split(" ")?.[0] || ""}!`}</span>
				</div>
				<div className="flex gap-2 items-center w-full min-w-0">
					<CustomizableButton
						onClick={() =>
							navigate("/home/notes/editor", { state: { note: null } })
						}
						className="min-w-0
							text-sm shadow-2xl bg-accent-light/40 dark:bg-accent-light/30 gap-1 items-center
							hover:border-accent-light dark:hover:border-accent-dark 
							hover:bg-accent-light dark:hover:bg-accent-dark text-black dark:text-white hover:text-white
							transition-colors">
						<RiStickyNoteAddLine className="size-4 shrink-0" />
						<span className="text-[12px] leading-[1.5rem] truncate">
							Add a Note!
						</span>
					</CustomizableButton>
					<CustomizableButton
						onClick={() => navigate("/home/events")}
						className="min-w-0
							text-sm shadow-2xl bg-accent-light/40 dark:bg-accent-light/30 gap-1 items-center
							hover:border-accent-light dark:hover:border-accent-dark 
							hover:bg-accent-light dark:hover:bg-accent-dark text-black dark:text-white hover:text-white
							transition-colors">
						<LuCalendarPlus className="size-4 shrink-0" />
						<span className="text-[12px] leading-[1.5rem] truncate">
							Add an Event!
						</span>
					</CustomizableButton>
				</div>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
				{/* recent notes */}
				<Collapsible
					open={recentNotesSectionOpen}
					onOpenChange={setRecentNotesSectionOpen}
					className="w-full">
					<CollapsibleTrigger className="rounded-xl w-full p-2 flex justify-between items-center">
						<span className="font-medium">Recent Notes</span>
						{recentNotesSectionOpen ? <FaAngleUp /> : <FaAngleDown />}
					</CollapsibleTrigger>
					{notesLoading ? (
						<div className="flex gap-1">
							<NotesLoadingSkeletonItem />
							<NotesLoadingSkeletonItem />
						</div>
					) : (
						<CollapsibleContent className="flex gap-2 ">
							{activeNotes.data.length > 0 ? (
								activeNotes.data
									.slice(0, 2)
									.map((note) => (
										<NoteListItem
											key={note.id}
											note={note as Note}
											className="h-60 w-1/2"
											previewClassName="text-sm"
										/>
									))
							) : (
								<div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 p-2">
									<LuNotebookPen className="size-14" />
									<div className="flex flex-col items-start text-[12px]">
										<span>No notes,</span>
										<span>add one</span>
									</div>
								</div>
							)}
						</CollapsibleContent>
					)}
				</Collapsible>
				{/* upcoming events */}
				<Collapsible
					open={upcomingEventsSectionOpen}
					onOpenChange={setUpcomingEventsSectionOpen}
					className="w-full">
					<CollapsibleTrigger className="rounded-xl w-full p-2 flex justify-between items-center">
						<span className="font-medium">Upcoming Events</span>
						{upcomingEventsSectionOpen ? <FaAngleUp /> : <FaAngleDown />}
					</CollapsibleTrigger>
					{eventsLoading ? (
						<div className="flex gap-1">
							<EventsLoadingSkeletonItem />
							<EventsLoadingSkeletonItem />
						</div>
					) : (
						<CollapsibleContent
							className={cn(
								"gap-2 grid",
								ismobile ? "grid-cols-1" : "grid-cols-2",
							)}>
							{Object.values(upcomingEvents).reduce(
								(acc, eventList) => acc + eventList.length,
								0,
							) === 0 ? (
								<div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 p-2">
									<LuCalendarPlus className="size-14" />
									<div className="flex flex-col items-start text-[12px]">
										<span>No upcoming events for next 7 days!</span>
									</div>
								</div>
							) : (
								Object.keys(upcomingEvents)
									.sort((a, b) => dayjs.utc(a).diff(dayjs.utc(b)))
									.filter(
										(dayString) =>
											Array.isArray(upcomingEvents[dayString]) &&
											upcomingEvents[dayString].length > 0,
									)
									.slice(0, 4)
									.map((dayString) => {
										const dayEvents = upcomingEvents[dayString];
										return (
											<div
												key={dayString}
												className="flex flex-col gap-1 p-2 rounded-xl bg-accent-light/50 dark:bg-accent-dark/50 w-full">
												<div className="text-sm font-medium">
													{dayjs.utc(dayString).format("ddd, DD MMM")}
												</div>
												{dayEvents.map((event, idx) => (
													<EventCard
														key={event.id + idx}
														event={event}
														className="grow"
													/>
												))}
											</div>
										);
									})
							)}
						</CollapsibleContent>
					)}
				</Collapsible>
			</div>
		</div>
	);
};

export default HomePage;
