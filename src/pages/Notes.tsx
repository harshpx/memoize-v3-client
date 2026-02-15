import CustomizableButton from "@/components/custom/CustomizableButton";
import NoteListItem from "@/components/custom/NoteListItem";
import { useStore } from "@/context/store";
import { LuNotebookPen as NoteIcon } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const Notes = () => {
	const navigate = useNavigate();
	const { activeNotes } = useStore();
	return (
		<div className="p-4 grow h-full w-full flex items-center justify-center overflow-scroll">
			{!!activeNotes && activeNotes.length > 0 ? (
				<ResponsiveMasonry
					className="w-full h-full"
					columnsCountBreakPoints={{ 640: 2, 1024: 3, 1280: 4, 1536: 5 }}>
					<Masonry className="w-full">
						<NoteListItem />
						{activeNotes.map((note) => (
							<NoteListItem key={note.id} note={note} />
						))}
					</Masonry>
				</ResponsiveMasonry>
			) : (
				<div className="flex flex-col items-center gap-2 text-black/70 dark:text-white/70 border border-white">
					<NoteIcon className="size-20 " />
					<span>No notes are there</span>
					<CustomizableButton
						onClick={() => navigate("/dashboard/notes/new")}
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
