import CustomizableButton from "@/components/custom/CustomizableButton";
import NoteListItem from "@/components/custom/NoteListItem";
import { useStore } from "@/context/store";
import { LuNotebookPen as NoteIcon } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { dataFetchHandler } from "@/services/services";
import { useEffect, useRef } from "react";
import type { Note } from "@/lib/commonTypes";
import { NotesLoadingSkeleton } from "@/components/custom/LoadingSkeletons";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const Notes = () => {
	const navigate = useNavigate();
	const activeNotes = useStore((state) => state.data.notes.active.data);
	const loading = useStore((state) => state.dataLoading);
	const isDesktop = useMediaQuery("(min-width: 1280px)");

	const didRun = useRef(false);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		dataFetchHandler("notes", "active");
	}, []);

	if (loading) {
		return <NotesLoadingSkeleton />;
	}

	return (
		<div
			className={cn(
				"p-1 grow h-full w-full flex items-center justify-center overflow-scroll",
				isDesktop ? "p-4" : "p-1",
			)}>
			{activeNotes.length > 0 ? (
				<ResponsiveMasonry
					className="w-full h-full"
					columnsCountBreakPoints={{ 640: 2, 1024: 3, 1280: 4, 1536: 5 }}>
					<Masonry className="w-full">
						<NoteListItem className="w-full" />
						{activeNotes.map((note) => (
							<NoteListItem
								key={note.id}
								note={note as Note}
								className="w-full"
							/>
						))}
					</Masonry>
				</ResponsiveMasonry>
			) : (
				<div className="flex flex-col items-center gap-2 text-black/70 dark:text-white/70">
					<NoteIcon className="size-20 " />
					<span>No notes are there</span>
					<CustomizableButton
						onClick={() =>
							navigate("/home/notes/editor", { state: { note: null } })
						}
						className="
					text-sm shadow-2xl bg-accent-light/40 dark:bg-accent-light/30
          hover:border-accent-light dark:hover:border-accent-dark 
          hover:bg-accent-light dark:hover:bg-accent-dark text-black dark:text-white hover:text-white
          transition-colors
        ">
						<span>Start adding!</span>
					</CustomizableButton>
				</div>
			)}
		</div>
	);
};

export default Notes;
