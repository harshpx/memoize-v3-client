import NoteListItem from "@/components/custom/NoteListItem";
import { useStore } from "@/context/store";
import { dashBoardPreviewFetchHandler } from "@/services/services";
import { useEffect, useRef } from "react";
import { LuNotebookPen as NoteIcon } from "react-icons/lu";

const Dashboard = () => {
	const notes = useStore((state) => state.notes);

	const didRun = useRef(false);

	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		dashBoardPreviewFetchHandler();
	}, []);

	return (
		<div className="p-4 grow h-full w-full flex flex-col overflow-scroll">
			{notes.active.length === 0 && (
				<div className="flex flex-col h-full w-full items-center justify-center gap-2 text-black/70 dark:text-white/70">
					<NoteIcon className="size-20 " />
					<span>Welcome to memoize</span>
				</div>
			)}
			{notes.active.length > 0 && (
				<div className="flex flex-col gap-2">
					<div>Recent Notes</div>
					<div className="w-full md:w-1/2 xl:w-1/3 flex gap-4">
						{notes.active.slice(0, 2).map((note) => (
							<NoteListItem
								key={note.id}
								note={note}
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
