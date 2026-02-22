import CustomizableButton from "@/components/custom/CustomizableButton";
import { NotesLoadingSkeleton } from "@/components/custom/LoadingSkeletons";
import NoteListItem from "@/components/custom/NoteListItem";
import { useStore } from "@/context/store";
import type { Note } from "@/lib/commonTypes";
import { dashboardPreviewFetchHandler } from "@/services/services";
import { useEffect, useRef } from "react";
import { LuNotebookPen as NoteIcon } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const activeNotes = useStore((state) => state.data.notes.active.data);
	const loading = useStore((state) => state.dataLoading);
	const navigate = useNavigate();

	const didRun = useRef(false);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		dashboardPreviewFetchHandler("notes");
	}, []);

	if (loading) {
		return <NotesLoadingSkeleton />;
	}

	return (
		<div className="p-4 grow h-full w-full flex flex-col overflow-scroll">
			{activeNotes.length === 0 && (
				<div className="flex flex-col h-full w-full items-center justify-center gap-2 text-black/70 dark:text-white/70">
					<NoteIcon className="size-20 " />
					<span>Welcome to memoize</span>
					<CustomizableButton
						onClick={() =>
							navigate("/dashboard/notes/editor", { state: { note: null } })
						}
						className="
							text-sm shadow-2xl bg-accent-light/40 dark:bg-accent-light/30
							hover:border-accent-light dark:hover:border-accent-dark 
							hover:bg-accent-light dark:hover:bg-accent-dark text-black dark:text-white hover:text-white
							transition-colors">
						<span>Start a Note!</span>
					</CustomizableButton>
				</div>
			)}
			{activeNotes.length > 0 && (
				<div className="flex flex-col gap-2">
					<div>Recent Notes</div>
					<div className="w-full md:w-1/2 xl:w-1/3 flex gap-4">
						{activeNotes.slice(0, 2).map((note) => (
							<NoteListItem
								key={note.id}
								note={note as Note}
								className="h-60 w-1/2"
								previewClassName="text-sm"
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
