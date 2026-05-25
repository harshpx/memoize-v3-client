import EventCard from "@/components/custom/calendar/EventCard";
import CustomizableButton from "@/components/custom/CustomizableButton";
import {
	ChatsLoadingSkeletonItem,
	EventsLoadingSkeletonItem,
	NotesLoadingSkeletonItem,
} from "@/components/custom/LoadingSkeletons";
import NoteListItem from "@/components/custom/NoteListItem";
import ThemeSwitch from "@/components/custom/ThemeSwitch";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useStore } from "@/context/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import type { Event, Note } from "@/lib/commonTypes";
import { cn, getTimeOfDayGreeting, populateEventsInRange } from "@/lib/utils";
import {
	conversationCreateHandler,
	conversationsFetchHandler,
	eventsFetchHandler,
	notesFetchHandler,
} from "@/services/services";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import {
	LuBotMessageSquare,
	LuCalendarPlus,
	LuNotebookPen,
	LuPlus,
} from "react-icons/lu";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const HomePage = () => {
	const user = useStore((state) => state.user);

	const activeNotes = useStore((state) => state.notes.active);
	const notesLoading = useStore((state) => state.notesLoading);

	const events = useStore((state) => state.events);
	const eventsLoading = useStore((state) => state.eventsLoading);
	const [upcomingEvents, setUpcomingEvents] = useState<Record<string, Event[]>>(
		{},
	);

	const conversations = useStore((state) => state.conversations);
	const conversationsLoading = useStore((state) => state.conversationsLoading);

	const navigate = useNavigate();
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const ismobile = useMediaQuery("(max-width: 420px)");

	const [recentConvSectionOpen, setRecentConvSectionOpen] = useState(true);
	const [recentNotesSectionOpen, setRecentNotesSectionOpen] = useState(true);
	const [upcomingEventsSectionOpen, setUpcomingEventsSectionOpen] =
		useState(true);

	const didRun = useRef(false);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		if (activeNotes.pageNumber === -1) {
			notesFetchHandler("active");
		}
		if (events.length === 0) {
			eventsFetchHandler();
		}
		if (conversations.length === 0) {
			conversationsFetchHandler();
		}
	}, []);

	useEffect(() => {
		const start = dayjs().utc().startOf("day");
		const end = start.add(7, "day").endOf("day");
		const eventMap = populateEventsInRange(events, { start, end });
		setUpcomingEvents(eventMap);
	}, [events]);

	const gotoNewChat = async () => {
		await conversationCreateHandler();
		navigate("/home/ai");
	};

	const gotoSelectedChat = (convId: string) => {
		useStore.setState({ selectedConversation: convId });
		navigate("/home/ai");
	};

	return (
		<div
			className={cn(
				"grow h-full w-full flex flex-col overflow-scroll gap-1",
				isDesktop ? "p-4" : "p-1",
			)}>
			<div className="absolute right-2 top-2 z-50">
				<ThemeSwitch />
			</div>
			<div className="flex flex-col w-full items-start justify-center gap-2">
				<div className="flex flex-col gap-0 items-start">
					<span className="text-2xl">{getTimeOfDayGreeting()}</span>
					<span className="text-3xl">{`${user?.name?.split(" ")?.[0] || ""}`}</span>
				</div>
				<div className="flex gap-1 items-center w-full min-w-0">
					<CustomizableButton
						onClick={gotoNewChat}
						className="min-w-0
							text-sm shadow-2xl gap-1 items-center
							bg-accent-light/60 hover:bg-accent-light/80 dark:bg-accent-dark/60 dark:hover:bg-accent-dark/80
							text-black dark:text-white
							transition-colors">
						<LuBotMessageSquare className="size-4 shrink-0" />
						<span className="text-[12px] leading-[1.5rem] truncate">
							Ask MemoAI
						</span>
					</CustomizableButton>
					<CustomizableButton
						onClick={() =>
							navigate("/home/notes/editor", { state: { note: null } })
						}
						className="min-w-0
							text-sm shadow-2xl gap-1 items-center
							bg-accent-light/60 hover:bg-accent-light/80 dark:bg-accent-dark/60 dark:hover:bg-accent-dark/80
							text-black dark:text-white
							transition-colors">
						<RiStickyNoteAddLine className="size-4 shrink-0" />
						<span className="text-[12px] leading-[1.5rem] truncate">
							Add Note
						</span>
					</CustomizableButton>
					<CustomizableButton
						onClick={() =>
							navigate("/home/events/editor", { state: { event: undefined } })
						}
						className="min-w-0
							text-sm shadow-2xl gap-1 items-center
							bg-accent-light/60 hover:bg-accent-light/80 dark:bg-accent-dark/60 dark:hover:bg-accent-dark/80
							text-black dark:text-white
							transition-colors">
						<LuCalendarPlus className="size-4 shrink-0" />
						<span className="text-[12px] leading-[1.5rem] truncate">
							Add Event
						</span>
					</CustomizableButton>
				</div>
			</div>
			{/* recents */}
			<ResponsiveMasonry
				className="h-full w-full overflow-visible"
				columnsCountBreakPoints={{ 640: 1, 1024: 2, 1536: 2 }}>
				<Masonry className="w-full h-full overflow-visible">
					{/* recent chats */}
					<div className="w-full break-inside-avoid overflow-visible">
						<Collapsible
							open={recentConvSectionOpen}
							onOpenChange={setRecentConvSectionOpen}
							className="w-full">
							<CollapsibleTrigger
								className={cn(
									"rounded-xl w-full p-2 flex justify-between items-center cursor-pointer",
								)}>
								<span className="font-medium">Recent MemoAI Chats</span>
								{recentConvSectionOpen ? <FaAngleUp /> : <FaAngleDown />}
							</CollapsibleTrigger>
							{conversationsLoading ? (
								<div className="flex gap-1">
									<ChatsLoadingSkeletonItem />
								</div>
							) : (
								<CollapsibleContent className="grid grid-cols-2 gap-2 h-full w-full">
									{conversations.filter((c) => !c.isNew).length > 0 ? (
										<>
											<div
												onClick={gotoNewChat}
												className={cn(
													"text-sm px-2 py-2 rounded-xl backdrop-blur-sm h-full flex items-center",
													"border border-neutral-300 dark:border-neutral-700/50",
													"bg-neutral-500/10 dark:bg-neutral-400/10",
													"cursor-pointer hover:bg-neutral-500/20 dark:hover:bg-neutral-400/20",
												)}>
												<span className="flex gap-1 items-center">
													<LuPlus />
													New Chat
												</span>
											</div>
											{conversations
												.filter((c) => !c.isNew)
												.slice(0, 6)
												.map((conv) => (
													<div
														key={conv.id}
														onClick={() => gotoSelectedChat(conv.id)}
														className={cn(
															"text-sm px-2 py-2 rounded-xl backdrop-blur-sm h-full flex items-center",
															"border border-neutral-300 dark:border-neutral-700/50",
															"bg-neutral-500/10 dark:bg-neutral-400/10",
															"cursor-pointer hover:bg-neutral-500/20 dark:hover:bg-neutral-400/20",
														)}>
														{conv.name}
													</div>
												))}
										</>
									) : (
										<div className="text-neutral-600 dark:text-neutral-400 p-2 text-[12px]">
											<CustomizableButton
												onClick={gotoNewChat}
												className={cn(
													"p-3 rounded-xl backdrop-blur-sm",
													"flex items-center gap-2",
													"bg-neutral-500/10 dark:bg-neutral-400/10",
													"border border-neutral-300 dark:border-neutral-700/50",
													"hover:bg-neutral-500/20 dark:hover:bg-neutral-400/20",
												)}>
												<LuBotMessageSquare className="size-10" />
												<div className="flex flex-col items-start truncate">
													<span>No conversations,</span>
													<span>Start a chat!</span>
												</div>
											</CustomizableButton>
										</div>
									)}
								</CollapsibleContent>
							)}
						</Collapsible>
					</div>
					{/* recent notes */}
					<div className="w-full break-inside-avoid overflow-visible">
						<Collapsible
							open={recentNotesSectionOpen}
							onOpenChange={setRecentNotesSectionOpen}
							className="w-full">
							<CollapsibleTrigger
								className={cn(
									"rounded-xl w-full p-2 flex justify-between items-center cursor-pointer",
								)}>
								<span className="font-medium">Recent Notes</span>
								{recentNotesSectionOpen ? <FaAngleUp /> : <FaAngleDown />}
							</CollapsibleTrigger>
							{notesLoading ? (
								<div className="flex gap-1">
									<NotesLoadingSkeletonItem />
									<NotesLoadingSkeletonItem />
								</div>
							) : (
								<CollapsibleContent className="grid grid-cols-2 gap-2">
									{activeNotes.data.length > 0 ? (
										activeNotes.data
											.slice(0, 4)
											.map((note) => (
												<NoteListItem
													key={note.id}
													note={note as Note}
													className="h-60 w-full"
													previewClassName="text-sm"
												/>
											))
									) : (
										<div className="text-neutral-600 dark:text-neutral-400 p-2 text-[12px]">
											<CustomizableButton
												onClick={() =>
													navigate("/home/notes/editor", {
														state: { note: null },
													})
												}
												className={cn(
													"p-3 rounded-xl backdrop-blur-sm",
													"flex items-center gap-2",
													"bg-neutral-500/10 dark:bg-neutral-400/10",
													"border border-neutral-300 dark:border-neutral-700/50",
													"hover:bg-neutral-500/20 dark:hover:bg-neutral-400/20",
												)}>
												<LuNotebookPen className="size-10" />
												<div className="flex flex-col items-start truncate">
													<span>No notes found,</span>
													<span>Add one</span>
												</div>
											</CustomizableButton>
										</div>
									)}
								</CollapsibleContent>
							)}
						</Collapsible>
					</div>
					{/* upcoming events */}
					<div className="w-full break-inside-avoid overflow-visible">
						<Collapsible
							open={upcomingEventsSectionOpen}
							onOpenChange={setUpcomingEventsSectionOpen}
							className="w-full">
							<CollapsibleTrigger className="rounded-xl w-full p-2 flex justify-between items-center cursor-pointer">
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
										<div className="text-neutral-600 dark:text-neutral-400 p-2 text-[12px]">
											<CustomizableButton
												onClick={() =>
													navigate("/home/events/editor", {
														state: { event: undefined },
													})
												}
												className={cn(
													"p-3 rounded-xl backdrop-blur-sm",
													"flex items-center gap-2",
													"bg-neutral-500/10 dark:bg-neutral-400/10",
													"border border-neutral-300 dark:border-neutral-700/50",
													"hover:bg-neutral-500/20 dark:hover:bg-neutral-400/20",
												)}>
												<LuCalendarPlus className="size-10" />
												<div className="flex flex-col items-start truncate">
													<span>No upcoming events for next 7 days!</span>
													<span>Add one</span>
												</div>
											</CustomizableButton>
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
														className={cn(
															"flex flex-col gap-2 p-2 rounded-xl backdrop-blur-sm w-full",
															"bg-neutral-500/10 dark:bg-neutral-400/10 border border-neutral-300 dark:border-neutral-700/50",
															"hover:bg-neutral-500/20 dark:hover:bg-neutral-400/20",
														)}>
														<div className="text-sm font-medium">
															{dayjs.utc(dayString).format("ddd, DD MMM")}
														</div>
														{dayEvents.map((event, idx) => (
															<EventCard
																key={event.id + idx}
																event={event}
																className="grow border border-neutral-300 dark:border-neutral-700/50"
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
				</Masonry>
			</ResponsiveMasonry>
		</div>
	);
};

export default HomePage;
