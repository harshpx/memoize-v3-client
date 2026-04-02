import { NotesLoadingSkeleton } from "@/components/custom/LoadingSkeletons";
import NoteListItem from "@/components/custom/NoteListItem";
import { useStore } from "@/context/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import type { Note } from "@/lib/commonTypes";
import { cn } from "@/lib/utils";
import { notesFetchHandler } from "@/services/services";
import { useEffect, useRef } from "react";
import { LuTrash } from "react-icons/lu";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const Trash = () => {
	const deletedNotes = useStore((state) => state.notes.deleted.data);
	const notesLoading = useStore((state) => state.notesLoading);
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const didRun = useRef(false);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		notesFetchHandler("deleted");
	}, []);

	if (notesLoading) {
		return <NotesLoadingSkeleton />;
	}

	return (
		<div
			className={cn(
				"grow h-full w-full flex items-center justify-center overflow-scroll",
				isDesktop ? "p-4" : "p-1",
			)}>
			{deletedNotes.length > 0 ? (
				<ResponsiveMasonry
					className="w-full h-full"
					columnsCountBreakPoints={{ 640: 2, 1024: 3, 1280: 4, 1536: 5 }}>
					<Masonry className="w-full">
						{deletedNotes.map((note) => (
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
					<LuTrash className="size-20 " />
					<span>Trash empty</span>
				</div>
			)}
		</div>
	);
};

export default Trash;
