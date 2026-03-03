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
import type { Note } from "@/lib/commonTypes";
import { cn, getTimeOfDayGreeting } from "@/lib/utils";
import { dashboardPreviewFetchHandler } from "@/services/services";
import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { LuCalendarPlus, LuNotebookPen } from "react-icons/lu";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
	const activeNotes = useStore((state) => state.data.notes.active.data);
	const user = useStore((state) => state.user);
	const loading = useStore((state) => state.dataLoading);
	const navigate = useNavigate();
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const didRun = useRef(false);

	const [recentNotesSectionOpen, setRecentNotesSectionOpen] = useState(true);
	const [upcomingEventsSectionOpen, setUpcomingEventsSectionOpen] =
		useState(true);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		dashboardPreviewFetchHandler("notes");
	}, []);

	return (
		<div
			className={cn(
				"grow h-full w-full flex flex-col overflow-scroll",
				isDesktop ? "p-4" : "p-1",
			)}>
			<div className="flex flex-col min-h-1/5 w-full items-start justify-center gap-2">
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
							text-black dark:text-white hover:text-white cursor-help
							transition-colors">
						<LuCalendarPlus className="size-4 shrink-0" />
						<span className="text-[12px] leading-[1.5rem] truncate">
							Events are coming soon!
						</span>
					</CustomizableButton>
				</div>
			</div>
			<div className="flex flex-wrap gap-2">
				<Collapsible
					open={recentNotesSectionOpen}
					onOpenChange={setRecentNotesSectionOpen}
					className="w-full lg:max-w-1/2 xl:max-w-2/5 2xl:max-w-1/3">
					<CollapsibleTrigger className="rounded-xl w-full p-2 flex justify-between items-center">
						<span className="font-medium">Recent Notes</span>
						{recentNotesSectionOpen ? <FaAngleUp /> : <FaAngleDown />}
					</CollapsibleTrigger>
					{loading ? (
						<div className="flex gap-1">
							<NotesLoadingSkeletonItem />
							<NotesLoadingSkeletonItem />
						</div>
					) : (
						<CollapsibleContent className="flex gap-2 ">
							{activeNotes.length > 0 ? (
								activeNotes
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
				<Collapsible
					open={upcomingEventsSectionOpen}
					onOpenChange={setUpcomingEventsSectionOpen}
					className="w-full lg:w-fit lg:grow">
					<CollapsibleTrigger className="rounded-xl w-full p-2 flex justify-between items-center">
						<span className="font-medium">Upcoming Events</span>
						{upcomingEventsSectionOpen ? <FaAngleUp /> : <FaAngleDown />}
					</CollapsibleTrigger>
					{loading ? (
						<div className="flex gap-1">
							<EventsLoadingSkeletonItem />
							<EventsLoadingSkeletonItem />
						</div>
					) : (
						<CollapsibleContent className="flex gap-2 ">
							<div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 p-2">
								<LuCalendarPlus className="size-14" />
								<div className="flex flex-col items-start text-[12px]">
									<span>No events,</span>
									<span>Events are coming soon!</span>
								</div>
							</div>
						</CollapsibleContent>
					)}
				</Collapsible>
			</div>
		</div>
	);
};

export default HomePage;
