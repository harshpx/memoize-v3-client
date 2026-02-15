import NoteListItem from "@/components/custom/NoteListItem";
import { useStore } from "@/context/store";
import { fetchDeletedNotes } from "@/services/apis";
import { retryWithRefresh } from "@/services/services";
import { useEffect } from "react";
import { LuTrash } from "react-icons/lu";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const Trash = () => {
	const { deletedNotes, setDeletedNotes, setLoading } = useStore();

	const fetchDeletedNotesHandler = async () => {
		if (deletedNotes) return;
		try {
			setLoading(true);
			const deletedNotesList = await retryWithRefresh(fetchDeletedNotes, []);
			setDeletedNotes(deletedNotesList);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchDeletedNotesHandler();
	}, []);

	return (
		<div className="p-4 grow h-full w-full flex items-center justify-center overflow-scroll">
			{!!deletedNotes && deletedNotes.length > 0 ? (
				<ResponsiveMasonry
					className="w-full h-full"
					columnsCountBreakPoints={{ 640: 2, 1024: 3, 1280: 4, 1536: 5 }}>
					<Masonry className="w-full">
						{deletedNotes.map((note) => (
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
