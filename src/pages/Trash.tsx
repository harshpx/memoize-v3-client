import NoteListItem from "@/components/custom/NoteListItem";
import { useStore } from "@/context/store";
import type { Note } from "@/lib/commonTypes";
import { dataFetchHandler } from "@/services/services";
import { useEffect, useRef } from "react";
import { LuTrash } from "react-icons/lu";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const Trash = () => {
	const deletedNotes = useStore((state) => state.data.notes.deleted.data);

	const didRun = useRef(false);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;

		dataFetchHandler("notes", "deleted");
	}, []);

	return (
		<div className="p-4 grow h-full w-full flex items-center justify-center overflow-scroll">
			{deletedNotes.length > 0 ? (
				<ResponsiveMasonry
					className="w-full h-full"
					columnsCountBreakPoints={{ 640: 2, 1024: 3, 1280: 4, 1536: 5 }}>
					<Masonry className="w-full">
						{deletedNotes.map((note) => (
							<NoteListItem key={note.id} note={note as Note} />
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
