import CustomizableButton from "@/components/custom/CustomizableButton";
import { LuNotebookPen as NoteIcon } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Notes = () => {
	const navigate = useNavigate();
	return (
		<div className="p-4 grow h-full w-full flex items-center justify-center">
			<div className="flex flex-col items-center gap-2 text-black/70 dark:text-white/70">
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
		</div>
	);
};

export default Notes;
