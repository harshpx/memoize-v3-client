import NoteListItem from "@/components/custom/NoteListItem";
import { useStore } from "@/context/store";
import { notesFetchHandler } from "@/services/services";
import { useEffect, useRef } from "react";
import { LuTrash } from "react-icons/lu";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const Trash = () => {
	const notes = useStore((state) => state.notes);

	const didRun = useRef(false);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;

		notesFetchHandler("deleted");
	}, []);

	return (
		<div className="p-4 grow h-full w-full flex items-center justify-center overflow-scroll">
			{notes.deleted.length > 0 ? (
				<ResponsiveMasonry
					className="w-full h-full"
					columnsCountBreakPoints={{ 640: 2, 1024: 3, 1280: 4, 1536: 5 }}>
					<Masonry className="w-full">
						{notes.deleted.map((note) => (
							<NoteListItem key={note.id} note={note} />
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
