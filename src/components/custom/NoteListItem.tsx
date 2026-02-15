import type { Note } from "@/lib/commonTypes";
import { formatDate } from "@/lib/utils";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss";
import "@/components/tiptap-ui-primitive/toolbar/toolbar.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

export interface NoteListItemProps {
	note?: Note;
}

const NoteListItem = ({ note }: NoteListItemProps) => {
	const navigate = useNavigate();
	return (
		<div
			onClick={() =>
				navigate(`/dashboard/notes/editor`, {
					state: { note: note },
				})
			}
			className={`rounded-lg border-2 
        ${!note ? "border-accent-light dark:border-accent-dark" : ""} 
        p-4 flex flex-col justify-between gap-2 break-inside-avoid min-h-52 max-h-96 mb-4 w-full
        hover:border-accent-light hover:dark:border-accent-dark cursor-pointer
      `}>
			{note ? (
				<div
					className="tiptap ProseMirror grow overflow-hidden"
					dangerouslySetInnerHTML={{ __html: note.preview }}
				/>
			) : (
				<div className="grow p-1 flex items-center justify-center">
					<LuPlus className="text-7xl text-accent-light dark:text-accent-dark" />
				</div>
			)}
			<div className="text-[12px] italic text-neutral-500 shrink-0">
				{note?.updatedAt ? formatDate(note.updatedAt) : ""}
			</div>
		</div>
	);
};

export default NoteListItem;
